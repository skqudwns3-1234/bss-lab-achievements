import { useEffect, useState } from 'react'
import type { Recruitment } from '../../types.ts'
import { formatDate } from '../../utils/achievements.ts'
import { getRecruitStatus, todayYmd } from '../../utils/recruitment.ts'
import ArrowIcon from '../common/ArrowIcon.tsx'
import ImageModal from '../common/ImageModal.tsx'

type RecruitBoxProps = {
  recruitment: Recruitment // 모집 정보 (lab.ts의 recruitment)
}

// 홈 ④ 지원 안내 (spec/01_home 1-4). 보일지 말지는 lab.ts의 recruitment.isOpen이 정한다 (HomePage에서 확인).
// 왼쪽: 모집 중·마감일, 제목, 지원 자격, "지원서 작성" 버튼 / 오른쪽: 포스터 (누르면 크게)
export default function RecruitBox({ recruitment }: RecruitBoxProps) {
  const { title, qualifications, posterUrl } = recruitment

  // 마감 여부·보일 마감일·지원서 링크를 한곳에서 판단 (푸터와 같은 함수, P170)
  const status = getRecruitStatus(recruitment, todayYmd())

  // 포스터 팝업이 열려 있는지 — 바뀌면 팝업을 그리거나 지워야 해서 상태로 둔다
  const [posterOpen, setPosterOpen] = useState(false)
  // 포스터 그림을 못 불러왔는지(파일이 없거나 이름이 틀림) — 그러면 깨진 그림 대신 포스터 칸을 숨긴다 (EX-22, P170)
  const [posterFailed, setPosterFailed] = useState(false)
  const posterAlt = `${title} 포스터`

  // lab.ts 값이 이상하면(마감일 형식, 편집용 링크 등) 개발자 도구에 경고를 남긴다.
  // 콘솔은 화면 밖이라 useEffect에서 — 경고 내용이 바뀔 때만 다시 남긴다
  const problemText = status.problems.join('\n')
  useEffect(() => {
    if (problemText) console.warn(`[지원 안내] lab.ts 확인 필요\n${problemText}`)
  }, [problemText])

  return (
    <div className="recruit">
      <div className="recruit__body">
        <p className="recruit__status">
          {/* 마감일이 지나면 "모집 마감" (EX-19) */}
          <span className={`recruit__badge ${status.closed ? 'recruit__badge--closed' : ''}`}>
            {status.closed ? '모집 마감' : '모집 중'}
          </span>
          {/* 마감일 형식이 틀리면 숨김 (EX-20) */}
          {status.deadline && <span className="recruit__deadline">~ {formatDate(status.deadline)} 마감</span>}
        </p>

        <h2 id="home-recruit-title" className="recruit__title">
          {title}
        </h2>

        {/* 지원 자격이 0개면 제목까지 숨김 (EX-14) */}
        {qualifications.length > 0 && (
          <div className="recruit__group">
            <h3 className="recruit__group-title">지원 자격</h3>
            <ul className="recruit__list">
              {/* key에 순서를 붙여 같은 문구가 두 번 있어도 겹치지 않게 (P170) */}
              {qualifications.map((item, index) => (
                <li key={`${index}-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 링크가 비었거나(EX-15) 편집용·https 아님(EX-21)이거나 마감됐으면(EX-19) 버튼을 숨김.
            새 탭으로 열고, 열린 페이지가 이 사이트를 건드리지 못하게 rel */}
        {status.applyUrl && (
          <a
            className="btn btn--primary btn--large recruit__apply"
            href={status.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            지원서 작성
            <ArrowIcon size={18} />
          </a>
        )}
      </div>

      {/* 포스터가 없거나(EX-18) 못 불러오면(EX-22) 칸을 숨김. 누르면 팝업으로 크게 */}
      {posterUrl && !posterFailed && (
        <button
          type="button"
          className="recruit__poster"
          onClick={() => setPosterOpen(true)}
          aria-label={`${posterAlt} 크게 보기`}
        >
          <img src={posterUrl} alt="" onError={() => setPosterFailed(true)} />
          <span className="recruit__poster-hint">눌러서 크게 보기</span>
        </button>
      )}

      {posterOpen && !posterFailed && (
        <ImageModal src={posterUrl} alt={posterAlt} onClose={() => setPosterOpen(false)} />
      )}
    </div>
  )
}
