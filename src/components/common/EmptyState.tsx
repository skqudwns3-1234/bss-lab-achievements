import './EmptyState.css'

type EmptyStateProps = {
  message: string // 보여 줄 안내 문장
  actionLabel?: string // 버튼 글자 (없으면 버튼 없음) — 예: 성과 목록의 "조건 초기화"(EX-08)
  onAction?: () => void // 버튼을 눌렀을 때
}

// 보여 줄 데이터가 없을 때의 안내 (design 5절, P180). 받는 값만 그리고 상태·훅은 없다.
// 홈 최근 성과 0건(EX-09)과 성과 목록의 "검색 결과 없음"(EX-08)·"성과 0건"에서 같이 쓴다.
export default function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state__message">{message}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn--secondary btn--small" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
