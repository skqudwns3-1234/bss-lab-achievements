import { createContext, useContext } from 'react'
import type { Achievement, AchievementInput } from '../types.ts'

// 성과 목록 상자(Context)와 꺼내 쓰는 훅 (spec/02 2-5).
// 상자를 채우는 쪽은 AchievementsContext.tsx의 AchievementsProvider.
// (컴포넌트 파일에서는 컴포넌트만 내보내야 개발 중 화면 즉시 갱신이 잘 돼서 — lint 규칙 — 훅은 이 파일로 따로 뺐다)

export type AchievementsContextValue = {
  achievements: Achievement[] // 지금 성과 목록 — 홈·목록·폼이 모두 이것을 본다
  notices: string[] // 처음 불러올 때 고친 내용 — 관리 모드 화면 띠에서 보여 줄 예정 (P174)
  addAchievement: (input: AchievementInput) => number | null // 저장에 성공하면 새 성과 번호, 실패면 null (C-2b — 목록 안내의 "보기"가 그 성과를 열려고)
  updateAchievement: (id: number, input: AchievementInput) => boolean // 없는 번호·저장 실패면 false
  deleteAchievement: (id: number) => boolean // 없는 번호·저장 실패면 false
}

// 처음 값 null = "Provider 밖" 표시 — useAchievements가 이걸로 실수를 알아챈다
export const AchievementsContext = createContext<AchievementsContextValue | null>(null)

// 어느 화면에서든 같은 성과 목록과 바꾸는 함수를 꺼내 쓰는 훅
export function useAchievements(): AchievementsContextValue {
  const value = useContext(AchievementsContext)
  if (!value) {
    throw new Error(
      'useAchievements는 <AchievementsProvider> 안에서만 쓸 수 있어요. main.tsx에서 앱을 AchievementsProvider로 감쌌는지 확인하세요.',
    )
  }
  return value
}
