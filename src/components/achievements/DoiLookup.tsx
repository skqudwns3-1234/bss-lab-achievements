import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, Ref } from 'react'
import { fetchCrossrefWork } from '../../api/crossref.ts'
import type { CrossrefWork } from '../../api/crossref.ts'
import { useAchievements } from '../../context/useAchievements.ts'
import { findDuplicateDoi, isValidDoi, normalizeDoi } from '../../utils/doi.ts'
import './DoiLookup.css'

type DoiLookupProps = {
  doi: string // 폼의 DOI 값 (저장할 때 같이 저장됨)
  onDoiChange: (doi: string) => void // DOI 칸을 바꿔 달라
  onFill: (work: CrossrefWork) => void // 불러온 값으로 폼을 채워 달라
  error?: string // 저장할 때 검사에서 나온 DOI 오류 (C-4 ⑥)
  editingId: number | null // 수정 중인 성과 번호 — 같은 DOI 경고에서 자기 자신을 뺀다
  inputRef: Ref<HTMLInputElement> // 첫 오류 칸 포커스용 — React 19는 ref를 보통 prop처럼 넘길 수 있다
}

type LookupStatus = 'idle' | 'loading' | 'success' | 'error'
type LookupState = { status: LookupStatus; message: string }

// 상태 문장 (시안 + 요구사항 EX-02~04)
const IDLE: LookupState = { status: 'idle', message: '논문의 DOI를 넣으면 Crossref에서 제목·저자·학술지·발행일을 가져와요.' }
const LOADING: LookupState = { status: 'loading', message: 'Crossref에서 불러오는 중…' }
const SUCCESS: LookupState = { status: 'success', message: '불러왔어요. 아래 값을 확인하고, 필요하면 고친 뒤 저장하세요.' }
const FORMAT_ERROR: LookupState = { status: 'error', message: 'DOI 형식이 아니에요. 예: 10.1038/nature14539' }
const NOT_FOUND: LookupState = { status: 'error', message: 'DOI를 찾을 수 없어요. 값을 다시 확인해 주세요.' }
const FAILED: LookupState = { status: 'error', message: '불러오지 못했어요. 다시 시도하거나 직접 입력하세요.' }

// 응답이 이보다 늦으면 취소하고 "불러오지 못했어요" (C-3 사용자 결정 ③ — 시간 초과는 이 화면이 맡음)
const TIMEOUT_MS = 10_000

