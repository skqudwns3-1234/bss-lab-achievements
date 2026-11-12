# 연구실 성과 아카이브 설계 문서

| 항목 | 내용 |
|---|---|
| 문서 | `design.md` (AI-SDLC STEP 2 설계 산출물) |
| 버전 | **v1.42** — P088 초안 → P094 v1.0 확정 → P099 예시 성과 표시(`isSample`) 추가 (v1.1, 2026-11-07) → P113 `LabInfo`에서 `phone` 빼고 `fullName` 추가 → P119 Layout·Header·Footer 맨 위로 스크롤 (v1.2) → P133 `Recruitment` 변경, `ImageModal` 추가 (v1.3) → P150 `Achievement.advisors`(지도교수) 추가 (v1.4) → P164–P167 저장소 불러오기 결과·안내·백업 (7절) (v1.5) → P170 `utils/recruitment.ts`(`getRecruitStatus`, `todayYmd`, `isValidYmd`)·`RecruitStatus` 타입, RecruitBox 예외 처리 (v1.6) → P174–P175 2-5 구현 반영(6.1, 훅 표, `applyChange`, 다른 탭 맞추기) (v1.7) → P176–P177 A 점검: 최신 목록 useRef, 같은 검사 규칙, `utils/date.ts` (v1.8) → P182–P183 1-9: 공통 팝업 훅 `useModal`(5.7), `utils/links.ts`, 열린 팝업은 성과 번호로 (v1.9) → P184–P185 1-6: `StatItem`, StatList, 통계는 실제 성과만 (v1.10) → P186–P187 1-7: `getNewestSummary(list, today)`, 실제 성과 거르기를 통계·알약이 같이 (v1.11) → P187–P188 홈 전체 점검: Header `menuPath`, 동작 줄이기, `doiUrl` 오류 막기 (v1.12) → P191 spec/02 B 확정: 삭제 확인은 줄 안(`ConfirmDialog` 뺌) (v1.13) → P193 B-1: 목록·줄 완료, `doiLabel` (v1.14) → P195 B-2: 검색·필터 완료, `EmptyState.hint` (v1.15) → P197 검색 0.25초 기다리기·스크롤바 자리 고정 (v1.16) → P203 B-3: 줄 팝업, 제목 버튼 + 덮개로 줄 전체 누르기 → P204–P207 "자세히" 빼고 제목 끝 ↗ + 마우스 올리면 줄 배경 (v1.17) → P209 B-4: 관리 모드 완료, `AdminBar`는 Layout이 그리는 안내 띠로·"성과 등록"은 제목 줄로 (v1.18) → P215 B-5: 삭제 완료 — 줄에는 참/거짓만, 최신 걸러진 목록 useRef, 지운 뒤 포커스 (v1.19) → P217 spec/02 점검: 더블클릭 두 번째 클릭 무시, 0건이면 조건 초기화, 헤더 메뉴 버튼 폭 880px (v1.20) → P222 spec/03 C-1: 폼 페이지 틀, `parseAchievementId` (v1.21) → P225 C-2a: `AchievementForm` 완료, 오류는 상태 대신 그릴 때 계산 (v1.22) → P228 C-2b: `addAchievement`는 새 번호를 돌려줌, 저장 안내·수정 중 삭제 (v1.23) → P231 C-3: DOI 규칙은 `utils/doi.ts`, Crossref는 결과 묶음 (v1.24) → P236 C-4: `DoiLookup` 완료, 삭제 안내 (v1.25) → P238 spec/03 점검 3건 (v1.26) → P243 spec/04 D-1: 부원 타입·데이터·계산 함수 (v1.27) → P247 D-2: 부원 페이지 (v1.28) → P252 D-3: 지도교수 사진·이력 요약·전체 이력 팝업 (v1.29) → P256 D-4: 부원 활동 자동·팝업 (v1.30) → P263 부원 페이지 A안(흰 카드 한 가족, 한 줄 3장) (v1.31) → P267 사이트 전체 글자 한 단계 키움·큰 여백 줄임 (v1.32) → P272 spec/05 소개 확정: `AboutPage` 구성, `LAB.about`·`address` (v1.33) → P288 홈 연구 분야 구역 삭제(계층도·FR-03), 최근 성과 카드 제목 칸 4줄 고정 (v1.34) → P289 부원 카드 활동 목록 → "참여 성과 N건 보기" 한 줄 (v1.35) → P291 PC 푸터 마지막 줄 맞춤·줄 간격 (v1.36) → P297 푸터 메뉴 삭제·3줄, 헤더 위 고정 (v1.37) → P304 푸터 "연락처" 제목을 화면에서 빼고 낭독기에만 (v1.38) → P306 부원 카드 참여 성과·`MemberActivityModal` 삭제 (v1.39) → P308 부원 카드 그림 `photoUrl`·`photoScale` (v1.40) → P311 이스터에그 `HiddenMemberModal`·`secretTap`·`HIDDEN_MEMBER` (v1.41) → P314 이스터에그 2 물방울 터뜨리기·`HONORARY_MEMBER`·`contactNote` (v1.42). **구현하면서 바뀔 수 있음** (P095) — 바뀌면 버전을 올리고 15절에 무엇을 왜 바꿨는지 남긴다 |
| 기준 문서 | `docs/requirements.md` v1.0 (FR·NFR·BR·EX·AC) |
| 함께 보는 문서 | `docs/design-visual.md` §10 (색·글꼴·버튼 등 시각 디자인), `spec/` (페이지별 요청 단위), `design/mockups/` (시안) |
| 다음 단계 | STEP 3 구현 (`spec/` 요청 단위) → `docs/test-cases.md` (STEP 4) |

