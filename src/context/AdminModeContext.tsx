import { useEffect, useState, type ReactNode } from 'react'
import { ADMIN_MODE_KEY, loadAdminMode, saveAdminMode } from '../utils/storage.ts'
import { AdminModeContext } from './useAdminMode.ts'

// 관리 모드 켜짐 여부를 들고 있는 상자 (spec/02 B-4, design 6.2, P208–P209).
// main.tsx에서 앱 전체를 감싸서, 헤더 스위치·관리 띠·성과 페이지가 useAdminMode()로 같은 값을 본다.
// 값이 켜짐/꺼짐 하나뿐이고 바꾸는 방법도 하나라 useReducer가 아니라 useState
export function AdminModeProvider({ children }: { children: ReactNode }) {
  // ① 저장소는 처음 한 번만 읽는다(지연 초기화 — 함수를 넘기면 첫 그리기 때만 실행). 깨진 값이면 꺼짐
  const [isAdmin, setIsAdmin] = useState(loadAdminMode)

  // ② 켜고 끄기: 화면을 먼저 바꾸고 저장. 저장에 실패해도(사생활 보호 모드 등) 이번 화면에서는 켜짐 —
  //    성과 목록과 달리 잃어버릴 데이터가 없어서 "저장 먼저"가 아니라 "화면 먼저". 새로고침하면 꺼진다
  function setAdmin(on: boolean) {
    setIsAdmin(on)
    if (!saveAdminMode(on)) {
      console.warn('[관리 모드] 저장하지 못했어요 — 이번 화면에서만 바뀌고, 새로고침하면 원래대로 돌아가요.')
    }
  }

  // ③ 다른 탭에서 켜고 끄면 이 탭도 맞춘다 (B-4 ⑤ — 성과 목록의 다른 탭 맞추기와 같은 방식, EX-25).
  //    브라우저 신호(storage 이벤트)를 듣는 것은 React 화면 밖 일이라 useEffect, 나갈 때 정리 함수로 듣기를 멈춘다.
  //    다시 저장하지 않고 읽기만 — 탭끼리 계속 주고받지 않게
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== ADMIN_MODE_KEY && event.key !== null) return // 성과 목록 등 다른 키는 무시 (null = 전체 비움)
      setIsAdmin(loadAdminMode())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // useMemo·useCallback은 넣지 않는다 — 이 상자는 켜짐 여부가 바뀔 때만 다시 그려지고,
  // 그때는 어차피 값이 바뀌므로 고정해서 얻는 게 없음 (AchievementsProvider와 같은 판단, 억지로 넣지 않기)
  const value = { isAdmin, setAdmin }

  return <AdminModeContext.Provider value={value}>{children}</AdminModeContext.Provider>
}
