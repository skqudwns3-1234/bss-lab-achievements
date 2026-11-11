// 연구실 소개 페이지(/about)에서 쓰는 작은 계산 (spec/05)

// 한눈에 보기 숫자 글자 — 0이면 "아직 없음", 아니면 "3명"·"12건" (E-1, P273 사용자 결정)
// "0건"보다 덜 비어 보이고, 예시 성과만 있을 때(실제 성과 0)도 맞는 말이라서
export function countText(count: number, unit: string): string {
  if (!Number.isFinite(count) || count <= 0) return '아직 없음'
  return `${Math.floor(count)}${unit}`
}
