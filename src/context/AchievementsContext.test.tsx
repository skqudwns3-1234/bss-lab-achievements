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

describe('addAchievement — 새 성과 번호 돌려주기 (spec/03 C-2b)', () => {
  test('UT-70 저장에 성공하면 새 번호(가장 큰 번호 + 1), 저장에 실패하면 null', () => {
    // 상자에서 꺼낸 함수를 바깥 변수에 잡아 두고, 그린 뒤에 직접 불러 본다
    let api: ReturnType<typeof useAchievements> | null = null
    function ApiProbe() {
      api = useAchievements()
      return null
    }
    const saved: string[] = []
    let failSave = false
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: (_key: string, value: string) => {
        if (failSave) throw new Error('저장 실패 흉내')
        saved.push(value)
      },
      removeItem: () => {},
    })
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    renderToString(
      <AchievementsProvider>
        <ApiProbe />
      </AchievementsProvider>,
    )
    const input = { type: 'AWARD' as const, title: '새 수상', achievedOn: '2026-05-01', authors: '', advisors: '', venue: '', doi: '', link: '' }
    expect(api!.addAchievement(input)).toBe(9) // 처음 데이터 8건 → 9번
    expect(api!.addAchievement(input)).toBe(10) // 연달아 등록해도 최신 목록 기준
    failSave = true
    expect(api!.addAchievement(input)).toBeNull()
  })
})
