import type { ResearchArea } from '../../types.ts'
import { padCount } from '../../utils/achievements.ts'

type ResearchAreaListProps = {
  areas: ResearchArea[] // 보여 줄 연구 분야들 (lab.ts의 researchAreas)
}

// 홈 ② 연구 분야 칸들 (spec/01_home 1-3, design.md 5.2).
// 받은 배열만큼 칸을 그리고 순서대로 01, 02 … 번호를 붙인다 — 개수는 고정하지 않음 (BR-17, H5)
export default function ResearchAreaList({ areas }: ResearchAreaListProps) {
  return (
    <ol className="research-list">
      {areas.map((area, index) => (
        <li key={area.title} className="research-list__item">
          <span className="research-list__number" aria-hidden="true">
            {padCount(index + 1)}
          </span>
          <h3 className="research-list__title">{area.title}</h3>
          <p className="research-list__desc">{area.description}</p>
        </li>
      ))}
    </ol>
  )
}
