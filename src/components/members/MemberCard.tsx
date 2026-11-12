import { useState } from 'react'
import type { Achievement, Member } from '../../types.ts'
import { memberInitial, periodLabel, positionLabel } from '../../utils/members.ts'
import ArrowIcon from '../common/ArrowIcon.tsx'
import MemberActivityModal from './MemberActivityModal.tsx'
import './MemberCard.css'

type MemberCardProps = {
  member: Member // 보여 줄 부원 한 명
  activities: Achievement[] // 이 부원이 저자로 들어간 실제 성과, 최신순 — MembersPage가 성과 목록에서 계산해 넘김 (D-4)
}

// 부원 카드 (spec/04 D-2 P246–P247 → D-4 P255–P256 → P289, design 5.6).
// 첫 글자 동그라미·이름·"예시" 배지·직위 이름표 / 연구 분야 / "참여 성과 N건 보기" / 기간·학교 이메일 — 비어 있는 칸은 숨긴다.
// 상태: isOpen(활동 팝업이 열렸는지) — 이 카드만 쓰는 값이라 카드 안에 둔다
export default function MemberCard({ member, activities }: MemberCardProps) {
  const { name, researchField, email, isSample } = member
  const position = positionLabel(member) // 졸업생은 "석사 졸업" 모양 (P242)
  const [isOpen, setIsOpen] = useState(false)

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
              <h3 className="member-card__name">{name}</h3>
              {/* 지어낸 예시 부원 표시 (Q-D1) — 성과의 예시 배지와 같은 모양. 제목 밖에 둬서 제목은 이름만 읽힘 */}
              {isSample && <span className="badge badge--sample">예시</span>}
            </div>
            {position !== '' && <span className="member-card__position">{position}</span>}
          </div>
        </div>

        {researchField.trim() !== '' && <p className="member-card__field">{researchField}</p>}

        {/* 참여 성과 (D-4 → P289 B안) — 성과에서 자동으로 모은 것. 카드에는 목록 대신 한 줄만, 누르면 전체 팝업.
            부원들이 같은 성과를 함께 해서 세 카드에 같은 목록이 반복되던 것을 없앰 (사용자 P288–P289). 0건이면 숨김 */}
        {activities.length > 0 && (
          <button type="button" className="member-card__more" onClick={() => setIsOpen(true)}>
            참여 성과 {activities.length}건 보기
            <ArrowIcon />
          </button>
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

      {/* 참여 성과 전체 팝업 — 닫으면 useModal이 "참여 성과 N건 보기" 버튼으로 포커스를 돌려놓음 */}
      {isOpen && <MemberActivityModal member={member} activities={activities} onClose={() => setIsOpen(false)} />}
    </>
  )
}
