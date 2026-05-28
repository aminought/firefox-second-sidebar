[English](README.md) | **中文（简体）**

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

### 一键安装（Windows，推荐）

以**管理员身份**打开 PowerShell，运行：

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/install.ps1 | iex
```

脚本会自动完成以下操作：

1. 从 GitHub 下载 fx-autoconfig 和 Second Sidebar
2. 检测 Firefox 安装目录和配置文件夹
3. 安装 fx-autoconfig 程序文件和配置文件
4. 安装 Second Sidebar 脚本
5. 验证安装是否成功

> **管理员权限**：fx-autoconfig 的 `config.js` 需要复制到 `C:\Program Files\Mozilla Firefox\`，因此需要管理员权限。如未以管理员运行，脚本会提示手动复制。

**卸载：**

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/uninstall.ps1 | iex
```

卸载脚本会交互式选择要移除的组件（Second Sidebar 脚本、fx-autoconfig 配置文件、fx-autoconfig 程序文件），可单独或全部移除。

### 手动安装

1. 安装 [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig)。
2. 将 `src/` 目录下的内容（`second_sidebar/` 和 `second_sidebar.uc.mjs`）复制到 `chrome/JS/` 中。
3. 在 `about:config` 中启用 `toolkit.legacyUserProfileCustomizations.stylesheets` 和 `dom.allow_scripts_to_close_windows`。
4. [清除](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache)启动缓存。
5. 尽情使用！

## 本地化

脚本支持多语言界面，自动根据 Firefox 浏览器语言设置显示对应翻译。

### 支持的语言

| 语言 | 代码 | 状态 |
|------|------|------|
| English | `en-US` | ✅ 完整 |
| 中文（简体） | `zh-CN` | ✅ 完整 |
| 日本語 | `ja` | ✅ 完整 |
| 한국어 | `ko` | ✅ 完整 |
| Deutsch | `de` | ✅ 完整 |
| Français | `fr` | ✅ 完整 |
| Español | `es` | ✅ 完整 |
| Português (Brasil) | `pt-BR` | ✅ 完整 |
| Русский | `ru` | ✅ 完整 |

### 语言文件结构

```
src/second_sidebar/i18n/
├── index.mjs     # 语言检测与加载入口
├── en-US.mjs     # 英语
├── zh-CN.mjs     # 简体中文
├── ja.mjs        # 日语
├── ko.mjs        # 韩语
├── de.mjs        # 德语
├── fr.mjs        # 法语
├── es.mjs        # 西班牙语
├── pt-BR.mjs     # 巴西葡萄牙语
└── ru.mjs        # 俄语
```

### 工作原理

所有 UI 文本从源代码中抽取到 `src/second_sidebar/i18n/` 下的语言文件中。每个源文件从 i18n 模块导入 `L`：

```js
import { L } from "../i18n/index.mjs";
```

启动时，`index.mjs` 通过 `Services.locale.requestedLocale` 检测浏览器语言并导出匹配的语言对象。如无精确匹配，则按语言前缀回退（如 `de-AT` → `de`），最终回退到 `en-US`。

### 添加新语言

1. 复制 `en-US.mjs` 为新语言文件（如 `it.mjs`）
2. 将英文值替换为对应语言翻译，保持 key 不变
3. 在 `index.mjs` 中导入并注册新语言
4. 提交 PR

### 切换语言

脚本自动检测 Firefox 浏览器语言设置。如需切换：

1. 打开 Firefox 设置 → 常规 → 语言
2. 更改 Firefox 界面语言
3. 重启浏览器
