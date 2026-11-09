import { afterEach, describe, expect, test, vi } from 'vitest'
import { scrollToTopIfCurrent } from './scrollToTop.ts'

// 같은 페이지 링크 → 맨 위로 (P119, 홈 점검 P187–P188, test-cases UT-61). 실행: npm test
// 테스트는 브라우저가 아니라서 window를 가짜로 끼운다 — "동작 줄이기" 설정 여부와 scrollTo 호출만 흉내

function fakeWindow(reduceMotion: boolean) {
  const scrollTo = vi.fn()
  vi.stubGlobal('window', { matchMedia: () => ({ matches: reduceMotion }), scrollTo })
  return scrollTo
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('scrollToTopIfCurrent — 같은 페이지 링크면 맨 위로', () => {
  test('UT-61 평소엔 부드럽게, "동작 줄이기"면 바로, 다른 페이지 링크면 아무것도 안 함', () => {
    const smooth = fakeWindow(false)
    scrollToTopIfCurrent('/', '/')
    expect(smooth).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })

    const instant = fakeWindow(true)
    scrollToTopIfCurrent('/', '/')
    expect(instant).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })

    const none = fakeWindow(false)
    scrollToTopIfCurrent('/about', '/')
    expect(none).not.toHaveBeenCalled()
  })
})
