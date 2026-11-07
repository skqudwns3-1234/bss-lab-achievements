type ArrowIconProps = {
  size?: number // 가로·세로 px. 안 넘기면 시안 값 14px
}

// ↗ 화살표 (design.md 5.2). 버튼·링크 글자 옆에 붙여 쓴다.
// stroke="currentColor"라서 글자색을 따라간다 — 검정 버튼에서는 흰색, 흰 버튼에서는 검정.
export default function ArrowIcon({ size = 14 }: ArrowIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}
