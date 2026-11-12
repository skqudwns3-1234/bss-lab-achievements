import { describe, expect, test } from 'vitest'
import { EMPTY_TAP, registerTap, type TapState } from './secretTap.ts'

// 시각 목록대로 차례로 눌러 보고, 각 누름에서 열렸는지를 모은다
function tapAt(times: number[], start: TapState = EMPTY_TAP): boolean[] {
  let state = start
  return times.map((time) => {
    const result = registerTap(state, time)
    state = result.state
    return result.triggered
  })
}

describe('registerTap — 로고 2초 안 5번 (이스터에그 P310–P311)', () => {
  test('UT-94 2초 안 5번째에 한 번만 열림, 늦으면 다시 셈, 6번째부터 새로 셈', () => {
    // 0.3초 간격 5번 → 5번째에서 열림
    expect(tapAt([0, 300, 600, 900, 1200])).toEqual([false, false, false, false, true])
    // 딱 2초째의 5번째도 됨 (2초 "안"에 포함)
    expect(tapAt([0, 500, 1000, 1500, 2000])).toEqual([false, false, false, false, true])
    // 천천히(0.6초 간격) → 5번째가 2.4초라 안 열림, 그 누름이 새 묶음의 1번째
    expect(tapAt([0, 600, 1200, 1800, 2400])).toEqual([false, false, false, false, false])
    // 연타 10번 → 5번째와 10번째에서만
    const ten = Array.from({ length: 10 }, (_, index) => index * 100)
    expect(tapAt(ten)).toEqual([false, false, false, false, true, false, false, false, false, true])
    // 4번 누르고 한참 뒤 → 처음부터, 그 뒤 4번 더 빨리 누르면 열림
    expect(tapAt([0, 100, 200, 300, 5000, 5100, 5200, 5300, 5400])).toEqual([
      false, false, false, false, false, false, false, false, true,
    ])
  })
})
