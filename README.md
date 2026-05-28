> **项目来源**：基于 [aminought/firefox-second-sidebar](https://github.com/aminought/firefox-second-sidebar) 国际化修改

一个 Firefox userChrome.js 脚本，为 Firefox 带来带有网页面板的第二侧边栏，功能类似 Vivaldi/Edge/Floorp 但更强大。

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
irm https://raw.githubusercontent.com/mitcehub/firefox-second-sidebar/master/install.ps1 | iex
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
.\install.ps1 -Uninstall
```

### 手动安装

### 第一步：安装 fx-autoconfig

fx-autoconfig 是一个 Firefox userChrome.js 管理器，它允许在浏览器中加载自定义脚本。本项目依赖它运行。

从 [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig) 下载或克隆仓库，然后进行以下两步操作：

#### 1.1 安装程序文件（program 目录）

将 `fx-autoconfig/program/` 目录下的**内容**（不是目录本身）复制到 Firefox 安装目录：

<details>
<summary>Windows</summary>

Firefox 通常安装在 `C:\Program Files\Mozilla Firefox\`

- `program/config.js` → `C:\Program Files\Mozilla Firefox\config.js`（与 firefox.exe 同级）
- `program/defaults/pref/config-prefs.js` → `C:\Program Files\Mozilla Firefox\defaults\pref\config-prefs.js`

</details>

<details>
<summary>Linux</summary>

Firefox 通常安装在 `/usr/lib/firefox/` 或 `/usr/lib64/firefox/`

```bash
sudo cp program/config.js /usr/lib/firefox/
sudo cp program/defaults/pref/config-prefs.js /usr/lib/firefox/defaults/pref/
```

</details>

<details>
<summary>macOS</summary>

Firefox 通常安装在 `/Applications/Firefox.app/Contents/Resources/`

```bash
cp program/config.js /Applications/Firefox.app/Contents/Resources/
cp program/defaults/pref/config-prefs.js /Applications/Firefox.app/Contents/Resources/defaults/pref/
```

</details>

> **注意**：如果你使用的是 Librefox 等已经使用 autoconfig 的 Firefox 分支，需要手动合并 `config.js` 的内容，而非直接覆盖。

#### 1.2 安装配置文件（profile 目录）

将 `fx-autoconfig/profile/` 目录下的**内容**（不是目录本身）复制到 Firefox 配置文件夹中。

**找到配置文件夹：**

<details>
<summary>Windows</summary>

```
%APPDATA%\Mozilla\Firefox\Profiles\<随机字符>.default-release\
```

通常路径类似：

```
C:\Users\<用户名>\AppData\Roaming\Mozilla\Firefox\Profiles\xxxxxxxx.default-release\
```

在资源管理器地址栏输入 `%APPDATA%\Mozilla\Firefox\Profiles\` 即可打开。

</details>

<details>
<summary>Linux</summary>

```
~/.mozilla/firefox/<随机字符>.default-release/
```

</details>

<details>
<summary>macOS</summary>

```
~/Library/Application Support/Firefox/Profiles/<随机字符>.default-release/
```

</details>

**复制文件：**

将 `profile/chrome/` 下的内容复制到配置文件夹的 `chrome/` 目录中：

```
profile/chrome/
├── JS/         → <配置文件夹>/chrome/JS/
├── utils/      → <配置文件夹>/chrome/utils/
├── CSS/        → <配置文件夹>/chrome/CSS/（可选，示例样式）
└── resources/  → <配置文件夹>/chrome/resources/（可选，示例资源）
```

> 其中 `CSS/` 和 `resources/` 为 fx-autoconfig 自带的示例文件，不是必须的。核心只需要 `JS/` 和 `utils/`。

最终目录结构：

```
<配置文件夹>/
├── chrome/
│   ├── JS/
│   └── utils/
│       ├── boot.sys.mjs
│       ├── chrome.manifest
│       ├── fs.sys.mjs
│       ├── uc_api.sys.mjs
│       └── utils.sys.mjs
├── prefs.js
└── ...
```

### 第二步：安装 Second Sidebar

将本项目的 `src/` 目录下的内容复制到 `chrome/JS/` 目录中：

```
src/
├── second_sidebar.uc.mjs  → <配置文件夹>/chrome/JS/second_sidebar.uc.mjs
└── second_sidebar/        → <配置文件夹>/chrome/JS/second_sidebar/
```

最终 `chrome/JS/` 目录结构：

```
<配置文件夹>/chrome/JS/
├── second_sidebar.uc.mjs
└── second_sidebar/
    ├── browser_elements.mjs
    ├── sidebar_controllers.mjs
    ├── sidebar_decorator.mjs
    ├── sidebar_elements.mjs
    ├── sidebar_injector.mjs
    ├── controllers/
    ├── css/
    ├── i18n/
    ├── icons/
    ├── patchers/
    ├── settings/
    ├── utils/
    ├── wrappers/
    └── xul/
```

### 第三步：重启 Firefox

重启 Firefox 后，右键点击工具栏，选择"自定义工具栏..."，将"Second Sidebar"按钮拖到工具栏上即可。

## 故障排除

### 脚本没有生效

1. **确认文件位置正确**：检查 `chrome/utils/chrome.manifest` 和 `chrome/utils/boot.sys.mjs` 是否存在
2. **清除启动缓存**：Firefox 会缓存启动文件，修改 `utils/` 目录下的文件后可能需要清除缓存
   - 在地址栏输入 `about:support`，点击页面右上角的"清除启动缓存"按钮
   - 或关闭 Firefox，删除配置文件夹的**本地目录**下的 `startupCache` 文件夹，再重启
3. **检查 about:config**：确认以下首选项已设置为 `true`（现代 Firefox 默认已开启）：
   - `toolkit.legacyUserProfileCustomizations.stylesheets`
   - `dom.allow_scripts_to_close_windows`

### 启动时出现 "fx-autoconfig: Startup is broken" 横幅

这是 fx-autoconfig 检测到 `gBrowser` 对象不可用导致的。点击横幅上的"Enable workaround"按钮即可修复，或手动在 `about:config` 中设置 `userChromeJS.gBrowser_hack.enabled` 为 `true`。

详见 [fx-autoconfig 文档](https://github.com/MrOtherGuy/fx-autoconfig#startup-error)。

## 本地化

本项目支持多语言界面，自动根据 Firefox 浏览器语言设置显示对应翻译。

### 支持的语言

| 语言               | 代码    | 状态    |
| ------------------ | ------- | ------- |
| English            | `en-US` | ✅ 完整 |
| 中文（简体）       | `zh-CN` | ✅ 完整 |
| 日本語             | `ja`    | ✅ 完整 |
| 한국어             | `ko`    | ✅ 完整 |
| Deutsch            | `de`    | ✅ 完整 |
| Français           | `fr`    | ✅ 完整 |
| Español            | `es`    | ✅ 完整 |
| Português (Brasil) | `pt-BR` | ✅ 完整 |
| Русский            | `ru`    | ✅ 完整 |

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

### 添加新语言

1. 复制 `en-US.mjs` 为新语言文件（如 `it.mjs`）
2. 将文件中的英文值替换为对应语言翻译，保持 key 不变
3. 在 `index.mjs` 中导入并注册新语言
4. 提交 PR

### 切换语言

脚本自动检测 Firefox 浏览器语言设置（`Services.locale.requestedLocale`），无需手动配置。如需切换：

1. 打开 Firefox 设置 → 常规 → 语言
2. 更改 Firefox 界面语言
3. 重启浏览器

## 上游同步

本项目 fork 自 [aminought/firefox-second-sidebar](https://github.com/aminought/firefox-second-sidebar)，当上游更新时：

```bash
git fetch upstream
git merge upstream/master
```

由于 UI 文本已抽取到 `i18n/` 语言文件中，合并冲突会大幅减少。上游新增的 UI 元素只需在语言文件中补充翻译即可。
