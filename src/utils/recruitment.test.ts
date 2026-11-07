import { describe, expect, test } from 'vitest'
import type { Recruitment } from '../types.ts'
import { isValidYmd, todayYmd } from './date.ts'
import { getRecruitStatus } from './recruitment.ts'

// 지원 안내 판단 테스트 (P170, test-cases UT-32~39). 실행: npm test

const FORM = 'https://docs.google.com/forms/d/e/abc/viewform'

// 테스트용 모집 정보 — 바꿀 칸만 넘긴다
function recruitment(changes: Partial<Recruitment> = {}): Recruitment {
  return {
    isOpen: true,
    endDate: '2026-12-01',
    title: '신입부원 모집',
    qualifications: [],
    posterUrl: '',
    formUrl: FORM,
    ...changes,
  }
}

describe('todayYmd · isValidYmd — 날짜', () => {
  test('UT-32 오늘 날짜를 YYYY-MM-DD로 (한 자리 월·일은 0을 붙임)', () => {
    expect(todayYmd(new Date(2026, 10, 8))).toBe('2026-11-08') // 월은 0부터라 10 = 11월
  })

  test('UT-33 실제로 있는 날짜만 true (없는 날짜·다른 형식은 false)', () => {
    expect(isValidYmd('2026-12-01')).toBe(true)
    expect(isValidYmd('2028-02-29')).toBe(true) // 윤년
    expect(isValidYmd('2026-02-30')).toBe(false)
    expect(isValidYmd('2026/12/01')).toBe(false)
    expect(isValidYmd('')).toBe(false)
  })
})

describe('getRecruitStatus — 지원 안내 상태 (EX-19~21)', () => {
  test('UT-34 마감 전에는 모집 중, 마감일 당일까지 지원 가능', () => {
    expect(getRecruitStatus(recruitment(), '2026-11-08')).toEqual({
      closed: false,
      deadline: '2026-12-01',
      applyUrl: FORM,
      problems: [],
    })
    expect(getRecruitStatus(recruitment(), '2026-12-01').closed).toBe(false)
  })

  test('UT-35 마감일이 지나면 마감, 지원서 링크 숨김', () => {
    const status = getRecruitStatus(recruitment(), '2026-12-02')
    expect(status.closed).toBe(true)
    expect(status.applyUrl).toBeNull()
    expect(status.problems).toEqual([])
  })

  test('UT-36 마감일 형식이 틀리면 마감일을 숨기고 경고 (마감 판단도 안 함)', () => {
    const status = getRecruitStatus(recruitment({ endDate: '2026/12/1' }), '2027-01-01')
    expect(status.deadline).toBeNull()
    expect(status.closed).toBe(false)
    expect(status.problems[0]).toContain('2026/12/1')
  })

  test('UT-37 편집용(/edit) 링크면 버튼을 숨기고 경고', () => {
    const status = getRecruitStatus(recruitment({ formUrl: 'https://docs.google.com/forms/d/abc/edit' }), '2026-11-08')
    expect(status.applyUrl).toBeNull()
    expect(status.problems[0]).toContain('편집용')
  })

  test('UT-38 https가 아닌 링크도 숨기고 경고', () => {
    const status = getRecruitStatus(recruitment({ formUrl: 'docs.google.com/forms/abc' }), '2026-11-08')
    expect(status.applyUrl).toBeNull()
    expect(status.problems[0]).toContain('https://')
  })

  test('UT-39 링크를 일부러 비우면 버튼만 숨기고 경고는 없음 (EX-15)', () => {
    const status = getRecruitStatus(recruitment({ formUrl: '  ' }), '2026-11-08')
    expect(status.applyUrl).toBeNull()
    expect(status.problems).toEqual([])
  })
})
