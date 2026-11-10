import { describe, expect, test, vi } from 'vitest'
import type { Achievement, AchievementFilter, AchievementInput, AchievementType } from '../types.ts'
import {
  achievementsReducer,
  findRequiredProblem,
  applyChange,
  countByType,
  filterAchievements,
  getNewestSummary,
  nextId,
  padCount,
  parseAchievementId,
  sortByLatest,
} from './achievements.ts'

// 계산 함수 단위 테스트 (spec/02 2-3b, test-cases UT-01~18). 실행: npm test
// 2-2 처음 데이터는 바뀔 수 있어서 쓰지 않고, 테스트마다 필요한 작은 성과를 직접 만든다.

// 테스트용 성과 만들기 — 번호·유형·날짜만 주고 나머지 칸은 빈 값 (필요한 칸만 extra로 덮어씀)
function make(
  id: number,
  type: AchievementType,
  achievedOn: string,
  extra: Partial<Achievement> = {},
): Achievement {
  return {
    id,
    type,
    title: `성과 ${id}`,
    achievedOn,
    authors: '',
    advisors: '',
    venue: '',
    doi: '',
    link: '',
    isSample: false,
    ...extra,
  }
}

// 결과에서 번호만 뽑아 비교하기 쉽게
const ids = (list: Achievement[]) => list.map((achievement) => achievement.id)

// 검색 조건 기본값 — 바꿀 칸만 넘긴다
const filterOf = (changes: Partial<AchievementFilter>): AchievementFilter => ({
  query: '',
  type: 'ALL',
  year: 'ALL',
  ...changes,
})

describe('sortByLatest — 최신순 정렬 (BR-10)', () => {
  test('UT-01 날짜 최신순으로 정렬한다', () => {
    const list = [make(1, 'PAPER', '2026-03-20'), make(2, 'AWARD', '2026-10-11'), make(3, 'PATENT', '2026-07-06')]
    expect(ids(sortByLatest(list))).toEqual([2, 3, 1])
  })

  test('UT-02 같은 날짜면 번호가 큰 것이 위 (P161)', () => {
    const list = [make(5, 'AWARD', '2026-07-06'), make(6, 'PAPER', '2026-07-06')]
    expect(ids(sortByLatest(list))).toEqual([6, 5])
  })

  test('UT-03 받은 목록(원본)의 순서는 바꾸지 않는다', () => {
    const list = [make(1, 'PAPER', '2026-01-01'), make(2, 'PAPER', '2026-12-31')]
    sortByLatest(list)
    expect(ids(list)).toEqual([1, 2])
  })

  test('UT-04 빈 목록이면 빈 목록', () => {
    expect(sortByLatest([])).toEqual([])
  })
})

describe('countByType — 유형별 개수 (홈 통계)', () => {
  test('UT-05 유형별로 센다', () => {
    const list = [make(1, 'PAPER', '2026-01-01'), make(2, 'PAPER', '2026-02-01'), make(3, 'CONTEST', '2026-03-01')]
    expect(countByType(list)).toEqual({ PAPER: 2, AWARD: 0, PATENT: 0, CONTEST: 1 })
  })

  test('UT-06 0건이면 네 유형 모두 0', () => {
    expect(countByType([])).toEqual({ PAPER: 0, AWARD: 0, PATENT: 0, CONTEST: 0 })
  })
})

describe('getNewestSummary — 홈 NEW 알약 (BR-15)', () => {
  // 오늘 날짜를 정해 두고 계산 — 테스트가 실제 날짜에 따라 바뀌지 않게 (1-7)
  const TODAY = '2026-11-08'

  test('UT-07 가장 최근 날짜가 한 유형뿐이면 유형 이름', () => {
    const list = [make(7, 'CONTEST', '2026-10-11'), make(8, 'CONTEST', '2026-10-11'), make(6, 'PAPER', '2026-07-06')]
    expect(getNewestSummary(list, TODAY)).toEqual({ date: '2026-10-11', label: '공모전', count: 2 })
  })

  test('UT-08 가장 최근 날짜에 유형이 섞이면 "성과"로 합친다 (P161)', () => {
    const list = [make(5, 'AWARD', '2026-07-06'), make(6, 'PAPER', '2026-07-06')]
    expect(getNewestSummary(list, TODAY)).toEqual({ date: '2026-07-06', label: '성과', count: 2 })
  })

  test('UT-09 예전 날짜의 성과는 세지 않는다', () => {
    const list = [make(1, 'PAPER', '2026-01-01'), make(2, 'PAPER', '2026-01-01'), make(3, 'PATENT', '2026-05-05')]
    expect(getNewestSummary(list, TODAY)).toEqual({ date: '2026-05-05', label: '특허', count: 1 })
  })

  test('UT-10 0건이면 null (알약 숨김, EX-09)', () => {
    expect(getNewestSummary([], TODAY)).toBeNull()
  })

  test('UT-58 오늘 이후(미래) 성과는 빼고 그 전 최근 날짜로, 미래만 있으면 null (EX-32, P186)', () => {
    const list = [make(9, 'PAPER', '2026-12-01'), make(7, 'CONTEST', '2026-10-11'), make(8, 'CONTEST', '2026-10-11')]
    expect(getNewestSummary(list, TODAY)).toEqual({ date: '2026-10-11', label: '공모전', count: 2 })
    expect(getNewestSummary([make(9, 'PAPER', '2026-12-01'), make(10, 'AWARD', '2026-11-09')], TODAY)).toBeNull()
  })

  test('UT-59 오늘 당일 성과는 포함 (경계)', () => {
    const list = [make(11, 'PATENT', TODAY), make(7, 'CONTEST', '2026-10-11')]
    expect(getNewestSummary(list, TODAY)).toEqual({ date: TODAY, label: '특허', count: 1 })
  })
})

