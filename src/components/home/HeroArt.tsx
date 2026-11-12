import { useEffect, useRef, useState, type AnimationEvent as ReactAnimationEvent } from 'react'
import { HONORARY_MEMBER } from '../../data/members.ts'
import { DROPLET_TAP_COUNT, EMPTY_TAP, registerTap } from '../../utils/secretTap.ts'
import HiddenMemberModal from '../members/HiddenMemberModal.tsx'

// 마우스가 이만큼(px) 안으로 다가오면 물방울이 반응한다 (물방울 반지름 + REACH)
const REACH = 160
// 가장 가까이 왔을 때 물방울이 밀려나는 거리(px)
const MAX_PUSH = 28
// 가장 가까이 왔을 때 반짝임이 마우스 쪽으로 움직이는 거리(px)
const MAX_SHINE = 8
// 마우스가 이 정도(0~1)보다 가까이 들어오는 순간 한 번 출렁인다
const WOBBLE_AT = 0.15

// 홈 첫 화면 오른쪽의 물방울 장식 (spec/01_home 1-8, 시안 Main.dc.html의 .hero-art, D4).
// 그림 파일 없이 CSS만으로 그린다. 받는 값 없음.
// 마우스가 다가가면 물방울이 살짝 밀려나고 반짝임이 마우스 쪽으로 움직인다 (P136–P137).
// 가까이 들어오는 순간에는 젤리처럼 한 번 출렁인다 (P138).
// 이스터에그 2 (P313–P314): 큰 물방울을 2초 안에 3번 누르면 "톡" 터지고 명예 부원 카드 팝업. 닫으면 물방울이 돌아온다.
// 상태: popped(터졌는지 — 물방울 모양이 바뀜), honoraryOpen(팝업) / ref: 누른 횟수(화면에 안 보임), 큰 물방울 DOM, 터지는 중인지
// 스타일은 HomePage.css의 "물방울 배경" 부분.
export default function HeroArt() {
  // 물방울 묶음 상자 — 안의 물방울들을 직접 움직이려고 붙잡아 둔다.
  // 마우스가 움직일 때마다 상태를 바꿔 다시 그리면 너무 자주 그려지므로, 상태 대신 DOM을 직접 바꾼다
  const artRef = useRef<HTMLDivElement>(null)
  // ── 이스터에그 2 (P313–P314) ──
  const [popped, setPopped] = useState(false) // 큰 물방울이 터졌는지 → droplet--popped 클래스
  const [honoraryOpen, setHonoraryOpen] = useState(false) // 명예 부원 팝업
  const dropletRef = useRef<HTMLDivElement>(null) // 큰 물방울 — 누른 곳이 물방울 안인지 재려고
  const tapRef = useRef(EMPTY_TAP) // 누른 횟수·처음 시각 — 화면에 안 보이는 값이라 상태가 아님 (로고 이스터에그와 같은 판단)
  const busyRef = useRef(false) // 터지는 중·팝업이 열린 동안은 세지 않음 (팝업 바탕을 누른 것까지 세지 않게)

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
    // 물방울마다 지난번에 마우스가 가까이 있었는지 — "들어오는 순간"에만 출렁이게
    const wasNear = new Map<HTMLElement, boolean>()
    let frame = 0

    // 출렁임: CSS 애니메이션 클래스를 뺐다가 다시 붙여 처음부터 재생
    function wobble(droplet: HTMLElement) {
      droplet.classList.remove('droplet--wobble')
      void droplet.offsetWidth // 브라우저가 클래스 제거를 반영하게 한 번 계산시킴 (이게 없으면 다시 붙여도 재생 안 됨)
      droplet.classList.add('droplet--wobble')
    }

    // 출렁임이 끝나면 클래스를 떼어 다음 출렁임을 준비
    function handleAnimationEnd(event: AnimationEvent) {
      if (event.animationName === 'droplet-wobble') {
        ;(event.target as HTMLElement).classList.remove('droplet--wobble')
      }
    }

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
          const near = power > WOBBLE_AT
          if (near && !wasNear.get(droplet)) wobble(droplet)
          wasNear.set(droplet, near)

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
      for (const droplet of droplets) {
        move(droplet, 0, 0, 0, 0)
        wasNear.set(droplet, false)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    art.addEventListener('animationend', handleAnimationEnd)
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointerMove)
      art.removeEventListener('animationend', handleAnimationEnd)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  // 큰 물방울 누르기 감시 (P313–P314). 물방울은 글 묶음 뒤에 있어 물방울 자체에 클릭을 받으면 글 묶음에 가려져서,
  // 화면 전체의 클릭을 듣고 "누른 곳이 큰 물방울 동그라미 안인지"를 잰다. 링크·버튼·입력칸·팝업 클릭과
  // 글자를 드래그해 고른 경우는 세지 않음 — 원래 동작(링크 이동, 글자 복사)은 그대로. 브라우저 일이라 useEffect, 떠나면 해제
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const droplet = dropletRef.current
      if (!droplet || busyRef.current) return
      if (
        event.target instanceof Element &&
        event.target.closest('a, button, input, select, textarea, label, [role="dialog"]')
      )
        return
      if ((window.getSelection()?.toString() ?? '') !== '') return
      const rect = droplet.getBoundingClientRect() // 휴대폰에서 줄어든 크기·밀려난 위치까지 반영된 실제 화면 위치
      const radius = rect.width / 2
      const distance = Math.hypot(event.clientX - (rect.left + radius), event.clientY - (rect.top + rect.height / 2))
      if (distance > radius) return

      const { state, triggered } = registerTap(tapRef.current, Date.now(), DROPLET_TAP_COUNT)
      tapRef.current = state
      if (!triggered) return
      busyRef.current = true
      setPopped(true)
      // "동작 줄이기"면 터지는 애니메이션이 없어 끝 신호도 안 오므로 바로 팝업
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setHonoraryOpen(true)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  // 터지는 애니메이션이 끝나면 팝업 (출렁임 끝 신호는 위 effect가 따로 처리)
  function handleDropletAnimationEnd(event: ReactAnimationEvent<HTMLDivElement>) {
    if (event.animationName === 'droplet-pop') setHonoraryOpen(true)
  }

  // 팝업을 닫으면 물방울이 돌아오고 다시 셀 수 있게
  function closeHonorary() {
    setHonoraryOpen(false)
    setPopped(false)
    busyRef.current = false
  }

  return (
    <>
      {/* 장식이라 화면 낭독기는 건너뛰고(aria-hidden), 마우스 클릭도 통과시킨다(CSS pointer-events: none) */}
      <div ref={artRef} className="hero-art" aria-hidden="true">
        {/* 바닥: 옅은 점 무늬 (가장자리로 갈수록 흐려짐) */}
        <div className="hero-art__dots" />

        {/* 바닥에 비친 물방울 그림자 3개 */}
        <div className="hero-art__shadow hero-art__shadow--1" />
        <div className="hero-art__shadow hero-art__shadow--2" />
        <div className="hero-art__shadow hero-art__shadow--3" />

        {/* 물방울 4개: 큰 것(xl 380px, lg 270px)은 하이라이트 3개, 작은 것(md 96px, sm 72px)은 2개 */}
        <div
          ref={dropletRef}
          className={`droplet droplet--xl ${popped ? 'droplet--popped' : ''}`}
          onAnimationEnd={handleDropletAnimationEnd}
        >
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

      {/* 명예 부원 팝업 — 물방울 상자(aria-hidden, 휴대폰에서 transform) 밖 형제로: 안에 두면 낭독기가 못 읽고 위치도 틀어짐 */}
      {honoraryOpen && (
        <HiddenMemberModal member={HONORARY_MEMBER} title="명예 부원을 찾았어요" onClose={closeHonorary} />
      )}
    </>
  )
}
