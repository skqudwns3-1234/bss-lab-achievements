import { useEffect, useRef } from 'react'

// ── 물 표면 움직임 값 (숫자를 바꿔 느낌을 조절한다) ──
const POINTS = 48 // 테두리를 나누는 점 개수 — 많을수록 매끄럽지만 계산이 늘어난다
const DENT = 0.22 // 마우스가 닿은 곳이 최대로 눌리는 깊이 (반지름 대비 비율)
const REACH = 0.55 // 마우스 주변 몇 % 범위의 테두리가 함께 눌리나 (반지름 대비)
const PRESS = 0.18 // 마우스가 표면을 누르는 힘 — 클수록 빨리 따라 눌림
const SPRING = 0.05 // 눌린 점이 제자리로 돌아가려는 힘 — 클수록 빨리 튀어 오름
const WAVE = 0.16 // 옆 점끼리 서로 끌어당기는 힘 — 클수록 물결이 멀리 퍼짐
const DAMPING = 0.9 // 매 프레임 남는 속도 비율 — 1에 가까울수록 오래 출렁임
const REST = 0.05 // 모든 점이 이보다 덜 움직이면 멈춘 것으로 보고 계산을 쉰다(px)

// 물방울 하나의 물리 상태: 테두리 점마다 "원래 원에서 안쪽으로 들어간 거리"와 그 속도
type Surface = {
  wrap: HTMLElement // 바깥 상자 (위치·크기)
  body: HTMLElement // 몸통 (이 모양을 바꾼다)
  size: number // 원래 지름(px, 확대·축소 전)
  offsets: Float32Array // 점마다 안쪽으로 들어간 거리 (음수면 바깥으로)
  velocities: Float32Array
}

// 점들을 잇는 매끄러운 닫힌 곡선(SVG path) — 이웃 점 사이 가운데를 지나는 2차 곡선
function toPath(surface: Surface): string {
  const radius = surface.size / 2
  const pts: [number, number][] = []
  for (let i = 0; i < POINTS; i++) {
    const angle = (i / POINTS) * Math.PI * 2
    const r = radius - surface.offsets[i]
    pts.push([radius + Math.cos(angle) * r, radius + Math.sin(angle) * r])
  }
  const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const start = mid(pts[POINTS - 1], pts[0])
  let d = `M${start[0].toFixed(1)},${start[1].toFixed(1)}`
  for (let i = 0; i < POINTS; i++) {
    const next = mid(pts[i], pts[(i + 1) % POINTS])
    d += `Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${next[0].toFixed(1)},${next[1].toFixed(1)}`
  }
  return `${d}Z`
}

