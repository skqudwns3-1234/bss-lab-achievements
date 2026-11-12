// 이스터에그 — 로고를 짧은 시간 안에 여러 번 누르면 숨은 부원 팝업 (P310–P311).
// "몇 번째 눌렀는지·처음 누른 시각"을 받아 다음 값과 "지금 열지"를 돌려주는 순수 함수 — 화면 없이 단위 테스트(UT-94)
// 값을 들고 있는 곳은 Header의 useRef (화면에 보일 필요가 없는 값이라 상태가 아님)

export const SECRET_TAP_COUNT = 5 // 이만큼 누르면
export const SECRET_TAP_WINDOW_MS = 2000 // 처음 누른 뒤 이 시간(2초) 안에

export type TapState = {
  count: number // 지금까지 센 횟수 (0이면 아직 안 셈)
  firstAt: number // 이번 묶음에서 처음 누른 시각 (밀리초)
}

export const EMPTY_TAP: TapState = { count: 0, firstAt: 0 }

// 한 번 누를 때마다 부른다. now = 누른 시각(Date.now()).
// 처음 누른 뒤 2초가 지났으면 이번 누름부터 1로 다시 센다. 5번째가 되면 열라고 하고 0으로 되돌림 — 6번째부터는 다시 1
export function registerTap(state: TapState, now: number): { state: TapState; triggered: boolean } {
  const inWindow = state.count > 0 && now - state.firstAt <= SECRET_TAP_WINDOW_MS
  const next: TapState = inWindow ? { count: state.count + 1, firstAt: state.firstAt } : { count: 1, firstAt: now }
  if (next.count >= SECRET_TAP_COUNT) return { state: EMPTY_TAP, triggered: true }
  return { state: next, triggered: false }
}
