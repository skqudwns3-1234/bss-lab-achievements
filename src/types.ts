// 앱 전체에서 쓰는 타입 모음 (design.md 2절). 기능을 만들 때마다 여기에 더한다.

// 연구 분야 하나 — 홈 ② 연구 분야 칸 (lab.ts의 researchAreas)
export type ResearchArea = {
  title: string // 분야 이름
  description: string // 설명 한두 문장
}

// 부원 모집 정보 — 홈 ④ 지원 안내 (lab.ts의 recruitment)
export type Recruitment = {
  isOpen: boolean // 모집 스위치 — false면 홈 지원 안내·푸터 지원서 링크 숨김 (BR-16, P143)
  endDate: string // 마감일 'YYYY-MM-DD' (시작일은 표시하지 않음 — P128)
  title: string // 지원 안내 제목
  qualifications: string[] // 지원 자격 (0개면 제목까지 숨김 — EX-14)
  posterUrl: string // 포스터 그림 주소 (비면 포스터 칸 숨김 — EX-18)
  formUrl: string // 구글 폼 응답용 링크 (비면 버튼 숨김 — EX-15)
}

// ── 성과 (spec/02 2-1) ──

// 성과 유형 4가지 — 저장할 때 쓰는 이름. 화면에 보이는 "논문·수상·특허·공모전"은 2-3의 TYPE_LABELS에서 바꿔 줌
export type AchievementType = 'PAPER' | 'AWARD' | 'PATENT' | 'CONTEST'

// 성과 1건
export type Achievement = {
  id: number // 성과 번호 — 새로 등록할 때 (지금 가장 큰 번호 + 1) (BR-12)
  type: AchievementType // 유형 (위 4가지 중 하나만 들어갈 수 있음)
  title: string // 제목 (필수)
  achievedOn: string // 날짜 'YYYY-MM-DD' (필수)
  authors: string // 저자·팀원 — 비어 있어도 됨
  advisors: string // 지도교수 — 비어 있어도 됨 (P150)
  venue: string // 학회·대회·기관 이름
  doi: string // 논문 DOI — 없으면 ''
  link: string // 원문·관련 링크 — 없으면 ''
  isSample: boolean // 지어낸 예시 성과면 true → 화면에 "예시" 배지 (P099)
}

// 등록·수정 폼에서 다루는 값 — 위에서 id와 isSample만 뺀 것
// (id는 저장할 때 정하고, isSample은 사용자가 고치는 값이 아님)
export type AchievementInput = Omit<Achievement, 'id' | 'isSample'>

// 폼 검사 결과 — 칸 이름: 오류 문장. 문제없는 칸은 없음 (spec/03 C-2a, design 2절)
export type AchievementErrors = Partial<Record<keyof AchievementInput, string>>

// 목록 위 안내 — 저장하고 목록으로 갈 때 실어 보내는 짐(등록·수정, spec/03 C-2b Q-C1)과
// 목록에서 지웠을 때 목록 페이지가 직접 띄우는 안내(삭제, P233). 삭제는 짐으로 오지 않는다
export type SavedNotice = {
  kind: 'add' | 'edit' | 'delete' // 등록·수정·삭제
  id: number // 그 성과 번호 — "보기"로 팝업을 열 때 (지운 성과는 목록에 없어 "보기"가 안 나옴)
  title: string // 저장된 제목 — 안내 문장에
}

// 성과 목록 검색 조건 (spec/02 2-3a) — 성과 페이지의 검색칸·유형·연도
export type AchievementFilter = {
  query: string // 검색어 — 제목·저자·지도교수에서 찾음 (P157)
  type: AchievementType | 'ALL' // 유형 ('ALL'이면 전체)
  year: number | 'ALL' // 연도 ('ALL'이면 전체)
}

// 홈 NEW 알약 내용 — "최근 등록 · 2026.10.11 공모전 2건" (spec/02 2-3a)
export type NewestSummary = {
  date: string // 가장 최근 날짜 'YYYY-MM-DD'
  label: string // 그날 성과가 한 유형이면 그 이름(예: 공모전), 섞이면 '성과' (P161)
  count: number // 그날 성과 개수
}

// 홈 통계 한 칸 (spec/01 1-6) — 이름과 개수. StatList가 배열로 받아 그린다
export type StatItem = {
  label: string // 칸 이름 (예: 논문)
  count: number // 개수 — 화면에서는 padCount로 두 자리 (BR-13)
}

// ── 부원 (spec/04 D-1, P242–P243) ──

// 재학 / 졸업 — 부원 페이지의 두 탭
export type MemberStatus = 'ENROLLED' | 'GRADUATED'

// 직위 — 가이드라인 셋 중에서 고르는 것을 권장하고, 다른 글자도 넣을 수 있다 (P242 "자유 글자 + 가이드라인").
// (string & {}): "아무 글자나 되지만 편집기 자동 완성에는 세 값을 먼저 보여 줘"라는 TypeScript 표기.
// 그냥 string이면 세 값이 string에 묻혀 자동 완성에 안 뜸. 정렬은 글자 안의 "박사·석사·학부(학사)"로 순위를 매김
export type MemberPosition = '박사과정' | '석사과정' | '학부연구생' | (string & {})

