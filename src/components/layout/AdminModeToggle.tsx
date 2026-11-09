import { useAdminMode } from '../../context/useAdminMode.ts'

// 관리 모드 스위치 (spec/02 B-4, design 5.2, 시안 헤더 오른쪽 알약). 넓은 화면은 메뉴 오른쪽, 휴대폰은 펼친 메뉴 맨 아래 (D1).
// 상태는 갖지 않고 상자(useAdminMode)의 값을 보여 주기만 한다. 누르면 반대로 바꾸고 저장까지는 상자가 한다.
// aria-pressed — 화면 낭독기가 "관리 모드, 토글 버튼, 눌림/안 눌림"으로 켜짐을 읽음 (유형 칩과 같은 방식)
export default function AdminModeToggle() {
  const { isAdmin, setAdmin } = useAdminMode()

  return (
    <button
      type="button"
      className={`admin-toggle${isAdmin ? ' admin-toggle--on' : ''}`}
      aria-pressed={isAdmin}
      onClick={() => setAdmin(!isAdmin)}
    >
      관리 모드
      {/* 동그라미가 왼쪽 = 꺼짐, 오른쪽 + 검정 = 켜짐. 보이기만 하는 그림이라 낭독기에는 숨김 */}
      <span className="admin-toggle__switch" aria-hidden="true">
        <span className="admin-toggle__knob" />
      </span>
    </button>
  )
}
