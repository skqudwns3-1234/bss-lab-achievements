import { useEffect, useRef, type PointerEvent, type MouseEvent } from 'react'

// 팝업 공통 동작을 묶은 커스텀 훅 (spec/01 1-9, P182–P183).
// 성과 팝업(AchievementModal)과 포스터 팝업(ImageModal)이 같이 쓴다. 앞으로 만들 삭제 확인 상자도 이 훅을 쓴다.
// - Esc로 닫기, 열린 동안 뒤 화면 스크롤 막기, 열리면 닫기 버튼에 포커스
// - 닫으면 팝업을 연 곳(누른 카드·버튼)으로 포커스를 돌려줌, Tab이 팝업 밖으로 나가지 않게 가둠
// - 바깥(어두운 배경)을 "누를 때와 뗄 때 모두" 바깥이었을 때만 닫음 — 안에서 글자를 드래그하다 바깥에서 떼도 안 닫힘
// 커스텀 훅 = 이름이 use로 시작하는 일반 함수. 안에서는 수업에서 배운 useEffect·useRef만 쓴다

// 팝업 안에서 Tab으로 갈 수 있는 것들
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Tab 가두기: 마지막에서 Tab → 첫 번째로, 첫 번째에서 Shift+Tab → 마지막으로. 팝업 밖에 있으면 첫 번째로
function keepFocusInside(event: KeyboardEvent, container: HTMLElement | null) {
  if (!container) return
  const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
  if (items.length === 0) {
    event.preventDefault()
    return
  }
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  if (!container.contains(active)) {
    event.preventDefault()
    first.focus()
  } else if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

export function useModal(onClose: () => void) {
  // Tab을 가둘 범위(팝업 상자)와 처음 포커스할 닫기 버튼 — DOM 요소를 붙잡아 두려고 useRef
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  // 최신 onClose — 부모가 그릴 때마다 새 함수를 줘도 아래 effect를 다시 돌리지 않으려고 ref에 둔다
  // (다시 돌면 포커스가 닫기 버튼으로 튀고 스크롤 막기도 풀렸다 걸림 — 05 메모의 포스터 팝업 문제)
  const onCloseRef = useRef(onClose)
  // 바깥을 눌렀을 때 누른 곳이 바깥이었는지 — 다시 그릴 필요 없는 값이라 ref
  const pressedOnBackdrop = useRef(false)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  // 팝업이 떠 있는 동안만: 키보드 감시·스크롤 막기. 사라질 때 cleanup에서 전부 원래대로 (화면 밖 일이라 useEffect)
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCloseRef.current()
      else if (event.key === 'Tab') keepFocusInside(event, dialogRef.current)
    }
    document.addEventListener('keydown', handleKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      // 연 곳으로 포커스 — 그 사이 그 요소가 사라졌으면(다른 탭에서 삭제 등) 조용히 건너뜀
      if (opener?.isConnected) opener.focus()
    }
  }, [])

  // 바깥(어두운 배경) 요소에 펼쳐 넣는 이벤트 — 누를 때와 뗄 때 모두 바깥이었을 때만 닫는다
  const backdropProps = {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      pressedOnBackdrop.current = event.target === event.currentTarget
    },
    onClick: (event: MouseEvent<HTMLElement>) => {
      // 더블클릭의 두 번째 클릭(event.detail = 연달아 누른 횟수 2 이상)은 무시 — 카드·줄을 더블클릭하면
      // 첫 클릭에 팝업이 열리고 두 번째 클릭이 바로 이 바깥에 닿아 닫혀 버렸다 (spec/02 점검 ①, P216–P217)
      if (event.detail > 1) return
      if (pressedOnBackdrop.current && event.target === event.currentTarget) onCloseRef.current()
      pressedOnBackdrop.current = false
    },
  }

  return { dialogRef, closeButtonRef, backdropProps }
}
