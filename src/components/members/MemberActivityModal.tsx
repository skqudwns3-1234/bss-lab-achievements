import { useModal } from '../../hooks/useModal.ts'
import type { Achievement, Member } from '../../types.ts'
import { TYPE_LABELS, formatDate } from '../../utils/achievements.ts'
import { positionLabel } from '../../utils/members.ts'
import '../achievements/AchievementModal.css' // 바탕·상자·닫기 줄은 성과 팝업 모양 그대로 (사이트 팝업이 한결같게)
import './MemberActivityModal.css'

type MemberActivityModalProps = {
  member: Member // 활동을 보여 줄 부원
  activities: Achievement[] // 그 부원의 활동 (achievementsOf 결과 — 실제 성과·최신순)
  onClose: () => void // 닫아 달라 — 열고 닫는 상태는 MemberCard가 가짐
}

// 부원 활동 전체 팝업 (spec/04 D-4, P255–P256). 카드에는 최근 3개만, 4건 이상이면 여기서 전부.
// 줄은 눌러도 아무 일 없는 목록 (사용자 결정 ② — 팝업 위 팝업은 닫기·포커스가 복잡해서).
// Esc·바깥·닫기 버튼, 뒤 화면 스크롤 막기, 닫으면 여는 버튼으로 포커스는 useModal 훅이 맡는다
export default function MemberActivityModal({ member, activities, onClose }: MemberActivityModalProps) {
  const { dialogRef, closeButtonRef, backdropProps } = useModal(onClose)
  const position = positionLabel(member)

  return (
    <div className="achievement-modal" {...backdropProps}>
      <div
        ref={dialogRef}
        className="achievement-modal__panel member-activity-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-activity-title"
      >
        <div className="achievement-modal__top">
          {position !== '' && <span className="achievement-modal__date">{position}</span>}
          <button ref={closeButtonRef} type="button" className="achievement-modal__close" onClick={onClose}>
            닫기 ✕
          </button>
        </div>

        <h2 id="member-activity-title" className="member-activity-modal__name">
          {member.name}
        </h2>
        <p className="member-activity-modal__count">활동 {activities.length}건</p>

        <ul className="member-activity-modal__list">
          {activities.map((achievement) => (
            <li key={achievement.id} className="member-activity-modal__item">
              <span className="member-activity-modal__meta">
                <span className="badge">{TYPE_LABELS[achievement.type]}</span>
                <span>{formatDate(achievement.achievedOn)}</span>
                {achievement.venue.trim() !== '' && <span>{achievement.venue}</span>}
              </span>
              <span className="member-activity-modal__title">{achievement.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
