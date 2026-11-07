import { useCallback, useEffect, useReducer, useRef, useState, type ReactNode } from 'react'
import type { AchievementInput, AchievementsAction } from '../types.ts'
import { achievementsReducer, applyChange } from '../utils/achievements.ts'
import { STORAGE_KEY, backupRawData, loadAchievements, saveAchievements } from '../utils/storage.ts'
import { AchievementsContext } from './useAchievements.ts'

// 성과 목록을 들고 있는 상자 (spec/02 2-5, design 6.1, P174–P175).
// main.tsx에서 앱 전체를 감싸서, 홈·성과 목록·등록 폼이 useAchievements()로 같은 목록을 쓴다.
export function AchievementsProvider({ children }: { children: ReactNode }) {
  // ① 저장소는 처음 한 번만 읽는다(지연 초기화). 목록과 "고친 내용" 안내를 함께 받으려고 결과를 통째로 잡아 둔다
  const [initial] = useState(loadAchievements)

  // ② 성과 목록 — 바꾸는 방법(추가·수정·삭제·통째로)이 여러 가지라 규칙을 reducer 한곳에 모은다
  const [achievements, dispatch] = useReducer(achievementsReducer, initial.achievements)

  // ③ 깨진 데이터를 이미 복구했는지 — 다시 그리지 않고 기억만 하면 돼서 useRef.
  //    개발 모드(StrictMode)는 effect를 두 번 실행하는데, 두 번째에 백업하면 "이미 고친 값"이 원본을 덮어쓴다 → 한 번만
  const repaired = useRef(false)

  // ③-2 가장 최신 목록 — 바꾸기 함수가 이걸로 다음 목록을 계산한다 (A 점검 P176–P177).
  //    화면이 그려질 때의 목록으로 계산하면, 한 동작 안에서 두 번 바꿀 때 두 번째가 첫 번째 결과를 몰라
  //    저장소와 화면이 어긋난다(화면 [3] / 저장 [1, 3]). 다시 그릴 필요 없이 값만 기억하면 돼서 useRef.
  //    목록을 바꾸는 길(바꾸기 함수·다른 탭 맞추기)에서 항상 함께 고친다
  const latest = useRef(initial.achievements)

  // ④ 처음 불러올 때 고친 게 있으면: 원본 백업 → 고친 목록 저장 → 콘솔 안내 한 번 (P167 A안).
  //    저장소·콘솔은 화면 밖 일이라 useEffect
  useEffect(() => {
    if (repaired.current || initial.notices.length === 0) return
    repaired.current = true
    // 백업에 실패하면 원본을 덮어쓰지 않는다 → 다음 방문 때 다시 발견돼 다시 안내 (재알림)
    const saved = backupRawData() && saveAchievements(initial.achievements)
    console.warn(
      `[성과 데이터] 저장된 값을 고쳐서 불러왔어요 (${saved ? '원본은 백업 칸에 두고 고친 목록을 저장함' : '저장하지 못함 — 다음 방문 때 다시 안내'})\n` +
        initial.notices.join('\n'),
    )
  }, [initial])

  // ⑤ 다른 탭에서 저장소가 바뀌면 다시 읽어 맞춘다 (P174). 같은 탭이 저장할 때는 신호가 오지 않는다.
  //    다른 탭이 깨진 값을 썼으면 고쳐서 보여 주기만 하고 저장은 안 한다 — 탭끼리 계속 주고받는 것 방지.
  //    대신 원본은 백업해 둔다 — 이 탭에서 다음에 저장하면 덮어써지므로 (A 점검 P177)
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY && event.key !== null) return // 백업 칸 등 다른 키는 무시 (null = 전체 비움)
      const result = loadAchievements()
      latest.current = result.achievements
      dispatch({ type: 'replace', achievements: result.achievements })
      if (result.notices.length > 0) {
        const backedUp = backupRawData()
        console.warn(
          `[성과 데이터] 다른 탭에서 바뀐 값을 고쳐서 불러왔어요 (${backedUp ? '원본은 백업 칸에 둠' : '원본 백업 못 함'})\n` +
            result.notices.join('\n'),
        )
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // ⑥ 바꾸기: 다음 목록을 먼저 계산해 저장 → 성공했을 때만 화면 반영 (EX-12), 성공 여부를 돌려준다.
  //    최신 목록(latest)으로 계산하고, 저장에 성공하면 latest도 바로 고친다 → 연달아 바꿔도 저장소 = 화면.
  //    함수를 useCallback으로 고정해, 나중에 목록 줄(memo)이 쓸데없이 다시 그려지지 않게
  //    (ref를 쓰므로 목록이 바뀌어도 함수가 새로 만들어지지 않는다)
  const commit = useCallback((action: AchievementsAction) => {
    const next = applyChange(latest.current, action, saveAchievements)
    if (!next) return false
    latest.current = next
    dispatch(action)
    return true
  }, [])
  const addAchievement = useCallback((input: AchievementInput) => commit({ type: 'add', input }), [commit])
  const updateAchievement = useCallback(
    (id: number, input: AchievementInput) => commit({ type: 'update', id, input }),
    [commit],
  )
  const deleteAchievement = useCallback((id: number) => commit({ type: 'delete', id }), [commit])

  // 내보내는 값은 useMemo로 감싸지 않는다 — 이 상자는 목록이 바뀔 때만 다시 그려져서 지금은 얻는 게 없음 (P174, 억지로 넣지 않기)
  const value = { achievements, notices: initial.notices, addAchievement, updateAchievement, deleteAchievement }

  return <AchievementsContext.Provider value={value}>{children}</AchievementsContext.Provider>
}
