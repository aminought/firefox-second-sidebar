# Second Sidebar for Firefox

A Firefox userChrome.js script for adding a second sidebar with web panels like in Vivaldi/Floorp/Zen but better.

![promo_rounded](https://github.com/user-attachments/assets/d3cd7163-6b9c-4005-a422-2995490c1be0)

## Motivation

There are many forks of Firefox, but I prefer to continue using the original browser. However, I have also tried other browsers such as Vivaldi, Floorp and Zen. I also miss the feature of having a decent sidebar with web panels, which is why I decided to create my own version, with blackjack and hookers.

## Demo

https://github.com/user-attachments/assets/a92fb9b5-84d5-42a1-99f3-ad718767383f

## Features

<details>
   <summary>⚠️ Warning: data-intensive GIFs under spoiler ⚠️</summary>
   <table>
      <tr>
         <td>
         <h3>Adding new web panel</h3>
            <ol>
               <li>Left-click on the Plus button.</li>
               <li>Enter the web address. The current address will be automatically inserted into the field.</li>
               <li>Choose Multi-Account Container if you want.</li>
               <li>Press Enter or click on the "Create" button.</li>
               <li>A new web panel will be created with default settings.</li>
            </ol>
         </td>
         <td><img src="https://github.com/user-attachments/assets/5b7c3802-3de7-4ac3-8c3d-93ea07c91f09" width="400px" /></td>
      </tr>
      <tr>
         <td>
            <h3>Pinning and unpinning the web panel</h3>
            Depending on your needs, you can pin the web panel to the side of the web page or make it appear on top of the content.
         </td>
         <td><img src="https://github.com/user-attachments/assets/048fd1e2-d50e-4ffc-beba-dc33d06e7251" width="400px" /></td>
      </tr>
      <tr>
         <td>
            <h3>Mobile view and zooming</h3>
            There is an option to open the website using the mobile user agent. There are also buttons to zoom in and out of the content.
         </td>
         <td><img src="https://github.com/user-attachments/assets/fad1d08e-f906-47d1-990d-9e6568e1512b" width="400px" /></td>
      </tr>
      <tr>
         <td>
            <h3>Unloading the web panel from memory</h3>
            To save memory, you can manually unload the web panel using two methods: the toolbar button or the context menu.
         </td>
         <td><img src="https://github.com/user-attachments/assets/520b38dd-5515-47dc-89c9-407ad9dc7155" width="400px" /></td>
      </tr>
      <tr>
         <td>
            <h3>Web panel settings</h3>
            Here you can change the following:
            <ol>
               <li>Page address. After changing the relevant field, please wait one second for the changes to be temporarily applied. They will be saved or canceled depending on your next action.
   </li>
               <li>Multi-Account Container.</li>
               <li>Favicon address. The same as for the page address.</li>
               <li>Web panel type: floating or pinned.</li>
               <li>Mobile View.</li>
               <li>Load into memory at startup: automatic loading of the web panel. </li>
               <li>Unload from memory after closing.</li>
               <li>Hide toolbar: "headless" web panel.</li>
               <li>Zoom.</li>
               <li>Position of the web panel button.</li>
            </ol>
            All changes are applied instantly, but can be rolled back by clicking the "Cancel" button or by losing focus. They are saved only after clicking the "Save" button.
         </td>
         <td><img src="https://github.com/user-attachments/assets/a19976d6-b4f8-4baa-a99b-c22bce6ab864" width="400px" /></td>
      </tr>
      <tr>
         <td>
            <h3>Deleting the web panel</h3>
            There is confirmation of the deletion, so you don't need to worry about accidentally deleting the web panel.
         </td>
         <td><img src="https://github.com/user-attachments/assets/5a870ce7-76d3-4297-a8e4-5603cb1dff3a" width="400px" /></td>
      </tr>
      <tr>
         <td>
            <h3>Sidebar settings</h3>
            Here you can change the following:
            <ol>
               <li>Sidebar position: left or right.</li>
               <li>Sidebar width (padding).</li>
               <li>Floating web panel offset: distance between sidebar and floating web panel.</li>
               <li>New web panel position: before or after "Plus" button.</li>
               <li>Container indicator position: which side of web panel button to color.</li>
               <li>Hide sidebar in popup windows.</li>
               <li>Auto-hide of back and forward buttons from toolbar.</li>
            </ol>
            All changes are applied instantly, but can be rolled back by clicking the "Cancel" button or by losing focus. They are saved only after clicking the "Save" button.
         </td>
         <td><img src="https://github.com/user-attachments/assets/b0cea2a7-99bc-4098-b417-08d2416c0c65" width="400px" /></td>
      </tr>
      <tr>
         <td>
            <h3>Customization</h3>
            You can customize the Second Sidebar like any other toolbar in Firefox: https://support.mozilla.org/en-US/kb/customize-firefox-controls-buttons-and-toolbars.
            Moreover, you can also move your web panel buttons to other toolbars!
         </td>
         <td><img src="https://github.com/user-attachments/assets/51403ab6-c9e8-4317-bf40-2b68691308d6" width="400px" /></td>
      </tr>
   </table>
</details>

## Install (fx-autoconfig)

1. Install [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig).
2. Copy the contents of the `src/` directory (`second_sidebar/` and `second_sidebar.uc.mjs`) into `chrome/JS/`.
3. [Clear](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache) startup-cache.
4. Have fun!

## If you use another loader

Use a wrapper script provided by @dimdamin: https://github.com/aminought/firefox-second-sidebar/issues/5.
