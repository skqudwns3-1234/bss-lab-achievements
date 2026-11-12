import { useState } from 'react'
import type { Member } from '../../types.ts'
import { memberInitial, periodLabel, positionLabel } from '../../utils/members.ts'
import './MemberCard.css'

type MemberCardProps = {
  member: Member // 보여 줄 부원 한 명
}

// 부원 카드 (spec/04 D-2 P246–P247 → D-4 P255–P256 → P289 → P306 → P308, design 5.6).
// 동그라미(그림 또는 첫 글자)·이름·"예시" 배지·직위 이름표 / 연구 분야 / 기간·학교 이메일 — 비어 있는 칸은 숨긴다.
// P306: "참여 성과 N건 보기"와 그 팝업을 뺌 (사용자 결정)
// 상태: photoFailed(그림을 못 불러왔는지, P308) — 이 카드만 쓰는 값이라 카드 안에 둔다 (교수 카드와 같은 방식)
export default function MemberCard({ member }: MemberCardProps) {
  const { name, researchField, email, isSample, photoUrl, photoScale, contactNote } = member
  const position = positionLabel(member) // 졸업생은 "석사 졸업" 모양 (P242)
  const [photoFailed, setPhotoFailed] = useState(false)
  const showPhoto = photoUrl !== undefined && photoUrl.trim() !== '' && !photoFailed

  return (
    <article className="member-card">
      <div className="member-card__top">
        {/* 동그라미는 꾸밈이라 낭독기는 건너뜀 — 바로 옆에 이름이 있어서.
            그림이 있으면 그림(P307–P308), 없거나 못 불러오면(onError) 첫 글자 */}
        <span className={`member-card__initial ${showPhoto ? 'member-card__initial--photo' : ''}`} aria-hidden="true">
          {showPhoto ? (
            <img
              className="member-card__photo"
              src={photoUrl}
              alt=""
              // 둘레 여백이 많은 그림은 키워서 동그라미를 채움 (기본 1배)
              style={photoScale ? { transform: `scale(${photoScale})` } : undefined}
              onError={() => setPhotoFailed(true)}
            />
          ) : (
            memberInitial(name)
          )}
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
        {/* 학교 이메일 — 누르면 메일 쓰기 창 (AC-15-2). 비었으면 대신 보일 글자(contactNote, 예: "비밀" P313), 그것도 없으면 숨김 */}
        {email.trim() !== '' ? (
          <a className="member-card__email" href={`mailto:${email.trim()}`}>
            {email.trim()}
          </a>
        ) : (
          contactNote &&
          contactNote.trim() !== '' && <span className="member-card__email member-card__note">{contactNote.trim()}</span>
        )}
      </div>
    </article>
  )
}
