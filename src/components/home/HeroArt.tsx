import { useEffect, useRef } from 'react'

// 마우스가 이만큼(px) 안으로 다가오면 물방울이 반응한다 (물방울 반지름 + REACH)
const REACH = 160
// 가장 가까이 왔을 때 물방울이 밀려나는 거리(px)
const MAX_PUSH = 28
// 가장 가까이 왔을 때 반짝임이 마우스 쪽으로 움직이는 거리(px)
const MAX_SHINE = 8

// 홈 첫 화면 오른쪽의 물방울 장식 (spec/01_home 1-8, 시안 Main.dc.html의 .hero-art, D4).
// 그림 파일 없이 CSS만으로 그린다. 받는 값·상태 없음.
// 마우스가 다가가면 물방울이 살짝 밀려나고 반짝임이 마우스 쪽으로 움직인다 (P136–P137).
// 스타일은 HomePage.css의 "물방울 배경" 부분.
export default function HeroArt() {
  // 물방울 묶음 상자 — 안의 물방울들을 직접 움직이려고 붙잡아 둔다.
  // 마우스가 움직일 때마다 상태를 바꿔 다시 그리면 너무 자주 그려지므로, 상태 대신 DOM을 직접 바꾼다
  const artRef = useRef<HTMLDivElement>(null)

  // 마우스 움직임(브라우저 = React 화면 밖)을 감시하는 일이라 useEffect.
  // 화면을 떠나면 cleanup에서 감시를 해제한다
  useEffect(() => {
    const art = artRef.current
    if (!art) return

    // 마우스가 없는 기기(휴대폰)와 "동작 줄이기"를 켠 사용자에게는 움직이지 않는다
    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!hasMouse || reduceMotion) return

    const droplets = Array.from(art.querySelectorAll<HTMLElement>('.droplet'))
    // 물방울마다 지금 밀려난 거리 — 위치를 잴 때 이만큼 빼야 원래 자리를 기준으로 계산된다
    const offsets = new Map<HTMLElement, { x: number; y: number }>()
    let frame = 0

    function move(droplet: HTMLElement, x: number, y: number, shineX: number, shineY: number) {
      offsets.set(droplet, { x, y })
      droplet.style.setProperty('--push-x', `${x}px`)
      droplet.style.setProperty('--push-y', `${y}px`)
      droplet.style.setProperty('--shine-x', `${shineX}px`)
      droplet.style.setProperty('--shine-y', `${shineY}px`)
    }

    function handlePointerMove(event: PointerEvent) {
      // 마우스 이벤트는 아주 자주 오므로, 화면을 다시 그리는 주기(requestAnimationFrame)에 한 번만 계산
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        for (const droplet of droplets) {
          const rect = droplet.getBoundingClientRect()
          const now = offsets.get(droplet) ?? { x: 0, y: 0 }
          // 원래 자리의 가운데
          const centerX = rect.left + rect.width / 2 - now.x
          const centerY = rect.top + rect.height / 2 - now.y
          const dx = centerX - event.clientX
          const dy = centerY - event.clientY
          const distance = Math.hypot(dx, dy) || 1
          // 0(멀리) ~ 1(아주 가까이)
          const power = Math.max(0, 1 - distance / (rect.width / 2 + REACH))
          const dirX = dx / distance
          const dirY = dy / distance
          move(
            droplet,
            dirX * power * MAX_PUSH, // 마우스 반대쪽으로 밀려남
            dirY * power * MAX_PUSH,
            -dirX * power * MAX_SHINE, // 반짝임은 마우스 쪽으로
            -dirY * power * MAX_SHINE,
          )
        }
      })
    }

    // 마우스가 창 밖으로 나가면 모두 제자리로
    function handlePointerLeave() {
      cancelAnimationFrame(frame)
      for (const droplet of droplets) move(droplet, 0, 0, 0, 0)
    }

    window.addEventListener('pointermove', handlePointerMove)
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return (
    // 장식이라 화면 낭독기는 건너뛰고(aria-hidden), 마우스 클릭도 통과시킨다(CSS pointer-events: none)
    <div ref={artRef} className="hero-art" aria-hidden="true">
      {/* 바닥: 옅은 점 무늬 (가장자리로 갈수록 흐려짐) */}
      <div className="hero-art__dots" />

      {/* 바닥에 비친 물방울 그림자 3개 */}
      <div className="hero-art__shadow hero-art__shadow--1" />
      <div className="hero-art__shadow hero-art__shadow--2" />
      <div className="hero-art__shadow hero-art__shadow--3" />

      {/* 물방울 4개: 큰 것(xl 380px, lg 270px)은 하이라이트 3개, 작은 것(md 96px, sm 72px)은 2개 */}
      <div className="droplet droplet--xl">
        <span className="droplet__shine" />
        <span className="droplet__dot" />
        <span className="droplet__glow" />
      </div>
      <div className="droplet droplet--sm">
        <span className="droplet__shine" />
        <span className="droplet__glow" />
      </div>
      <div className="droplet droplet--lg">
        <span className="droplet__shine" />
        <span className="droplet__dot" />
        <span className="droplet__glow" />
      </div>
      <div className="droplet droplet--md">
        <span className="droplet__shine" />
        <span className="droplet__glow" />
      </div>
    </div>
  )
}