> 교수님 AI-SDLC 실습지 STEP 2 틀(데이터 모델·타입, 화면·동선, 컴포넌트 계층도·책임·Props, 상태, LocalStorage, 데이터 흐름, 설계 검토)을 따른다.
> 이미 정한 것은 출처(P번호·문서)를 달고, **이번에 AI가 정한 것은 [AI 설계]**로 표시했다. 사용자가 정할 것은 [12. 확인이 필요한 사항](#12-확인이-필요한-사항)에 모았다.

---

## 1. 기술 구성
| 구분 | 내용 |
|---|---|
| 언어·프레임워크 | TypeScript 7 + React 19 (함수형 컴포넌트), `any` 금지 (NFR-01) |
| 라우팅 | React Router 8 (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `useParams`, `useNavigate`, `Navigate`) |
| 상태 | React 내장 훅만 — Context + useReducer (전역 성과), useState (화면 상태) (NFR-02) |
| 저장 | LocalStorage, 키 2개 (7절) |
| 외부 API | Crossref REST API (8절) |
| 스타일 | 순수 CSS + CSS 변수 (`index.css`), 페이지·컴포넌트별 CSS 파일 |

---

## 2. 데이터 모델 · TypeScript 타입
모든 타입은 `src/types.ts` 한 파일에 모은다 [AI 설계]. 필드는 requirements.md 2절, 기말 API 명세와 같은 이름.

```ts
// 성과
export type AchievementType = 'PAPER' | 'AWARD' | 'PATENT' | 'CONTEST'

export interface Achievement {
  id: number           // 기존 최댓값 + 1 (BR-12)
  type: AchievementType
  title: string        // 필수
  achievedOn: string   // 필수, 'YYYY-MM-DD'
  link: string         // 비어 있으면 ''
  authors: string      // 저자·참여자 (Q2)
  advisors: string     // 지도교수 — 비어 있어도 됨 (P150, spec/02 Q-A1)
  venue: string
  doi: string          // 논문만
  isSample: boolean    // 지어낸 예시 성과면 true → 화면에 "예시" 배지 (P099). 직접 등록한 성과는 false
}

// 폼에서 다루는 값 — id는 저장할 때 정하고, isSample은 폼에서 고치지 않으므로 뺀다 (저장할 때 false)
export type AchievementInput = Omit<Achievement, 'id' | 'isSample'>

// 폼 검증 오류 — 칸 이름 → 오류 문장
export type AchievementErrors = Partial<Record<keyof AchievementInput, string>>

// 목록 검색·필터 조건 (FR-07)
// (구현은 types.ts에서 type으로) 홈 NEW 알약: export type NewestSummary = { date: string; label: string; count: number } (P161)
// 홈 통계 한 칸 (1-6): export type StatItem = { label: string; count: number }
export interface AchievementFilter {
  query: string                    // 제목·저자 검색어
  type: AchievementType | 'ALL'
  year: number | 'ALL'
}

// 부원 (Q8: 학교 이메일 포함) — spec/04 D-1(P243)에서 구현: 교수는 Professor로 따로, 기간·예시 표시 추가
export type MemberStatus = 'ENROLLED' | 'GRADUATED'
export type MemberPosition = '박사과정' | '석사과정' | '학부연구생' | (string & {})  // 자유 글자 + 가이드라인 자동 완성 (P242)
export type Member = {
  id: number
  name: string
  position: MemberPosition // 정렬은 글자 안의 박사·석사·학부(학사)로 순위
  researchField: string
  email: string           // 학교 이메일 — 실제 값은 본인 동의 시에만 (NFR-10)
  status: MemberStatus
  startYear: number       // 시안의 기간 (Q-D2)
  endYear: number | null  // 졸업만
  isSample: boolean       // 예시 배지 (Q-D1)
}
export type Professor = { name: string; title: string; researchField: string; email: string; isSample: boolean } // 탭 밖 맨 위 (P240)

// 연구실 정보 (lab.ts)
export interface ResearchArea { title: string; description: string }
export interface Recruitment {
  isOpen: boolean   // 모집 스위치 (P143, 전 SHOW_RECRUIT_BOX)
  endDate: string; title: string; qualifications: string[]; posterUrl: string; formUrl: string   // P133: 마감일만, 우대사항 → 지원 자격, 포스터 추가
}
export interface LabInfo {
  name: string; shortName: string; fullName: string; koreanName: string; intro: string   // intro: 푸터 한 줄 소개 (P143, P297부터 PC에서 한 줄)
  department: string; location: string
  contactEmail: string               // 공용 메일이 없어 사용자 본인 학교 메일 (P113). 전화는 넣지 않음
  researchAreas: ResearchArea[]      // 1-3에서 추가
  recruitment: Recruitment
}

// Crossref에서 받아 폼에 채울 값 (8절)
export type CrossrefWork = Pick<AchievementInput, 'title' | 'authors' | 'venue' | 'achievedOn' | 'link'>

// DOI 조회 상태 (FR-13, AC-13-6)
export type DoiLookupState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; message: string }
```
- 유형 이름은 화면마다 반복되므로 상수 하나로: `TYPE_LABELS: Record<AchievementType, string> = { PAPER: '논문', AWARD: '수상', PATENT: '특허', CONTEST: '공모전' }` (`src/utils/achievements.ts`) [AI 설계]
- `Record<AchievementType, …>`로 두면 유형을 하나 더 만들었을 때 이름을 빼먹으면 타입 오류가 나서 바로 알 수 있다

---

## 3. 화면 구성 · 사용자 동선
| 주소 | 화면 | 관리 모드 필요 | 기능 |
|---|---|---|---|
| `/` | 홈 | | FR-02~05 |
| `/achievements` | 성과 목록 | (관리 버튼만) | FR-06~09, FR-12, FR-14 |
| `/achievements/new` | 성과 등록 | ✅ | FR-10, FR-13 |
| `/achievements/:id/edit` | 성과 수정 | ✅ | FR-11, FR-13 |
| `/members` | 부원 | | FR-15 |
| `/about` | 연구실 소개 | | FR-16 (선택) |
| `*` | 404 | | FR-01 |

**동선** (requirements → PRD 5절 시나리오)
1. 지원자: 홈 → 최근 성과(연구 분야는 연구실 소개에서, P288) → 카드 눌러 팝업 → "성과 둘러보기" → 검색 → (모집 기간이면) "지원서 작성" → 구글 폼
2. 랩장 등록: 헤더 "관리 모드" 켬 → 성과 목록 → "성과 등록" → 유형 논문 → DOI 불러오기 → 확인·수정 → 저장 → 목록 맨 위, 홈 통계 +1
3. 랩장 수정·삭제: 성과 목록 → 검색 → 줄의 "수정"(폼으로) / "삭제"(확인 상자 → 한 건 삭제)

---

## 4. 컴포넌트 계층도
```
App                                   라우팅 + 전역 저장소 감싸기
└─ AdminModeProvider                  관리 모드 (Context)
   └─ AchievementsProvider            성과 목록 (Context + useReducer)
      └─ BrowserRouter
         └─ Layout                    헤더 · 페이지 자리(Outlet) · 푸터
            ├─ Header
            │  └─ AdminModeToggle     관리 모드 스위치
            ├─ (페이지 — 주소에 따라 하나)
            │  ├─ HomePage
            │  │  ├─ StatList                통계 4칸
            │  │  ├─ RecentAchievementCard×4 최근 성과 (연구 분야는 P288에 AboutPage로만)
            │  │  ├─ RecruitBox              지원 안내 (스위치)
            │  │  │  └─ ImageModal           포스터 크게 보기 팝업 (공용, P133)
            │  │  └─ AchievementModal        자세히 보기 팝업 (공용)
            │  ├─ AchievementsPage
            │  │  (관리 모드 띠 AdminBar는 Layout이 헤더 아래에 그림 — B-4, v1.18)
            │  │  ├─ SearchFilterBar         검색어 · 유형 칩 · 연도
            │  │  ├─ AchievementList
            │  │  │  └─ AchievementRow×n     한 줄 (memo)
            │  │  ├─ EmptyState              결과 없음 (공용)
            │  │  ├─ AchievementModal        (공용)
            │  │  (삭제 확인은 AchievementRow 줄 안에 — Q-B3, P191)
            │  ├─ AchievementFormPage        등록·수정 공용 페이지
            │  │  └─ AchievementForm
            │  │     └─ DoiLookup            DOI 불러오기 (논문일 때만)
            │  ├─ MembersPage
            │  │  └─ MemberCard×n
            │  ├─ AboutPage
            │  └─ NotFoundPage
            └─ Footer
공용 조각: ArrowIcon (↗ 화살표)
공용 훅: useModal (팝업 공통 동작 — ImageModal·AchievementModal, 5.7)
```
- 공용 컴포넌트(`AchievementModal`, `EmptyState`, `ArrowIcon`)는 여러 페이지에서 쓰므로 `components/common/`·`components/achievements/`에 둔다 [AI 설계]. 공용 훅은 `hooks/` (1-9)

---

## 5. 컴포넌트별 책임 · Props · 상태 · 훅 · 함수
표기: **Props**는 부모가 넘겨주는 값, **상태**는 자기가 들고 있는 값, **이벤트**는 사용자 행동 → 실행되는 함수

### 5.1 전역 (Context)
| 컴포넌트 | 책임 | Props | 상태 | 훅 | 내보내는 것 |
|---|---|---|---|---|---|
| `AdminModeProvider` (완료, B-4 — `context/AdminModeContext.tsx` + 훅은 `useAdminMode.ts`) | 관리 모드 켜짐 여부를 모든 화면에 공유하고 저장 | `children` | `isAdmin: boolean` (처음 값은 LocalStorage에서, 깨진 값이면 꺼짐 EX-38) | `useState`(지연 초기화), `useEffect`(다른 탭 맞추기 EX-39), `createContext` | `useAdminMode()` → `{ isAdmin, setAdmin(on) }`. `setAdmin`은 화면 먼저 바꾸고 저장(실패하면 콘솔 안내만 — 잃을 데이터가 없어서). useMemo·useCallback은 넣지 않음(켜짐이 바뀔 때만 다시 그려짐) |
| `AchievementsProvider` | 성과 목록을 들고, 추가·수정·삭제를 한곳에서 처리하고 저장 | `children` | `achievements: Achievement[]` (useReducer, 처음 값은 LocalStorage 또는 예시 데이터), `saveError: string \| null` | `useReducer`(지연 초기화), `useState`, `useCallback`, `useMemo`, `createContext` | `useAchievements()` → `{ achievements, addAchievement(input)`(**C-2b부터 새 성과 번호, 실패면 null** — 저장 안내의 "보기"), `updateAchievement(id, input), deleteAchievement(id), getAchievement(id), saveError }` |

### 5.2 공통 틀
| 컴포넌트 | 책임 | Props | 상태 | 훅 | 함수·이벤트 |
|---|---|---|---|---|---|
| `Layout` (완료) | 헤더·페이지 자리·푸터 배치 | — | — | `useLocation`, `useEffect`(주소가 바뀌면 맨 위로 — P119) | — |
| `Header` (완료 + 스위치 추가, B-4 — **P297: 스크롤해도 화면 맨 위에 고정(CSS `position: sticky`, 세로 500px 이하는 풂)** — **P311 이스터에그: 로고 2초 안 5번 → `HiddenMemberModal`. 누른 횟수·처음 시각은 `useRef`(`tapRef`, 화면에 안 보이는 값), 팝업 열림은 `useState`(`hiddenOpen`), 판단은 `utils/secretTap.ts` `registerTap`(순수 함수), 주소가 바뀌면 메뉴와 함께 닫음** — 메뉴와 스위치를 `header__menu` 묶음으로, 휴대폰은 묶음째 펼침. **점검 P217: 메뉴 버튼으로 접는 폭은 헤더만 880px 이하**(스위치가 들어가며 761~830px에서 두 줄이 돼서). 로고 부제 숨기기는 그대로 760px) | 로고, 메뉴, 모바일 메뉴 펼침 | — | `menuOpen: boolean`, `menuPath: string`(지난번 주소 — 바뀌면 그리는 중에 메뉴 접기, EX-34, P188) | `useState`, `useLocation` | 메뉴 버튼 클릭 → 펼침/접힘, 로고·메뉴 클릭 → `handleLinkClick`: 접힘 + 지금 페이지면 맨 위로(부드럽게, "동작 줄이기"면 바로 — P119·P188). 뒤로·앞으로 가기로 주소가 바뀌어도 접힘 |
| `AdminModeToggle` (완료, B-4) | 관리 모드 스위치 (시안: 헤더 오른쪽 알약 + 작은 스위치, 휴대폰은 펼친 메뉴 맨 아래 D1) | — | — | `useAdminMode` | 클릭 → `setAdmin(!isAdmin)`. `aria-pressed`로 켜짐 표시. 눌러도 휴대폰 메뉴는 그대로 펼쳐 둠 |
| `AdminBar` (완료, B-4 — **`layout/`로 옮김, 등록 버튼은 빼고 안내만**, P209 ①②④) | 관리 모드 + 성과 주소(목록·등록·수정)일 때 헤더 아래 가로 전체 검정 띠: 안내 문장 + 처음 불러올 때 고친 내용(`notices`)을 요약 한 줄 + `<details>` 펼치기 | — | — | `useAchievements`(notices) | — (Layout이 `isAdmin && 성과 주소`일 때만 그림) |
| `Footer` (완료) | ① 연구실 이름 + 학과(`footer__title-row`, 좁으면 학과가 다음 줄) ② 한 줄 소개(`LAB.intro`, PC 한 줄·휴대폰 자동 줄바꿈) ③ 연락처(위치·메일·모집 중이면 "지원서 작성" — PC 한 줄, 880px 이하 세로 목록 44px, "연락처" 제목은 P304부터 `visually-hidden`으로 화면 낭독기에만) + 저작권 줄. **메뉴 묶음은 P297에 삭제**(헤더가 늘 위에 있어서) — P143 → P297 | — | — | — (P297에 메뉴와 함께 `useLocation`도 뺌) | 지원서 작성 → 새 탭 |
| `ArrowIcon` | ↗ 화살표 SVG | `size?: number` | — | — | — |

### 5.3 홈 (`spec/01_home.md`)
| 컴포넌트 | 책임 | Props | 상태 | 훅 | 함수·이벤트 |
|---|---|---|---|---|---|
| `HomePage` (완료 — 1-1~1-9) | 구역 3개 조립(P288에 연구 분야 뺌 — 첫 화면·최근 성과·지원 안내), 홈에 보일 값 계산, 팝업 열고 닫기 | — | `selectedId: number \| null` (열린 팝업의 성과 **번호** — 성과는 지금 목록에서 찾음, P182) | `useAchievements`, `useState`, `useMemo`(예시를 뺀 실제 성과 `real`(BR-20) → 통계·NEW 알약(오늘까지, 1-7)이 같이 씀, 최신 4개), `useCallback`(openModal·closeModal) | `openModal(a)` → `setSelectedId(a.id)`, `closeModal()`. 찾는 성과가 없으면(다른 탭에서 지움) 그리는 중에 번호를 `null`로 (EX-27). `LAB.recruitment.isOpen`으로 ④ 표시 (P143에 상수 `SHOW_RECRUIT_BOX`에서 옮김) |
| `StatList` (완료, 1-6) | 통계 4칸 — `<dl>`로 이름·숫자 짝 | `stats: StatItem[]` | — | — | 숫자를 두 자리로 (BR-13). 넓으면 4칸 한 줄, 760px 이하 2×2·숫자 48px (grid라 3칸 + 1칸 없음) |
| `ResearchAreaList` | 연구 분야 칸들 — P288부터 `AboutPage`에서만 씀 (모양은 `ResearchAreaList.css`) | `areas: ResearchArea[]` | — | — | 번호 `01`… (BR-17) |
| `RecentAchievementCard` (완료, 1-5·1-9) | 최근 성과 카드 1장 (예시면 "예시" 배지). 제목 칸은 짧아도 4줄 높이로 고정해 저자·학회 줄이 카드끼리 맞음 (P288). 휴대폰은 여백 16px·제목 3줄·저자·학회 숨김 (CSS, P182) | `achievement: Achievement`, `onOpen: (a: Achievement) => void` | — | — | 카드(전체가 `<button>`) 클릭 → `onOpen(achievement)` |
| `RecruitBox` (완료, 1-4 / P170 예외 처리) | 지원 안내: 모집 중·**모집 마감**·마감일, 제목, 지원 자격, "지원서 작성", 포스터 | `recruitment: Recruitment` | `posterOpen: boolean`, `posterFailed: boolean`(그림을 못 불러옴, EX-22) | `useState`, `useEffect`(lab.ts 값 경고를 개발자 도구에 — 화면 밖 일, EX-20·21) | "지원서 작성" → 새 탭 (EX-15) / 포스터 클릭 → `setPosterOpen(true)` → `ImageModal` (EX-18) / 지원 자격 0개면 숨김 (EX-14) |
| `HeroArt` (완료, 1-8 → **P314 이스터에그 2**) | 첫 화면 물방울 장식, 마우스가 다가가면 밀려나고 들어오는 순간 한 번 출렁임 (P137–P138. P146 표면 눌림은 시도 후 되돌림 P147). P314: 큰 물방울을 2초 안에 3번 누르면 터지고(`droplet--popped`, 끝나면 팝업) 명예 부원 `HiddenMemberModal`, 닫으면 물방울 복귀 | — | `popped`, `honoraryOpen` (P314) | `useRef`(물방울 상자, 큰 물방울, 누른 횟수, 터지는 중), `useEffect`(pointermove 감시 / P314 화면 전체 click 감시 — 둘 다 cleanup), `useState` | 상태 대신 CSS 변수로 직접 이동 / 클릭은 "누른 곳이 큰 물방울 원 안인지"를 재서 셈(물방울이 글 묶음 뒤라 물방울에 직접 클릭을 못 받음), 링크·버튼·입력칸·팝업·글자 선택 중은 안 셈 |
| `ImageModal` (완료, 1-4, 공용) | 그림 하나를 크게 보기 | `src`, `alt`, `onClose: () => void` | — | `useModal`(5.7 — 처음엔 `useEffect`·`useRef`를 직접 썼고 1-9에 공통 훅으로 옮김, P183) | X·바깥·Esc → `onClose()`. 그림을 눌러도 안 닫힘 |

### 5.4 성과 목록 (`spec/02` 예정)
| 컴포넌트 | 책임 | Props | 상태 | 훅 | 함수·이벤트 |
|---|---|---|---|---|---|
| `AchievementsPage` (B-1~B-4 완료 — B-4: `useAdminMode`로 제목 줄 오른쪽 "성과 등록" 링크(시안, P209 ②), 0건이면 관리 모드일 때 도움말 문장(⑥); 팝업 번호는 걸러진 목록이 아니라 전체 목록에서 찾음(EX-37), 열기·닫기 `useCallback`; 칩 숫자·연도는 전체 목록 기준, 걸렸을 때만 "3 / 8", 고른 연도가 사라지면 그리는 중에 전체로 EX-35, 0건이면 필터 줄 숨김) | 검색·필터 조건을 들고 걸러진 목록 계산, 팝업·삭제 확인 관리 | — | `filter: AchievementFilter`, `selectedId: number \| null`(홈과 같은 방식, 1-9), `confirmingId: number \| null`(삭제 확인 중인 성과 번호 — 다른 탭에서 지워지면 그리는 중에 null, P191) | `useAchievements`, `useAdminMode`, `useState`, `useMemo`(걸러진 목록·연도 선택지), `useCallback`(줄에 넘기는 함수들), `useNavigate` | `handleFilterChange(next)`, `resetFilter()`, `openModal(a)`, `requestDelete(a)`, `confirmDelete()`, `goEdit(id)`. **C-2b**: `useLocation`으로 폼이 실어 온 짐(`SavedNotice`)을 처음 그릴 때만 `useState`로 꺼내고 `useEffect`로 방문 기록의 짐을 비움(EX-44), 제목 줄 아래 검정 띠 "‘제목’ 성과를 등록했어요/수정했어요." + "보기"(팝업), `role="status"` 칸은 늘 그려 둠, 6초 타이머(`useEffect` 정리 함수) — 팝업이 열렸거나 띠에 포커스가 있으면 멈춤(EX-45) |
| `SearchFilterBar` (완료, B-2 — 칩 숫자 `typeCounts`·`total`도 받음, 숨은 라벨 "제목·저자·지도교수 검색". **P197: 입력칸 글자 `draft`를 상태로 들고 `useEffect` 타이머로 0.25초 멈추면 검색어를 올림(정리 함수로 취소), 부모 검색어가 바뀌면 그리는 중에 `draft` 맞추기** — EX-36) | 검색어 입력, 유형 칩, 연도 선택 | `filter`, `years: number[]`, `onChange: (f: AchievementFilter) => void` | — | — | 입력·선택마다 `onChange({ ...filter, 바뀐 값 })` (입력하는 즉시, FR-07) |
| `AchievementList` (B-1~B-5 완료 — B-5: 번호(`confirmingId`·`focusId`)를 줄마다 "이 줄인가" 참/거짓으로 바꿔 넘김(memo 유지). 수정은 `onEdit` 함수 대신 줄 안 링크라 안 받음) | 줄 목록(`<ol>`) — 전체 개수는 페이지 제목 옆 | `achievements`, `isAdmin`, `onOpen`, `onEdit`, `onDelete` | — | — | — |
| `AchievementRow` (B-1·B-3·B-4·B-5 완료. **B-5: "삭제" → 줄 맨 아래 확인 칸(덮개 위, 44px 버튼), `useRef`(제목·삭제·취소 버튼) + `useEffect`(열리면 취소에 포커스, `shouldFocusTitle`이면 제목에 포커스 후 `onFocusDone`), 취소·Esc는 삭제 버튼으로 포커스 먼저, 실패 문장 `role="alert"`, 삭제 버튼 `aria-expanded`·취소 버튼 `aria-describedby`(질문 문장)**. **B-3: 제목이 `<button>`이고 CSS `::after` 덮개를 줄(`position: relative`) 전체에 펼쳐 줄 어디를 눌러도 열림** — 줄 전체를 버튼으로 감싸면 제목(h2)이 제목으로 안 읽히고 줄 안에 관리 버튼을 넣을 수 없어서. 키보드 포커스 테두리는 덮개에(줄 전체). **P204–P207: 줄 끝 "자세히" 글자는 뺌 → 누를 수 있다는 표시는 제목 끝 작은 ↗(마지막 글자와 줄바꿈 없는 묶음) + 마우스가 있는 기기에서만(`hover: hover`) 줄 배경 밝게·제목 밑줄. 배경·누르는 범위·포커스 테두리는 같은 모양으로 글자보다 좌우 16px(휴대폰 12px) 넓게**) | 한 줄 (유형 배지·예시 배지·날짜·제목 전체·저자·학술지·DOI 번호(`doiLabel`) + 관리 버튼). 빈 칸 숨김, 휴대폰은 grid 자리 지정으로 날짜를 배지 줄로 | `achievement`, `isAdmin`, `onOpen`, `onEdit(id)`, `onDelete(a)` | — | `memo`로 감쌈 | 줄 클릭 → `onOpen`, 수정 → `onEdit`, 삭제 → `onDelete` (B-3 방식에선 관리 버튼이 제목 버튼 안이 아니라 옆이라 클릭이 번지지 않음 — 대신 **덮개보다 위에 오도록 `position: relative; z-index: 1`** 필요, B-4) |
| `EmptyState` (`hint?` 추가, B-2) | 결과·데이터가 없을 때 안내 | `message: string`, `actionLabel?`, `onAction?` | — | — | (EX-08, EX-09) |
| `AchievementModal` (완료, 1-9 — 홈에서 씀, 목록에서 다시 씀) | 성과 하나의 자세히 보기 — 배지·날짜·전체 제목·저자·지도교수·학회·DOI·원문 보기, 빈 칸은 줄째 숨김 | `achievement: Achievement`, `onClose: () => void` | — | `useModal`(5.7) | X·바깥·Esc → `onClose()`. 원문은 `safeLink`가 http(s)일 때만, DOI는 `doiUrl`로 doi.org 링크(화면엔 번호만, EX-30). 휴대폰은 거의 꽉 찬 화면 + 팝업 안 스크롤, 위쪽 줄 sticky(EX-31) |
| ~~`ConfirmDialog`~~ (P191에 뺌) | 삭제 확인은 `AchievementRow` 줄 안에서 (시안 그대로, Q10·Q-B3) — 확인 칸이 열리면 첫 포커스는 "취소", Esc = 취소 | — | — | — | — |

### 5.5 성과 등록·수정 (`spec/03` 예정)
| 컴포넌트 | 책임 | Props | 상태 | 훅 | 함수·이벤트 |
|---|---|---|---|---|---|
| `AchievementFormPage` (C-1 틀 완료) | 주소로 등록/수정 구분, 관리 모드 검사, 수정 대상 찾기, 저장 후 이동. 시안 배치: 왼쪽 제목·설명(수정이면 고치는 성과 제목)·단계 01~03 / 오른쪽 흰 폼 상자 | — | — | `useParams`, `useNavigate`, `useAdminMode`, `useAchievements` | 관리 모드 꺼짐 → `<Navigate to="/achievements" replace />` (EX-07·39 — 뒤로 가기로 폼에 다시 안 옴), 주소 번호는 `parseAchievementId`(1 이상 정수 글자만)로 바꿔 목록에서 찾고 없으면 `EmptyState` + "성과 목록으로" (EX-06), `handleSubmit(input)` → add/update 후 목록으로 |
| `AchievementForm` (C-2a 완료) | 입력칸·검증·저장/취소, 흰 상자·"취소"(C-1에서 옮김) | `initialValues: AchievementInput`(처음 그릴 때만 씀), `onSubmit: (input) => boolean`(성공 여부 — 성공하면 페이지가 목록으로). 초안의 `submitLabel`·`onCancel`은 뺌("저장" 한 가지, 취소는 `Link`) | `values`, `submitted`(저장을 눌렀는지), `saveFailed` — **`errors`는 상태가 아니라 `submitted ? validateAchievement(values) : {}`로 그릴 때 계산**(P224 ③) | `useState`, `useRef`(첫 오류 칸·실패 문장 포커스, `savingRef` 두 번 저장 막기 — EX-41), `useEffect`(실패 문장으로 포커스) | `handleChange(field, value)`, `handleSubmit(e)` → 오류면 첫 오류 칸 포커스, 아니면 `onSubmit(normalizeInput(values))`, 실패면 "저장에 실패했습니다."(폼 맨 위, `role="alert"`, 포커스). 유형은 숨긴 `radio` + `label` 알약(Q-C4), 칸 이름 `TYPE_FIELD_LABELS`(Q-C3), 미래 날짜 회색 안내(Q-C2), `noValidate`. 페이지는 `key`로 등록↔수정마다 새로 만듦(EX-43). [C-4] `fillFromCrossref(work)` → 빈칸이 아니라 받은 값으로 덮어씀 (BR-06). **C-4**: 유형 아래 `DoiLookup`(논문만), `handleTypeChange`는 논문이 아니면 DOI를 지움(Q-C6), `handleFill`은 빈 값이 아닌 칸만 덮어쓰고 `autoFilled`(상태)에 넣음 → 칸 이름 옆 "자동 입력", `handleChange`에서 고친 칸은 뺌. 첫 오류 포커스 순서 DOI → 제목 → 날짜 → 링크. prop `editingId` 추가 |
| `DoiLookup` (C-4 완료) | DOI 입력과 불러오기 — 유형이 논문일 때만 폼이 그림, 시안 회색 상자 | `doi`, `onDoiChange(v)`, `onFill(work: CrossrefWork)`, `error?`(저장 때 DOI 오류), `editingId`(같은 DOI 경고에서 자기 자신 빼기), `inputRef`(첫 오류 포커스 — React 19 ref prop) | `lookup: { status: idle·loading·success·error, message }` | `useState`, `useRef`(진행 중 `AbortController`·10초 타이머), `useEffect`(사라질 때 취소), `useAchievements`(같은 DOI 찾기 — 그릴 때 계산) | `handleLookup()`: 불러오는 중이면 무시 → `normalizeDoi`(칸도 번호로) → `isValidDoi` 아니면 요청 없이 형식 오류 → 취소 장치 + 10초 타이머 → `fetchCrossrefWork` → **지금 요청일 때만** 결과 반영(성공 `onFill`, not-found, failed·시간 초과). DOI를 고치면 취소. Enter = 불러오기. 버튼은 `aria-disabled`(disabled면 포커스가 떨어져서) |

### 5.6 부원·소개·404
| 컴포넌트 | 책임 | Props | 상태 | 훅 | 함수·이벤트 |
|---|---|---|---|---|---|
| `MembersPage` (D-2 완료) | 제목 → **지도교수 자리**(탭 밖) → 재학/졸업 탭 → 카드 grid·빈 상태 | — | **상태 없음** — 고른 탭은 주소 `?tab=graduated`(Q-D5, 재학은 `/members`) | `useSearchParams`(탭 읽고 쓰기, `replace`), `useAchievements`(D-4 — 부원 활동을 성과 목록에서 계산), `useRef`(화살표 키로 옮길 탭 버튼). `useMemo`는 안 씀(Q-D6 — 부원 수십 명) | 탭 클릭·←→ Home End → `setSearchParams`, 탭 모양은 `role` tablist/tab/tabpanel + `aria-selected`·`aria-controls`, 고른 탭만 `tabIndex` 0 |
| `MemberCard` (D-2 → D-4 → P289 → P306 → **P308**) | 부원 1명 — 동그라미(그림이 있으면 그림 `photoScale`배 확대·잘라 냄, 없거나 못 불러오면 첫 글자, 낭독기는 건너뜀)·이름(h3)·예시 배지(제목 밖)·직위 이름표·연구 분야·기간·학교 이메일. P306에 참여 성과를 뺌 | `member: Member` | `photoFailed` (P308 — 교수 카드와 같은 방식) | `useState` | 그림 `onError` → 첫 글자, 이메일 클릭 → `mailto:` (AC-15-2), 빈 칸 숨김 |
| ~~`MemberActivityModal`~~ (D-4 → **P306 삭제**) | 부원 활동 전체 팝업이었음 — 카드에서 참여 성과를 빼며 파일(.tsx·.css)째 지움. 다시 필요하면 Git 기록(커밋 00160e0 이전) | — | — | — | — |
| `HiddenMemberModal` (P311, 이스터에그 → P314 `title` 받음) | 숨은 부원 카드 팝업 — 위 줄 `title`(팝업 이름: "함께했던 부원" / "명예 부원을 찾았어요")·닫기 + `MemberCard` 그대로. 성과 팝업 바탕·상자, 카드 한 장 폭(440px), 휴대폰은 꽉 찬 화면 대신 카드 높이만큼 가운데 | `member`, `onClose` | — | `useModal` | Esc·바깥·닫기 → 로고로 포커스 |
| `ProfessorCard` (D-2 → D-3 완료) | 지도교수 — 검정 넓은 카드, **사진(4:5 둥근 네모, 못 불러오면 첫 글자)**, 학력 한 줄, 최근 논문 3편(두 줄까지), 전화(tel:)·이메일, "전체 이력 보기 (논문 N편)" | `professor: Professor` | `photoFailed`, `isOpen` — 이 카드만 쓰는 값 | `useState` | 이력이 하나도 없으면 D-2 모양 그대로. **팝업은 카드(article) 밖 형제로 그림**(안에 두면 흰 글자색을 물려받음 — D-3 확인 중 발견) |
| `ProfessorModal` (D-3) | 전체 이력 팝업 — 이름·직함, "논문 21편 · SCIE 5 · SCOPUS 5 · SCI 1", 전공·연구 분야·소속학회·연락처, 학력, 경력, 논문(연도별 + 등급 배지·역할 배지), 학술활동. 빈 묶음 숨김 | `professor`, `onClose` | — | `useModal`(성과 팝업과 같은 훅·같은 바탕 모양 CSS) | Esc·바깥·닫기 → 여는 버튼으로 포커스 |
| `AboutPage` | 연구실 소개 (선택) — 소개 글 + 옆 정보 목록 4줄(P276 B안)·연구 분야(`ResearchAreaList` 다시 씀)·찾아오는 길·연락처 (spec/05, P272) | — | — | `useAchievements` (실제 성과 수 — 전역 상태에서 읽기만) | 지도에서 보기 → 새 탭 / 지도교수·부원 칸 → `/members` |
| `NotFoundPage` (완료) | 없는 주소 안내 | — | — | — | — |

### 5.7 공용 훅 (`src/hooks/`, 1-9 — P182–P183)
| 훅 | 책임 | 받는 값 | 돌려주는 값 | 안에서 쓰는 훅 | 동작 |
|---|---|---|---|---|---|
| `useModal` (완료) | 팝업 공통 동작을 한곳에 — `ImageModal`·`AchievementModal`이 씀 (삭제 확인은 줄 안이라 쓰지 않음, P191) | `onClose: () => void` | `dialogRef`(팝업 상자), `closeButtonRef`(처음 포커스 받을 버튼), `backdropProps`(바깥 클릭 처리 — 어두운 배경에 펼쳐 붙임) | `useRef`(요소 2개, 최신 `onClose`, 바깥에서 눌렀는지), `useEffect`(열릴 때 한 번: 키보드 감시·스크롤 막기·포커스 → 정리 함수에서 모두 되돌림) | Esc → 닫기 / Tab·Shift+Tab → 팝업 안에서만 돎 / 열면 닫기 버튼에 포커스, 닫으면 연 곳으로(그 요소가 아직 화면에 있을 때만) / 열린 동안 뒤 화면 스크롤을 막고 닫으면 원래 값으로 / 누를 때·뗄 때 모두 바깥일 때만 닫기(EX-28) / 최신 `onClose`는 ref로 — 부모가 새 함수를 줘도 effect를 다시 돌리지 않음 |

- 헤더의 휴대폰 메뉴는 이 훅을 쓰지 않는다 — 뒤 화면을 막는 팝업이 아니라 펼침 메뉴라서 Tab 가두기·스크롤 막기가 맞지 않음 (P183에 확인)

---

## 6. 상태 관리 구조
### 6.1 성과 저장소 (AchievementsProvider)
- `useReducer(achievementsReducer, undefined, loadInitial)` — 세 번째 인자 `loadInitial`이 처음 한 번만 LocalStorage를 읽는다(지연 초기화) [AI 설계]
- 액션
```ts
type AchievementsAction =
  | { type: 'add'; input: AchievementInput }            // id는 reducer가 최댓값+1로
  | { type: 'update'; id: number; input: AchievementInput }
  | { type: 'delete'; id: number }
```
- **저장은 "먼저 저장, 성공하면 화면 반영"** [AI 설계 — 설계 검토 R1 참고]: `commit(action)`이 `achievementsReducer(지금 목록, action)`으로 다음 목록을 계산 → `saveAchievements(다음 목록)` 시도 → 성공하면 `dispatch(action)`, 실패하면 `saveError`에 "저장하지 못했어요."를 넣고 화면은 그대로 (EX-12, NFR-04)
- reducer는 순수 함수(같은 입력이면 같은 결과, 바깥을 건드리지 않음)라서 `utils/achievements.ts`에 두고 단독으로 테스트할 수 있다

- **구현 (2-5, P174–P175)**: `context/AchievementsContext.tsx`(Provider) + `context/useAchievements.ts`(Context·훅 — 컴포넌트 파일은 컴포넌트만 내보내라는 lint 규칙 때문에 분리)
  - 처음 불러오기: `useState(loadAchievements)`로 결과(목록 + 안내)를 한 번 잡고 `useReducer(achievementsReducer, initial.achievements)` — 2-4에서 불러오기가 안내 문장도 돌려주게 바뀌어 설계의 "useReducer 세 번째 인자" 대신 이렇게
  - 깨진 데이터: `useEffect`에서 원본 백업 → 고친 목록 저장 → 콘솔 안내 한 번. `useRef`로 한 번만 실행(개발 모드 두 번 실행 때 백업이 덮어써지는 것 방지). 백업 실패면 원본을 덮어쓰지 않음. 화면 띠는 관리 모드 때(`notices` 보관)
  - 바꾸기: `applyChange(지금 목록, 동작, saveAchievements)`(순수 함수) → 성공일 때만 `dispatch`, 함수는 성공 여부(boolean) 반환. 없는 번호는 reducer가 같은 목록을 돌려줘 실패로
  - 다른 탭: `useEffect`로 `storage` 신호를 감시해 다시 읽고 `replace` (깨진 값이면 고쳐 보여 주기만, 저장은 안 함 — 탭끼리 주고받기 방지)
  - 예시 성과를 수정해도 `isSample` 유지 (P174). 처음 방문에는 저장하지 않음(첫 수정 때 저장)
  - `useMemo`는 쓰지 않음 — Provider는 목록이 바뀔 때만 다시 그려져 얻는 게 없음 (훅을 억지로 넣지 않기)
  - **A 점검 반영 (P176–P177)**: 바꾸기 함수는 화면이 그려질 때의 목록이 아니라 `useRef`에 둔 **최신 목록**으로 계산(같은 동작 안에서 두 번 바꿔도 저장소 = 화면, 덕분에 함수도 한 번만 만들어짐) / reducer는 `findRequiredProblem`(유형·빈 제목·실제 날짜)에 걸리는 입력을 받지 않음 — 불러오기와 **같은 규칙** / 다른 탭이 깨진 값을 쓰면 원본 백업

### 6.2 관리 모드 (AdminModeProvider)
- `useState(() => loadAdminMode())` — 처음 값만 LocalStorage에서, `setAdmin(on)`이 상태를 바꾸고 바로 저장 (Q5)

### 6.3 화면 상태 (각 페이지)
- 검색어·필터, 열린 팝업, 삭제 대상, 탭, 폼 입력값·오류, DOI 조회 상태 — 그 화면에서만 쓰므로 `useState`로 그 페이지에 둔다
- 걸러진 목록·통계·연도 선택지처럼 **다른 상태로 계산되는 값은 상태로 두지 않고** `useMemo`로 계산한다 (같은 값을 두 군데 두면 어긋날 수 있음)
- 열린 팝업도 같은 이유로 성과 객체가 아니라 **번호**를 상태로 두고 지금 목록에서 찾는다 (1-9, P182) — 다른 탭에서 고치면 팝업도 바로 바뀌고, 지우면 저절로 닫힌다. 사라진 번호는 그리는 중에 `null`로 맞춘다(EX-27 — `useEffect`로 한 번 더 그리는 것보다 단순, React 공식 문서 방식)

### 6.4 훅 배치 — "강의에서 배운 훅을 적재적소에" (NFR-02, 교수님 안내 P065)
| 훅 | 쓰는 곳 | 이유 |
|---|---|---|
| `useState` | 처음 불러온 결과를 한 번만 잡기(지연 초기화, `AchievementsProvider`), 메뉴 펼침, 관리 모드, 검색·필터, 열린 팝업의 성과 번호(`HomePage`, 1-9)·삭제 대상, 포스터 팝업(`RecruitBox`), 탭, 폼 값·오류, DOI 상태 | 바뀌면 화면이 다시 그려져야 하는 값 |
| `useReducer` | 성과 목록 | 같은 데이터를 바꾸는 방법(추가·수정·삭제)이 여러 가지라 한곳(reducer)에 모아 규칙을 지킴 |
| `createContext`·`useContext` | 성과 목록, 관리 모드 | 홈·목록·폼·헤더가 같은 값을 써서, props로 여러 층을 넘기지 않으려고 |
| `useMemo` | 홈 통계·최신 4개·NEW, 목록 필터 결과·연도 선택지 (~~부원 탭 결과~~ — spec/04 Q-D6에서 빼기로, P240) | 성과 목록·조건이 안 바뀌면 다시 계산하지 않음. 특히 검색 입력마다 전체를 거르는 계산 |
| `useCallback` | Provider가 내보내는 함수들, 홈 카드·팝업에 넘기는 열기·닫기(`HomePage`, 1-9), 목록 줄에 넘기는 `onOpen`·`onEdit`·`onDelete` | 다시 그려질 때 함수가 새로 만들어지면 `memo`한 줄이 쓸데없이 다시 그려짐 → 같은 함수를 유지 |
| `memo` | `AchievementRow` | 검색어를 칠 때마다 목록 전체가 다시 그려지는데, 내용이 안 바뀐 줄은 건너뜀 (성과가 많아질 때 효과. 샘플 데이터 수준에서는 차이가 작음 — 설계 검토 R5) |
| `useEffect` | 깨진 데이터 백업·저장, 다른 탭 `storage` 신호 감시(`AchievementsProvider`, P175), 팝업 공통 훅 `useModal`(Esc·Tab 키 감시, 스크롤 막기, 포커스 — 팝업·확인 상자가 같이 씀, 1-9), DOI 요청을 화면이 사라질 때 취소, **페이지가 바뀌면 맨 위로 스크롤(`Layout`, P119)** | 화면 밖(키보드·문서·네트워크)과 연결하고, 사라질 때 정리(cleanup)해야 하는 일 |
| `useRef` | 깨진 데이터 복구를 한 번만(`AchievementsProvider` — 개발 모드 두 번 실행에도 원본 보호, P175), 물방울 상자(`HeroArt` — 마우스마다 다시 그리지 않고 직접 움직이려고, P137), `useModal`의 팝업 상자·처음 포커스 버튼·최신 `onClose`(부모가 새 함수를 줘도 effect를 다시 돌리지 않으려고)·바깥에서 눌렀는지(1-9), DOI 요청의 `AbortController` | 다시 그리지 않고 DOM 요소나 값을 붙잡아 둠 |
| 사용자 정의 훅 `useModal` | `ImageModal`, `AchievementModal` | 같은 `useEffect`·`useRef` 묶음을 팝업마다 똑같이 쓰게 되어 한 번 만들어 같이 씀 — 고칠 때 한 곳만 고치면 모든 팝업에 반영 (P182–P183) |
| React Router 훅 | `useParams`(수정할 id), `useNavigate`(저장 후 이동), `useLocation`(지금 주소 — 맨 위로 스크롤, P119) | 주소 읽기·바꾸기 (수업 밖, 05_code-analysis 기록) |

- LocalStorage 저장은 `useEffect`가 아니라 위 6.1의 `commit`에서 한다 — 저장에 실패하면 화면도 바꾸지 않아야 해서(EX-12). DOI 조회도 `useEffect`가 아니라 버튼의 이벤트 핸들러에서 한다 — 사용자 행동에 대한 반응이라서

---

## 7. LocalStorage 처리 (`src/utils/storage.ts`)
| 키 | 값 | 함수 |
|---|---|---|
| `lab-achievements:items` | `Achievement[]`의 JSON | `loadAchievements(): Achievement[] \| null`, `saveAchievements(list): boolean` |
| `lab-achievements:adminMode` | `"true"` / `"false"` | `loadAdminMode(): boolean`, `saveAdminMode(on): boolean` |

- **불러오기** (EX-10, EX-11, Q7 — **2-4 구현, P164–P167**) → `loadAchievements(): LoadResult` = `{ achievements, notices }` (읽기만 함)
  1. 저장소를 읽을 수 없으면(브라우저가 막음) → 처음 데이터 + 안내
  2. 값이 없으면 → 처음 데이터 8건 (안내 없음)
  3. JSON이 아니거나 배열이 아니면 → 처음 데이터 + 안내
  4. 빈 배열 `[]`이면 → **빈 목록 그대로** (사용자가 다 지운 것, P164)
  5. 배열이면 항목마다 검사: 필수(번호 1 이상 정수·유형 4가지·제목 빈칸 아님·날짜 `YYYY-MM-DD`)가 틀리거나 **번호가 겹치면(P165)** 그 항목을 빼고 안내 / 선택 글자 칸(저자·지도교수·학회·DOI·링크)·`isSample`이 없거나 형식이 다르면 빈 값·`false`로 채워 살리고 안내 / 모르는 칸은 버림
  - 배열에 항목이 있었는데 **전부 틀려서 0건**이 되면 → 망가진 데이터로 보고 **처음 데이터 + 안내** (처음 설계대로, P168–P169 AI 추천 채택). 일부러 비운 `[]`과 구분
- **안내·복구 (P167 A안)**: 2-5에서 `notices`가 있으면 `backupRawData()`로 원본을 `lab-achievements:backup`에 옮기고 → 고친 목록을 저장 → 안내를 한 번 보여 준다. 저장에 실패하면 다음 방문에 다시 발견돼 안내가 다시 나온다(재알림 효과). 기간 재알림(B안)은 고칠 화면이 없어 제외 — 기말(서버·관리자 화면)에서는 B가 맞을 수 있음
- **예시 데이터** (`data/sampleAchievements.ts`, P098–P099): 실제 성과(사용자가 "여기를 고치세요" 주석을 보고 직접 채움, `isSample: false`) + 지어낸 예시(`isSample: true`)를 섞어 8건 — 논문 3·수상 2·특허 1·공모전 2. 예선에 그친 경진대회도 준비한 기록이라 포함 (사용자 결정)
- **저장**: `try { localStorage.setItem(...); return true } catch { return false }` — 저장 공간 부족·사생활 보호 모드에서 `setItem`이 오류를 던지므로 (EX-12)

---

## 8. Crossref 연동 (`src/api/crossref.ts`) — `design-visual.md` §6을 이어받음
- **C-3 구현 (P230–P231)**: 파일을 나눔 — DOI 글자 규칙(`normalizeDoi`·`isValidDoi`)은 **`src/utils/doi.ts`**(팝업 링크 `doiUrl`도 이걸 씀 — 체크리스트 4절 "DOI 정리를 한곳에" 처리), 인터넷을 쓰는 `fetchCrossrefWork`만 `src/api/crossref.ts`
- `normalizeDoi(input)`: 앞뒤 공백 제거, 앞의 `https://doi.org/`·`http://dx.doi.org/`·`doi:` 제거 (BR-05)
- `isValidDoi(doi)`: `10.`으로 시작하고 `/`가 있음 — `^10\.\d{4,9}/\S+$` [AI 설계] (EX-02)
- `fetchCrossrefWork(doi, signal): Promise<CrossrefWork>`
  - `GET https://api.crossref.org/works/{encodeURIComponent(doi)}`
  - ~~404 → `DoiNotFoundError` / 그 밖의 실패·네트워크 오류 → `LookupFailedError`~~ → **오류를 던지지 않고 결과 묶음** `CrossrefResult = { ok: true, work } | { ok: false, reason: 'not-found' | 'failed' | 'aborted' }` (P230 ② — 화면이 `if`로 나누기 쉽고 오류 클래스가 필요 없음). 주소 만들기까지 `try` 안(짝 없는 특수 문자 → failed). 10초 시간 초과는 C-4 화면이 같은 취소 신호로(③). 이메일(`mailto`) 안 붙임 (EX-03, EX-04)
  - 응답 변환: `title[0]` → title(**태그 지우기 → 표기 되돌리기 → 공백 하나로**, EX-47), `author[]`의 `given family`(given 없으면 family, 단체는 `name`) → authors(", "로 이음), `container-title[0]` → venue(같은 다듬기), `issued.date-parts[0]` → achievedOn(빠진 월·일은 01, 없는 날짜·`[[null]]`은 빈칸, EX-05), ~~`URL`~~ → link는 **`doiUrl(doi)`로 직접**(응답 URL은 `http://dx.doi.org/…`로 오기도 해서, P230 ⑥). 반환 타입 `CrossrefWork = Pick<AchievementInput, title·authors·venue·achievedOn·link>`
  - 응답도 `unknown`으로 받아 필요한 칸만 꺼낸다 (`any` 금지)
- ~~⚠ 브라우저에서 바로 부를 수 있는지(CORS) 아직 직접 확인하지 않음~~ → P219 확인(200, CORS 문제 없음), C-3 개발 화면에서 다시 불러 확인 (설계 검토 R6)

---

## 9. 주요 계산 (`src/utils/achievements.ts`)
| 함수 | 하는 일 | 규칙 |
|---|---|---|
| `sortByLatest(list)` | 날짜 최신순, 같으면 id 큰 것 위 | BR-10 |
| `filterAchievements(list, filter)` | 검색어(제목·저자, 대소문자·앞뒤 공백 무시) AND 유형 AND 연도 | BR-11 |
| `getYears(list)` | 데이터에 있는 연도만, 최신순 | Q4 |
| `countByType(list)` | 유형별 개수 → 통계 4칸 | FR-02 |
| `getNewestSummary(list, today)` | 오늘(`today`) 이후 날짜는 빼고(1-7, P186) 가장 최근 날짜 + 그날 성과 개수, 한 유형이면 유형 이름·섞이면 "성과" → `NewestSummary { date, label, count }` (`null`이면 숨김, P161). 오늘 날짜를 받는 순수 함수라 테스트에서 날짜를 정해 둘 수 있음 | BR-15, EX-32 |
| `nextId(list)` | 최댓값 + 1, 없으면 1 | BR-12 |
| `validateAchievement(input)` (C-2a) | 제목(공백만도)·실제 있는 날짜·링크(`safeLink`와 같은 규칙) 검사 → `AchievementErrors`(시안 문장) | BR-02, BR-04, EX-01, EX-30 |
| `normalizeInput(input)` · `toInput(achievement)` · `EMPTY_INPUT` · `TYPE_FIELD_LABELS` (C-2a) | 저장 직전 앞뒤 공백 지우기 / 성과 → 폼 값(번호·예시 여부 뺌) / 등록 처음 값(논문) / 유형별 칸 이름 | BR-03, Q-C3 |
| `findRequiredProblem(value)` | 유형·제목·실제 날짜 검사 → 이유 문장 또는 null. reducer(저장)와 storage(불러오기)가 같이 씀 (P177). 폼의 `validateAchievement`도 이걸 바탕으로 | EX-26 |
| `normalizeInput(input)` | 문자열 앞뒤 공백 제거 | BR-03 |
| `formatDate(ymd)` | `2026-09-15` → `2026.09.15` | 화면 표시 |
| (`utils/recruitment.ts`) `getRecruitStatus(r, today)` | 마감 여부·보일 마감일·지원서 링크·경고를 한곳에서 → 홈 ④와 푸터가 같이 씀. `isValidYmd`(실제 날짜 검사)는 등록 폼에서도 다시 씀 | EX-19~21 (P170) |
| `padCount(n)` | `3` → `03`, `100` → `100` | BR-13 |
| (`utils/links.ts`) `safeLink(url)` | `http:`·`https:` 주소만 돌려주고 아니면 `null` → 링크 숨김 (`new URL`로 검사) | EX-30 (1-9). 03 폼의 링크 검사에도 쓸 것 |
| (`utils/links.ts`) `doiLabel(doi)` | 화면에 보일 DOI 번호만 — `doiUrl`을 거쳐 비었거나 깨지면 `null`. 팝업·목록 줄이 같이 씀 (B-1, P193) | EX-30, EX-33 |
| (`utils/links.ts`) `doiUrl(doi)` | 앞의 `https://doi.org/`·`doi:`를 떼고 `https://doi.org/번호` 링크로 (`encodeURI`) | EX-30, BR-05. 8절 `normalizeDoi`와 같은 정리 — 03 DOI 단계에서 하나로 합칠 것. 주소로 만들 수 없으면(`encodeURI` 오류) `null` (EX-33, P188) |
| `achievementsReducer(state, action)` | 6.1의 액션 처리 (순수 함수) | — |

---

## 10. 데이터 흐름
```
[등록]  AchievementForm 저장 클릭
        → validateAchievement 통과 → onSubmit(normalizeInput(values))
        → AchievementFormPage.handleSubmit → addAchievement(input)
        → commit({ type:'add', input }) → 다음 목록 계산 → saveAchievements 성공
        → dispatch → achievements 바뀜
        → 이 값을 쓰는 HomePage(통계·최근 성과)와 AchievementsPage(목록)가 다시 그려짐
        → navigate('/achievements')

[검색]  SearchFilterBar 입력 → onChange(next) → AchievementsPage의 filter 상태 바뀜
        → useMemo가 filterAchievements(achievements, filter) 다시 계산 → 목록 다시 그려짐
        (memo한 AchievementRow 중 바뀌지 않은 줄은 건너뜀)

[DOI]   DoiLookup "불러오기" → normalizeDoi → isValidDoi 실패면 메시지
        → lookup = loading → fetchCrossrefWork → 성공: onFill(work) → AchievementForm values에 채움 (저장은 안 함)
                                                → 실패: lookup = error + 메시지
```
- JSP에 빗대면: Provider = DAO + 저장소, 페이지 = 서블릿(Controller), 하위 컴포넌트 = JSP 화면, props = `request.setAttribute`

---

## 11. 폴더 구조
```
lab-achievements/src/
├─ main.tsx, App.tsx, index.css, types.ts
├─ api/crossref.ts
├─ context/AdminModeContext.tsx, AchievementsContext.tsx(Provider), useAchievements.ts(Context·훅)
├─ data/lab.ts, members.ts, sampleAchievements.ts
├─ hooks/useModal.ts (팝업 공통 동작, 1-9)
├─ utils/achievements.ts, storage.ts, date.ts(P177), recruitment.ts(P170), links.ts(1-9)
├─ components/
│  ├─ layout/   Layout, Header, AdminModeToggle, AdminBar, Footer, navItems.ts, Layout.css
│  ├─ common/   ArrowIcon, ImageModal(+css), EmptyState(+css)
│  ├─ home/     StatList, ResearchAreaList, RecentAchievementCard, RecruitBox
│  ├─ achievements/  AchievementModal(+css), SearchFilterBar, AchievementList, AchievementRow, AchievementForm, DoiLookup
│  └─ members/  MemberCard, HiddenMemberModal(P311)
└─ pages/  HomePage(+css), AchievementsPage, AchievementFormPage, MembersPage, AboutPage, NotFoundPage
```

---

## 12. 확인이 필요한 사항
| ID | 질문 | AI 기본값 | 이유 |
|---|---|---|---|
| D1 | 관리 모드 스위치 위치 | 헤더 오른쪽 (시안 그대로) | 어느 화면에서든 켜고 끌 수 있음. 휴대폰에서는 펼친 메뉴 맨 아래 |
| D2 | 목록 줄을 눌렀을 때 | 홈과 같은 팝업 | FR-08 [보충]을 채택함. 한 번 만든 팝업을 재사용 |
| D3 | "샘플로 되돌리기"를 어디에 | 성과 목록의 관리 모드 띠 | 성과를 다루는 화면에 모음. 실수 방지로 확인 상자 |
| D4 | 등록·수정 화면을 따로 만들지 | 한 페이지·한 폼을 같이 씀 (지금 라우팅 그대로) | 칸이 같고, 처음 값만 다름 |

**결정 기록**
| ID | 결정 | 이유 |
|---|---|---|
| D4 | AI 기본값 채택 — 한 페이지·한 폼 | "등록 수정은 한페이지에서 하는게 맞는거 같음" (P090). **AI 코멘트**: 입력칸·검증·DOI 불러오기를 한 번만 만들면 되고, 고칠 때도 한 곳만 고치면 등록·수정 둘 다 바뀌어서 둘이 어긋날 일이 없다 |
| D1 | AI 기본값 채택 — 관리 모드 스위치를 헤더에 **모두에게 보이게** (휴대폰은 펼친 메뉴 맨 아래). AI가 "모두에게 보이기 / `?admin`으로 숨기기"를 비교함 | "모두에게 보이게 하고 나중에는 어차피 로그인 기능으로 할꺼니까" (P091) — 체험판 스위치는 기말에서 부원 로그인으로 바뀜 |
| D2 | AI 기본값 채택 — 성과 목록의 줄을 누르면 홈과 같은 팝업 | "D2는 그대로 진행" (P093). **AI 코멘트**: 팝업을 한 번 만들어 두 화면에서 쓰니 만들 것이 줄고, 방문자는 홈 카드든 목록 줄이든 같은 방식으로 자세히 볼 수 있어 헷갈리지 않는다 |
| D3 | **제외** — "예시 데이터로 초기화" 버튼을 만들지 않음 (AI 기본값은 "남기기"였음) | "D3는 없어도 될 것 같은디" (P093). AI 의견: 동의 — 브라우저 저장소를 비우고 새로고침하면 EX-10에 따라 예시 데이터로 다시 시작하므로, 시연 전 정리는 그 방법으로 충분 |

## 13. 설계 검토 (실습지 2.4 — 요구사항과 설계 비교)
| # | 검토 질문 | 결과 |
|---|---|---|
| R1 | 저장 실패 시 화면을 바꾸지 않는가? (EX-12) | `useEffect`로 저장하면 화면이 먼저 바뀌어 규칙을 어김 → **저장 먼저, 성공하면 반영**(6.1)으로 설계 |
| R2 | 모든 FR이 컴포넌트에 들어갔는가? | FR-01~16 모두 4·5절에 있음 (추적: 14절) |
| R3 | 같은 일을 두 번 만드는 곳이 없는가? | 팝업·확인 상자·결과 없음 안내를 공용 컴포넌트로 묶음. 등록·수정은 한 폼. 팝업 공통 동작은 훅 `useModal` 하나로 (1-9) |
| R4 | 상태가 두 군데에 있어 어긋날 위험은? | 계산되는 값(필터 결과·통계)은 상태로 두지 않고 `useMemo`로 계산 |
| R5 | 불필요하게 복잡한 곳은? | `memo`·`useCallback`은 지금 샘플 데이터 양에서는 효과가 작음. 다만 성과가 늘어날 때 의미가 있고 강의 훅 활용(NFR-02)이라 한 곳(목록 줄)에만 씀 — 남발하지 않음 |
| R6 | 아직 확인하지 않은 가정은? | Crossref를 브라우저에서 바로 부를 수 있는지(CORS) — 구현(4단계) 전에 한 번 호출해 확인 |
| R7 | `any` 없이 바깥 데이터를 다룰 수 있는가? | LocalStorage·Crossref 응답을 `unknown`으로 받아 검사 함수로 확인 |

## 14. 요구사항 → 설계 추적
| FR | 컴포넌트 | 함수·상태 |
|---|---|---|
| FR-01 | Layout, Header, Footer, NotFoundPage | `menuOpen` |
| FR-02 | HomePage, StatList | `countByType`, `getNewestSummary`, `padCount` |
| FR-03 (삭제 P288 → FR-16 AboutPage) | ResearchAreaList | `LAB.researchAreas` |
| FR-04 | RecentAchievementCard, AchievementModal | `sortByLatest`, `selectedId` |
| FR-05 | RecruitBox, Footer | `LAB.recruitment` (`isOpen` 스위치) |
| FR-06 | AchievementsPage, AchievementList, AchievementRow, EmptyState | `sortByLatest` |
| FR-07 | SearchFilterBar | `filter`, `filterAchievements`, `getYears` |
| FR-08 | AchievementModal, `useModal` | `selectedId`, `safeLink`, `doiUrl` |
| FR-09 | AdminModeProvider, AdminModeToggle, AdminBar | `isAdmin` |
| FR-10·11 | AchievementFormPage, AchievementForm | `values`, `errors`, `validateAchievement`, `add/updateAchievement` |
| FR-12 | AchievementRow (줄 안 확인) | `deleteTarget`, `deleteAchievement` |
| FR-13 | DoiLookup | `lookup`, `fetchCrossrefWork`, `normalizeDoi`, `isValidDoi` |
| FR-14 | AchievementsProvider | `commit`, `load/saveAchievements` |
| FR-15 | MembersPage, MemberCard | `tab` |
| FR-16 | AboutPage | `LAB` |

## 15. 설계 검토 및 개선 기록 (사용자 작성)
- 확정 (P094): D1~D4를 정한 뒤 "확정". 수정한 부분은 D3(초기화 버튼 제외 → requirements v1.1)
- **v1.1 (P099)**: 테스트 데이터를 정하다가(test-cases T3) 실제 성과가 3건뿐이라 예시를 섞기로 함 → 지어낸 성과가 실제처럼 보이지 않게 `Achievement`에 `isSample` 추가, 카드·줄·팝업에 "예시" 배지. AI가 "표시 없이 섞으면 방문자가 실제 성과로 오해할 수 있다"며 배지를 추천 → 사용자 채택
- **v1.2 (P109–P113, 구현 중 변경)**: 연구실 소개 첫머리에 BSS 풀 네임을 쓰려고 `fullName` 추가(P109). 공용 전화번호가 없고 개인 휴대폰 번호는 공개하지 않기로 해서 `phone` 삭제, 푸터 연락처는 이메일만(P113)
- **v1.2 추가 (P117–P119, 구현 중 발견)**: 사용자가 "홈에서 홈 눌렀을 때 맨 상단으로 올려줘야 하지 않을까?" → AI가 확인하다가 페이지를 옮길 때도 스크롤이 그대로인 문제를 함께 발견. `Layout`에 주소가 바뀌면 맨 위로(`useEffect` + `useLocation`), `Header`·`Footer`에 지금 페이지 링크면 부드럽게 맨 위로(`scrollToTop.ts`)
- **v1.3 (P127–P133, 구현 중 변경)**: 사용자가 모집 포스터를 넣고 싶어 함 → `Recruitment`를 마감일만·지원 자격(`qualifications`)·포스터(`posterUrl`)로 바꾸고, 포스터를 크게 보는 공용 팝업 `ImageModal` 추가. 나중에 만들 `AchievementModal`과 같은 방식(useEffect cleanup, useRef 포커스)이라 먼저 익혀 둠
- **v1.3 추가 (P141–P143)**: 푸터에서도 모집 중인지 알아야 해서 스위치를 `HomePage`의 상수에서 `lab.ts`의 `recruitment.isOpen`으로 옮김 — 켜고 끄는 곳이 한 곳. `LabInfo.intro` 추가
- **v1.4 (P150)**: 사용자가 "누구 지도 받아서 쓴건지는 있어야" → `Achievement`에 `advisors` 칸 추가 (폼·팝업에도 표시). 기말 API 명세 achievement에도 더할 것
- **v1.9 (P182–P183, 구현 중 변경)**: 팝업 공통 동작(Esc·스크롤 막기·포커스·Tab 가두기·바깥 클릭)을 사용자 정의 훅 `useModal`로 묶음(5.7) — 사용자 요청 "지금까지 팝업 열던 것들에도 적용 가능하고 이게 더 효율적으로 적용 될 수 있다면 이 훅을 사용하는 식으로"(P183). 그때까지 팝업은 포스터 `ImageModal` 하나라 같이 옮겼고, 헤더 휴대폰 메뉴는 팝업이 아니라 그대로, `ConfirmDialog`도 이 훅으로 설계 변경. HomePage는 열린 성과를 객체가 아니라 번호로(P182), 링크 검사 `utils/links.ts` 추가
- **v1.10 (P184–P185)**: 홈 통계는 예시 성과를 빼고 실제 성과만 셈 — AI 추천(예시 포함, 시안 숫자 맞추기)과 달리 사용자 "예시 숫자 굳이 안 맞춰도 된다고 생각중이라 그냥 실제 성과값만"(P184). 시안의 flex(칸 최소 200px) 대신 grid로 4칸 / 휴대폰 2×2 (768px 근처 3칸 + 1칸 방지). `StatItem` 타입 추가
- **v1.11 (P186–P187)**: NEW 알약도 실제 성과만 + 오늘 이후 날짜 제외(AI 추천 픽 채택) → `getNewestSummary`가 오늘 날짜를 받음. HomePage는 예시를 뺀 목록(`real`)을 한 번만 걸러 통계·알약이 같이 씀(같은 거르기를 두 번 쓰지 않게). 알약은 HomePage 안에, 눌러도 동작 없음
- **v1.12 (P187–P188, 홈 전체 점검)**: 점검에서 재현된 문제를 사용자가 모두 고치기로("다 수정하자") — `doiUrl`이 오류를 잡아 `null`(EX-33), 푸터 링크 높이 44px(NFR-08), `Header`가 지난 주소(`menuPath`)를 기억해 바뀌면 메뉴 접기(EX-34), 같은 페이지 스크롤은 "동작 줄이기"면 바로. 오류 경계(Error Boundary)는 클래스 컴포넌트라 기말로
- **v1.13 (P189–P191, spec/02 B 확정)**: 초안을 쓰다 Q10("시안의 확인 상자" — 시안은 줄 안 확인)과 5.4의 팝업 `ConfirmDialog`가 어긋난 것을 찾아 Q-B3으로 물음 → 사용자 AI 추천(줄 안 확인) 채택. `ConfirmDialog`를 빼고 `AchievementsPage`는 삭제 확인 중인 번호(`confirmingId`)를 상태로
- **v1.18 (P208–P209, B-4)**: 시안을 다시 보니 "성과 등록"은 제목 줄 오른쪽, 검정 띠는 안내만 있음 → 초안의 `AdminBar`(띠 안 등록 버튼)와 어긋나 B-4 가이드에서 물음(②) → 사용자 AI 추천 픽 채택. `AdminBar`는 헤더 아래 가로 전체라 `main`(내용 폭) 밖에 있어야 해서 Layout이 그리고 `layout/` 폴더로 옮김. 수정은 `onEdit` 함수 대신 줄 안 링크(`Link`)
- **v1.19 (P213–P215, B-5)**: 삭제를 구현하며 구체화 — `AchievementsPage`에 `confirmingId`·`deleteFailed`·`focusId` + 최신 걸러진 목록 `useRef`(useEffect로 갱신. 지우는 함수가 다음 줄을 찾으려면 목록이 필요한데, 의존값에 넣으면 검색할 때마다 함수가 새로 생겨 memo가 깨져서). 줄에는 번호 대신 참/거짓. 확인 칸 저절로 닫기는 그리는 중에(관리 모드 꺼짐·걸러진 목록에 없음, EX-40). 페이지 제목 `h1`은 `tabIndex={-1}`(다 지운 뒤 포커스 자리)
- **v1.20 (P216–P217, spec/02 점검)**: `useModal` 바깥 클릭 닫기와 줄의 제목·수정·삭제 버튼은 더블클릭의 두 번째 클릭(`event.detail > 1`)을 무시(EX-41). `AchievementsPage`는 성과가 0건이 되면 그리는 중에 검색 조건을 처음으로(EX-42). 헤더 메뉴 접는 폭 880px
- **v1.21 (P221–P222, spec/03 C-1)**: `AchievementFormPage` 틀 — 관리 모드 검사 먼저(`<Navigate replace>`), 수정 대상은 그릴 때마다 목록에서 찾아 다른 탭 삭제·수정이 바로 반영. `utils/achievements.ts`에 `parseAchievementId` 추가(`Number()`만 쓰면 `1e2`·`01`이 다른 성과로 이어져서). 폼 상자·"취소"는 C-2에서 `AchievementForm`으로 옮김
- **v1.22 (P224–P225, spec/03 C-2a)**: `AchievementForm` — props를 `initialValues`·`onSubmit → boolean` 둘로 줄임(사용자 프롬프트), 오류는 상태 대신 그릴 때 계산, `savingRef`로 두 번 저장 막기(막기를 빼면 한 번에 3건 등록되는 것 재현), 등록↔수정 `key`(EX-43). 계산 함수 `validateAchievement`·`normalizeInput`·`toInput`·`EMPTY_INPUT`·`TYPE_FIELD_LABELS`
- **v1.23 (P227–P228, spec/03 C-2b)**: `addAchievement`가 참/거짓 대신 **새 성과 번호(실패면 null)** — reducer가 맨 끝에 붙이므로 저장된 최신 목록의 마지막 번호. `SavedNotice` 타입·`readSavedNotice(state: unknown)`. `AchievementFormPage`는 저장 후 `navigate(목록, { replace, state })`, **한 번 찾은 성과를 상태로 기억**(그리는 중에 맞추기)해 수정 중 삭제(EX-46)와 처음부터 없던 번호(EX-06)를 구분, 폼 `key`는 주소 번호. `AchievementForm`에 `isDeleted` prop. `AchievementsPage` 저장 안내(EX-44·45)
- **v1.24 (P230–P231, spec/03 C-3)**: 8절 — `utils/doi.ts`(normalizeDoi·isValidDoi, links.ts `doiUrl`이 씀) + `api/crossref.ts`(`fetchCrossrefWork(doi, signal?)` → `CrossrefResult` 묶음, 오류 클래스 대신). 제목·학술지 다듬기(EX-47), 링크는 `doiUrl`로 직접
- **v1.25 (P233–P236, 삭제 안내 + spec/03 C-4)**: `AchievementsPage` 삭제 성공 시 같은 안내 띠("삭제했어요", `SavedNotice.kind`에 delete — 짐으로는 안 옴). `DoiLookup` 완료, `AchievementForm` DOI 연결·자동 입력 표시. 계산 함수: `findDuplicateDoi`(utils/doi.ts), `validateAchievement`에 DOI(논문만), `normalizeInput`은 논문이면 정리한 번호·아니면 빈칸, Crossref 저자 처음 3명 + " 외 N명"
- **v1.26 (P237–P238, spec/03 전체 점검)**: `DoiLookup` 저장 검사 문장은 상태 문장과 같으면 숨김, `AchievementForm.handleFill`은 "자동 입력" 표시가 남은 칸이 새 응답에 없으면 비움, `AchievementFormPage.handleSubmit`은 수정인데 성과가 없으면 false(등록으로 넘어가지 않게)
- **v1.27 (P242–P243, spec/04 D-1)**: 2절 부원 타입 — `position`은 자유 글자 + 가이드라인(`MemberPosition`), `startYear`·`endYear`·`isSample` 추가, 교수는 `Professor`로 따로. `src/data/members.ts`(`PROFESSORS`·`MEMBERS`), `src/utils/members.ts`(`sortedMembers`·`countByStatus`·`memberInitial`·`periodLabel`·`positionLabel`). 부원 탭 거르기에 `useMemo`는 쓰지 않음(Q-D6 — 6.4 표의 "부원 탭 결과"는 빠짐)
- **v1.28 (P246–P247, spec/04 D-2)**: `MembersPage`(주소로 탭 기억 — useState 없음, 진짜 탭), `MemberCard`, `ProfessorCard` 새로. 카드 목록은 CSS grid(마지막 줄도 같은 폭). P248: 교수 연구 분야·학교 이메일을 사용자가 준 이력으로 채움
- **v1.29 (P251–P252, spec/04 D-3)**: 타입 `ProfessorPaper`·`ProfessorCareer`, `Professor`에 사진·전화·전공·학회·학력·경력·논문·학술활동(모두 선택 칸). `utils/members.ts`에 `recentPapers`·`papersByYear`·`countByGrade`·`telHref`. `ProfessorModal` 새로. 사진은 `public/members/professor.jpg`(사용자 바탕화면 pro.do 복사). 교수 논문은 성과 페이지에 섞지 않음
- **v1.30 (P255–P256, spec/04 D-4)**: `utils/members.ts`에 `splitNames`·`achievementsOf`(저자 칸만, 예시 성과 빼고, 정확히 같은 이름, `sortByLatest`). `MembersPage`가 `useAchievements`로 부원마다 계산(useMemo 없음), `MemberCard`에 최근 활동·버튼, `MemberActivityModal` 새로. 카드 높이 맞추기(칸 li를 flex)
- **v1.31 (P261–P263, 부원 페이지 A안)**: `ProfessorCard`는 검정 → 흰 카드 + 검정 2px 테두리·검정 직함 배지·사진 160×200 (5.6 표의 "검정 넓은 카드"는 이걸로 바뀜). `MembersPage`에 구역 제목 h2(PROFESSOR / STUDENTS, 학생 구역 오른쪽에 탭), 카드 이름은 h3. 부원 grid 한 줄 장수 고정(3·2·1), 부원 카드 글자·동그라미 키움
- **v1.32 (P265–P267, 사이트 전체 글자·여백)**: 시안 값보다 본문·보조 글자를 한 단계 키움(13→15, 14→16, 15→17 등, 큰 제목은 그대로), `--section-gap` 72→56px(760px 이하 44), 본문 위 48→36px 등 큰 여백 한 단계 줄임 — 사용자가 화면을 보고 정한 것(04_improvements I06). design-visual.md §10의 글자 크기·여백 값은 이 기준으로 읽는다
- **v1.33 (P272, spec/05 확정)**: `AboutPage`는 상태 없이 그릴 때 계산만(useMemo 안 씀 — 부원·성과 세기가 가볍고 거의 다시 안 그려짐). `LAB`에 `about: string[]`(소개 문단)·`address`(도로명 주소)·`mapQuery`(지도 검색어 — 주소로 찾으면 학교 정문이 나와 건물 이름 "대진대학교 이공학관", P279) 추가. 새 `utils/lab.ts`(`countText`·`mapSearchUrl`). 정보 목록 줄 타입은 앱 안 이동(`to` → Link)과 바깥 링크(`href`·`external` → a, 새 탭은 rel)를 나눔
- **v1.34 (P287–P288, 홈 다듬기)**: 사용자 결정으로 홈에서 연구 분야 구역을 지움 — 연구실 소개와 겹치고 홈은 성과 중심. `ResearchAreaList`는 소개에서 계속 씀. 최근 성과 카드 제목은 3줄·4줄이 섞이면 아래 줄이 어긋나서 `min-height: calc(1.4em * 4)`로 칸 높이 고정(휴대폰은 0 — 저자·학회를 숨겨 어긋날 줄이 없음). 같은 날 푸터(P286): 881px 이상에서만 메뉴·연락처 가로 한 줄, 소개 문구 `\n`은 `white-space: pre-line`으로 그 폭에서만 줄바꿈
- **v1.35 (P288–P289, 부원 카드)**: 실제 부원 3명이 같은 성과를 함께 해서 세 카드에 같은 최근 활동 3줄이 반복됨 → 사용자 B안: 카드에는 "참여 성과 N건 보기" 버튼 한 줄(1건 이상), 목록은 팝업에서만. `CARD_ACTIVITY_COUNT`·활동 목록 CSS 지움. 계산(`achievementsOf`)·팝업·`isOpen` 상태는 그대로 — 성과를 등록하면 숫자가 저절로 늘어남. 1280px 카드 높이 467 → 263px
- **v1.42 (P312–P314, 이스터에그 2)**: AI가 낸 4가지(물방울 터뜨리기 / 검색창 비밀 단어 / 푸터 길게 누르기 / 키 순서) 중 사용자가 물방울. 물방울은 글 묶음(z-index 1) 뒤에 있어 `pointer-events`로 물방울만 클릭을 받게 하면 글 묶음이 가로챔(확인) → 화면 전체 click을 듣고 원 안인지 거리로 판단, 글자 복사·링크는 그대로 두려고 막힌 대상·글자 선택 중은 제외. 터짐은 출렁임처럼 `scale` 속성 애니메이션이라 밀려나는 transform과 안 부딪힘, 끝 신호(animationend)로 팝업 — "동작 줄이기"면 신호가 없어 바로 팝업. 팝업은 물방울 상자 밖 형제(상자는 aria-hidden이고 휴대폰에서 transform이 있어 fixed 위치가 틀어짐). `registerTap`에 횟수·시간 인자(기본은 로고 5번), `Member.contactNote`(메일 대신 글자), `HiddenMemberModal`에 `title`. 사진은 쓰지 않음 — 받은 파일이 동명의 정치인 보도 사진이라(실제 공인이 명예 부원처럼 보임, 저작권·초상권)
- **v1.41 (P309–P311, 이스터에그)**: 사용자 "아무것도 안뜨는 히든 버튼" → 화면에 안 보이는 진짜 버튼은 키보드 Tab·화면 낭독기에 이름 없는 버튼으로 잡혀서 쓰지 않고, 이미 있는 로고에 숨은 동작을 붙임. 숨은 부원은 `HIDDEN_MEMBER`로 `MEMBERS` 밖(탭·인원 수에 안 섞임), status는 ENROLLED + endYear(졸업 이름표로 안 바뀌게). 훅 판단: 누른 횟수는 `useRef` — 바뀌어도 화면이 달라지지 않는 값이라 상태로 두면 누를 때마다 헤더를 다시 그림 / 팝업 열림은 `useState` — 화면이 바뀌어야 함 / 시간 판단은 화면과 떼어 `registerTap` 순수 함수(UT-94). 팝업은 `useModal`·`MemberCard`를 다시 써서 새로 만든 동작이 거의 없음. 팝업이 sticky 헤더(z-index 2) 안에 그려지지만 본문 요소는 z-index 1 이하라 덮이지 않음(확인)
- **v1.40 (P307–P308, 부원 카드 그림)**: 사용자가 세 부원에게 그림을 줌 → `Member`에 `photoUrl?`·`photoScale?`(둘 다 없어도 됨), 그림은 `public/images/avatars/member-번호`(페이지 주소와 같은 폴더 이름은 403이라 피함, P269). 그림 둘레 여백이 제각각이라 그림을 자르는 대신 데이터에 배율을 둠(이 컴퓨터에 그림 자르는 도구가 없었고, 그림을 바꿀 때 배율만 고치면 됨). `MemberCard`는 다시 상태 하나(`photoFailed`) — 그림을 못 불러오면 첫 글자로, 교수 카드와 같은 판단. UT-93 데이터 검사
- **v1.39 (P305–P306, 부원 카드)**: 사용자가 참여 성과 없는 카드 샘플(263 → 203px)을 보고 "지우기". `MemberCard`는 받는 값이 `member` 하나, 상태·훅 없음. `MembersPage`는 성과 목록(`useAchievements`)을 더 쓰지 않음. 남는 코드는 사용자 결정으로 팝업 파일만 지우고 `achievementsOf`·`splitNames`와 테스트(UT-87~89)는 기말용으로 남김 (AI 추천은 모두 지우기 — 안 쓰는 코드를 남기지 않으려고)
- **v1.38 (P302–P304, 푸터 연락처 제목)**: 사용자 "연락처 지우는게 더 이쁜가?" → AI는 줄을 남기자고 하고 시안 3개(A 줄 삭제 / B 제목만 빼기 / C 위치만 빼기, AI 추천 C) → 사용자 B. 제목을 아예 지우지 않고 기존 `visually-hidden` 클래스로 화면에서만 숨김 — 화면 낭독기는 "연락처"를 읽어 줄의 뜻을 알 수 있게. 쓰지 않게 된 `.footer__heading` 스타일 삭제
- **v1.37 (P292–P297, 푸터 다시 정리 + 헤더 고정)**: P292~P296 시안(메뉴·연락처를 위로 왼쪽/오른쪽, 학과 아래로, 선 A/B)은 모두 쓰지 않음. P297 사용자 결정 — 푸터 메뉴를 지우고 3줄(이름 + 학과 / 소개 / 연락처), 메뉴가 없어진 대신 `Header`를 `position: sticky; top: 0`로 늘 위에(배경 투명 → 바탕색, 밑으로 지나가는 글·물방울이 비치지 않게). JS 없이 CSS만 — 스크롤을 직접 재는 훅(useEffect + scroll 이벤트)은 필요 없음. 세로 500px 이하는 고정 풂(`@media (max-height: 500px)`), `html { scroll-padding-top: 100px }`로 Tab 포커스가 헤더 밑에 숨지 않게. 관리 띠(`AdminBar`)는 고정 안 함. v1.36의 `last baseline`·`pre-line`·메뉴 줄 높이 규칙은 지움, `lab.ts` intro의 `\n`도 지움
- **v1.36 (P290–P291, PC 푸터)**: 시안 2개(학과 아래로 / 오른쪽 그대로 아래로) 중 2안. `.footer__top`에 `align-items: last baseline`(모르는 브라우저는 앞 줄 `flex-end`) — 양쪽 묶음의 마지막 글자 줄 밑선을 맞춰 "대진대학교 컴퓨터공학과"와 "연락처" 줄이 한 줄(차이 0.2px). 메뉴·연락처 줄 높이는 `calc(1.6em + 8px)` = 왼쪽 글 줄 높이 + 왼쪽 묶음 간격 → 메뉴 줄도 "그 기록을 이곳에 모읍니다." 줄과 맞음. 880px 이하는 44px 그대로 (NFR-08 예외 기록)
- **AI 코멘트** (사용자 판단 이유가 아니라 이 설계의 장점 정리): 컴포넌트마다 받는 값·상태·쓰는 훅이 정해져 있어서, 구현을 요청할 때 "어떤 컴포넌트가 무엇을 받아 무엇을 한다"를 그대로 프롬프트로 쓸 수 있다. 또 화면에서 계산되는 값은 상태로 두지 않고(6.3), 저장 실패 시 화면을 바꾸지 않게(R1) 미리 정해 둬서, 구현 중에 데이터가 어긋나는 버그를 줄인다
- 데이터 모델의 적절성:
- 컴포넌트 분리 기준:
- 상태 관리 방법:
- LocalStorage 활용 방법:
- AI가 제안한 설계 중 수정한 부분과 이유:
