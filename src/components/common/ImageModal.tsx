import { useEffect, useRef } from 'react'
import './ImageModal.css'

type ImageModalProps = {
  src: string // 크게 보여 줄 그림 주소
  alt: string // 그림 설명 (화면 낭독기용)
  onClose: () => void // 닫을 때 부르는 함수 — 열고 닫는 상태는 부모가 가진다
}

// 그림 하나를 화면 가득 크게 보여 주는 팝업 (1-4 모집 포스터, P133).
// 닫는 방법 3가지: X 버튼, 바깥(어두운 배경) 누르기, Esc 키
export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  // 팝업이 열리면 닫기 버튼에 포커스 — 키보드 사용자가 바로 닫을 수 있게
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // 팝업이 떠 있는 동안: Esc 키로 닫기 + 뒤 화면 스크롤 막기.
  // 키보드·문서(body)는 React 화면 밖이라 useEffect에서 연결하고,
  // 팝업이 사라질 때 return의 정리 함수(cleanup)로 원래대로 되돌린다.
  useEffect(() => {
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    // 바깥(어두운 배경)을 누르면 닫힘. 안쪽 그림을 누를 때는 닫히지 않게 currentTarget과 비교
    <div
      className="image-modal"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <button ref={closeButtonRef} type="button" className="image-modal__close" onClick={onClose}>
        닫기 ✕
      </button>
      <img className="image-modal__image" src={src} alt={alt} />
    </div>
  )
}
