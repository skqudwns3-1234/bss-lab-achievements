import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import AchievementForm from '../components/achievements/AchievementForm.tsx'
import EmptyState from '../components/common/EmptyState.tsx'
import { useAchievements } from '../context/useAchievements.ts'
import { useAdminMode } from '../context/useAdminMode.ts'
import type { Achievement, AchievementInput, SavedNotice } from '../types.ts'
import { EMPTY_INPUT, parseAchievementId, toInput } from '../utils/achievements.ts'
import './AchievementFormPage.css'

// 단계 안내 (시안) — 보기만, 누르는 것 아님
const STEPS = ['유형 고르기', 'DOI 불러오기 (논문만)', '값 확인 후 저장']

// 설명 한 줄 — 등록은 시안 문장, 수정은 수정용 문장 (spec/03 C-1 ③, P221)
const LEAD_NEW =
  '논문이라면 DOI만 넣어도 제목·저자·학술지·발행일이 채워져요. 불러온 값은 바로 저장되지 않으니, 확인하고 고친 뒤 저장하세요.'
const LEAD_EDIT = '고칠 값을 바꾼 뒤 저장하세요. 저장하기 전에는 목록이 바뀌지 않아요.'

// "← 성과 목록" (시안의 왼쪽 꺾쇠 아이콘)
function BackLink() {
  return (
    <Link to="/achievements" className="form-page__back">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 6l-6 6 6 6" />
      </svg>
      성과 목록
    </Link>
  )
}

// 성과 등록·수정 페이지 (spec/03 C-1 P221–P222 틀, C-2a P224–P225 폼 연결). 입력칸·검사는 AchievementForm.
// 판단 순서: ① 관리 모드가 아니면 목록으로 ② 수정이면 고칠 성과 찾기 — 처음부터 없으면 "찾을 수 없어요",
// 수정하는 동안 지워졌으면 폼은 남기고 안내(C-2b Q-C8) ③ 틀 + 폼 (C-2a)
export default function AchievementFormPage() {
  // /achievements/new 이면 id가 없고, /achievements/8/edit 이면 '8'
  const { id } = useParams()
  const isEdit = id !== undefined
  const { isAdmin } = useAdminMode()
  const { achievements, addAchievement, updateAchievement } = useAchievements()
  // 버튼을 눌렀을 때 다른 주소로 보내는 라우터 기능 — 훅이라 아래에서 일찍 돌려보내기 전에 부른다
  const navigate = useNavigate()
  // 이 화면에서 한 번 찾았던 성과 (C-2b, Q-C8) — 수정하는 동안 다른 탭에서 지워졌는지(삭제됨)와
  // 처음부터 없던 번호(EX-06)를 구분하려고 기억한다. 훅이라 아래에서 일찍 돌려보내기 전에 부른다
  const [seen, setSeen] = useState<Achievement | null>(null)

  // ① 관리 모드가 아니면 그리지 않고 성과 목록으로 (EX-07). replace: 주소 기록에서 폼 주소를 목록으로 바꿔치기해
  //    뒤로 가기를 눌러도 폼으로 와서 또 쫓겨나지 않게. 다른 탭에서 관리 모드를 끄면 이 탭의 isAdmin도 바뀌어(B-4)
  //    다시 그려지면서 바로 여기로 온다 (EX-39)
  if (!isAdmin) return <Navigate to="/achievements" replace />

  // ② 수정이면 고칠 성과를 찾는다. 그릴 때마다 목록에서 찾아서 다른 탭의 수정·삭제가 바로 반영됨
  const editId = isEdit ? parseAchievementId(id) : null
  const target = editId === null ? null : (achievements.find((achievement) => achievement.id === editId) ?? null)

  // 찾았으면 기억해 둔다 — 그리는 중에 상태 맞추기(C-1·B-5와 같은 방식). 다른 탭에서 고치면 새 값으로 갈아 둠
  if (target && seen !== target) setSeen(target)
  // 찾았던 그 번호가 목록에서 사라짐 = 수정하는 동안 지워짐 (Q-C8)
  const isDeleted = isEdit && target === null && seen !== null && seen.id === editId
  // 보여 줄 성과 — 지워진 뒤에도 "고치는 성과" 제목과 폼 처음 값은 마지막으로 본 값
  const shown = target ?? (isDeleted ? seen : null)

  // 번호가 숫자가 아니거나(abc·0·1.5) 처음부터 없는 성과(9999) (EX-06)
  if (isEdit && shown === null) {
    return (
      <section>
        <BackLink />
        <h1 className="page-title form-page__title">성과 수정</h1>
        <div className="form-page__empty">
          <EmptyState
            message="성과를 찾을 수 없어요."
            hint="지워졌거나 주소가 잘못됐을 수 있어요."
            actionLabel="성과 목록으로"
            onAction={() => navigate('/achievements')}
          />
        </div>
      </section>
    )
  }

  // 저장 (C-2a): 등록은 add(새 번호, 실패면 null), 수정은 update(성공 여부) — 둘 다 "저장 먼저, 성공하면 반영" (2-5).
  // 폼이 memo가 아니라 useCallback으로 고정해도 얻는 게 없어 그냥 함수
  function handleSubmit(input: AchievementInput): boolean {
    if (target) {
      if (!updateAchievement(target.id, input)) return false
      goToList({ kind: 'edit', id: target.id, title: input.title })
      return true
    }
    const newId = addAchievement(input)
    if (newId === null) return false
    goToList({ kind: 'add', id: newId, title: input.title })
    return true
  }

  // 저장 후 목록으로 (C-2b, Q-C1, P227).
  // replace: 방문 기록에서 폼을 목록으로 바꿔치기 → 뒤로 가기로 폼에 돌아가 한 번 더 저장하는 일이 없게
  // state: 주소에는 안 보이는 짐 — 목록 페이지가 꺼내 "등록했어요/수정했어요" 안내를 그림
  function goToList(saved: SavedNotice) {
    navigate('/achievements', { replace: true, state: { saved } })
  }

  // ③ 틀 — 시안 배치: 왼쪽 안내(제목·설명·단계) / 오른쪽 흰 폼 상자
  return (
    <section>
      <BackLink />
      <div className="form-page__body">
        <div className="form-page__intro">
          <h1 className="page-title form-page__title">{isEdit ? '성과 수정' : '성과 등록'}</h1>
          <p className="form-page__lead">{isEdit ? LEAD_EDIT : LEAD_NEW}</p>
          {/* 어떤 성과를 고치는지 (C-1 ③) */}
          {shown && (
            <p className="form-page__target">
              <span className="form-page__target-label">고치는 성과</span>
              <span className="form-page__target-title">{shown.title}</span>
            </p>
          )}
          <ol className="form-page__steps">
            {STEPS.map((step, index) => (
              <li key={step}>
                <span className="form-page__step-number">{String(index + 1).padStart(2, '0')}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* 흰 폼 상자 = AchievementForm (C-2a). key: 뒤로·앞으로 가기로 등록 ↔ 수정(또는 3번 ↔ 5번)을 오가면
            React가 같은 자리의 같은 컴포넌트를 다시 써서 앞 화면 값이 남을 수 있음 → key가 바뀌면 폼을 새로 만들어 처음 값부터 (EX-43).
            C-2b: key는 주소 번호 — 수정하는 동안 성과가 지워져도 폼이 새로 만들어지지 않아 쓰던 값이 남음 (Q-C8) */}
        <AchievementForm
          key={isEdit ? `edit-${id}` : 'new'}
          initialValues={shown ? toInput(shown) : EMPTY_INPUT}
          isDeleted={isDeleted}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  )
}
