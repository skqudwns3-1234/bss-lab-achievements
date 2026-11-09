import { afterEach, describe, expect, test, vi } from 'vitest'
import { SAMPLE_ACHIEVEMENTS } from '../data/sampleAchievements.ts'
import {
  ADMIN_MODE_KEY,
  BACKUP_KEY,
  STORAGE_KEY,
  backupRawData,
  loadAchievements,
  loadAdminMode,
  saveAchievements,
  saveAdminMode,
} from './storage.ts'

// 저장소 읽기·쓰기 테스트 (spec/02 2-4, test-cases UT-19~30, 관리 모드 UT-63~64). 실행: npm test
// 테스트하는 곳(Node)에는 브라우저 저장소가 없어서, 진짜처럼 동작하는 가짜 저장소를 끼워 넣는다 (vi.stubGlobal).

type FakeOptions = { failRead?: boolean; failWrite?: boolean }

// 가짜 저장소: 처음 값과 "읽기·쓰기 실패" 흉내를 정할 수 있다. data로 안에 무엇이 들었는지 확인
function useFakeStorage(initial: Record<string, string> = {}, options: FakeOptions = {}) {
  const data = new Map(Object.entries(initial))
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => {
      if (options.failRead) throw new Error('SecurityError: 브라우저가 저장소를 막음')
      return data.get(key) ?? null
    },
    setItem: (key: string, value: string) => {
      if (options.failWrite) throw new Error('QuotaExceededError: 용량 초과')
      data.set(key, value)
    },
    removeItem: (key: string) => data.delete(key),
    clear: () => data.clear(),
  })
  return data
}

// 저장소에 들어 있을 성과 한 건 (JSON으로 저장되는 모양)
function stored(id: number, changes: Record<string, unknown> = {}) {
  return {
    id,
    type: 'PAPER',
    title: `성과 ${id}`,
    achievedOn: '2026-07-06',
    authors: '홍길동',
    advisors: '박교수',
    venue: '예시 학회',
    doi: '',
    link: '',
    isSample: false,
    ...changes,
  }
}

const saved = (list: unknown) => ({ [STORAGE_KEY]: JSON.stringify(list) })

afterEach(() => {
  vi.unstubAllGlobals() // 테스트마다 가짜 저장소를 새로
})

describe('loadAchievements — 불러오기 (EX-11, P164)', () => {
  test('UT-19 저장된 게 없으면 처음 데이터 8건, 안내 없음', () => {
    useFakeStorage()
    const result = loadAchievements()
    expect(result.achievements).toEqual(SAMPLE_ACHIEVEMENTS)
    expect(result.notices).toEqual([])
  })

  test('UT-20 빈 목록([])이 저장돼 있으면 빈 목록 그대로 (TD-B)', () => {
    useFakeStorage(saved([]))
    expect(loadAchievements()).toEqual({ achievements: [], notices: [] })
  })

  test('UT-21 JSON이 깨져 있으면 처음 데이터 + 안내 (TD-C)', () => {
    useFakeStorage({ [STORAGE_KEY]: 'abc' })
    const result = loadAchievements()
    expect(result.achievements).toEqual(SAMPLE_ACHIEVEMENTS)
    expect(result.notices).toHaveLength(1)
    expect(result.notices[0]).toContain('JSON')
  })

  test('UT-22 목록이 아닌 값이면 처음 데이터 + 안내', () => {
    useFakeStorage(saved({ id: 1 }))
    const result = loadAchievements()
    expect(result.achievements).toEqual(SAMPLE_ACHIEVEMENTS)
    expect(result.notices[0]).toContain('목록 형식이 아니')
  })

  test('UT-23 필수 칸이 틀린 항목은 빼고 무엇이 문제였는지 안내 (TD-D)', () => {
    useFakeStorage(saved([stored(1), stored(2), stored(3, { type: 'BOOK' }), stored(4, { title: '   ' })]))
    const result = loadAchievements()
    expect(result.achievements.map((a) => a.id)).toEqual([1, 2])
    expect(result.notices).toHaveLength(2)
    expect(result.notices[0]).toContain('3번째 항목')
    expect(result.notices[0]).toContain('"BOOK"')
    expect(result.notices[1]).toContain('제목이 비어')
  })

  test('UT-54 없는 날짜(2026-02-30) 항목도 빼고 안내 — 저장할 때와 같은 규칙 (P177)', () => {
    useFakeStorage(saved([stored(1), stored(2, { achievedOn: '2026-02-30' })]))
    const result = loadAchievements()
    expect(result.achievements.map((a) => a.id)).toEqual([1])
    expect(result.notices[0]).toContain('2026-02-30')
  })

  test('UT-24 지도교수 칸이 없는 옛 항목은 빈 값으로 채워 살리고 안내', () => {
    const old = stored(1)
    delete (old as Record<string, unknown>).advisors
    useFakeStorage(saved([old]))
    const result = loadAchievements()
    expect(result.achievements).toHaveLength(1)
    expect(result.achievements[0].advisors).toBe('')
    expect(result.notices).toEqual(['1번째 항목(번호 1)에 지도교수 칸이 없어 빈 값으로 채웠어요.'])
  })

  test('UT-25 번호가 겹치면 앞의 것만 남기고 안내 (P165)', () => {
    useFakeStorage(saved([stored(1, { title: '앞' }), stored(1, { title: '뒤' })]))
    const result = loadAchievements()
    expect(result.achievements.map((a) => a.title)).toEqual(['앞'])
    expect(result.notices[0]).toContain('겹쳐')
  })

  test('UT-31 항목이 있었는데 전부 틀리면 처음 데이터 + 안내 (P169)', () => {
    useFakeStorage(saved([stored(1, { type: 'BOOK' }), 'abc']))
    const result = loadAchievements()
    expect(result.achievements).toEqual(SAMPLE_ACHIEVEMENTS)
    expect(result.notices).toHaveLength(3)
    expect(result.notices[2]).toContain('모두 형식에 맞지 않아')
  })

  test('UT-26 브라우저가 저장소를 막아도 멈추지 않고 처음 데이터 + 안내', () => {
    useFakeStorage({}, { failRead: true })
    const result = loadAchievements()
    expect(result.achievements).toEqual(SAMPLE_ACHIEVEMENTS)
    expect(result.notices[0]).toContain('읽을 수 없어')
  })
})

