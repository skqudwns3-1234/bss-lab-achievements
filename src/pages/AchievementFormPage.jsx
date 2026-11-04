import { useParams } from 'react-router'

export default function AchievementFormPage() {
  // /achievements/:id/edit 이면 id가 있고, /achievements/new 이면 없다
  const { id } = useParams()

  return (
    <section>
      <h1 className="page-title">{id ? '성과 수정' : '성과 등록'}</h1>
      <p className="placeholder-note">3단계에서 구현합니다.</p>
    </section>
  )
}
