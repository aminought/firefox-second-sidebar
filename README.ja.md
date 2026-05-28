[English](README.md) | **日本語**

Firefox userChrome.js スクリプト。Vivaldi/Edge/Floorp のような、ウェブパネル付きのセカンドサイドバーを Firefox にもたらします。

<img width="2200" height="2131" alt="promo-rounded" src="https://github.com/user-attachments/assets/020ee8cf-1f3d-4184-98fe-889be89d6145" />

## 動機

Vivaldi、Edge、Floorp、Zen など、さまざまなブラウザを試してきましたが、どれにもサイドバーという共通点があります。サイドバーなしのブラウザ生活はもう考えられません。残念ながら、私の精神と機能のニーズに最も合致する Firefox のサイドバーは、あまり満足のいくものではありません。そこで、ブラックジャックとフックガール付きで自分で作ることにしました！

## デモ

https://github.com/user-attachments/assets/cd79d644-ca2c-4a30-ae8e-c265f41768b6

## 機能

### サイドバー

- アクション：`表示` • `非表示`
- [ツールバーのカスタマイズ](https://support.mozilla.org/ja/kb/customize-firefox-controls-buttons-and-toolbars)でボタンをカスタマイズ
- 設定：
  - 一般：`位置（左 / 右）` • `幅`
  - 表示：`サイドバーを自動的に隠す` • `自動非表示の動作（インライン / オーバーレイ）` • `サイドバー非表示時にウェブパネルを隠す` • `ショートカットでサイドバーの表示/非表示を切り替え`
  - ウェブパネル：`デフォルトのフローティングパネルオフセット` • `新しいパネルの位置（プラスボタンの前 / プラスボタンの後）` • `ジオメトリヒントを表示`
  - ウェブパネルボタン：`コンテナーインジケーター（オフ / 左 / 右 / 上 / 下 / 四周）` • `ツールチップ（オフ / タイトル / URL / タイトルとURL）` • `ツールチップに完全なURLを表示`
  - ウェブパネルツールバー：`進むボタンを自動的に隠す` • `戻るボタンを自動的に隠す`
  - アニメーション：`サイドバーをアニメーション` • `ウェブパネルツールバーをアニメーション`

### ウェブパネル

- アクション：`作成` • `削除` • `編集` • `位置とサイズの変更` • `位置とサイズのリセット` • `アンロード` • `ミュート` • `ミュート解除` • `ピン留め` • `ピン留め解除` • `ズーム変更` • `戻る` • `進む` • `再読み込み` • `ホーム`
- 拡張機能サポート
- ポップアップ通知サポート（マイク/カメラ/位置情報などの権限リクエスト）
- 設定：
  - 一般：`URL` • `マルチアカウントコンテナー` • `一時的` • `モバイルビュー` • `ズーム`
  - タイトル：`動的` • `静的タイトルを設定`
  - ファビコン：`動的` • `静的ファビコンを設定`
  - 位置とサイズ：`モード（フローティング / ピン留め）` • `常に最前面` • `位置のアンカー` • `水平オフセット` • `垂直オフセット` • `幅` • `高さ`
  - 読み込み：`起動時にメモリに読み込む` • `最後に開いたページを復元` • `閉じた後にメモリからアンロード` • `定期再読み込み`
  - キーボードショートカット：`ショートカットでウェブパネルの表示/非表示を切り替え`
  - CSSセレクター：`有効にする` • `CSSセレクターを設定`
  - 要素を非表示：`ツールバーを非表示` • `音声アイコンを非表示` • `通知バッジを非表示`

### ウィジェット

- `セカンドサイドバー`：サイドバーの表示 / 非表示

## インストール

### ワンクリックインストール（Windows、推奨）

**管理者として** PowerShell を開き、実行：

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/install.ps1 | iex
```

スクリプトが自動的に以下を実行します：

1. GitHub から fx-autoconfig と Second Sidebar をダウンロード
2. Firefox のインストールディレクトリとプロファイルフォルダーを検出
3. fx-autoconfig のプログラムファイルとプロファイルファイルをインストール
4. Second Sidebar スクリプトをインストール
5. インストールの検証

> **管理者権限**：fx-autoconfig の `config.js` は `C:\Program Files\Mozilla Firefox\` にコピーする必要があるため、管理者権限が必要です。管理者として実行していない場合、手動コピーの指示が表示されます。

**アンインストール：**

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/uninstall.ps1 | iex
```

アンインストールスクリプトでは、インタラクティブに削除するコンポーネントを選択できます。

### 手動インストール

1. [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig) をインストール。
2. `src/` ディレクトリの内容（`second_sidebar/` と `second_sidebar.uc.mjs`）を `chrome/JS/` にコピー。
3. `about:config` で `toolkit.legacyUserProfileCustomizations.stylesheets` と `dom.allow_scripts_to_close_windows` を有効化。
4. [スタートアップキャッシュをクリア](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache)。
5. お楽しみください！

## ローカライゼーション

スクリプトは多言語に対応し、Firefox の言語設定に応じて自動的に UI を表示します。

### 対応言語

| 言語 | コード | 状態 |
|------|--------|------|
| English | `en-US` | ✅ 完全 |
| 中文（简体） | `zh-CN` | ✅ 完全 |
| 日本語 | `ja` | ✅ 完全 |
| 한국어 | `ko` | ✅ 完全 |
| Deutsch | `de` | ✅ 完全 |
| Français | `fr` | ✅ 完全 |
| Español | `es` | ✅ 完全 |
| Português (Brasil) | `pt-BR` | ✅ 完全 |
| Русский | `ru` | ✅ 完全 |

### 新しい言語の追加

1. `en-US.mjs` を新しいファイルにコピー（例：`it.mjs`）
2. 英語の値を翻訳に置き換え（キーは変更しない）
3. `index.mjs` で新しい言語をインポートして登録
4. PR を提出

### 言語の切り替え

スクリプトは Firefox のブラウザ言語を自動検出します。切り替えるには：

1. Firefox 設定 → 一般 → 言語 を開く
2. Firefox のインターフェース言語を変更
3. ブラウザを再起動
