import { createContext, useContext } from 'react'

// 관리 모드 상자(Context)와 꺼내 쓰는 훅 (spec/02 B-4, design 6.2).
// 상자를 채우는 쪽은 AdminModeContext.tsx의 AdminModeProvider.
// (useAchievements.ts와 같은 이유로 훅은 이 파일로 따로 뺐다 — 컴포넌트 파일에서는 컴포넌트만 내보내기)

export type AdminModeContextValue = {
  isAdmin: boolean // 관리 모드가 켜져 있는지 — 켜지면 관리 띠·등록·수정 버튼이 보인다
  setAdmin: (on: boolean) => void // 켜고 끄기 — 저장까지 한다 (새로고침해도 유지, Q5)
}

// 처음 값 null = "Provider 밖" 표시 — useAdminMode가 이걸로 실수를 알아챈다
export const AdminModeContext = createContext<AdminModeContextValue | null>(null)

// 어느 화면에서든 관리 모드 켜짐 여부와 바꾸는 함수를 꺼내 쓰는 훅
export function useAdminMode(): AdminModeContextValue {
  const value = useContext(AdminModeContext)
  if (!value) {
    throw new Error(
      'useAdminMode는 <AdminModeProvider> 안에서만 쓸 수 있어요. main.tsx에서 앱을 AdminModeProvider로 감쌌는지 확인하세요.',
    )
  }
  return value
}
