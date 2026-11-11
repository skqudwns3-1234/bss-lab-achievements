import { describe, expect, test } from 'vitest'
import { LAB } from '../data/lab.ts'
import { countText } from './lab.ts'

describe('countText — 연구실 소개 한눈에 보기 숫자 (spec/05 E-1)', () => {
  test('UT-90 0이면 "아직 없음", 아니면 숫자 + 단위 / 이상한 값도 "아직 없음"', () => {
    expect(countText(0, '명')).toBe('아직 없음')
    expect(countText(1, '명')).toBe('1명')
    expect(countText(128, '건')).toBe('128건')
    expect(countText(-1, '건')).toBe('아직 없음')
    expect(countText(Number.NaN, '건')).toBe('아직 없음')
  })

  test('UT-90b lab.ts 소개 문단 — 빈 줄 없음 (빈 줄은 화면에서 빼지만 데이터 실수일 가능성이 커서 알려 줌)', () => {
    LAB.about.forEach((paragraph, index) => {
      expect(paragraph.trim(), `소개 문단 ${index + 1}번째 줄이 비어 있음`).not.toBe('')
    })
  })
})
