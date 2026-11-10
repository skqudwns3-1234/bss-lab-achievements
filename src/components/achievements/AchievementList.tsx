import type { Achievement } from '../../types.ts'
import AchievementRow from './AchievementRow.tsx'
import './AchievementList.css'

type AchievementListProps = {
  achievements: Achievement[] // 보여 줄 성과들 — 정렬·검색은 부모(AchievementsPage)가 끝내서 넘긴다
  isAdmin: boolean // 관리 모드 — 켜지면 줄마다 "수정"·"삭제" (B-4·B-5)
  confirmingId: number | null // 삭제 확인 칸이 열린 성과 번호 (B-5)
  deleteFailed: boolean // 그 확인 칸에서 저장에 실패했는지 (B-5)
  focusId: number | null // 지운 뒤 제목에 포커스를 줄 성과 번호 (B-5)
  onOpen: (achievement: Achievement) => void // 줄을 누르면 팝업 (B-3)
  onDelete: (achievement: Achievement) => void // "삭제" → 확인 칸 열기 (B-5)
  onCancelDelete: () => void // 확인 칸 취소·Esc (B-5)
  onConfirmDelete: (achievement: Achievement) => void // 확인 칸의 빨간 "삭제" (B-5)
  onFocusDone: () => void // 지운 뒤 포커스를 받았다는 신호 (B-5)
}

// 성과 목록 (spec/02 B-1, design 5.4). 받은 순서대로 한 줄씩 그리기만 하고 상태·훅은 없다.
// 순서가 의미 있는 목록(최신순)이라 <ol>. key는 겹치지 않는 성과 번호 (저장소에서 겹침을 걸러 둠, P165).
// B-5: 번호(confirmingId·focusId)는 여기서 "이 줄인가" 참/거짓으로 바꿔 넘긴다 — 줄(memo)에 번호를 그대로 주면
// 확인 칸을 열고 닫을 때마다 모든 줄이 다시 그려지고, 참/거짓이면 값이 바뀐 줄(1~2줄)만 다시 그려진다
export default function AchievementList({
  achievements,
  isAdmin,
  confirmingId,
  deleteFailed,
  focusId,
  onOpen,
  onDelete,
  onCancelDelete,
  onConfirmDelete,
  onFocusDone,
}: AchievementListProps) {
  return (
    <ol className="achievement-list">
      {achievements.map((achievement) => {
        const isConfirming = achievement.id === confirmingId
        return (
          <AchievementRow
            key={achievement.id}
            achievement={achievement}
            isAdmin={isAdmin}
            isConfirming={isConfirming}
            saveFailed={isConfirming && deleteFailed}
            shouldFocusTitle={achievement.id === focusId}
            onOpen={onOpen}
            onDelete={onDelete}
            onCancelDelete={onCancelDelete}
            onConfirmDelete={onConfirmDelete}
            onFocusDone={onFocusDone}
          />
        )
      })}
    </ol>
  )
}
