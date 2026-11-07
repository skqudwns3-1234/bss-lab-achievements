import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { AchievementsProvider } from './AchievementsContext.tsx'
import { useAchievements } from './useAchievements.ts'

// 성과 목록 상자 테스트 (spec/02 2-5, test-cases UT-49~50). 실행: npm test
// 화면 테스트 도구를 더 깔지 않고, React에 들어 있는 renderToString(화면을 글자로 그려 보기)으로 확인한다.
// (effect는 실행되지 않으므로 복구·백업·다른 탭 맞추기는 브라우저에서 확인)

// 상자에서 꺼낸 목록 개수를 글자로 보여 주는 확인용 컴포넌트
function CountProbe() {
  const { achievements } = useAchievements()
  return <span>{`성과 ${achievements.length}건`}</span>
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('AchievementsProvider · useAchievements', () => {
  test('UT-49 Provider 밖에서 훅을 쓰면 알아보기 쉬운 오류', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {}) // React가 오류를 콘솔에도 찍어서 테스트 출력이 지저분해지지 않게
    expect(() => renderToString(<CountProbe />)).toThrow('<AchievementsProvider> 안에서만')
  })

  test('UT-50 Provider 안에서는 처음 데이터 8건을 꺼내 쓴다 (저장된 게 없을 때)', () => {
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} })
    const html = renderToString(
      <AchievementsProvider>
        <CountProbe />
      </AchievementsProvider>,
    )
    expect(html).toContain('성과 8건')
  })
})
