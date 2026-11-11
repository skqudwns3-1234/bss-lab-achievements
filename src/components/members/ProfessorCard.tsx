import { useState } from 'react'
import type { Professor } from '../../types.ts'
import { memberInitial, recentPapers, telHref } from '../../utils/members.ts'
import ArrowIcon from '../common/ArrowIcon.tsx'
import ProfessorModal from './ProfessorModal.tsx'
import './ProfessorCard.css'

type ProfessorCardProps = {
  professor: Professor // 보여 줄 담당 교수 한 명
}

// 지도교수 카드 (spec/04 D-2 P246–P247 → D-3 P251–P252) — 부원 탭과 상관없이 페이지 맨 위에 따로, 크게.
// D-3: 사진 + 요약 몇 개(학력 한 줄·최근 논문 3편) + 전화 + "전체 이력 보기" → 팝업 (사용자 P249 제안).
// 상태: photoFailed(사진을 못 불러왔는지) / isOpen(팝업이 열렸는지) — 이 카드만 쓰는 값이라 카드 안에 둔다.
// 칸이 비어 있으면 그 줄을 숨기고, 이력이 하나도 없으면 D-2 모양 그대로
export default function ProfessorCard({ professor }: ProfessorCardProps) {
  const { name, title, researchField, email, isSample, photoUrl, phone, education, papers } = professor
  const [photoFailed, setPhotoFailed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const paperList = papers ?? []
  const recent = recentPapers(paperList, 3) // 카드 요약 3편 (사용자 결정 ②)
  const educationLine = education?.[0] ?? ''
  // 팝업에 더 볼 것이 있을 때만 버튼
  const hasProfile =
    paperList.length > 0 ||
    (education?.length ?? 0) > 0 ||
    (professor.careers?.length ?? 0) > 0 ||
    (professor.activities?.length ?? 0) > 0 ||
    (professor.societies?.length ?? 0) > 0 ||
    (professor.major ?? '') !== ''
  const showPhoto = photoUrl !== undefined && photoUrl !== '' && !photoFailed

  return (
    // 팝업은 카드(article) 밖 형제로 — 안에 두면 검정 카드의 흰 글자색을 물려받아 팝업 글자가 안 보였음 (D-3 확인 중 발견, P252)
    <>
      <article className="professor-card">
        {/* 사진 — 증명사진 비율 둥근 네모(사용자 결정 ⑤, 사진이 4:5라 4:5). 못 불러오면(onError) 첫 글자 동그라미로
          (홈 모집 포스터와 같은 방식) */}
        {showPhoto ? (
          <img
            className="professor-card__photo"
            src={photoUrl}
            alt={`${name} ${title} 사진`}
            width={128}
            height={160}
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <span className="professor-card__initial" aria-hidden="true">
            {memberInitial(name)}
          </span>
        )}

        <div className="professor-card__body">
          <div className="professor-card__title-row">
            {title.trim() !== '' && <span className="professor-card__title">{title}</span>}
            {isSample && <span className="badge badge--sample">예시</span>}
          </div>
          <h3 className="professor-card__name">{name}</h3>
          {researchField.trim() !== '' && <p className="professor-card__field">{researchField}</p>}

          {/* 요약 — 학력 한 줄 + 최근 논문 3편(제목은 두 줄까지, 전체는 팝업) */}
          {educationLine !== '' && <p className="professor-card__education">{educationLine}</p>}
          {recent.length > 0 && (
            <div className="professor-card__recent">
              <p className="professor-card__recent-title">최근 논문</p>
              <ul className="professor-card__papers">
                {recent.map((paper) => (
                  <li key={`${paper.date}-${paper.title}`} className="professor-card__paper">
                    <span className="professor-card__paper-title">{paper.title}</span>
                    <span className="professor-card__paper-date">{paper.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 연락처 — 전화(tel:, 휴대폰에서 누르면 전화)·학교 이메일(mailto:). 카드에도 전화 (사용자 결정 ④ P251) */}
          {(phone || email.trim() !== '') && (
            <div className="professor-card__contacts">
              {phone && (
                <a className="professor-card__link" href={telHref(phone)}>
                  {phone}
                </a>
              )}
              {email.trim() !== '' && (
                <a className="professor-card__link" href={`mailto:${email.trim()}`}>
                  {email.trim()}
                </a>
              )}
            </div>
          )}

          {hasProfile && (
            <button type="button" className="professor-card__more" onClick={() => setIsOpen(true)}>
              전체 이력 보기
              {paperList.length > 0 && ` (논문 ${paperList.length}편)`}
              <ArrowIcon />
            </button>
          )}
        </div>
      </article>

      {/* 전체 이력 팝업 — 닫으면 useModal이 "전체 이력 보기" 버튼으로 포커스를 돌려놓음 */}
      {isOpen && <ProfessorModal professor={professor} onClose={() => setIsOpen(false)} />}
    </>
  )
}