// 부원 1명 (design 2절, 요구사항 2.3 — 시안의 기간 추가 Q-D2)
export type Member = {
  id: number // 번호 — 목록 key. 겹치면 데이터 검사 테스트가 알려 줌
  name: string // 이름
  position: MemberPosition // 직위
  researchField: string // 연구 분야 — 비면 카드에서 숨김
  email: string // 학교 이메일 — 비면 숨김. 실제 값은 본인 동의 시에만 (NFR-10)
  status: MemberStatus // 재학 / 졸업
  startYear: number // 들어온 해 (시안 "2023 –")
  endYear: number | null // 졸업한 해 — 재학이면 null
  isSample: boolean // 지어낸 예시면 true → "예시" 배지 (Q-D1)
  photoUrl?: string // 카드 동그라미에 넣을 그림 (P307) — public/images/ 아래 주소. 없거나 못 불러오면 첫 글자 동그라미
  photoScale?: number // 그림 확대 배율 (기본 1) — 둘레 여백이 많은 그림을 동그라미에 맞게 키움. 1~3 (데이터 검사 테스트)
}

// 교수 논문·학술활동 한 건 (spec/04 D-3, P251) — 칸을 나눠서 최신순·연도 묶기·등급 배지가 된다
export type ProfessorPaper = {
  title: string // 「」 안의 제목
  venue: string // 학술지·학회 (예: Applied Sciences)
  grade: string // SCIE · SCOPUS · SCI, 없으면 '' (국내 학술지 등)
  role: string // 교신저자 · 제1저자
  date: string // 'YYYY.MM' (예: 2026.03) — 글자 순서가 곧 날짜 순서
}

// 교수 경력 한 줄 (예: 창신대학교 · 부교수 · 2018.03~2024.08)
export type ProfessorCareer = {
  place: string
  position: string
  period: string
}

// 담당 교수 — 부원 목록과 따로 둔다: 탭·정렬·인원 수에 섞이지 않고 페이지 맨 위에 따로 보임 (Q-D1, P240).
// D-3(P251): 사진·전화·이력 칸은 모두 없어도 됨(?) — 정보가 적은 교수도 오류 없이 지금 카드 모양으로 보임
export type Professor = {
  name: string
  title: string // 직함 (예: 지도교수)
  researchField: string // 비면 숨김
  email: string // 비면 숨김
  isSample: boolean
  photoUrl?: string // public/ 아래 사진 주소 (예: /images/professor.jpg — 페이지 주소와 같은 이름의 폴더는 쓰지 않음) — 못 불러오면 첫 글자 동그라미
  phone?: string // 학교 연구실 번호 — 카드·팝업에 tel: 링크 (P251)
  major?: string // 전공
  societies?: string[] // 소속학회
  education?: string[] // 학력 — 첫 줄이 카드 요약
  careers?: ProfessorCareer[] // 경력
  papers?: ProfessorPaper[] // 논문 — 최근 3편이 카드 요약, 전체는 팝업. 성과 페이지에는 섞지 않음 (P251 ⑥)
  activities?: ProfessorPaper[] // 학술활동 (학회 발표 등)
}

// 저장소에서 성과를 불러온 결과 (spec/02 2-4) — 목록 + 무엇이 잘못돼서 어떻게 고쳤는지 안내 문장
export type LoadResult = {
  achievements: Achievement[]
  notices: string[] // 비어 있으면 문제 없음. 있으면 2-5에서 원본 백업 → 고친 목록 저장 → 안내 한 번 (P167 A안)
}

// 지원 안내 상태 — 홈 ④와 푸터가 같은 판단을 쓰도록 한곳(utils/recruitment.ts)에서 계산 (P170)
export type RecruitStatus = {
  closed: boolean // 마감일이 지났는지 → "모집 마감", 지원서 버튼·푸터 링크 숨김
  deadline: string | null // 화면에 보일 마감일 'YYYY-MM-DD' (형식이 틀리거나 없는 날짜면 null → 숨김)
  applyUrl: string | null // 지원서 링크 (비었거나 편집용·https 아님이면 null → 버튼 숨김)
  problems: string[] // lab.ts 값이 이상할 때 개발자 도구에 남길 경고
}

// 성과 목록을 바꾸는 방법 (spec/02 2-5) — achievementsReducer가 처리
export type AchievementsAction =
  | { type: 'add'; input: AchievementInput } // 새 번호를 붙여 끝에 추가
  | { type: 'update'; id: number; input: AchievementInput } // 내용만 바꿈 (번호·예시 여부는 그대로, P174)
  | { type: 'delete'; id: number }
  | { type: 'replace'; achievements: Achievement[] } // 다른 탭에서 바뀐 목록으로 통째로 (P174)
