import { useState } from 'react'
import type { Recruitment } from '../../types.ts'
import { formatDate } from '../../utils/achievements.ts'
import ArrowIcon from '../common/ArrowIcon.tsx'
import ImageModal from '../common/ImageModal.tsx'

type RecruitBoxProps = {
  recruitment: Recruitment // 모집 정보 (lab.ts의 recruitment)
}

// 홈 ④ 지원 안내 (spec/01_home 1-4). 보일지 말지는 lab.ts의 recruitment.isOpen이 정한다 (HomePage에서 확인).
// 왼쪽: 모집 중·마감일, 제목, 지원 자격, "지원서 작성" 버튼 / 오른쪽: 포스터 (누르면 크게)
export default function RecruitBox({ recruitment }: RecruitBoxProps) {
  const { endDate, title, qualifications, posterUrl, formUrl } = recruitment

  // 포스터 팝업이 열려 있는지 — 바뀌면 팝업을 그리거나 지워야 해서 상태로 둔다
  const [posterOpen, setPosterOpen] = useState(false)
  const posterAlt = `${title} 포스터`

  return (
    <div className="recruit">
      <div className="recruit__body">
        <p className="recruit__status">
          <span className="recruit__badge">모집 중</span>
          <span className="recruit__deadline">~ {formatDate(endDate)} 마감</span>
        </p>

        <h2 id="home-recruit-title" className="recruit__title">
          {title}
        </h2>

        {/* 지원 자격이 0개면 제목까지 숨김 (EX-14) */}
        {qualifications.length > 0 && (
          <div className="recruit__group">
            <h3 className="recruit__group-title">지원 자격</h3>
            <ul className="recruit__list">
              {qualifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 폼 링크가 비면 버튼을 숨김 (EX-15). 새 탭으로 열고, 열린 페이지가 이 사이트를 건드리지 못하게 rel */}
        {formUrl && (
          <a
            className="btn btn--primary btn--large recruit__apply"
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            지원서 작성
            <ArrowIcon size={18} />
          </a>
        )}
      </div>

      {/* 포스터가 없으면 칸을 숨김 (EX-18). 누르면 팝업으로 크게 */}
      {posterUrl && (
        <button
          type="button"
          className="recruit__poster"
          onClick={() => setPosterOpen(true)}
          aria-label={`${posterAlt} 크게 보기`}
        >
          <img src={posterUrl} alt="" />
          <span className="recruit__poster-hint">눌러서 크게 보기</span>
        </button>
      )}

      {posterOpen && (
        <ImageModal src={posterUrl} alt={posterAlt} onClose={() => setPosterOpen(false)} />
      )}
    </div>
  )
}
