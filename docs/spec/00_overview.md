# 00. 전체 설계 개요

> 이 폴더는 **사용자가 직접 프롬프트로 요청하기 위한** 페이지별 상세 설계서다 (P052–P053).
> 각 페이지 파일의 "요청 단위 목록"을 순서대로 하나씩 요청한다. 디자인 값은 `docs/design-visual.md` §10 개발용 요약, 시안은 `design/mockups/`.

## 페이지 목록
| 파일 | 주소 | 페이지 | 상태 |
|---|---|---|---|
| `01_home.md` | `/` | 홈 | **확정** (P063) |
| `02_achievements.md` | `/achievements` | A. 데이터 바탕(타입·샘플·계산·저장·전역 상태) + B. 성과 목록·검색·필터 | 초안 (P149) |
| `03_achievement-form.md` | `/achievements/new`, `/achievements/:id/edit` | 성과 등록·수정 + DOI 자동 채우기 | **확정·구현 완료** (P220 확정 → C-1~C-4 → 점검 P237–P238) |
| `04_members.md` | `/members` | 부원 | **확정·구현 완료** (P240–P241 확정 → D-1~D-4 → 점검 P268–P269) |
| `05_about.md` | `/about` | 연구실 소개 (시안 없음) | **확정·구현 완료** (P272 확정 → E-1·B안·E-2 → 점검 P282–P283) |

## 이미 만들어진 것 (모든 페이지 공통)
| 무엇 | 파일 | 단계 |
|---|---|---|
| 주소별 페이지 연결 | `src/App.tsx` | 0단계 |
| 공통 틀(헤더·페이지 자리·푸터) | `src/components/layout/Layout.tsx` | 0단계 |
| 헤더: 로고, 메뉴, 760px 이하 메뉴 버튼 | `src/components/layout/Header.tsx`, `navItems.ts` | D2 |
| 푸터: 연구실 정보, 메뉴, 연락처 | `src/components/layout/Footer.tsx` | D2 |
| 연구실 정보(자리 표시 값) | `src/data/lab.ts` | D2 |
| 색·글꼴·버튼·배지·칩·입력칸 공통 스타일 | `src/index.css` (`btn`, `badge`, `chip`, `input`, `page-title`, `section-title`, `eyebrow`) | D1 |

## 데이터 구조: 성과 하나 (`docs/design-visual.md` §4)
| 필드 | 예시 | 필수 |
|---|---|---|
| `id` | `3` | ✅ |
| `type` | `'PAPER'` / `'AWARD'` / `'PATENT'` / `'CONTEST'` | ✅ |
| `title` | `'온디바이스 음성 인식을 위한 경량 트랜스포머 모델'` | ✅ |
| `achievedOn` | `'2026-09-15'` | ✅ |
| `link` | `'https://doi.org/…'` | |
| `authors` | `'김하늘, 이도윤, 박서준'` | |
| `venue` | `'한국정보과학회논문지'` | |
| `doi` | `'10.xxxx/…'` (논문만) | |

유형 이름: PAPER 논문, AWARD 수상, PATENT 특허, CONTEST 공모전

## 수업 방식(JSP·서블릿)과 이 프로젝트의 대응
| JSP·서블릿 | 이 프로젝트 (React) |
|---|---|
| 서블릿 (Controller) | 페이지 컴포넌트 (`src/pages/`) |
| DAO 메소드 | 데이터를 다루는 함수 (`src/utils/`), 전역 저장소 Context·reducer (`src/context/`) |
| DTO | 성과 객체 `{ type, title, achievedOn, … }` |
| JSP 화면 | 컴포넌트의 JSX (`src/components/`) |
| 쿼리스트링 `pid` | 주소 값 — `useParams()`의 `id` |
| `request.setAttribute` → JSP | props로 자식 컴포넌트에 넘기기 |
| `@WebServlet("/주소")` | `App.tsx`의 `<Route path="주소">` |
| DB 테이블 | 브라우저 localStorage (3단계부터) |

## 요청할 때 넣으면 좋은 것
1. **무엇을 만드는지** — "홈의 최근 성과 구역을 만들려고 함"
2. **어떤 컴포넌트·함수가** — "RecentAchievementCard 컴포넌트가"
3. **무엇을 받아서** — "성과 하나를 props로 받아서"
4. **무엇을 하는지·보여 주는지** — "유형 배지, 날짜(2026.09.15 형식), 제목 … 을 보여 줘"
5. **어디서 쓰는지** — "HomePage에서는 최신순 3개만 map으로 넘겨 줘"
6. **어떤 파일을 작성할지** — "RecentAchievementCard랑 HomePage 그 부분 코드 작성해주삼"

요청이 애매하면 AI는 바로 짜지 않고 먼저 되묻는다. 나온 코드는 브라우저로 확인한 뒤 커밋한다.
