import { useModal } from '../../hooks/useModal.ts'
import type { Member } from '../../types.ts'
import '../achievements/AchievementModal.css' // 바탕·상자·닫기 줄은 성과 팝업 모양 그대로 (사이트 팝업이 한결같게)
import MemberCard from './MemberCard.tsx'
import './HiddenMemberModal.css'

type HiddenMemberModalProps = {
  member: Member // 보여 줄 숨은 부원 (data/members.ts의 HIDDEN_MEMBER·HONORARY_MEMBER)
  title: string // 위 줄 글자 = 팝업 이름 (예: "함께했던 부원", "명예 부원을 찾았어요")
  onClose: () => void // 닫아 달라 — 열고 닫는 상태는 연 쪽(Header·HeroArt)이 가짐
}

// 이스터에그 팝업 (P310–P311) — 헤더 로고를 2초 안에 5번 누르면 예전 부원 카드가 뜬다.
// P313–P314: 홈 물방울을 3번 누르면 명예 부원도 이 팝업으로 — 위 줄 글자만 title로 바꿔 씀.
// 카드는 부원 페이지의 MemberCard를 그대로, Esc·바깥·닫기·포커스 돌려놓기·스크롤 막기는 다른 팝업과 같은 useModal
export default function HiddenMemberModal({ member, title, onClose }: HiddenMemberModalProps) {
  const { dialogRef, closeButtonRef, backdropProps } = useModal(onClose)

  return (
    <div className="achievement-modal hidden-member-modal" {...backdropProps}>
      <div
        ref={dialogRef}
        className="achievement-modal__panel hidden-member-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hidden-member-title"
      >
        <div className="achievement-modal__top">
          <span id="hidden-member-title" className="achievement-modal__date">
            {title}
          </span>
          <button ref={closeButtonRef} type="button" className="achievement-modal__close" onClick={onClose}>
            닫기 ✕
          </button>
        </div>
        <MemberCard member={member} />
      </div>
    </div>
  )
}
