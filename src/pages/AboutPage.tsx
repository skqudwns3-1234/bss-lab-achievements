import { LAB } from '../data/lab.ts'

export default function AboutPage() {
  return (
    <section>
      <h1 className="page-title">연구실 소개</h1>
      {/* 첫머리에 BSS 풀 네임 — 다른 곳은 "BSS 연구실"로 짧게 쓰므로 여기서 풀어 준다 (P109, 한글 이름 P122) */}
      <p>
        {LAB.shortName}는 <strong>{LAB.fullName}</strong>({LAB.koreanName})의 줄임말이에요.
      </p>
      <p className="placeholder-note">5단계에서 구현합니다.</p>
    </section>
  )
}
