import { describe, expect, test } from 'vitest'
import type { Achievement, AchievementFilter, AchievementType } from '../types.ts'
import { countByType, filterAchievements, getNewestSummary, nextId, sortByLatest } from './achievements.ts'

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
  test('UT-07 가장 최근 날짜가 한 유형뿐이면 유형 이름', () => {
    const list = [make(7, 'CONTEST', '2026-10-11'), make(8, 'CONTEST', '2026-10-11'), make(6, 'PAPER', '2026-07-06')]
    expect(getNewestSummary(list)).toEqual({ date: '2026-10-11', label: '공모전', count: 2 })
  })

  test('UT-08 가장 최근 날짜에 유형이 섞이면 "성과"로 합친다 (P161)', () => {
    const list = [make(5, 'AWARD', '2026-07-06'), make(6, 'PAPER', '2026-07-06')]
    expect(getNewestSummary(list)).toEqual({ date: '2026-07-06', label: '성과', count: 2 })
  })

  test('UT-09 예전 날짜의 성과는 세지 않는다', () => {
    const list = [make(1, 'PAPER', '2026-01-01'), make(2, 'PAPER', '2026-01-01'), make(3, 'PATENT', '2026-05-05')]
    expect(getNewestSummary(list)).toEqual({ date: '2026-05-05', label: '특허', count: 1 })
  })

  test('UT-10 0건이면 null (알약 숨김, EX-09)', () => {
    expect(getNewestSummary([])).toBeNull()
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
