import type { RecruitStatus, Recruitment } from '../types.ts'

// 지원 안내 판단 (P169–P170 예외 처리 점검). 홈 ④ RecruitBox와 푸터가 같이 쓴다.
// 오늘 날짜를 받아서 계산하는 순수 함수라 테스트할 때 날짜를 마음대로 넣어 볼 수 있다.

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// 오늘 날짜 'YYYY-MM-DD' (보는 사람 컴퓨터의 날짜 기준)
export function todayYmd(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

// 'YYYY-MM-DD' 형식이면서 실제로 있는 날짜인지 — '2026-02-30'처럼 없는 날짜는 false
// (성과 등록 폼의 날짜 검사에서도 다시 쓸 수 있다)
export function isValidYmd(ymd: string): boolean {
  if (!DATE_PATTERN.test(ymd)) return false
  const [year, month, day] = ymd.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

// 지원 안내 상태 계산
// - 마감일 형식이 틀리면 마감일을 숨기고 경고 (마감 여부도 판단하지 않음)
// - 오늘이 마감일보다 뒤면 "모집 마감" — 마감일 당일까지는 모집 중
// - 지원서 링크가 비었으면 숨김(일부러 비운 것, EX-15), 편집용(/edit)이거나 https가 아니면 숨기고 경고
export function getRecruitStatus(recruitment: Recruitment, today: string): RecruitStatus {
  const problems: string[] = []

  let deadline: string | null = recruitment.endDate
  if (!isValidYmd(recruitment.endDate)) {
    deadline = null
    problems.push(`마감일 "${recruitment.endDate}"이 YYYY-MM-DD 형식의 실제 날짜가 아니라서 숨겼어요. lab.ts의 endDate를 고치세요.`)
  }
  const closed = deadline !== null && today > deadline

  const url = recruitment.formUrl.trim()
  let link: string | null = url
  if (url === '') {
    link = null
  } else if (url.includes('/edit')) {
    link = null
    problems.push('지원서 링크가 구글 폼 편집용(/edit)이라 버튼을 숨겼어요. "보내기 → 링크"의 응답용 링크로 바꾸세요.')
  } else if (!url.startsWith('https://')) {
    link = null
    problems.push(`지원서 링크 "${url}"가 https://로 시작하지 않아 버튼을 숨겼어요.`)
  }

  return { closed, deadline, applyUrl: closed ? null : link, problems }
}
