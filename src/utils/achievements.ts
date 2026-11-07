import type { Achievement, AchievementFilter, AchievementType, NewestSummary } from '../types.ts'

// 화면에 보여 줄 값을 계산하는 함수들 (design.md 9절, spec/02 2-3a).
// 화면(React)·저장소와 상관없는 순수 함수만 둔다 — 같은 값을 넣으면 늘 같은 결과, 받은 목록은 바꾸지 않음.

// 숫자를 두 자리로: 1 → "01", 12 → "12", 100 → "100" (BR-13)
// 홈 연구 분야 번호(1-3)와 통계 4칸(1-6)에 같이 쓴다
export function padCount(n: number): string {
  return String(n).padStart(2, '0')
}

// 날짜 표시용: '2026-12-01' → '2026.12.01'
// 지원 안내 마감일(1-4)과 성과 날짜에 같이 쓴다
export function formatDate(ymd: string): string {
  return ymd.replaceAll('-', '.')
}

// ── 성과 계산 (spec/02 2-3a, P156–P161) ──

// 유형 → 화면 이름. 모든 유형에 이름이 있어야 하는 타입(Record)이라, 유형이 늘었는데 이름을 빼먹으면 빌드가 알려 준다
export const TYPE_LABELS: Record<AchievementType, string> = {
  PAPER: '논문',
  AWARD: '수상',
  PATENT: '특허',
  CONTEST: '공모전',
}

// 'YYYY-MM-DD' → 연도 숫자 (앞 4글자)
function getYear(ymd: string): number {
  return Number(ymd.slice(0, 4))
}

// 최신순 정렬: 날짜 최신순, 같은 날짜면 번호(id) 큰 것이 위 (BR-10, P161)
// 'YYYY-MM-DD'는 글자 순서가 곧 날짜 순서라 문자열 비교로 충분하다.
// 원본은 그대로 두고 복사본을 정렬해 돌려준다 — sort는 원본을 바꾸는데, React 상태 원본을 바꾸면 변화를 못 알아챈다
export function sortByLatest(list: Achievement[]): Achievement[] {
  return [...list].sort((a, b) => b.achievedOn.localeCompare(a.achievedOn) || b.id - a.id)
}

// 유형별 개수 → 홈 통계 4칸. 모두 0으로 시작해야 성과가 없는 유형도 "00"으로 나온다
export function countByType(list: Achievement[]): Record<AchievementType, number> {
  const counts: Record<AchievementType, number> = { PAPER: 0, AWARD: 0, PATENT: 0, CONTEST: 0 }
  for (const achievement of list) counts[achievement.type] += 1
  return counts
}

// 홈 NEW 알약 내용: 가장 최근 날짜 + 그날 성과 개수.
// 그날 성과가 한 유형이면 유형 이름("공모전 2건"), 섞이면 "성과 2건"으로 합친다 (P161).
// 성과가 하나도 없으면 null → 알약을 숨긴다 (EX-09)
export function getNewestSummary(list: Achievement[]): NewestSummary | null {
  if (list.length === 0) return null
  const date = sortByLatest(list)[0].achievedOn
  const sameDay = list.filter((achievement) => achievement.achievedOn === date)
  const types = new Set(sameDay.map((achievement) => achievement.type))
  const label = types.size === 1 ? TYPE_LABELS[sameDay[0].type] : '성과'
  return { date, label, count: sameDay.length }
}

// 검색·필터 → 성과 목록 (FR-07, BR-11).
// 검색어: 앞뒤 공백을 지우고 대소문자 무시, 제목·저자·지도교수 중 한 칸에라도 들어 있으면 통과 (비어 있으면 모두 통과)
// 검색어·유형·연도는 모두 만족(AND)해야 남는다 (P161). 순서는 받은 목록 그대로 — 정렬은 sortByLatest가 따로
export function filterAchievements(list: Achievement[], filter: AchievementFilter): Achievement[] {
  const query = filter.query.trim().toLowerCase()
  return list.filter((achievement) => {
    const matchesQuery =
      query === '' ||
      [achievement.title, achievement.authors, achievement.advisors].some((field) =>
        field.toLowerCase().includes(query),
      )
    const matchesType = filter.type === 'ALL' || achievement.type === filter.type
    const matchesYear = filter.year === 'ALL' || getYear(achievement.achievedOn) === filter.year
    return matchesQuery && matchesType && matchesYear
  })
}

// 연도 선택지: 데이터에 있는 연도만, 중복 없이(Set), 최신순 (Q4)
export function getYears(list: Achievement[]): number[] {
  return [...new Set(list.map((achievement) => getYear(achievement.achievedOn)))].sort((a, b) => b - a)
}

// 새 성과 번호: 가장 큰 번호 + 1, 없으면 1 (BR-12).
// "개수 + 1"이 아닌 이유 — 1·2·3 중 2를 지우면 개수가 2라서 새 번호 3이 기존 3번과 겹친다
export function nextId(list: Achievement[]): number {
  return list.length === 0 ? 1 : Math.max(...list.map((achievement) => achievement.id)) + 1
}