describe('filterAchievements — 검색·필터 (FR-07, BR-11)', () => {
  const list = [
    make(1, 'PAPER', '2025-05-01', { title: 'Deep Learning 입문', authors: '홍길동' }),
    make(2, 'AWARD', '2026-07-06', { title: '우수논문상', authors: '김예시', advisors: '박교수' }),
    make(3, 'PAPER', '2026-07-06', { title: '배달 증거 검증', authors: '이샘플', advisors: '박교수' }),
  ]

  test('UT-11 제목으로 찾는다', () => {
    expect(ids(filterAchievements(list, filterOf({ query: '배달' })))).toEqual([3])
  })

  test('UT-12 저자로 찾는다', () => {
    expect(ids(filterAchievements(list, filterOf({ query: '김예시' })))).toEqual([2])
  })

  test('UT-13 지도교수로 찾는다 (P157)', () => {
    expect(ids(filterAchievements(list, filterOf({ query: '박교수' })))).toEqual([2, 3])
  })

  test('UT-14 대소문자와 앞뒤 공백은 무시한다', () => {
    expect(ids(filterAchievements(list, filterOf({ query: '  deep ' })))).toEqual([1])
  })

  test('UT-15 검색어가 비어 있으면(공백만 있어도) 전체', () => {
    expect(ids(filterAchievements(list, filterOf({ query: '   ' })))).toEqual([1, 2, 3])
  })

  test('UT-16 유형과 연도는 모두 만족해야 남는다 (AND, P161)', () => {
    expect(ids(filterAchievements(list, filterOf({ type: 'PAPER', year: 2026 })))).toEqual([3])
    expect(ids(filterAchievements(list, filterOf({ query: '박교수', type: 'AWARD' })))).toEqual([2])
  })

  test('UT-17 맞는 성과가 없으면 빈 목록', () => {
    expect(filterAchievements(list, filterOf({ query: '없는 말' }))).toEqual([])
    expect(filterAchievements(list, filterOf({ type: 'AWARD', year: 2025 }))).toEqual([])
  })
})

describe('nextId — 새 성과 번호 (BR-12)', () => {
  test('UT-18 가장 큰 번호 + 1, 빈 목록이면 1, 중간 번호를 지워도 겹치지 않는다', () => {
    expect(nextId([make(1, 'PAPER', '2026-01-01'), make(3, 'PAPER', '2026-01-01')])).toBe(4)
    expect(nextId([])).toBe(1)
    // 1·2·3 중 2를 지운 상태 — "개수 + 1"이면 3이 되어 기존 3번과 겹친다
    expect(nextId([make(1, 'PAPER', '2026-01-01'), make(3, 'PAPER', '2026-01-01')])).not.toBe(3)
  })
})

// ── 2-5 목록 바꾸기 (UT-40~48) ──

// 폼에서 들어오는 값 (번호·예시 여부 없음)
function input(title: string): AchievementInput {
  return { type: 'PAPER', title, achievedOn: '2026-11-08', authors: '', advisors: '', venue: '', doi: '', link: '' }
}

