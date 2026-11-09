import { useAchievements } from '../../context/useAchievements.ts'

// 관리 모드 띠 (spec/02 B-4, 시안 그대로 헤더 바로 아래 가로 전체 검정 띠, P209 ①).
// Layout이 "관리 모드 켜짐 + 성과 주소(목록·등록·수정)"일 때만 그린다. 상태는 없다.
// 처음 불러올 때 저장된 데이터를 고친 내용(notices, 2-4·2-5)이 있으면 여기서 알린다 — 방문자(관리 모드 꺼짐)에게는 안 보임.
// 시안의 "샘플 데이터로 되돌리기" 버튼은 넣지 않음 (D3)
export default function AdminBar() {
  const { notices } = useAchievements()

  return (
    <aside className="admin-bar" aria-label="관리 모드 안내">
      <div className="admin-bar__inner">
        <p className="admin-bar__text">관리 모드 — 성과를 등록·수정·삭제할 수 있어요. 바뀐 내용은 이 브라우저에 저장됩니다.</p>

        {/* 고친 내용: 요약 한 줄만 먼저, 누르면 자세히 (P209 ④). <details>는 HTML 기본 펼치기라 React 상태가 필요 없다 */}
        {notices.length > 0 && (
          <details className="admin-bar__notices">
            <summary>저장된 성과 데이터에 문제가 있어 {notices.length}가지를 고쳐서 불러왔어요 (자세히)</summary>
            <ul>
              {/* 불러올 때 한 번 만들어지고 순서가 바뀌지 않는 목록이라 순번을 key로 써도 됨. 같은 문장이 둘일 수 있어 문장은 key로 못 씀 */}
              {notices.map((notice, index) => (
                <li key={index}>{notice}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </aside>
  )
}
