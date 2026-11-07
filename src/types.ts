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

// 저장소에서 성과를 불러온 결과 (spec/02 2-4) — 목록 + 무엇이 잘못돼서 어떻게 고쳤는지 안내 문장
export type LoadResult = {
  achievements: Achievement[]
  notices: string[] // 비어 있으면 문제 없음. 있으면 2-5에서 원본 백업 → 고친 목록 저장 → 안내 한 번 (P167 A안)
}
