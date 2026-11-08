import type { StatItem } from '../../types.ts'
import { padCount } from '../../utils/achievements.ts'

type StatListProps = {
  stats: StatItem[] // 보여 줄 칸들 — 세는 일은 부모(HomePage)가 하고 여기는 그리기만
}

// 홈 ① 첫 화면 아래 통계 칸들 (spec/01 1-6, design.md 5.3).
// 받은 배열만큼 칸을 그리고 숫자는 두 자리로 (3 → 03, 0 → 00, 100 → 100 — BR-13).
// <dl>(이름–값 목록)로 그려서 화면 낭독기가 "논문 01"처럼 이름과 숫자를 짝으로 읽는다
export default function StatList({ stats }: StatListProps) {
  return (
    <dl className="stat-list">
      {stats.map((stat) => (
        // 칸 이름(유형 이름)은 겹치지 않아 key로 씀
        <div key={stat.label} className="stat-list__item">
          <dt className="stat-list__label">{stat.label}</dt>
          <dd className="stat-list__count">{padCount(stat.count)}</dd>
        </div>
      ))}
    </dl>
  )
}
