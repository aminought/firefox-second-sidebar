> **项目来源**：基于 [aminought/firefox-second-sidebar](https://github.com/aminought/firefox-second-sidebar) 汉化并修改

一个 Firefox userChrome.js 脚本，为 Firefox 带来带有网页面板的第二侧边栏，功能类似 Vivaldi/Edge/Floorp 但更强大。

<img width="2200" height="2131" alt="promo-rounded" src="https://github.com/user-attachments/assets/020ee8cf-1f3d-4184-98fe-889be89d6145" />

## 动机

我尝试过各种浏览器，如 Vivaldi、Edge、Floorp 和 Zen，它们都有一个共同点——我无法想象没有侧边栏的浏览器。可惜的是，Firefox 虽然最符合我的精神需求和功能期望，但它的侧边栏实在不尽如人意。因此，我决定自己动手做一个，黑杰克和女郎也安排上！

## 演示

https://github.com/user-attachments/assets/cd79d644-ca2c-4a30-ae8e-c265f41768b6

## 功能特性

### 侧边栏

- 操作：`显示` • `隐藏`
- 通过[自定义工具栏](https://support.mozilla.org/zh-CN/kb/customize-firefox-controls-buttons-and-toolbars)定制按钮
- 设置：
  - 通用：`位置（左侧 / 右侧）` • `宽度`
  - 可见性：`自动隐藏侧边栏` • `自动隐藏行为（内联 / 覆盖）` • `侧边栏隐藏时隐藏网页面板` • `设置快捷键显示/隐藏侧边栏`
  - 网页面板：`默认浮动面板偏移` • `新建面板位置（加号按钮之前 / 加号按钮之后）` • `显示几何提示`
  - 网页面板按钮：`容器指示器（关闭 / 左侧 / 右侧 / 顶部 / 底部 / 四周）` • `工具提示（关闭 / 标题 / 网址 / 标题和网址）` • `工具提示显示完整网址`
  - 网页面板工具栏：`自动隐藏前进按钮` • `自动隐藏后退按钮`
  - 动画：`侧边栏动画` • `网页面板工具栏动画`

### 网页面板

- 操作：`创建` • `删除` • `编辑` • `更改位置和大小` • `重置位置和大小` • `卸载` • `静音` • `取消静音` • `固定` • `取消固定` • `更改缩放` • `后退` • `前进` • `刷新` • `主页`
- 支持扩展
- 支持弹窗通知（麦克风/摄像头/位置等权限请求）
- 设置：
  - 通用：`网址` • `多账户容器` • `临时` • `移动视图` • `缩放`
  - 标题：`动态` • `设置静态标题`
  - 图标：`动态` • `设置静态图标`
  - 位置和大小：`模式（浮动 / 固定）` • `始终置顶` • `位置锚点` • `水平偏移` • `垂直偏移` • `宽度` • `高度`
  - 加载：`启动时加载到内存` • `恢复上次打开的页面` • `关闭后从内存卸载` • `定时刷新`
  - 键盘快捷键：`设置快捷键显示/隐藏网页面板`
  - CSS 选择器：`启用` • `设置 CSS 选择器`
  - 隐藏元素：`隐藏工具栏` • `隐藏声音图标` • `隐藏通知徽章`

### 小部件

- `第二侧边栏` 按钮：显示/隐藏侧边栏

## 安装

1. 安装 [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig)。
2. 将 `src/` 目录下的内容（`second_sidebar/` 和 `second_sidebar.uc.mjs`）复制到 `chrome/JS/`。
3. 在 `about:config` 中启用 `toolkit.legacyUserProfileCustomizations.stylesheets` 和 `dom.allow_scripts_to_close_windows`。
4. [清除](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache)启动缓存。
5. 尽情享受！

## 本地化

本项目界面已完全中文化。如需其他语言，欢迎提交翻译 PR。