describe('achievementsReducer — 목록 바꾸는 규칙 (design 6.1)', () => {
  const list = [make(1, 'PAPER', '2026-01-01'), make(3, 'AWARD', '2026-02-01', { isSample: true })]

  test('UT-40 추가: 새 번호(가장 큰 번호 + 1)와 실제 성과로 끝에 붙이고, 원본은 그대로', () => {
    const next = achievementsReducer(list, { type: 'add', input: input('새 성과') })
    expect(ids(next)).toEqual([1, 3, 4])
    expect(next[2]).toMatchObject({ id: 4, title: '새 성과', isSample: false })
    expect(ids(list)).toEqual([1, 3])
  })

  test('UT-41 수정: 내용만 바꾸고 번호와 예시 여부는 그대로 (예시 배지 유지, P174)', () => {
    const next = achievementsReducer(list, { type: 'update', id: 3, input: input('고친 제목') })
    expect(next[1]).toMatchObject({ id: 3, title: '고친 제목', isSample: true })
    expect(next[0]).toBe(list[0]) // 다른 항목은 건드리지 않음
  })

  test('UT-42 없는 번호를 수정하면 받은 목록을 그대로 돌려준다', () => {
    expect(achievementsReducer(list, { type: 'update', id: 99, input: input('x') })).toBe(list)
  })

  test('UT-43 삭제: 그 번호만 뺀다', () => {
    expect(ids(achievementsReducer(list, { type: 'delete', id: 1 }))).toEqual([3])
  })

  test('UT-44 없는 번호를 삭제하면 받은 목록을 그대로 돌려준다', () => {
    expect(achievementsReducer(list, { type: 'delete', id: 99 })).toBe(list)
  })

  test('UT-45 통째로 바꾸기: 받은 목록으로 (다른 탭에서 바뀐 경우, P174)', () => {
    const other = [make(7, 'CONTEST', '2026-10-11')]
    expect(achievementsReducer(list, { type: 'replace', achievements: other })).toBe(other)
  })
})

describe('applyChange — 저장 먼저, 성공하면 반영 (EX-12)', () => {
  const list = [make(1, 'PAPER', '2026-01-01')]

  test('UT-46 없는 번호면 저장도 하지 않고 실패(null)', () => {
    const save = vi.fn(() => true)
    expect(applyChange(list, { type: 'delete', id: 99 }, save)).toBeNull()
    expect(save).not.toHaveBeenCalled()
  })

  test('UT-47 저장에 실패하면 실패(null) — 화면은 그대로', () => {
    expect(applyChange(list, { type: 'add', input: input('x') }, () => false)).toBeNull()
  })

  test('UT-48 저장에 성공하면 저장한 그 목록을 돌려준다', () => {
    const save = vi.fn(() => true)
    const next = applyChange(list, { type: 'add', input: input('x') }, save)
    expect(ids(next ?? [])).toEqual([1, 2])
    expect(save).toHaveBeenCalledWith(next)
  })
})

// ── A 점검 후 추가 (P176–P177): 저장할 때도 불러올 때와 같은 규칙 ──
describe('findRequiredProblem · 틀린 입력은 저장하지 않기', () => {
  const list = [make(1, 'PAPER', '2026-01-01')]

  test('UT-51 필수 칸 검사: 문제가 없으면 null, 있으면 이유', () => {
    expect(findRequiredProblem(input('제목'))).toBeNull()
    expect(findRequiredProblem({ ...input('제목'), type: 'BOOK' })).toContain('"BOOK"')
    expect(findRequiredProblem(input('   '))).toContain('제목이 비어')
    expect(findRequiredProblem({ ...input('제목'), achievedOn: '2026-02-30' })).toContain('2026-02-30')
  })

  test('UT-52 빈 제목은 추가하지 않고, 저장도 하지 않는다', () => {
    const save = vi.fn(() => true)
    expect(achievementsReducer(list, { type: 'add', input: input('  ') })).toBe(list)
    expect(applyChange(list, { type: 'add', input: input('  ') }, save)).toBeNull()
    expect(save).not.toHaveBeenCalled()
  })

  test('UT-53 없는 날짜(2026-02-30)·틀린 형식(2026/11/08)은 추가·수정하지 않는다', () => {
    expect(achievementsReducer(list, { type: 'add', input: { ...input('x'), achievedOn: '2026-02-30' } })).toBe(list)
    expect(achievementsReducer(list, { type: 'update', id: 1, input: { ...input('x'), achievedOn: '2026/11/08' } })).toBe(list)
  })
})

describe('padCount — 숫자 두 자리 (BR-13, 1-6)', () => {
  test('UT-57 한 자리는 앞에 0, 두 자리 이상은 그대로', () => {
    expect(padCount(0)).toBe('00') // 성과 0건 (EX-09)
    expect(padCount(9)).toBe('09')
    expect(padCount(10)).toBe('10')
    expect(padCount(100)).toBe('100') // 100 이상은 자르지 않음
  })
})

describe('parseAchievementId — 주소의 성과 번호 (EX-06, spec/03 C-1)', () => {
  test('UT-65 1 이상의 정수 글자만 숫자로, 나머지는 null', () => {
    expect(parseAchievementId('8')).toBe(8)
    expect(parseAchievementId('9999')).toBe(9999) // 형식은 맞음 — 없는 번호인지는 목록에서 찾아 봄
    for (const text of ['abc', '0', '1.5', '01', '-1', '1e2', ' 8', '']) {
      expect(parseAchievementId(text)).toBeNull()
    }
  })
})
