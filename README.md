# BSS 연구실 성과 아카이브

대진대학교 컴퓨터공학과 BSS(BigdataSystemSoftware) 연구실의 논문·수상·특허·공모전 성과를 한곳에 모아 보여 주는 웹사이트입니다.
2026-2학기 리액트프로그래밍 「바이브 코딩을 활용한 React 웹서비스 개발」 과제로, 기말 프로젝트(연구실 웹사이트)의 체험판으로 만들었습니다.

- 실행 주소: (배포 후 추가)
- 개발 기간: 2026-11-02 ~ 2026-11-13
- AI 도구: Claude Code

## 주요 기능

| 기능 | 설명 |
|---|---|
| 성과 목록·검색 | 제목·저자·지도교수 검색, 유형(논문·수상·특허·공모전)·연도 필터, 눌러서 자세히 보기 |
| 성과 등록·수정·삭제 | 헤더의 "관리 모드"를 켜면 등록·수정·삭제 버튼이 나타남 |
| DOI로 논문 정보 불러오기 | 논문 DOI를 넣으면 Crossref Open API에서 제목·저자·학술지·날짜를 가져와 폼에 채움 |
| 홈·연구실 소개·부원 | 최근 성과와 통계, 모집 안내, 지도교수 이력, 부원 카드 |
| 반응형 | PC·태블릿·휴대폰 화면에 맞춰 배치가 바뀜 |

데이터는 서버 없이 브라우저의 LocalStorage에 저장됩니다. 그래서 등록한 성과는 그 브라우저에서만 보입니다.

## 기술

React 19 · TypeScript · Vite · React Router · Vitest · Crossref REST API · LocalStorage

수업에서 배운 훅(useState, useEffect, useRef, useContext, useReducer, useMemo, useCallback, memo)을 필요한 곳에 썼고, 쓴 이유는 `docs/design.md`에 적었습니다.

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm test         # 단위 테스트
npm run build    # 타입 검사 + 빌드
```

## 폴더

```
src/
├─ api/          Crossref 연동
├─ components/   화면 조각 (achievements, common, home, layout, members)
├─ context/      성과 목록·관리 모드 (Context + useReducer)
├─ data/         연구실·부원·처음 성과 데이터
├─ hooks/        팝업 공통 동작 (useModal)
├─ pages/        페이지 (홈, 소개, 부원, 성과, 등록·수정)
└─ utils/        검색·날짜·저장 등 순수 함수와 단위 테스트
docs/            기획·설계 문서 (아래)
```

## 문서 (AI-SDLC)

요구사항 → 설계 → 구현 → 테스트 순서로 문서를 만들며 진행했습니다. 단계마다 AI가 초안을 쓰고 사람이 검토해 확정했습니다.

| 단계 | 문서 |
|---|---|
| 기획 | [docs/PRD.md](docs/PRD.md) |
| STEP 1 요구사항 | [docs/requirements.md](docs/requirements.md) |
| STEP 2 설계 | [docs/design.md](docs/design.md), [docs/design-visual.md](docs/design-visual.md) |
| STEP 3 구현 단위 | [docs/spec/](docs/spec/) (페이지별 상세 설계서) |
| STEP 4 테스트 | [docs/test-cases.md](docs/test-cases.md), [docs/exception-checklist.md](docs/exception-checklist.md) |

문서 안의 `P###`는 개발 중 프롬프트 번호, `report/…`는 따로 제출하는 결과보고서의 기록 파일을 가리킵니다(이 저장소에는 없음).
