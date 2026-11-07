// 화면에 보여 줄 값을 계산하는 함수들 (design.md 9절). 화면(React)과 상관없는 순수 함수만 둔다.

// 숫자를 두 자리로: 1 → "01", 12 → "12", 100 → "100" (BR-13)
// 홈 연구 분야 번호(1-3)와 통계 4칸(1-6)에 같이 쓴다
export function padCount(n: number): string {
  return String(n).padStart(2, '0')
}
