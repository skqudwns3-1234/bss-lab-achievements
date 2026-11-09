import { memo } from 'react'
import { Link } from 'react-router'
import type { Achievement } from '../../types.ts'
import { TYPE_LABELS, formatDate } from '../../utils/achievements.ts'
import { doiLabel } from '../../utils/links.ts'
import ArrowIcon from '../common/ArrowIcon.tsx'

type AchievementRowProps = {
  achievement: Achievement // 보여 줄 성과 하나
  isAdmin: boolean // 관리 모드 — 켜지면 "수정" 버튼 (B-4)
  onOpen: (achievement: Achievement) => void // 줄을 누르면 "이 성과를 열어 줘" — 팝업은 AchievementsPage가 띄운다 (B-3)
}

// 성과 목록의 한 줄 (spec/02 B-1·B-3, design 5.4, P192–P193·P199). 받은 값만 그리고 상태는 없다.
// 날짜 / 유형·예시 배지·학회 / 제목(전체) / 저자 + DOI(작게). 비어 있는 칸은 숨긴다 — 카드와 달리 높이를 맞출 필요가 없어서.
// 휴대폰에서는 CSS grid 자리 지정으로 날짜를 배지 줄 오른쪽에 올린다 (날짜는 한 번만 그림).
// B-3: 제목이 버튼이고, CSS 덮개(::after)로 누르는 범위를 줄 전체로 넓힌다 — 줄 전체를 <button>으로 감싸면
// 그 안의 제목(h2)이 제목으로 읽히지 않고, B-4에서 줄 안에 수정·삭제 버튼을 넣을 수 없어서 (버튼 안에 버튼 불가).
// 줄 끝 "자세히 ↗" 글자는 넣어 보고 사용자가 화면을 본 뒤 뺌 (P204). 대신 누를 수 있다는 표시는
// 제목 끝 작은 ↗(휴대폰에도 늘 보임) + 마우스를 올리면 줄 배경이 밝아지고 제목 밑줄·손가락 커서 (P206–P207).
// B-4: 관리 모드면 "수정" 버튼(넓은 화면 줄 오른쪽 칸·휴대폰 맨 아래 줄, P209 ③). 덮개보다 위에 올려 팝업 대신 이동만
function AchievementRow({ achievement, isAdmin, onOpen }: AchievementRowProps) {
  const { id, type, title, achievedOn, authors, venue, doi, isSample } = achievement
  // DOI는 번호만 — 주소째 저장했어도 번호, 비었거나 깨졌으면 null → 숨김 (EX-30·33, 팝업과 같은 함수)
  const doiText = doiLabel(doi)
  const hasAuthors = authors.trim() !== ''
  // 제목을 "마지막 글자 앞 / 마지막 글자"로 나눔 — Array.from은 이모지처럼 두 칸짜리 글자도 한 글자로 셈
  const titleChars = Array.from(title)
  const titleHead = titleChars.slice(0, -1).join('')
  const titleTail = titleChars.slice(-1).join('')

  return (
    // 관리 모드면 줄 칸 배치가 달라짐(오른쪽 버튼 칸 추가) — 꺼졌을 때 빈 칸 간격이 남지 않게 따로 표시
    <li className={`achievement-row${isAdmin ? ' achievement-row--admin' : ''}`}>
      <span className="achievement-row__date">{formatDate(achievedOn)}</span>

      <div className="achievement-row__top">
        <span className="badge">{TYPE_LABELS[type]}</span>
        {/* 지어낸 예시 성과 표시 (BR-19) */}
        {isSample && <span className="badge badge--sample">예시</span>}
        {venue.trim() !== '' && <span className="achievement-row__venue">{venue}</span>}
      </div>

      {/* 제목 = 여는 버튼. 키보드는 Tab으로 제목에 와서 Enter·Space. 화면 낭독기는 "제목, 버튼"으로 읽음 */}
      <h2 className="achievement-row__title">
        <button type="button" className="achievement-row__open" onClick={() => onOpen(achievement)}>
          {titleHead}
          {/* 마지막 글자 + ↗를 줄바꿈 없는 묶음으로 — 제목이 줄 끝에 딱 맞을 때 ↗만 다음 줄로 떨어지지 않게
              (320px에서 발견, P207. 묶는 건 한 글자뿐이라 긴 영어 단어도 그 앞에서는 그대로 줄이 바뀜).
              ↗는 홈 카드 "자세히 ↗"와 같은 아이콘(사이트 안에서 "팝업 열기" 뜻), aria-hidden이라 낭독기는 제목만 읽음 */}
          <span className="achievement-row__title-end">
            {titleTail}
            <span className="achievement-row__arrow">
              <ArrowIcon />
            </span>
          </span>
        </button>
      </h2>

      {(hasAuthors || doiText) && (
        <p className="achievement-row__meta">
          {hasAuthors && <span>{authors}</span>}
          {doiText && <span className="achievement-row__doi">DOI {doiText}</span>}
        </p>
      )}

      {/* 관리 버튼 — 수정은 폼 주소로 이동만(폼은 spec/03). 삭제는 B-5에서 이 옆에.
          화면에는 "수정"만 보이고, 낭독기는 숨은 제목까지 읽어 줄마다 무엇을 고치는지 구분됨 */}
      {isAdmin && (
        <div className="achievement-row__admin">
          <Link to={`/achievements/${id}/edit`} className="achievement-row__admin-button">
            수정<span className="visually-hidden"> — {title}</span>
          </Link>
        </div>
      )}
    </li>
  )
}

// memo: 부모가 다시 그려져도 받은 성과(achievement)와 여는 함수(onOpen)가 그대로면 이 줄은 다시 그리지 않는다.
// B-2에서 검색어를 칠 때마다 목록이 다시 그려지는데, 내용이 안 바뀐 줄은 건너뛰게 (design 6.4·R5).
// onOpen이 그대로이려면 부모가 useCallback으로 고정해 넘겨야 한다 (B-3).
// isAdmin이 바뀌면(스위치) 모든 줄이 다시 그려지는데, 버튼이 생기고 사라져야 하니 맞는 동작 (B-4)
export default memo(AchievementRow)
