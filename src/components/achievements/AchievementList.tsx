import type { Achievement } from '../../types.ts'
import AchievementRow from './AchievementRow.tsx'
import './AchievementList.css'

type AchievementListProps = {
  achievements: Achievement[] // 보여 줄 성과들 — 정렬·검색은 부모(AchievementsPage)가 끝내서 넘긴다
  isAdmin: boolean // 관리 모드 — 켜지면 줄마다 "수정" 버튼 (B-4). 받은 그대로 줄에 넘긴다
  onOpen: (achievement: Achievement) => void // 줄을 누르면 "이 성과를 열어 줘" — 받은 그대로 줄에 넘긴다 (B-3)
}

// 성과 목록 (spec/02 B-1, design 5.4). 받은 순서대로 한 줄씩 그리기만 하고 상태·훅은 없다.
// 순서가 의미 있는 목록(최신순)이라 <ol>. key는 겹치지 않는 성과 번호 (저장소에서 겹침을 걸러 둠, P165)
export default function AchievementList({ achievements, isAdmin, onOpen }: AchievementListProps) {
  return (
    <ol className="achievement-list">
      {achievements.map((achievement) => (
        <AchievementRow key={achievement.id} achievement={achievement} isAdmin={isAdmin} onOpen={onOpen} />
      ))}
    </ol>
  )
}
