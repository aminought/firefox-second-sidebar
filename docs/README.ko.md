[English](../README.md) | **한국어**

Vivaldi/Edge/Floorp처럼 웹 패널이 있는 두 번째 사이드바를 Firefox에 제공하는 userChrome.js 스크립트입니다.

<img width="2200" height="2131" alt="promo-rounded" src="https://github.com/user-attachments/assets/020ee8cf-1f3d-4184-98fe-889be89d6145" />

## 동기

Vivaldi, Edge, Floorp, Zen 등 다양한 브라우저를 사용해 보았는데, 모두 사이드바라는 공통점이 있습니다. 사이드바 없이 브라우저를 사용하는 것은 상상할 수 없습니다. 안타깝게도 저의 정신적, 기능적 요구에 가장 부합하는 Firefox의 사이드바는 만족스럽지 않습니다. 그래서 블랙잭과 호스티스와 함께 직접 만들기로 했습니다!

## 데모

https://github.com/user-attachments/assets/cd79d644-ca2c-4a30-ae8e-c265f41768b6

## 기능

### 사이드바

- 동작: `표시` • `숨기기`
- [도구 모음 사용자 지정](https://support.mozilla.org/ko/kb/customize-firefox-controls-buttons-and-toolbars)으로 버튼 사용자 지정
- 설정:
  - 일반: `위치 (왼쪽 / 오른쪽)` • `너비`
  - 표시: `사이드바 자동 숨기기` • `자동 숨기기 동작 (인라인 / 오버레이)` • `사이드바 숨김 시 웹 패널 숨기기` • `단축키로 사이드바 표시/숨기기`
  - 웹 패널: `기본 떠다니는 패널 오프셋` • `새 패널 위치 (더하기 버튼 앞 / 더하기 버튼 뒤)` • `지오메트리 힌트 표시`
  - 웹 패널 버튼: `컨테이너 표시기 (끄기 / 왼쪽 / 오른쪽 / 위 / 아래 / 둘레)` • `도구 설명 (끄기 / 제목 / URL / 제목 및 URL)` • `도구 설명에 전체 URL 표시`
  - 웹 패널 도구 모음: `앞으로 버튼 자동 숨기기` • `뒤로 버튼 자동 숨기기`
  - 애니메이션: `사이드바 애니메이션` • `웹 패널 도구 모음 애니메이션`

### 웹 패널

- 동작: `만들기` • `삭제` • `편집` • `위치 및 크기 변경` • `위치 및 크기 재설정` • `언로드` • `음소거` • `음소거 해제` • `고정` • `고정 해제` • `확대/축소 변경` • `뒤로` • `앞으로` • `새로고침` • `홈`
- 확장 프로그램 지원
- 팝업 알림 지원 (마이크/카메라/위치 등 권한 요청)
- 설정:
  - 일반: `URL` • `다중 계정 컨테이너` • `임시` • `모바일 보기` • `확대/축소`
  - 제목: `동적` • `정적 제목 설정`
  - 파비콘: `동적` • `정적 파비콘 설정`
  - 위치 및 크기: `모드 (떠다니는 / 고정)` • `항상 위에` • `위치 앵커` • `수평 오프셋` • `수직 오프셋` • `너비` • `높이`
  - 로딩: `시작 시 메모리에 로드` • `마지막으로 열린 페이지 복원` • `닫은 후 메모리에서 언로드` • `주기적 새로고침`
  - 키보드 단축키: `단축키로 웹 패널 표시/숨기기`
  - CSS 선택자: `사용` • `CSS 선택자 설정`
  - 요소 숨기기: `도구 모음 숨기기` • `소리 아이콘 숨기기` • `알림 배지 숨기기`

### 위젯

- `두 번째 사이드바`: 사이드바 표시 / 숨기기

## 설치

### 원클릭 설치 (Windows, 권장)

**관리자 권한으로** PowerShell을 열고 실행:

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/install.ps1 | iex
```

스크립트가 자동으로 다음을 수행합니다:

1. GitHub에서 fx-autoconfig 및 Second Sidebar 다운로드
2. Firefox 설치 디렉토리 및 프로필 폴더 감지
3. fx-autoconfig 프로그램 파일 및 프로필 파일 설치
4. Second Sidebar 스크립트 설치
5. 설치 확인

> **관리자 권한**: fx-autoconfig의 `config.js`를 `C:\Program Files\Mozilla Firefox\`에 복사해야 하므로 관리자 권한이 필요합니다. 관리자로 실행하지 않은 경우 수동 복사 안내가 표시됩니다.

**제거:**

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/uninstall.ps1 | iex
```

제거 스크립트에서 대화형으로 제거할 구성 요소를 선택할 수 있습니다.

### 수동 설치

1. [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig) 설치.
2. `src/` 디렉토리의 내용 (`second_sidebar/` 및 `second_sidebar.uc.mjs`)을 `chrome/JS/`에 복사.
3. `about:config`에서 `toolkit.legacyUserProfileCustomizations.stylesheets` 및 `dom.allow_scripts_to_close_windows` 활성화.
4. [시작 캐시 지우기](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache).
5. 즐기세요!

## 현지화

스크립트는 다국어를 지원하며 Firefox 브라우저 언어에 따라 자동으로 UI를 표시합니다.

### 지원 언어

| 언어               | 코드    | 상태    |
| ------------------ | ------- | ------- |
| English            | `en-US` | ✅ 완전 |
| 中文（简体）       | `zh-CN` | ✅ 완전 |
| 日本語             | `ja`    | ✅ 완전 |
| 한국어             | `ko`    | ✅ 완전 |
| Deutsch            | `de`    | ✅ 완전 |
| Français           | `fr`    | ✅ 완전 |
| Español            | `es`    | ✅ 완전 |
| Português (Brasil) | `pt-BR` | ✅ 완전 |
| Русский            | `ru`    | ✅ 완전 |

### 새 언어 추가

1. `en-US.mjs`를 새 파일로 복사 (예: `it.mjs`)
2. 영어 값을 번역으로 교체 (키는 변경하지 않음)
3. `index.mjs`에서 새 언어를 가져오고 등록
4. PR 제출

### 언어 전환

스크립트는 Firefox 브라우저 언어를 자동으로 감지합니다. 전환하려면:

1. Firefox 설정 → 일반 → 언어 열기
2. Firefox 인터페이스 언어 변경
3. 브라우저 다시 시작
