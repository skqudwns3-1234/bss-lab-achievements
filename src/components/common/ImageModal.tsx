import { useModal } from '../../hooks/useModal.ts'
import './ImageModal.css'

type ImageModalProps = {
  src: string // 크게 보여 줄 그림 주소
  alt: string // 그림 설명 (화면 낭독기용)
  onClose: () => void // 닫을 때 부르는 함수 — 열고 닫는 상태는 부모가 가진다
}

// 그림 하나를 화면 가득 크게 보여 주는 팝업 (1-4 모집 포스터, P133).
// 닫는 방법 3가지: X 버튼, 바깥(어두운 배경) 누르기, Esc 키.
// Esc·스크롤 막기·포커스(열면 닫기 버튼, 닫으면 포스터 버튼으로)·Tab 가두기는 공통 훅 useModal이 맡는다 (1-9, P183)
export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  const { dialogRef, closeButtonRef, backdropProps } = useModal(onClose)

  return (
    // 바깥(어두운 배경)을 누르면 닫힘. 안쪽 그림을 누를 때는 닫히지 않음 (useModal의 backdropProps)
    <div
      ref={dialogRef}
      className="image-modal"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      {...backdropProps}
    >
      <button ref={closeButtonRef} type="button" className="image-modal__close" onClick={onClose}>
        닫기 ✕
      </button>
      <img className="image-modal__image" src={src} alt={alt} />
    </div>
  )
}
