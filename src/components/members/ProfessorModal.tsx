import { useModal } from '../../hooks/useModal.ts'
import type { Professor, ProfessorPaper } from '../../types.ts'
import { countByGrade, papersByYear, telHref } from '../../utils/members.ts'
import '../achievements/AchievementModal.css' // 바탕·상자·닫기·정보 줄은 성과 팝업 모양 그대로 (사이트 팝업이 한결같게)
import './ProfessorModal.css'

type ProfessorModalProps = {
  professor: Professor // 이력을 보여 줄 교수
  onClose: () => void // 닫아 달라 — 열고 닫는 상태는 ProfessorCard가 가짐
}

// 지도교수 전체 이력 팝업 (spec/04 D-3, P251–P252). 카드에는 요약만, 전체는 여기서 (사용자 P249 "요약해서 몇개 보여주고 누르면 팝업").
// Esc·바깥·닫기 버튼, 뒤 화면 스크롤 막기, 닫으면 여는 버튼으로 포커스 돌려놓기는 성과 팝업과 같은 useModal 훅이 맡는다.
// 비어 있는 묶음은 통째로 숨김
export default function ProfessorModal({ professor, onClose }: ProfessorModalProps) {
  const { dialogRef, closeButtonRef, backdropProps } = useModal(onClose)
  const { name, title, researchField, email, phone, major, societies, education, careers, papers, activities } = professor
  const paperList = papers ?? []
  const grades = countByGrade(paperList)

  // 위쪽 정보 줄 — 비어 있는 줄은 뺌
  const rows = [
    { label: '전공', value: major ?? '' },
    { label: '연구 분야', value: researchField },
    { label: '소속학회', value: (societies ?? []).join(', ') },
  ].filter((row) => row.value.trim() !== '')

  return (
    <div className="achievement-modal" {...backdropProps}>
      <div
        ref={dialogRef}
        className="achievement-modal__panel professor-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="professor-modal-title"
      >
        {/* 닫기 줄 — 긴 목록을 스크롤해도 위에 붙어 있음(성과 팝업과 같은 sticky) */}
        <div className="achievement-modal__top">
          {title.trim() !== '' && <span className="achievement-modal__date">{title}</span>}
          <button ref={closeButtonRef} type="button" className="achievement-modal__close" onClick={onClose}>
            닫기 ✕
          </button>
        </div>

        <h2 id="professor-modal-title" className="professor-modal__name">
          {name}
        </h2>
        {paperList.length > 0 && (
          <p className="professor-modal__counts">
            논문 {paperList.length}편{grades.map(({ grade, count }) => ` · ${grade} ${count}`).join('')}
          </p>
        )}

        {(rows.length > 0 || phone || email.trim() !== '') && (
          <dl className="achievement-modal__info">
            {rows.map((row) => (
              <div key={row.label} className="achievement-modal__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
            {(phone || email.trim() !== '') && (
              <div className="achievement-modal__row">
                <dt>연락처</dt>
                <dd>
                  {phone && <a href={telHref(phone)}>{phone}</a>}
                  {phone && email.trim() !== '' && ' · '}
                  {email.trim() !== '' && <a href={`mailto:${email.trim()}`}>{email.trim()}</a>}
                </dd>
              </div>
            )}
          </dl>
        )}

        {education && education.length > 0 && (
          <section className="professor-modal__section" aria-labelledby="professor-education">
            <h3 id="professor-education" className="professor-modal__section-title">
              학력
            </h3>
            <ul className="professor-modal__list">
              {education.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        )}

        {careers && careers.length > 0 && (
          <section className="professor-modal__section" aria-labelledby="professor-careers">
            <h3 id="professor-careers" className="professor-modal__section-title">
              경력
            </h3>
            <ul className="professor-modal__list">
              {careers.map(({ place, position, period }) => (
                <li key={`${place}-${period}`}>
                  {place} · {position} <span className="professor-modal__muted">{period}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 논문 — 연도별로 묶고 줄마다 등급·역할 배지 (사용자 결정 ③) */}
        {paperList.length > 0 && (
          <section className="professor-modal__section" aria-labelledby="professor-papers">
            <h3 id="professor-papers" className="professor-modal__section-title">
              논문 {paperList.length}편
            </h3>
            {papersByYear(paperList).map((group) => (
              <div key={group.year}>
                <h4 className="professor-modal__year">{group.year}</h4>
                <ul className="professor-modal__list">
                  {group.papers.map((paper) => (
                    <PaperItem key={`${paper.date}-${paper.title}`} paper={paper} />
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {activities && activities.length > 0 && (
          <section className="professor-modal__section" aria-labelledby="professor-activities">
            <h3 id="professor-activities" className="professor-modal__section-title">
              학술활동
            </h3>
            <ul className="professor-modal__list">
              {activities.map((paper) => (
                <PaperItem key={`${paper.date}-${paper.title}`} paper={paper} />
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}

// 논문·학술활동 한 줄: 제목 / 학술지 · 날짜 + 등급·역할 배지 (빈 값은 숨김)
function PaperItem({ paper }: { paper: ProfessorPaper }) {
  const { title, venue, grade, role, date } = paper
  return (
    <li className="professor-modal__paper">
      <span className="professor-modal__paper-title">{title}</span>
      <span className="professor-modal__paper-meta">
        {venue.trim() !== '' && <span>{venue}</span>}
        <span>{date}</span>
        {grade.trim() !== '' && <span className="badge">{grade}</span>}
        {role.trim() !== '' && <span className="professor-modal__role">{role}</span>}
      </span>
    </li>
  )
}
