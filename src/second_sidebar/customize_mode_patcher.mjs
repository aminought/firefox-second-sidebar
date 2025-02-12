const kPaletteId = "customization-palette";
const kDragDataTypePrefix = "text/toolbarwrapper-id/";

const lazy = {};
var gDraggingInToolbars;

ChromeUtils.defineESModuleGetters(lazy, {
  DragPositionManager: "resource:///modules/DragPositionManager.sys.mjs",
});

// https://searchfox.org/mozilla-central/source/browser/components/customizableui/CustomizeMode.sys.mjs
// this -> gCustomizeMode, delete "lazy" staff, use custom getPlaceForItem, use shared gDraggingInToolbars,
// remove __dumpDragData
export class CustomizeModePatcher {
  static patch() {
    gCustomizeMode._wrapToolbarItem = customizeMode._wrapToolbarItem;
    gCustomizeMode._wrapToolbarItemSync = customizeMode._wrapToolbarItemSync;
    gCustomizeMode._wrapItemsInArea = customizeMode._wrapItemsInArea;
    gCustomizeMode.onWidgetAfterDOMChange =
      customizeMode.onWidgetAfterDOMChange;
    gCustomizeMode._addDragHandlers = customizeMode._addDragHandlers;
    gCustomizeMode._onDragStart = customizeMode._onDragStart;
    gCustomizeMode._onDragOver = customizeMode._onDragOver;
    gCustomizeMode._setDragActive = customizeMode._setDragActive;
    gCustomizeMode._getDragItemSize = customizeMode._getDragItemSize;
  }
}

