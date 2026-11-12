import type { Member } from '../../types.ts'
import { memberInitial, periodLabel, positionLabel } from '../../utils/members.ts'
import './MemberCard.css'

type MemberCardProps = {
  member: Member // 보여 줄 부원 한 명
}

// 부원 카드 (spec/04 D-2 P246–P247 → D-4 P255–P256 → P289 → P306, design 5.6).
// 첫 글자 동그라미·이름·"예시" 배지·직위 이름표 / 연구 분야 / 기간·학교 이메일 — 비어 있는 칸은 숨긴다.
// P306: "참여 성과 N건 보기"와 그 팝업을 뺌 (사용자 결정) — 그래서 상태 없이 받은 부원만 그리는 카드
export default function MemberCard({ member }: MemberCardProps) {
  const { name, researchField, email, isSample } = member
  const position = positionLabel(member) // 졸업생은 "석사 졸업" 모양 (P242)

  return (
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
  )
}
