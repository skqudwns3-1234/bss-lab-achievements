import { memo } from 'react'
import type { Achievement } from '../../types.ts'
import { TYPE_LABELS, formatDate } from '../../utils/achievements.ts'
import { doiLabel } from '../../utils/links.ts'

type AchievementRowProps = {
  achievement: Achievement // 보여 줄 성과 하나
}

// 성과 목록의 한 줄 (spec/02 B-1, design 5.4, P192–P193). 받은 값만 그리고 상태는 없다.
// 날짜 / 유형·예시 배지·학회 / 제목(전체) / 저자 + DOI(작게). 비어 있는 칸은 숨긴다 — 카드와 달리 높이를 맞출 필요가 없어서.
// 휴대폰에서는 CSS grid 자리 지정으로 날짜를 배지 줄 오른쪽에 올린다 (날짜는 한 번만 그림)
function AchievementRow({ achievement }: AchievementRowProps) {
  const { type, title, achievedOn, authors, venue, doi, isSample } = achievement
  // DOI는 번호만 — 주소째 저장했어도 번호, 비었거나 깨졌으면 null → 숨김 (EX-30·33, 팝업과 같은 함수)
  const doiText = doiLabel(doi)
  const hasAuthors = authors.trim() !== ''

  return (
    <li className="achievement-row">
      <span className="achievement-row__date">{formatDate(achievedOn)}</span>

      <div className="achievement-row__top">
        <span className="badge">{TYPE_LABELS[type]}</span>
        {/* 지어낸 예시 성과 표시 (BR-19) */}
        {isSample && <span className="badge badge--sample">예시</span>}
        {venue.trim() !== '' && <span className="achievement-row__venue">{venue}</span>}
      </div>

      <h2 className="achievement-row__title">{title}</h2>

      {(hasAuthors || doiText) && (
        <p className="achievement-row__meta">
          {hasAuthors && <span>{authors}</span>}
          {doiText && <span className="achievement-row__doi">DOI {doiText}</span>}
        </p>
      )}
    </li>
  )
}

// memo: 부모가 다시 그려져도 받은 성과(achievement)가 그대로면 이 줄은 다시 그리지 않는다.
// B-2에서 검색어를 칠 때마다 목록이 다시 그려지는데, 내용이 안 바뀐 줄은 건너뛰게 (design 6.4·R5)
export default memo(AchievementRow)
