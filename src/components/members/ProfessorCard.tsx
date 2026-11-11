import type { Professor } from '../../types.ts'
import { memberInitial } from '../../utils/members.ts'
import './ProfessorCard.css'

type ProfessorCardProps = {
  professor: Professor // 보여 줄 담당 교수 한 명
}

// 지도교수 카드 (spec/04 D-2, P246–P247) — 부원 탭과 상관없이 페이지 맨 위에 따로, 크게 (P240·P242).
// 받은 값만 그리고 상태·훅은 없다. 연구 분야·이메일이 비면 그 줄을 숨김 (지금은 둘 다 빈칸 — 사용자가 나중에 채움, P244–P245)
export default function ProfessorCard({ professor }: ProfessorCardProps) {
  const { name, title, researchField, email, isSample } = professor

  return (
    <article className="professor-card">
      <span className="professor-card__initial" aria-hidden="true">
        {memberInitial(name)}
      </span>
      <div className="professor-card__body">
        <div className="professor-card__title-row">
          {title.trim() !== '' && <span className="professor-card__title">{title}</span>}
          {isSample && <span className="badge badge--sample">예시</span>}
        </div>
        <h2 className="professor-card__name">{name}</h2>
        {researchField.trim() !== '' && <p className="professor-card__field">{researchField}</p>}
        {email.trim() !== '' && (
          <a className="professor-card__email" href={`mailto:${email.trim()}`}>
            {email.trim()}
          </a>
        )}
      </div>
    </article>
  )
}