// 홈 첫 화면 오른쪽의 물방울 장식 (spec/01_home 1-8, 시안 Main.dc.html의 .hero-art, D4).
// 그림은 CSS만으로 그린다. 받는 값·상태 없음.
// 마우스를 대면 그 부분의 표면이 물처럼 눌리고, 떼면 물결이 퍼지며 출렁이다 제자리로 (P140, P146).
// 원리: 테두리를 점 48개로 나눠 점마다 작은 스프링을 달고, 매 프레임 점 위치로 몸통 모양(clip-path)을 다시 그린다.
// 스타일은 HomePage.css의 "물방울 배경" 부분.
export default function HeroArt() {
  // 물방울 묶음 상자 — 안의 물방울들을 직접 바꾸려고 붙잡아 둔다.
  // 매 프레임 바뀌는 값을 상태로 두면 초당 60번 다시 그리게 되므로, 상태 대신 DOM을 직접 바꾼다
  const artRef = useRef<HTMLDivElement>(null)

  // 마우스 움직임(브라우저 = React 화면 밖)을 감시하고 애니메이션을 돌리는 일이라 useEffect.
  // 화면을 떠나면 cleanup에서 감시와 애니메이션을 멈춘다
  useEffect(() => {
    const art = artRef.current
    if (!art) return

    // 마우스가 없는 기기(휴대폰)와 "동작 줄이기"를 켠 사용자에게는 움직이지 않는다
    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!hasMouse || reduceMotion) return

    const surfaces: Surface[] = Array.from(art.querySelectorAll<HTMLElement>('.droplet')).map((wrap) => ({
      wrap,
      body: wrap.querySelector<HTMLElement>('.droplet__body')!,
      size: wrap.offsetWidth,
      offsets: new Float32Array(POINTS),
      velocities: new Float32Array(POINTS),
    }))

    let pointer: { x: number; y: number } | null = null // 화면 기준 마우스 위치 (창 밖이면 null)
    let frame = 0 // 돌고 있는 애니메이션 번호 (0이면 쉬는 중)

    // 한 프레임: 마우스가 누르는 힘 + 스프링 + 옆 점과의 물결을 계산해 점을 움직이고 모양을 다시 그린다
    function step() {
      let moving = false
      let pressing = false // 마우스가 어느 물방울이든 누르고 있는지

      for (const s of surfaces) {
        const radius = s.size / 2
        // 마우스 위치를 이 물방울의 원래 크기 기준 좌표로 (첫 화면이 축소돼 있어도 맞게)
        let local: { x: number; y: number } | null = null
        if (pointer) {
          const rect = s.wrap.getBoundingClientRect()
          const scale = rect.width / s.size
          local = { x: (pointer.x - rect.left) / scale - radius, y: (pointer.y - rect.top) / scale - radius }
        }

        for (let i = 0; i < POINTS; i++) {
          const angle = (i / POINTS) * Math.PI * 2
          let force = -SPRING * s.offsets[i] // 제자리로
          const prev = s.offsets[(i - 1 + POINTS) % POINTS]
          const next = s.offsets[(i + 1) % POINTS]
          force += WAVE * (prev + next - 2 * s.offsets[i]) // 옆 점과 높이를 맞추려는 힘 → 물결

          if (local) {
            // 이 점(원래 원 위)과 마우스 사이 거리 → 가까울수록 깊이 눌리는 목표
            const px = Math.cos(angle) * radius
            const py = Math.sin(angle) * radius
            const distance = Math.hypot(px - local.x, py - local.y)
            const range = radius * REACH + 12
            if (distance < range) {
              pressing = true
              const closeness = 1 - distance / range
              const target = closeness * closeness * radius * DENT
              if (target > s.offsets[i]) force += PRESS * (target - s.offsets[i])
            }
          }

          // 속도만 먼저 바꾸고, 위치는 모든 점의 힘을 다 계산한 뒤 한꺼번에 옮긴다.
          // (점을 하나씩 바로 옮기면 옆 점이 이미 바뀐 값을 보고 계산해 출렁임이 점점 커지며 터짐 — P146 확인)
          s.velocities[i] = (s.velocities[i] + force) * DAMPING
        }

        let active = false
        for (let i = 0; i < POINTS; i++) {
          s.offsets[i] += s.velocities[i]
          if (Math.abs(s.offsets[i]) > REST || Math.abs(s.velocities[i]) > REST) active = true
        }

        if (active) {
          s.body.style.clipPath = `path('${toPath(s)}')`
          moving = true
        } else if (s.body.style.clipPath) {
          // 완전히 멈추면 원래의 매끈한 원으로
          s.offsets.fill(0)
          s.velocities.fill(0)
          s.body.style.clipPath = ''
        }
      }

      // 아직 움직이거나 누르는 중이면 다음 프레임도 계산, 아니면 쉰다 (마우스가 멀리 있으면 계산 안 함)
      frame = moving || pressing ? requestAnimationFrame(step) : 0
    }

    function wake() {
      if (!frame) frame = requestAnimationFrame(step)
    }

    function handlePointerMove(event: PointerEvent) {
      pointer = { x: event.clientX, y: event.clientY }
      wake()
    }

    // 마우스가 창 밖으로 나가면 누르던 힘이 사라지고, 남은 출렁임만 잦아든다
    function handlePointerLeave() {
      pointer = null
      wake()
    }

    window.addEventListener('pointermove', handlePointerMove)
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      for (const s of surfaces) s.body.style.clipPath = ''
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

      {/* 물방울 4개: 큰 것(xl 380px, lg 270px)은 하이라이트 3개, 작은 것(md 96px, sm 72px)은 2개.
          바깥 상자(droplet)는 바닥 그림자, 몸통(droplet__body)은 눌리는 부분 */}
      <div className="droplet droplet--xl">
        <div className="droplet__body">
          <span className="droplet__shine" />
          <span className="droplet__dot" />
          <span className="droplet__glow" />
        </div>
      </div>
      <div className="droplet droplet--sm">
        <div className="droplet__body">
          <span className="droplet__shine" />
          <span className="droplet__glow" />
        </div>
      </div>
      <div className="droplet droplet--lg">
        <div className="droplet__body">
          <span className="droplet__shine" />
          <span className="droplet__dot" />
          <span className="droplet__glow" />
        </div>
      </div>
      <div className="droplet droplet--md">
        <div className="droplet__body">
          <span className="droplet__shine" />
          <span className="droplet__glow" />
        </div>
      </div>
    </div>
  )
}