describe('saveAchievements — 저장하기 (EX-12)', () => {
  test('UT-27 저장하면 true, 다시 불러오면 같은 목록', () => {
    useFakeStorage()
    const list = [SAMPLE_ACHIEVEMENTS[0], SAMPLE_ACHIEVEMENTS[1]]
    expect(saveAchievements(list)).toBe(true)
    expect(loadAchievements()).toEqual({ achievements: list, notices: [] })
  })

  test('UT-28 저장에 실패하면(용량 초과 등) false', () => {
    useFakeStorage({}, { failWrite: true })
    expect(saveAchievements(SAMPLE_ACHIEVEMENTS)).toBe(false)
  })
})

describe('backupRawData — 원본 백업 (P167 A안)', () => {
  test('UT-29 문제가 있던 원본 글자를 백업 칸에 그대로 옮긴다', () => {
    const data = useFakeStorage({ [STORAGE_KEY]: 'abc' })
    expect(backupRawData()).toBe(true)
    expect(data.get(BACKUP_KEY)).toBe('abc')
  })

  test('UT-30 백업에 실패하면 false (앱은 멈추지 않음)', () => {
    useFakeStorage({ [STORAGE_KEY]: 'abc' }, { failWrite: true })
    expect(backupRawData()).toBe(false)
  })
})

describe('loadAdminMode·saveAdminMode — 관리 모드 저장 (B-4, Q5)', () => {
  test('UT-63 정확히 "true"일 때만 켜짐 — 없음·"false"·깨진 값·저장소를 못 읽으면 꺼짐', () => {
    useFakeStorage({ [ADMIN_MODE_KEY]: 'true' })
    expect(loadAdminMode()).toBe(true)
    for (const value of ['false', 'yes', 'TRUE', '1', '']) {
      useFakeStorage({ [ADMIN_MODE_KEY]: value })
      expect(loadAdminMode()).toBe(false)
    }
    useFakeStorage()
    expect(loadAdminMode()).toBe(false)
    useFakeStorage({ [ADMIN_MODE_KEY]: 'true' }, { failRead: true })
    expect(loadAdminMode()).toBe(false)
  })

  test('UT-64 켜고 끈 값을 "true"/"false"로 저장해 다시 불러오면 같음, 저장에 실패하면 false', () => {
    const data = useFakeStorage()
    expect(saveAdminMode(true)).toBe(true)
    expect(data.get(ADMIN_MODE_KEY)).toBe('true')
    expect(loadAdminMode()).toBe(true)
    expect(saveAdminMode(false)).toBe(true)
    expect(data.get(ADMIN_MODE_KEY)).toBe('false')
    expect(loadAdminMode()).toBe(false)
    useFakeStorage({}, { failWrite: true })
    expect(saveAdminMode(true)).toBe(false)
  })
})
