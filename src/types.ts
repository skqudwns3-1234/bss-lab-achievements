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
