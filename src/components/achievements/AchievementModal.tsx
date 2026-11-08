import type { Achievement } from '../../types.ts'
import { useModal } from '../../hooks/useModal.ts'
import { TYPE_LABELS, formatDate } from '../../utils/achievements.ts'
import { doiUrl, safeLink } from '../../utils/links.ts'
import ArrowIcon from '../common/ArrowIcon.tsx'
import './AchievementModal.css'

type AchievementModalProps = {
  achievement: Achievement // 보여 줄 성과 하나
  onClose: () => void // 닫을 때 부르는 함수 — 열고 닫는 상태는 부모(HomePage·성과 목록)가 가진다
}

// 성과 하나의 자세히 보기 팝업 (spec/01 1-9, FR-08, P182–P183). 홈 카드와 성과 목록(02)에서 같이 쓴다.
// 카드에서 잘린 전체 제목과 저자·지도교수·학회, DOI·원문 링크를 보여 준다. 빈 칸은 줄째 숨김.
// Esc·바깥·닫기 버튼, 스크롤 막기, 포커스 처리는 useModal 훅이 맡는다
export default function AchievementModal({ achievement, onClose }: AchievementModalProps) {
  const { dialogRef, closeButtonRef, backdropProps } = useModal(onClose)
  const { type, title, achievedOn, authors, advisors, venue, doi, link, isSample } = achievement

  // 링크는 http(s)일 때만, DOI는 doi.org 주소로 (안전하지 않거나 비어 있으면 null → 숨김)
  const original = safeLink(link)
  const doiLink = doiUrl(doi)
  const rows = [
    { label: '저자', value: authors },
    { label: '지도교수', value: advisors },
    { label: '학회·대회', value: venue },
  ].filter((row) => row.value.trim() !== '')

  return (
    // 바깥(어두운 배경) — 누를 때와 뗄 때 모두 바깥이면 닫힘
    <div className="achievement-modal" {...backdropProps}>
      <div
        ref={dialogRef}
        className="achievement-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievement-modal-title"
      >
        <div className="achievement-modal__top">
          <span className="achievement-modal__badges">
            <span className="badge">{TYPE_LABELS[type]}</span>
            {isSample && <span className="badge badge--sample">예시</span>}
          </span>
          <span className="achievement-modal__date">{formatDate(achievedOn)}</span>
          <button ref={closeButtonRef} type="button" className="achievement-modal__close" onClick={onClose}>
            닫기 ✕
          </button>
        </div>

        <h2 id="achievement-modal-title" className="achievement-modal__title">
          {title}
        </h2>

        {(rows.length > 0 || doiLink) && (
          <dl className="achievement-modal__info">
            {rows.map((row) => (
              <div key={row.label} className="achievement-modal__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
            {doiLink && (
              <div className="achievement-modal__row">
                <dt>DOI</dt>
                <dd>
                  {/* 화면에는 DOI 번호만 (주소째 붙여 넣었어도 "10.…"으로) */}
                  <a href={doiLink} target="_blank" rel="noopener noreferrer">
                    {decodeURI(doiLink.replace('https://doi.org/', ''))}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        )}

        {/* 원문 링크가 http(s)일 때만 (체크리스트 — javascript: 같은 주소 막기) */}
        {original && (
          <div className="achievement-modal__actions">
            <a className="btn btn--primary" href={original} target="_blank" rel="noopener noreferrer">
              원문 보기
              <ArrowIcon />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
