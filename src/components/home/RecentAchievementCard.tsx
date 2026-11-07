import type { Achievement } from '../../types.ts'
import { TYPE_LABELS, formatDate } from '../../utils/achievements.ts'
import ArrowIcon from '../common/ArrowIcon.tsx'

type RecentAchievementCardProps = {
  achievement: Achievement // 보여 줄 성과 하나
  onOpen: (achievement: Achievement) => void // 카드를 누르면 "이 성과를 열어 줘" 신호 — 팝업은 1-9에서 HomePage가 연결
}

// 홈 ③ 최근 성과 카드 1장 (spec/01 1-5, design 5절, P180). 받는 값만 그리고 상태·훅은 없다.
// 카드 전체가 하나의 버튼 — 휴대폰 2×2에서도 누르기 쉽게 (P180 AI 추천 채택).
// 제목 4줄·저자 1줄·학회 1줄에서 …로 잘라 카드 높이를 맞춘다 (CSS line-clamp). 잘린 내용은 1-9 팝업에서 전부 보여 준다
export default function RecentAchievementCard({ achievement, onOpen }: RecentAchievementCardProps) {
  const { type, title, achievedOn, authors, venue, isSample } = achievement

  return (
    <button type="button" className="recent-card" onClick={() => onOpen(achievement)}>
      <span className="recent-card__top">
        <span className="recent-card__badges">
          <span className="badge">{TYPE_LABELS[type]}</span>
          {/* 지어낸 예시 성과 표시 (BR-19) */}
          {isSample && <span className="badge badge--sample">예시</span>}
        </span>
        <span className="recent-card__date">{formatDate(achievedOn)}</span>
      </span>
      <span className="recent-card__title">{title}</span>
      {/* 저자·학회가 비어 있어도 줄은 남겨 카드 높이를 맞춘다 */}
      <span className="recent-card__meta">{authors}</span>
      <span className="recent-card__meta">{venue}</span>
      <span className="recent-card__more">
        자세히
        <ArrowIcon />
      </span>
    </button>
  )
}
