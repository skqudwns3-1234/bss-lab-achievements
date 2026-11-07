// 앱 전체에서 쓰는 타입 모음 (design.md 2절). 기능을 만들 때마다 여기에 더한다.

// 연구 분야 하나 — 홈 ② 연구 분야 칸 (lab.ts의 researchAreas)
export type ResearchArea = {
  title: string // 분야 이름
  description: string // 설명 한두 문장
}
