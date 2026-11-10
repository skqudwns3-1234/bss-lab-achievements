import { memo, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import type { Achievement } from '../../types.ts'
import { TYPE_LABELS, formatDate } from '../../utils/achievements.ts'
import { doiLabel } from '../../utils/links.ts'
import ArrowIcon from '../common/ArrowIcon.tsx'

type AchievementRowProps = {
  achievement: Achievement // 보여 줄 성과 하나
  isAdmin: boolean // 관리 모드 — 켜지면 "수정"·"삭제" 버튼 (B-4·B-5)
  isConfirming: boolean // 이 줄의 삭제 확인 칸이 열렸는지 (B-5)
  saveFailed: boolean // 이 줄 삭제가 저장에 실패했는지 — 확인 칸 안에 안내 (B-5 ②)
  shouldFocusTitle: boolean // 바로 앞 줄이 지워져 이 줄 제목으로 포커스를 옮길 차례인지 (B-5 ①)
  onOpen: (achievement: Achievement) => void // 줄을 누르면 "이 성과를 열어 줘" — 팝업은 AchievementsPage가 띄운다 (B-3)
  onDelete: (achievement: Achievement) => void // "삭제" → 확인 칸 열어 줘 (B-5)
  onCancelDelete: () => void // 확인 칸 닫아 줘 (B-5)
  onConfirmDelete: (achievement: Achievement) => void // 정말 지워 줘 (B-5)
  onFocusDone: () => void // 제목에 포커스를 줬다는 신호 (B-5)
}

// 성과 목록의 한 줄 (spec/02 B-1·B-3, design 5.4, P192–P193·P199). 받은 값만 그리고 상태는 없다.
// 날짜 / 유형·예시 배지·학회 / 제목(전체) / 저자 + DOI(작게). 비어 있는 칸은 숨긴다 — 카드와 달리 높이를 맞출 필요가 없어서.
// 휴대폰에서는 CSS grid 자리 지정으로 날짜를 배지 줄 오른쪽에 올린다 (날짜는 한 번만 그림).
// B-3: 제목이 버튼이고, CSS 덮개(::after)로 누르는 범위를 줄 전체로 넓힌다 — 줄 전체를 <button>으로 감싸면
// 그 안의 제목(h2)이 제목으로 읽히지 않고, B-4에서 줄 안에 수정·삭제 버튼을 넣을 수 없어서 (버튼 안에 버튼 불가).
// 줄 끝 "자세히 ↗" 글자는 넣어 보고 사용자가 화면을 본 뒤 뺌 (P204). 대신 누를 수 있다는 표시는
// 제목 끝 작은 ↗(휴대폰에도 늘 보임) + 마우스를 올리면 줄 배경이 밝아지고 제목 밑줄·손가락 커서 (P206–P207).
// B-4: 관리 모드면 "수정" 버튼(넓은 화면 줄 오른쪽 칸·휴대폰 맨 아래 줄, P209 ③). 덮개보다 위에 올려 팝업 대신 이동만.
// B-5: "삭제" → 이 줄 맨 아래 확인 칸(시안 문장 + 취소·빨간 삭제). 열리면 "취소"에 포커스, Esc = 취소 (Q-B3, P214)
function AchievementRow({
  achievement,
  isAdmin,
  isConfirming,
  saveFailed,
  shouldFocusTitle,
  onOpen,
  onDelete,
  onCancelDelete,
  onConfirmDelete,
  onFocusDone,
}: AchievementRowProps) {
  const { id, type, title, achievedOn, authors, venue, doi, isSample } = achievement
  // DOI는 번호만 — 주소째 저장했어도 번호, 비었거나 깨졌으면 null → 숨김 (EX-30·33, 팝업과 같은 함수)
  const doiText = doiLabel(doi)
  const hasAuthors = authors.trim() !== ''
  // 제목을 "마지막 글자 앞 / 마지막 글자"로 나눔 — Array.from은 이모지처럼 두 칸짜리 글자도 한 글자로 셈
  const titleChars = Array.from(title)
  const titleHead = titleChars.slice(0, -1).join('')
  const titleTail = titleChars.slice(-1).join('')

  // 포커스를 옮길 버튼들 — 화면의 실제 버튼(DOM)을 가리켜야 해서 useRef (B-5)
  const titleButtonRef = useRef<HTMLButtonElement>(null)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // 확인 칸이 열리면 첫 포커스는 "취소" — 실수로 Enter를 두 번 눌러도 지워지지 않게 (Q-B3).
  // 포커스 옮기기는 그린 뒤의 화면(DOM) 일이라 useEffect
  useEffect(() => {
    if (isConfirming) cancelButtonRef.current?.focus()
  }, [isConfirming])

  // 바로 앞 줄이 지워졌으면 이 줄 제목으로 포커스 → 다 옮겼다고 알려 표시를 지움 (B-5 ①)
  useEffect(() => {
    if (!shouldFocusTitle) return
    titleButtonRef.current?.focus()
    onFocusDone()
  }, [shouldFocusTitle, onFocusDone])

  // 취소·Esc: 포커스를 "삭제" 버튼으로 먼저 돌려 놓고 칸을 닫는다 — 닫히는 칸 안에 포커스가 남아 사라지지 않게
  function handleCancel() {
    deleteButtonRef.current?.focus()
    onCancelDelete()
  }

  // 확인 칸·질문 문장의 id — 삭제 버튼(aria-controls)·취소 버튼(aria-describedby)이 가리킨다. 성과 번호로 겹치지 않게
  const confirmId = `delete-confirm-${id}`
  const questionId = `delete-question-${id}`

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
        <button
          ref={titleButtonRef}
          type="button"
          className="achievement-row__open"
          onClick={() => onOpen(achievement)}
        >
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

      {/* 관리 버튼 — 수정은 폼 주소로 이동만(폼은 spec/03), 삭제는 아래 확인 칸을 연다 (B-5).
          화면에는 "수정"·"삭제"만 보이고, 낭독기는 숨은 제목까지 읽어 줄마다 무엇을 고치고 지우는지 구분됨 */}
      {isAdmin && (
        <div className="achievement-row__admin">
          <Link to={`/achievements/${id}/edit`} className="achievement-row__admin-button">
            수정<span className="visually-hidden"> — {title}</span>
          </Link>
          {/* aria-expanded: 확인 칸이 열렸는지 낭독기에 알림 */}
          <button
            ref={deleteButtonRef}
            type="button"
            className="achievement-row__admin-button"
            aria-expanded={isConfirming}
            aria-controls={isConfirming ? confirmId : undefined}
            onClick={() => onDelete(achievement)}
          >
            삭제<span className="visually-hidden"> — {title}</span>
          </button>
        </div>
      )}

      {/* 삭제 확인 칸 (B-5, 시안 그대로 — 그 줄 맨 아래 가로 전체). 덮개보다 위라 눌러도 팝업이 안 뜸.
          Esc는 칸 안 어디에 포커스가 있든 취소 */}
      {isAdmin && isConfirming && (
        <div
          id={confirmId}
          className="achievement-row__confirm"
          onKeyDown={(event) => {
            if (event.key === 'Escape') handleCancel()
          }}
        >
          <p id={questionId} className="achievement-row__confirm-text">
            이 성과를 삭제할까요? 삭제하면 되돌릴 수 없어요.
          </p>
          {/* 저장 실패 — 줄은 그대로, 칸은 열린 채로 다시 시도 가능 (B-5 ②, 문장은 사용자가 정함 P214).
              role="alert": 나타나는 순간 낭독기가 바로 읽음 */}
          {saveFailed && (
            <p role="alert" className="achievement-row__confirm-error">
              저장에 실패했습니다.
            </p>
          )}
          <div className="achievement-row__confirm-actions">
            {/* 낭독기는 "취소" 다음에 질문 문장까지 읽음 — 처음 포커스가 여기라 무엇을 묻는지 알 수 있게 */}
            <button
              ref={cancelButtonRef}
              type="button"
              className="achievement-row__confirm-button"
              aria-describedby={questionId}
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              type="button"
              className="achievement-row__confirm-button achievement-row__confirm-button--danger"
              onClick={() => onConfirmDelete(achievement)}
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

// memo: 부모가 다시 그려져도 받은 성과(achievement)와 여는 함수(onOpen)가 그대로면 이 줄은 다시 그리지 않는다.
// B-2에서 검색어를 칠 때마다 목록이 다시 그려지는데, 내용이 안 바뀐 줄은 건너뛰게 (design 6.4·R5).
// onOpen이 그대로이려면 부모가 useCallback으로 고정해 넘겨야 한다 (B-3).
// isAdmin이 바뀌면(스위치) 모든 줄이 다시 그려지는데, 버튼이 생기고 사라져야 하니 맞는 동작 (B-4).
// 삭제 확인은 참/거짓(isConfirming 등)으로 받아서, 확인 칸을 열고 닫을 때 다시 그려지는 줄은 값이 바뀐 줄뿐 (B-5)
export default memo(AchievementRow)
