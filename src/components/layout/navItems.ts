// 메뉴 하나의 모양: 이동할 주소와 화면에 보일 이름
export type NavItem = {
  path: string
  label: string
}

// 헤더 메뉴 목록. App.tsx의 라우트 경로와 맞춰야 한다.
export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: '홈' },
  { path: '/about', label: '연구실 소개' },
  { path: '/members', label: '부원' },
  { path: '/achievements', label: '성과' },
]
