// 날짜 함수 (P170에 utils/recruitment.ts에서 만들고, A 점검 P176–P177에 여기로 옮김).
// 지원 안내 마감일, 성과 저장·불러오기 검사, 등록 폼 날짜 검사에서 같이 쓴다.

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// 오늘 날짜 'YYYY-MM-DD' (보는 사람 컴퓨터의 날짜 기준)
export function todayYmd(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

// 'YYYY-MM-DD' 형식이면서 실제로 있는 날짜인지 — '2026-02-30'처럼 없는 날짜는 false
export function isValidYmd(ymd: string): boolean {
  if (!DATE_PATTERN.test(ymd)) return false
  const [year, month, day] = ymd.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}
