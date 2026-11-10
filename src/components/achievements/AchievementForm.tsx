import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import type { AchievementInput } from '../../types.ts'
import { todayYmd } from '../../utils/date.ts'
import {
  ACHIEVEMENT_TYPES,
  TYPE_FIELD_LABELS,
  TYPE_LABELS,
  normalizeInput,
  validateAchievement,
} from '../../utils/achievements.ts'
import './AchievementForm.css'

type AchievementFormProps = {
  initialValues: AchievementInput // 처음 값 — 등록은 빈 값 + 논문, 수정은 그 성과 값. 처음 그릴 때만 씀
  onSubmit: (input: AchievementInput) => boolean // 저장 — 성공했는지 돌려받음 (성공하면 페이지가 목록으로 보냄)
  isDeleted: boolean // 수정하는 동안 다른 탭에서 이 성과가 지워졌는지 — 참이면 안내 + 저장 막기 (C-2b, Q-C8)
}

// 글자 칸 하나의 이름 (values의 칸 이름 중 유형을 뺀 것)
type TextField = Exclude<keyof AchievementInput, 'type'>

// 성과 등록·수정 폼 (spec/03 C-2a, P224–P225, design 5.5).
// 상태: values(폼 값) / submitted(저장을 한 번 눌렀는지) / saveFailed(저장 실패 문장).
// 오류(errors)는 상태로 두지 않고 그릴 때마다 values로 계산한다 — 상태로 따로 두면 칸을 고칠 때마다
// 두 곳을 맞춰야 하고, 어긋나면 고쳤는데도 빨간 문장이 남아서 (사용자 결정 ③)
export default function AchievementForm({ initialValues, onSubmit, isDeleted }: AchievementFormProps) {
  // 처음 값은 처음 그릴 때만 — 다른 탭에서 같은 성과를 고쳐도 쓰던 값은 그대로 (EX-25)
  const [values, setValues] = useState(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const [saveFailed, setSaveFailed] = useState(false)

  // 첫 오류 칸·실패 문장으로 포커스를 옮기려고 실제 칸(DOM)을 가리킴
  const titleRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)
  const linkRef = useRef<HTMLInputElement>(null)
  const alertRef = useRef<HTMLParagraphElement>(null)
  // 저장 중 표시 — 상태는 다음 그림에서야 바뀌지만 ref는 바로 바뀌어서, 더블클릭·Enter 연타의 두 번째 저장을
  // 확실히 무시한다 (사용자 결정 ⑤, EX-41). 성공하면 풀지 않음 — 곧 목록으로 떠나므로
  const savingRef = useRef(false)

  // 저장을 한 번 누른 뒤부터만 오류를 보여 줌 — 그 뒤로는 칸을 고치는 즉시 다시 계산
  const errors = submitted ? validateAchievement(values) : {}
  const labels = TYPE_FIELD_LABELS[values.type]
  // 미래 날짜 안내 (Q-C2) — 'YYYY-MM-DD'는 글자 순서가 곧 날짜 순서. 막지는 않음
  const isFuture = errors.achievedOn === undefined && values.achievedOn !== '' && values.achievedOn > todayYmd()

  // 실패 문장이 나타나면 그 문장으로 포커스 → 화면이 그리로 스크롤 (휴대폰에서 "저장"은 아래, 문장은 위라서 — AI 보탬)
  // 포커스 옮기기는 그린 뒤의 화면 일이라 useEffect
  useEffect(() => {
    if (saveFailed) alertRef.current?.focus()
  }, [saveFailed])

  // 글자 칸 바꾸기 — 그 칸만 새 값으로 (제어 입력)
  function handleChange(field: TextField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault() // 브라우저 기본 동작(페이지 새로고침) 막기
    // 지워진 성과는 저장하지 않음 — 저장 버튼을 숨겨도 칸에서 Enter를 누르면 폼이 제출돼서 여기서도 막는다 (Q-C8)
    if (isDeleted) return
    if (savingRef.current) return // 두 번째 저장은 무시
    setSubmitted(true)
    setSaveFailed(false)

    // 오류가 있으면 저장하지 않고 화면 순서대로 첫 오류 칸으로 포커스
    const found = validateAchievement(values)
    if (found.title) return titleRef.current?.focus()
    if (found.achievedOn) return dateRef.current?.focus()
    if (found.link) return linkRef.current?.focus()

    savingRef.current = true
    const ok = onSubmit(normalizeInput(values)) // 앞뒤 공백을 지운 값으로 저장 (BR-03)
    if (!ok) {
      savingRef.current = false // 다시 시도할 수 있게
      setSaveFailed(true) // 입력값은 그대로 (EX-12)
    }
  }

  // 오류 칸이면 빨간 테두리 + 낭독기용 표시(aria-invalid, 오류 문장 id)
  function errorProps(field: TextField) {
    const message = errors[field]
    return {
      className: `input${message ? ' input--error' : ''}`,
      'aria-invalid': message ? true : undefined,
      'aria-describedby': message ? `form-${field}-error` : undefined,
    }
  }

  // 칸 아래 빨간 오류 문장 — 컴포넌트가 아니라 그냥 함수로 부름 (안에서 컴포넌트를 만들면 그릴 때마다 새 종류가 되어 다시 만들어짐)
  function errorText(field: TextField) {
    const message = errors[field]
    return message ? (
      <p id={`form-${field}-error`} className="achievement-form__error">
        {message}
      </p>
    ) : null
  }

  return (
    // noValidate: 브라우저 기본 검사 말풍선(링크 칸 type="url" 등)을 끄고 우리 문장만 보여 줌
    <form className="achievement-form" noValidate onSubmit={handleSubmit}>
      {/* 수정하는 동안 다른 탭에서 지워짐 (C-2b, Q-C8, P227). 쓰던 값은 그대로 두어 복사해 새로 등록할 수 있게.
          role="alert": 나타나는 순간 낭독기가 읽음 — 포커스는 옮기지 않음(쓰던 칸에서 계속 복사할 수 있게) */}
      {isDeleted && (
        <div role="alert" className="achievement-form__deleted">
          <p className="achievement-form__deleted-text">이 성과는 다른 곳에서 삭제됐어요.</p>
          <Link to="/achievements" className="btn btn--secondary btn--small">
            목록으로
          </Link>
        </div>
      )}

      {saveFailed && (
        // role="alert": 나타나는 순간 낭독기가 읽음. tabIndex -1: 코드로만 포커스 (Tab 순서엔 안 들어감)
        <p ref={alertRef} role="alert" tabIndex={-1} className="achievement-form__alert">
          저장에 실패했습니다.
        </p>
      )}

      {/* 유형 — 진짜 라디오를 숨기고 옆 글자를 알약으로 (사용자 결정 ①, Q-C4).
          화살표 키로 고르기·Tab 한 번에 넘어가기·"4개 중 1번째" 읽기는 브라우저가 해 줌 */}
      <fieldset className="achievement-form__types">
        <legend>
          유형 <span className="achievement-form__required" aria-hidden="true">*</span>
        </legend>
        <div className="achievement-form__type-list">
          {ACHIEVEMENT_TYPES.map((type) => (
            <label key={type} className="achievement-form__type">
              <input
                type="radio"
                name="type"
                value={type}
                checked={values.type === type}
                onChange={() => setValues((prev) => ({ ...prev, type }))}
                className="achievement-form__type-input"
              />
              <span className="achievement-form__type-pill">{TYPE_LABELS[type]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="achievement-form__field">
        <label htmlFor="form-title" className="achievement-form__label">
          제목 <span className="achievement-form__required" aria-hidden="true">*</span>
        </label>
        {/* required: 낭독기가 "필수"라고 읽음 (검사는 noValidate라 우리 함수가 함) */}
        <input
          ref={titleRef}
          id="form-title"
          type="text"
          required
          value={values.title}
          onChange={(event) => handleChange('title', event.target.value)}
          {...errorProps('title')}
        />
        {errorText('title')}
      </div>

      {/* 날짜(1) : 학술지(2) 한 줄 — 칸 이름은 유형마다 (Q-C3) */}
      <div className="achievement-form__row">
        <div className="achievement-form__field">
          <label htmlFor="form-achievedOn" className="achievement-form__label">
            {labels.achievedOn} <span className="achievement-form__required" aria-hidden="true">*</span>
          </label>
          <input
            ref={dateRef}
            id="form-achievedOn"
            type="date"
            required
            value={values.achievedOn}
            onChange={(event) => handleChange('achievedOn', event.target.value)}
            {...errorProps('achievedOn')}
          />
          {errorText('achievedOn')}
          {isFuture && (
            <p className="achievement-form__note">오늘 이후 날짜예요. 예정된 성과라면 그대로 저장하세요.</p>
          )}
        </div>
        <div className="achievement-form__field">
          <label htmlFor="form-venue" className="achievement-form__label">
            {labels.venue}
          </label>
          <input
            id="form-venue"
            type="text"
            value={values.venue}
            onChange={(event) => handleChange('venue', event.target.value)}
            {...errorProps('venue')}
          />
        </div>
      </div>

      <div className="achievement-form__field">
        <label htmlFor="form-authors" className="achievement-form__label">
          {labels.authors}
        </label>
        <input
          id="form-authors"
          type="text"
          placeholder="쉼표로 구분 — 예: 홍길동, 김철수"
          value={values.authors}
          onChange={(event) => handleChange('authors', event.target.value)}
          {...errorProps('authors')}
        />
      </div>

      {/* 지도교수 — 시안에는 없지만 데이터에 있어서 보충 (P150) */}
      <div className="achievement-form__field">
        <label htmlFor="form-advisors" className="achievement-form__label">
          지도교수
        </label>
        <input
          id="form-advisors"
          type="text"
          placeholder="쉼표로 구분"
          value={values.advisors}
          onChange={(event) => handleChange('advisors', event.target.value)}
          {...errorProps('advisors')}
        />
      </div>

      <div className="achievement-form__field">
        <label htmlFor="form-link" className="achievement-form__label">
          링크
        </label>
        {/* inputMode="url": 휴대폰에서 주소 자판 */}
        <input
          ref={linkRef}
          id="form-link"
          type="url"
          inputMode="url"
          placeholder="https://"
          value={values.link}
          onChange={(event) => handleChange('link', event.target.value)}
          {...errorProps('link')}
        />
        {errorText('link')}
      </div>

      <div className="achievement-form__actions">
        {/* 취소: 목록으로 가기만, 바꾼 값은 버림 (떠날 때 경고 없음 — Q6, TC-38) */}
        <Link to="/achievements" className="btn btn--secondary">
          취소
        </Link>
        {/* 지워진 성과면 저장 버튼을 숨김 — 막아 둔(disabled) 버튼은 "왜 안 눌리지?" 싶어서 (사용자 결정 P227) */}
        {!isDeleted && (
          <button type="submit" className="btn btn--primary">
            저장
          </button>
        )}
      </div>
    </form>
  )
}