// DOI로 자동 채우기 — 폼 안의 회색 상자 (spec/03 C-4, P233–P235, design 5.5). 유형이 논문일 때만 폼이 그린다.
// 상태: lookup(상태 문장). 진행 중인 요청의 취소 장치(AbortController)와 10초 타이머는 그림과 상관없이
// 들고 있다가 꺼내 쓰는 값이라 useRef. 화면이 사라지면 useEffect 정리 함수가 요청을 취소한다
export default function DoiLookup({ doi, onDoiChange, onFill, error, editingId, inputRef }: DoiLookupProps) {
  const { achievements } = useAchievements()
  const [lookup, setLookup] = useState<LookupState>(IDLE)
  const controllerRef = useRef<AbortController | null>(null)
  const timerRef = useRef<number | null>(null)
  const isLoading = lookup.status === 'loading'

  // 같은 DOI 경고 (Q-C7, C-4 ⑦) — DOI가 모양을 갖추는 즉시. 그릴 때 계산(상태 아님), 수정 중인 자기 자신은 뺌
  const cleaned = normalizeDoi(doi)
  const duplicate = isValidDoi(cleaned) ? findDuplicateDoi(achievements, cleaned, editingId) : null

  // 진행 중인 요청과 타이머를 멈춘다. 이 뒤에 도착하는 결과는 아래 "지금 요청인지" 검사에서 버려짐
  function stopRequest() {
    controllerRef.current?.abort()
    controllerRef.current = null
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = null
  }

  // 화면이 사라질 때(페이지를 떠남, 유형을 바꿔 DOI 상자가 없어짐) 요청 취소 — 사라진 폼을 고치지 않게
  useEffect(() => stopRequest, [])

  async function handleLookup() {
    if (controllerRef.current) return // 불러오는 중이면 무시 — 버튼 연타·Enter 연타 (EX-16)
    const doiNumber = normalizeDoi(doi)
    if (doiNumber !== doi) onDoiChange(doiNumber) // 주소째 붙여 넣었으면 칸도 번호로 (AC-13-2)
    if (!isValidDoi(doiNumber)) {
      setLookup(FORMAT_ERROR) // 모양이 아니면 묻지 않음 (EX-02)
      return
    }

    const controller = new AbortController()
    controllerRef.current = controller
    // 10초가 지나면 취소 → fetchCrossrefWork가 aborted를 돌려줌. 사용자가 멈춘 경우는 stopRequest가
    // controllerRef를 비워서 아래에서 버려지므로, 여기까지 오는 aborted는 시간 초과뿐
    timerRef.current = window.setTimeout(() => controller.abort(), TIMEOUT_MS)
    setLookup(LOADING)

    const result = await fetchCrossrefWork(doiNumber, controller.signal)
    if (controllerRef.current !== controller) return // 그 사이 취소됨(DOI를 고침·화면이 사라짐) — 결과 버림
    stopRequest()

    if (result.ok) {
      onFill(result.work) // 덮어쓰기는 폼이 (빈 값은 원래 값 유지 — C-4 ②)
      setLookup(SUCCESS)
    } else if (result.reason === 'not-found') {
      setLookup(NOT_FOUND) // EX-03 — 폼 값은 그대로
    } else {
      setLookup(FAILED) // 인터넷 끊김·서버 오류·10초 초과 (EX-04) — 직접 입력해 저장할 수 있음
    }
  }

  // DOI 칸을 고치면: 불러오는 중이면 취소(다른 DOI의 결과가 들어오지 않게), 지난 상태 문장은 처음으로
  function handleChange(value: string) {
    if (controllerRef.current) stopRequest()
    if (lookup.status !== 'idle') setLookup(IDLE)
    onDoiChange(value)
  }

  // DOI 칸에서 Enter = 불러오기 (C-4 ④) — 폼 저장으로 넘어가지 않게 막음. 한글 조합을 끝내는 Enter는 건너뜀
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return
    event.preventDefault()
    void handleLookup()
  }

  // 낭독기가 DOI 칸에서 함께 읽을 문장들 (상태·저장 오류·같은 DOI 경고)
  const showError = error !== undefined && error !== lookup.message
  const describedBy = ['form-doi-status', showError ? 'form-doi-error' : '', duplicate ? 'form-doi-duplicate' : '']
    .filter((id) => id !== '')
    .join(' ')

  return (
    <div className="doi-lookup">
      <label htmlFor="form-doi" className="achievement-form__label">
        DOI로 자동 채우기
      </label>
      <div className="doi-lookup__row">
        <input
          ref={inputRef}
          id="form-doi"
          type="text"
          className={`input input--pill doi-lookup__input${error ? ' input--error' : ''}`}
          placeholder="예: 10.1000/xyz123 또는 https://doi.org/…"
          autoComplete="off"
          spellCheck={false}
          value={doi}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
        {/* 불러오는 중엔 막기(EX-16) — disabled 대신 aria-disabled: disabled로 바꾸면 누른 버튼에 있던
            포커스가 페이지 맨 처음으로 떨어져서. 누름은 handleLookup이 무시함 */}
        <button
          type="button"
          className="btn btn--primary doi-lookup__button"
          aria-disabled={isLoading}
          onClick={() => void handleLookup()}
        >
          {isLoading ? '불러오는 중' : '불러오기'}
        </button>
      </div>

      {/* 상태 문장 — role="status" 칸은 늘 그려 두고 글만 바꿈(낭독기가 바뀔 때마다 읽음) */}
      <p id="form-doi-status" role="status" className={`doi-lookup__status doi-lookup__status--${lookup.status}`}>
        <StatusIcon status={lookup.status} />
        <span>{lookup.message}</span>
      </p>
      {/* 저장 검사 문장 — 상태 문장이 이미 같은 말(불러오기에서 난 형식 오류)이면 두 줄로 겹치지 않게 뺌 (spec/03 점검 ①, P238) */}
      {showError && (
        <p id="form-doi-error" className="achievement-form__error">
          {error}
        </p>
      )}
      {duplicate && (
        <p id="form-doi-duplicate" className="doi-lookup__duplicate">
          이미 등록된 DOI예요: {duplicate.title}
        </p>
      )}
    </div>
  )
}

// 상태 아이콘 (시안): 성공 체크 / 오류 느낌표 원 / 불러오는 중 도는 원 / 대기는 없음
function StatusIcon({ status }: { status: LookupStatus }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  if (status === 'success') {
    return (
      <svg {...common}>
        <path d="M5 12l5 5 9-10" />
      </svg>
    )
  }
  if (status === 'error') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6" />
        <path d="M12 16.5v.5" />
      </svg>
    )
  }
  if (status === 'loading') {
    return (
      <svg {...common} className="doi-lookup__spinner">
        <path d="M12 3a9 9 0 1 0 9 9" />
      </svg>
    )
  }
  return null
}
