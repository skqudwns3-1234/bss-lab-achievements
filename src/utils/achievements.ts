import type {
  Achievement,
  AchievementErrors,
  AchievementFilter,
  AchievementInput,
  AchievementType,
  AchievementsAction,
  NewestSummary,
  SavedNotice,
} from '../types.ts'
import { isValidYmd } from './date.ts'
import { isValidDoi, normalizeDoi } from './doi.ts'
import { safeLink } from './links.ts'

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

// 정해 둔 유형 4가지 (TYPE_LABELS와 같은 순서)
export const ACHIEVEMENT_TYPES: AchievementType[] = ['PAPER', 'AWARD', 'PATENT', 'CONTEST']

// 정해 둔 4가지 유형인지
export function isAchievementType(value: unknown): value is AchievementType {
  return ACHIEVEMENT_TYPES.some((type) => type === value)
}

// 안내 문장에 값을 보여 주기 위한 글자 (없으면 "없음")
export function showValue(value: unknown): string {
  return value === undefined ? '없음' : JSON.stringify(value)
}

// 필수 칸 검사 — 유형·제목·날짜. 문제가 없으면 null, 있으면 이유 문장.
// 저장할 때(achievementsReducer)와 불러올 때(storage)가 **같은 규칙**을 쓴다 — 앱이 저장한 값이 다음 방문에 버려지지 않게 (A 점검 P176–P177)
export function findRequiredProblem(value: { type: unknown; title: unknown; achievedOn: unknown }): string | null {
  if (!isAchievementType(value.type)) return `유형 ${showValue(value.type)}은 없는 유형이에요`
  if (typeof value.title !== 'string' || value.title.trim() === '') return '제목이 비어 있어요'
  if (typeof value.achievedOn !== 'string' || !isValidYmd(value.achievedOn)) {
    return `날짜가 실제 있는 YYYY-MM-DD 날짜가 아니에요 (값: ${showValue(value.achievedOn)})`
  }
  return null
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
// today('YYYY-MM-DD')보다 뒤 날짜(미래) 성과는 빼고 계산한다 — 미래 날짜를 허용해서(Q1) 아직 오지 않은 날이
// "최근 등록"으로 뜨지 않게 (1-7, P186). 오늘 당일은 포함. 날짜 형식이 같아서 글자 비교로 앞뒤를 알 수 있다.
// 남는 성과가 없으면 null → 알약을 숨긴다 (EX-09, EX-32)
export function getNewestSummary(list: Achievement[], today: string): NewestSummary | null {
  const past = list.filter((achievement) => achievement.achievedOn <= today)
  if (past.length === 0) return null
  const date = sortByLatest(past)[0].achievedOn
  const sameDay = past.filter((achievement) => achievement.achievedOn === date)
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

// 주소의 성과 번호(글자) → 숫자. 1 이상의 정수 글자만 받고 아니면 null (spec/03 C-1, EX-06, P221–P222).
// Number()만 쓰면 '1e2'→100, '01'→1, ' 8 '→8처럼 이상한 주소도 다른 성과로 이어져서 글자 모양부터 본다
export function parseAchievementId(text: string): number | null {
  return /^[1-9]\d*$/.test(text) ? Number(text) : null
}

// ── 등록·수정 폼 (spec/03 C-2a, P224–P225) ──

// 등록 폼의 처음 값 — 유형은 논문, 나머지는 빈 칸
export const EMPTY_INPUT: AchievementInput = {
  type: 'PAPER',
  title: '',
  achievedOn: '',
  authors: '',
  advisors: '',
  venue: '',
  doi: '',
  link: '',
}

// 성과 → 폼 값. 번호와 예시 여부는 사용자가 고치는 값이 아니라 뺀다 (번호·예시 여부는 저장할 때 reducer가 그대로 둠)
export function toInput(achievement: Achievement): AchievementInput {
  const { type, title, achievedOn, authors, advisors, venue, doi, link } = achievement
  return { type, title, achievedOn, authors, advisors, venue, doi, link }
}

// 유형마다 바뀌는 칸 이름 (Q-C3, 시안). 저장 칸은 같고 이름만 다르다. 제목·지도교수·링크는 그대로
export const TYPE_FIELD_LABELS: Record<AchievementType, { venue: string; authors: string; achievedOn: string }> = {
  PAPER: { venue: '학술지·학회', authors: '저자', achievedOn: '발행일' },
  AWARD: { venue: '수여 기관·대회', authors: '수상자', achievedOn: '수상일' },
  PATENT: { venue: '출원·등록 기관', authors: '발명자', achievedOn: '출원일' },
  CONTEST: { venue: '대회 이름', authors: '참가자', achievedOn: '수상일' },
}

// 폼 검사 — 칸별 오류 문장 묶음, 문제없으면 빈 묶음 {} (EX-01, BR-02·04, EX-30). 문장은 시안 그대로.
// 유형은 라디오라 늘 넷 중 하나 — 검사하지 않음. 저장 단계의 마지막 검사는 reducer의 findRequiredProblem (EX-26)
export function validateAchievement(values: AchievementInput): AchievementErrors {
  const errors: AchievementErrors = {}
  if (values.title.trim() === '') errors.title = '제목을 입력해 주세요.'
  // 달력 칸은 다 고르지 않았거나 연도를 다섯 자리로 치면 빈 글자·이상한 값이 와서 여기서 걸림
  if (!isValidYmd(values.achievedOn)) errors.achievedOn = '날짜를 골라 주세요.'
  // 팝업의 "원문 보기"와 같은 규칙(safeLink) — 폼이 받아 준 링크는 팝업에서도 열림
  if (values.link.trim() !== '' && safeLink(values.link) === null) {
    errors.link = 'http:// 또는 https://로 시작하는 주소만 넣을 수 있어요.'
  }
  // DOI는 논문일 때만 검사 — 다른 유형은 저장할 때 DOI를 지우므로(BR-05) 보이지 않는 칸의 오류로 막히지 않게 (C-4, P235)
  if (values.type === 'PAPER' && values.doi.trim() !== '' && !isValidDoi(normalizeDoi(values.doi))) {
    errors.doi = 'DOI 형식이 아니에요. 예: 10.1038/nature14539' // EX-02와 같은 문장
  }
  return errors
}

// 저장 직전 글자 칸의 앞뒤 공백 지우기 (BR-03). 가운데 공백은 그대로, 공백만이면 빈 값
export function normalizeInput(values: AchievementInput): AchievementInput {
  return {
    type: values.type,
    title: values.title.trim(),
    achievedOn: values.achievedOn,
    authors: values.authors.trim(),
    advisors: values.advisors.trim(),
    venue: values.venue.trim(),
    // 논문이면 정리한 번호만(주소째 붙여 넣어도 — 같은 DOI 비교가 어긋나지 않게), 다른 유형이면 빈칸 (BR-05, Q-C6, C-4)
    doi: values.type === 'PAPER' ? normalizeDoi(values.doi) : '',
    link: values.link.trim(),
  }
}

// 목록 페이지가 받은 이동 짐(location.state)에서 저장 안내를 꺼낸다 (spec/03 C-2b, Q-C1).
// 짐은 브라우저 방문 기록에 남는 값이라 모양을 믿을 수 없어서(unknown) 하나씩 확인하고, 아니면 null → 안내 없음.
// 짐으로는 등록·수정만 온다 — 삭제 안내는 목록 페이지가 직접 띄움(P233)
export function readSavedNotice(state: unknown): SavedNotice | null {
  if (typeof state !== 'object' || state === null || !('saved' in state)) return null
  const saved = state.saved
  if (typeof saved !== 'object' || saved === null) return null
  if (!('kind' in saved) || !('id' in saved) || !('title' in saved)) return null
  const { kind, id, title } = saved
  if ((kind !== 'add' && kind !== 'edit') || typeof id !== 'number' || typeof title !== 'string') return null
  return { kind, id, title }
}

// ── 성과 목록 바꾸기 (spec/02 2-5, P174–P175) ──

// 목록을 바꾸는 규칙을 한곳에 모은 함수(reducer). 원본은 그대로 두고 새 목록을 돌려준다.
// 없는 번호를 수정·삭제하거나, 필수 칸이 틀린 입력이면 받은 목록을 그대로 돌려준다 — "바뀐 게 없다"는 표시
// (applyChange가 이걸로 실패를 안다. 틀린 값이 목록에 들어가 저장됐다가 다음 방문에 버려지는 일을 막음 — P177)
export function achievementsReducer(state: Achievement[], action: AchievementsAction): Achievement[] {
  switch (action.type) {
    case 'add':
      if (findRequiredProblem(action.input)) return state
      return [...state, { ...action.input, id: nextId(state), isSample: false }]
    case 'update': {
      const target = state.find((achievement) => achievement.id === action.id)
      if (!target || findRequiredProblem(action.input)) return state
      // 번호와 예시 여부는 그대로 — 예시 성과를 고쳐도 "예시" 배지는 남는다 (P174)
      return state.map((achievement) =>
        achievement.id === action.id ? { ...action.input, id: target.id, isSample: target.isSample } : achievement,
      )
    }
    case 'delete':
      if (!state.some((achievement) => achievement.id === action.id)) return state
      return state.filter((achievement) => achievement.id !== action.id)
    case 'replace':
      return action.achievements
  }
}

// "저장 먼저, 성공하면 반영" 판단 (EX-12, design 6.1). 저장된 새 목록을 돌려주고, 실패하면 null.
// - 바뀐 게 없으면(없는 번호) 저장도 하지 않고 null
// - 저장에 실패하면 null → 화면은 그대로
// 화면(Provider) 없이 테스트하려고 순수 함수로 뺐다 — 저장 함수는 받아서 쓴다
export function applyChange(
  current: Achievement[],
  action: AchievementsAction,
  save: (list: Achievement[]) => boolean,
): Achievement[] | null {
  const next = achievementsReducer(current, action)
  if (next === current) return null
  if (!save(next)) return null
  return next
}
