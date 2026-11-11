import { useState } from 'react'
import type { Achievement, Member } from '../../types.ts'
import { TYPE_LABELS } from '../../utils/achievements.ts'
import { memberInitial, periodLabel, positionLabel } from '../../utils/members.ts'
import ArrowIcon from '../common/ArrowIcon.tsx'
import MemberActivityModal from './MemberActivityModal.tsx'
import './MemberCard.css'

type MemberCardProps = {
  member: Member // 보여 줄 부원 한 명
  activities: Achievement[] // 이 부원이 저자로 들어간 실제 성과, 최신순 — MembersPage가 성과 목록에서 계산해 넘김 (D-4)
}

// 카드에 보여 줄 최근 활동 수 — 이보다 많으면 "활동 N건 모두 보기" (사용자 P253 "3개 넘기면 팝업")
const CARD_ACTIVITY_COUNT = 3

// 부원 카드 (spec/04 D-2 P246–P247 → D-4 P255–P256, design 5.6).
// 첫 글자 동그라미·이름·"예시" 배지·직위 이름표 / 연구 분야 / 최근 활동 / 기간·학교 이메일 — 비어 있는 칸은 숨긴다.
// 상태: isOpen(활동 팝업이 열렸는지) — 이 카드만 쓰는 값이라 카드 안에 둔다
export default function MemberCard({ member, activities }: MemberCardProps) {
  const { name, researchField, email, isSample } = member
  const position = positionLabel(member) // 졸업생은 "석사 졸업" 모양 (P242)
  const [isOpen, setIsOpen] = useState(false)
  const recent = activities.slice(0, CARD_ACTIVITY_COUNT)

  return (
    // 팝업은 카드(article) 밖 형제로 — 카드 안에 두면 카드의 글자 모양을 물려받음 (D-3에서 겪은 문제)
    <>
      <article className="member-card">
        <div className="member-card__top">
          {/* 동그라미 글자는 꾸밈이라 낭독기는 건너뜀 — 바로 옆에 이름이 있어서 */}
          <span className="member-card__initial" aria-hidden="true">
            {memberInitial(name)}
          </span>
          <div className="member-card__who">
            <div className="member-card__name-row">
              <h2 className="member-card__name">{name}</h2>
              {/* 지어낸 예시 부원 표시 (Q-D1) — 성과의 예시 배지와 같은 모양. 제목 밖에 둬서 제목은 이름만 읽힘 */}
              {isSample && <span className="badge badge--sample">예시</span>}
            </div>
            {position !== '' && <span className="member-card__position">{position}</span>}
          </div>
        </div>

        {researchField.trim() !== '' && <p className="member-card__field">{researchField}</p>}

        {/* 최근 활동 (D-4) — 성과에서 자동으로 모은 것. 0건이면 묶음째 숨김 */}
        {recent.length > 0 && (
          <div className="member-card__activities">
            <p className="member-card__activities-title">최근 활동</p>
            <ul className="member-card__activity-list">
              {recent.map((achievement) => (
                <li key={achievement.id} className="member-card__activity">
                  <span className="badge">{TYPE_LABELS[achievement.type]}</span>
                  <span className="member-card__activity-title">{achievement.title}</span>
                </li>
              ))}
            </ul>
            {activities.length > CARD_ACTIVITY_COUNT && (
              <button type="button" className="member-card__more" onClick={() => setIsOpen(true)}>
                활동 {activities.length}건 모두 보기
                <ArrowIcon />
              </button>
            )}
          </div>
        )}

        <div className="member-card__bottom">
          <span className="member-card__period">{periodLabel(member)}</span>
          {/* 학교 이메일 — 누르면 메일 쓰기 창 (AC-15-2). 비면 숨김 */}
          {email.trim() !== '' && (
            <a className="member-card__email" href={`mailto:${email.trim()}`}>
              {email.trim()}
            </a>
          )}
        </div>
      </article>

      {/* 활동 전체 팝업 — 닫으면 useModal이 "활동 N건 모두 보기" 버튼으로 포커스를 돌려놓음 */}
      {isOpen && <MemberActivityModal member={member} activities={activities} onClose={() => setIsOpen(false)} />}
    </>
  )
}
