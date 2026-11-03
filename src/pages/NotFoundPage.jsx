import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section>
      <h1>페이지를 찾을 수 없어요</h1>
      <p>
        주소를 다시 확인하거나 <Link to="/">홈으로</Link> 돌아가세요.
      </p>
    </section>
  )
}