const customizeMode = {
  async _wrapToolbarItem(aArea) {
    let target = CustomizableUI.getCustomizeTargetForArea(
      aArea,
      gCustomizeMode.window,
    );
    if (!target || gCustomizeMode.areas.has(target)) {
      return null;
    }

    gCustomizeMode._addDragHandlers(target);
    for (let child of target.children) {
      if (
        gCustomizeMode.isCustomizableItem(child) &&
        !gCustomizeMode.isWrappedToolbarItem(child)
      ) {
        await gCustomizeMode
          .deferredWrapToolbarItem(child, getPlaceForItem(child))
          .catch(console.log);
      }
    }
    gCustomizeMode.areas.add(target);
    return target;
  },

  _wrapToolbarItemSync(aArea) {
    let target = CustomizableUI.getCustomizeTargetForArea(
      aArea,
      gCustomizeMode.window,
    );
    if (!target || gCustomizeMode.areas.has(target)) {
      return null;
    }

    gCustomizeMode._addDragHandlers(target);
    try {
      for (let child of target.children) {
        if (
          gCustomizeMode.isCustomizableItem(child) &&
          !gCustomizeMode.isWrappedToolbarItem(child)
        ) {
          gCustomizeMode.wrapToolbarItem(child, getPlaceForItem(child));
        }
      }
    } catch (error) {
      console.log(error);
    }

    gCustomizeMode.areas.add(target);
    return target;
  },

  _wrapItemsInArea(target) {
    for (let child of target.children) {
      if (gCustomizeMode.isCustomizableItem(child)) {
        gCustomizeMode.wrapToolbarItem(child, getPlaceForItem(child));
      }
    }
  },

  onWidgetAfterDOMChange(aNodeToChange, aSecondaryNode, aContainer) {
    if (
      aContainer.ownerGlobal != gCustomizeMode.window ||
      gCustomizeMode.resetting
    ) {
      return;
    }
    // If the node is still attached to the container, wrap it again:
    if (aNodeToChange.parentNode) {
      let place = getPlaceForItem(aNodeToChange);
      gCustomizeMode.wrapToolbarItem(aNodeToChange, place);
      if (aSecondaryNode) {
        gCustomizeMode.wrapToolbarItem(aSecondaryNode, place);
      }
    } else {
      // If not, it got removed.

      // If an API-based widget is removed while customizing, append it to the palette.
      // The _applyDrop code itself will take care of positioning it correctly, if
      // applicable. We need the code to be here so removing widgets using CustomizableUI's
      // API also does the right thing (and adds it to the palette)
      let widgetId = aNodeToChange.id;
      let widget = CustomizableUI.getWidget(widgetId);
      if (widget.provider == CustomizableUI.PROVIDER_API) {
        let paletteItem = gCustomizeMode.makePaletteItem(widget, "palette");
        gCustomizeMode.visiblePalette.appendChild(paletteItem);
      }
    }
  },

  _addDragHandlers(aTarget) {
    // Allow dropping on the padding of the arrow panel.
    if (aTarget.id == CustomizableUI.AREA_FIXED_OVERFLOW_PANEL) {
      aTarget = gCustomizeMode.$("customization-panelHolder");
    }
    aTarget.addEventListener("dragstart", gCustomizeMode, true);
    aTarget.addEventListener("dragover", gCustomizeMode, true);
    aTarget.addEventListener("dragleave", gCustomizeMode, true);
    aTarget.addEventListener("drop", gCustomizeMode, true);
    aTarget.addEventListener("dragend", gCustomizeMode, true);
  },

  _onDragStart(aEvent) {
    let item = aEvent.target;
    while (item && item.localName != "toolbarpaletteitem") {
      if (
        item.localName == "toolbar" ||
        item.id == kPaletteId ||
        item.id == "customization-panelHolder"
      ) {
        return;
      }
      item = item.parentNode;
    }

    let draggedItem = item.firstElementChild;
    let placeForItem = getPlaceForItem(item);

    let dt = aEvent.dataTransfer;
    let documentId = aEvent.target.ownerDocument.documentElement.id;

    dt.mozSetDataAt(kDragDataTypePrefix + documentId, draggedItem.id, 0);
    dt.effectAllowed = "move";

    let itemRect = gCustomizeMode._getBoundsWithoutFlushing(draggedItem);
    let itemCenter = {
      x: itemRect.left + itemRect.width / 2,
      y: itemRect.top + itemRect.height / 2,
    };
    gCustomizeMode._dragOffset = {
      x: aEvent.clientX - itemCenter.x,
      y: aEvent.clientY - itemCenter.y,
    };

    let toolbarParent = draggedItem.closest("toolbar");
    if (toolbarParent) {
      let toolbarRect = gCustomizeMode._getBoundsWithoutFlushing(toolbarParent);
      toolbarParent.style.minHeight = toolbarRect.height + "px";
    }

    gDraggingInToolbars = new Set();

    // Hack needed so that the dragimage will still show the
    // item as it appeared before it was hidden.
    gCustomizeMode._initializeDragAfterMove = () => {
      // For automated tests, we sometimes start exiting customization mode
      // before gCustomizeMode fires, which leaves us with placeholders inserted after
      // we've exited. So we need to check that we are indeed customizing.
      if (gCustomizeMode._customizing && !gCustomizeMode._transitioning) {
        item.hidden = true;
        lazy.DragPositionManager.start(gCustomizeMode.window);
        let canUsePrevSibling =
          placeForItem == "toolbar" || placeForItem == "panel";
        if (item.nextElementSibling) {
          gCustomizeMode._setDragActive(
            item.nextElementSibling,
            "before",
            draggedItem.id,
            placeForItem,
          );
          gCustomizeMode._dragOverItem = item.nextElementSibling;
        } else if (canUsePrevSibling && item.previousElementSibling) {
          gCustomizeMode._setDragActive(
            item.previousElementSibling,
            "after",
            draggedItem.id,
            placeForItem,
          );
          gCustomizeMode._dragOverItem = item.previousElementSibling;
        }
        let currentArea = gCustomizeMode._getCustomizableParent(item);
        currentArea.setAttribute("draggingover", "true");
      }
      gCustomizeMode._initializeDragAfterMove = null;
      gCustomizeMode.window.clearTimeout(gCustomizeMode._dragInitializeTimeout);
    };
    gCustomizeMode._dragInitializeTimeout = gCustomizeMode.window.setTimeout(
      gCustomizeMode._initializeDragAfterMove,
      0,
    );
  },

  _onDragOver(aEvent, aOverrideTarget) {
    if (gCustomizeMode._isUnwantedDragDrop(aEvent)) {
      return;
    }
    if (gCustomizeMode._initializeDragAfterMove) {
      gCustomizeMode._initializeDragAfterMove();
    }

    let document = aEvent.target.ownerDocument;
    let documentId = document.documentElement.id;
    if (!aEvent.dataTransfer.mozTypesAt(0).length) {
      return;
    }

    let draggedItemId = aEvent.dataTransfer.mozGetDataAt(
      kDragDataTypePrefix + documentId,
      0,
    );
    let draggedWrapper = document.getElementById("wrapper-" + draggedItemId);
    let targetArea = gCustomizeMode._getCustomizableParent(
      aOverrideTarget || aEvent.currentTarget,
    );
    let originArea = gCustomizeMode._getCustomizableParent(draggedWrapper);

    // Do nothing if the target or origin are not customizable.
    if (!targetArea || !originArea) {
      return;
    }

    // Do nothing if the widget is not allowed to be removed.
    if (
      targetArea.id == kPaletteId &&
      !CustomizableUI.isWidgetRemovable(draggedItemId)
    ) {
      return;
    }

    // Do nothing if the widget is not allowed to move to the target area.
    if (!CustomizableUI.canWidgetMoveToArea(draggedItemId, targetArea.id)) {
      return;
    }

    let targetAreaType = getPlaceForItem(targetArea);
    let targetNode = gCustomizeMode._getDragOverNode(
      aEvent,
      targetArea,
      targetAreaType,
      draggedItemId,
    );

    // We need to determine the place that the widget is being dropped in
    // the target.
    let dragOverItem, dragValue;
    if (targetNode == CustomizableUI.getCustomizationTarget(targetArea)) {
      // We'll assume if the user is dragging directly over the target, that
      // they're attempting to append a child to that target.
      dragOverItem =
        (targetAreaType == "toolbar"
          ? gCustomizeMode._findVisiblePreviousSiblingNode(
              targetNode.lastElementChild,
            )
          : targetNode.lastElementChild) || targetNode;
      dragValue = "after";
    } else {
      let targetParent = targetNode.parentNode;
      let position = Array.prototype.indexOf.call(
        targetParent.children,
        targetNode,
      );
      if (position == -1) {
        dragOverItem =
          targetAreaType == "toolbar"
            ? gCustomizeMode._findVisiblePreviousSiblingNode(
                targetNode.lastElementChild,
              )
            : targetNode.lastElementChild;
        dragValue = "after";
      } else {
        dragOverItem = targetParent.children[position];
        if (targetAreaType == "toolbar") {
          // Check if the aDraggedItem is hovered past the first half of dragOverItem
          let itemRect = gCustomizeMode._getBoundsWithoutFlushing(dragOverItem);
          let dropTargetCenter = itemRect.left + itemRect.width / 2;
          let existingDir = dragOverItem.getAttribute("dragover");
          let dirFactor = gCustomizeMode.window.RTL_UI ? -1 : 1;
          if (existingDir == "before") {
            dropTargetCenter +=
              ((parseInt(dragOverItem.style.borderInlineStartWidth) || 0) / 2) *
              dirFactor;
          } else {
            dropTargetCenter -=
              ((parseInt(dragOverItem.style.borderInlineEndWidth) || 0) / 2) *
              dirFactor;
          }
          let before = gCustomizeMode.window.RTL_UI
            ? aEvent.clientX > dropTargetCenter
            : aEvent.clientX < dropTargetCenter;
          dragValue = before ? "before" : "after";
        } else if (targetAreaType == "panel") {
          let itemRect = gCustomizeMode._getBoundsWithoutFlushing(dragOverItem);
          let dropTargetCenter = itemRect.top + itemRect.height / 2;
          let existingDir = dragOverItem.getAttribute("dragover");
          if (existingDir == "before") {
            dropTargetCenter +=
              (parseInt(dragOverItem.style.borderBlockStartWidth) || 0) / 2;
          } else {
            dropTargetCenter -=
              (parseInt(dragOverItem.style.borderBlockEndWidth) || 0) / 2;
          }
          dragValue = aEvent.clientY < dropTargetCenter ? "before" : "after";
        } else {
          dragValue = "before";
        }
      }
    }

    if (
      gCustomizeMode._dragOverItem &&
      dragOverItem != gCustomizeMode._dragOverItem
    ) {
      gCustomizeMode._cancelDragActive(
        gCustomizeMode._dragOverItem,
        dragOverItem,
      );
    }

    if (
      dragOverItem != gCustomizeMode._dragOverItem ||
      dragValue != dragOverItem.getAttribute("dragover")
    ) {
      if (dragOverItem != CustomizableUI.getCustomizationTarget(targetArea)) {
        gCustomizeMode._setDragActive(
          dragOverItem,
          dragValue,
          draggedItemId,
          targetAreaType,
        );
      }
      gCustomizeMode._dragOverItem = dragOverItem;
      targetArea.setAttribute("draggingover", "true");
    }

    aEvent.preventDefault();
    aEvent.stopPropagation();
  },

  _setDragActive(aItem, aValue, aDraggedItemId, aAreaType) {
    if (!aItem) {
      return;
    }

    if (aItem.getAttribute("dragover") != aValue) {
      aItem.setAttribute("dragover", aValue);

      let window = aItem.ownerGlobal;
      let draggedItem = window.document.getElementById(aDraggedItemId);
      if (aAreaType == "palette") {
        gCustomizeMode._setGridDragActive(aItem, draggedItem, aValue);
      } else {
        let targetArea = gCustomizeMode._getCustomizableParent(aItem);
        let makeSpaceImmediately = false;
        if (!gDraggingInToolbars.has(targetArea.id)) {
          gDraggingInToolbars.add(targetArea.id);
          let draggedWrapper = gCustomizeMode.$("wrapper-" + aDraggedItemId);
          let originArea =
            gCustomizeMode._getCustomizableParent(draggedWrapper);
          makeSpaceImmediately = originArea == targetArea;
        }
        let propertyToMeasure = aAreaType == "toolbar" ? "width" : "height";
        // Calculate width/height of the item when it'd be dropped in gCustomizeMode position.
        let borderWidth = gCustomizeMode._getDragItemSize(aItem, draggedItem)[
          propertyToMeasure
        ];
        let layoutSide = aAreaType == "toolbar" ? "Inline" : "Block";
        let prop, otherProp;
        if (aValue == "before") {
          prop = "border" + layoutSide + "StartWidth";
          otherProp = "border-" + layoutSide.toLowerCase() + "-end-width";
        } else {
          prop = "border" + layoutSide + "EndWidth";
          otherProp = "border-" + layoutSide.toLowerCase() + "-start-width";
        }
        if (makeSpaceImmediately) {
          aItem.setAttribute("notransition", "true");
        }
        aItem.style[prop] = borderWidth + "px";
        aItem.style.removeProperty(otherProp);
        if (makeSpaceImmediately) {
          // Force a layout flush:
          aItem.getBoundingClientRect();
          aItem.removeAttribute("notransition");
        }
      }
    }
  },

  _getDragItemSize(aDragOverNode, aDraggedItem) {
    // Cache it good, cache it real good.
    if (!gCustomizeMode._dragSizeMap) {
      gCustomizeMode._dragSizeMap = new WeakMap();
    }
    if (!gCustomizeMode._dragSizeMap.has(aDraggedItem)) {
      gCustomizeMode._dragSizeMap.set(aDraggedItem, new WeakMap());
    }
    let itemMap = gCustomizeMode._dragSizeMap.get(aDraggedItem);
    let targetArea = gCustomizeMode._getCustomizableParent(aDragOverNode);
    let currentArea = gCustomizeMode._getCustomizableParent(aDraggedItem);
    // Return the size for gCustomizeMode target from cache, if it exists.
    let size = itemMap.get(targetArea);
    if (size) {
      return size;
    }

    // Calculate size of the item when it'd be dropped in gCustomizeMode position.
    let currentParent = aDraggedItem.parentNode;
    let currentSibling = aDraggedItem.nextElementSibling;
    const kAreaType = "cui-areatype";
    let areaType, currentType;

    if (targetArea != currentArea) {
      // Move the widget temporarily next to the placeholder.
      aDragOverNode.parentNode.insertBefore(aDraggedItem, aDragOverNode);
      // Update the node's areaType.
      if (targetArea.id === "sb2-main") {
        areaType = "panel";
      } else {
        areaType = CustomizableUI.getAreaType(targetArea.id);
      }
      currentType =
        aDraggedItem.hasAttribute(kAreaType) &&
        aDraggedItem.getAttribute(kAreaType);
      if (areaType) {
        aDraggedItem.setAttribute(kAreaType, areaType);
      }
      gCustomizeMode.wrapToolbarItem(aDraggedItem, areaType || "palette");
      CustomizableUI.onWidgetDrag(aDraggedItem.id, targetArea.id);
    } else {
      aDraggedItem.parentNode.hidden = false;
    }

    // Fetch the new size.
    let rect = aDraggedItem.parentNode.getBoundingClientRect();
    size = { width: rect.width, height: rect.height };
    // Cache the found value of size for gCustomizeMode target.
    itemMap.set(targetArea, size);

    if (targetArea != currentArea) {
      gCustomizeMode.unwrapToolbarItem(aDraggedItem.parentNode);
      // Put the item back into its previous position.
      currentParent.insertBefore(aDraggedItem, currentSibling);
      // restore the areaType
      if (areaType) {
        if (currentType === false) {
          aDraggedItem.removeAttribute(kAreaType);
        } else {
          aDraggedItem.setAttribute(kAreaType, currentType);
        }
      }
      gCustomizeMode.createOrUpdateWrapper(aDraggedItem, null, true);
      CustomizableUI.onWidgetDrag(aDraggedItem.id);
    } else {
      aDraggedItem.parentNode.hidden = true;
    }
    return size;
  },
};

function getPlaceForItem(aElement) {
  let place;
  let node = aElement;
  while (node && !place) {
    if (node.id == "sb2-main") {
      place = "panel";
    } else if (node.localName == "toolbar") {
      place = "toolbar";
    } else if (node.id == CustomizableUI.AREA_FIXED_OVERFLOW_PANEL) {
      place = "panel";
    } else if (node.id == "customization-palette") {
      place = "palette";
    }

    node = node.parentNode;
  }
  return place;
}
