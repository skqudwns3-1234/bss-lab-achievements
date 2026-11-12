import { describe, expect, test } from 'vitest'
import { LAB } from '../data/lab.ts'
import { countText, mapSearchUrl } from './lab.ts'

describe('countText — 연구실 소개 한눈에 보기 숫자 (spec/05 E-1)', () => {
  test('UT-90 0이면 "아직 없음", 아니면 숫자 + 단위 / 이상한 값도 "아직 없음"', () => {
    expect(countText(0, '명')).toBe('아직 없음')
    expect(countText(1, '명')).toBe('1명')
    expect(countText(128, '건')).toBe('128건')
    expect(countText(-1, '건')).toBe('아직 없음')
    expect(countText(Number.NaN, '건')).toBe('아직 없음')
  })

  test('UT-91 mapSearchUrl — 한글·앞뒤 공백·빈칸·주소를 깨는 글자 (spec/05 E-2)', () => {
    expect(mapSearchUrl('대진대학교 이공학관')).toBe(
      'https://map.kakao.com/link/search/%EB%8C%80%EC%A7%84%EB%8C%80%ED%95%99%EA%B5%90%20%EC%9D%B4%EA%B3%B5%ED%95%99%EA%B4%80',
    )
    expect(mapSearchUrl('  이공학관  ')).toBe(mapSearchUrl('이공학관')) // 앞뒤 공백은 뗌
    expect(mapSearchUrl('')).toBeNull()
    expect(mapSearchUrl('   ')).toBeNull()
    // /·#·&·?가 그대로 들어가면 주소의 다른 부분(경로·해시·검색 조건)으로 읽혀 검색어가 잘림 → 모두 바뀌어 한 덩어리
    const tricky = mapSearchUrl('A동/401호 #2 & ?')
    expect(tricky).toBe('https://map.kakao.com/link/search/A%EB%8F%99%2F401%ED%98%B8%20%232%20%26%20%3F')
    expect(decodeURIComponent((tricky ?? '').split('/link/search/')[1])).toBe('A동/401호 #2 & ?')
  })

  test('UT-92 lab.ts 연구실 연락처 — 메일 모양, 위치가 있으면 지도 검색어도 (05 점검 P283)', () => {
    // 소개·푸터에서 mailto:로 쓰는 메일 — 부원·교수 메일(UT-83)과 같은 규칙: 빈칸 또는 이름@도메인.끝
    const email = LAB.contactEmail.trim()
    if (email !== '') expect(email, `연구실 메일 "${email}" 모양이 이상함`).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    // 위치 줄이 보이는데 검색어가 비면 링크 없는 줄이 됨 — 일부러 비울 수도 있지만 실수일 가능성이 커서 알려 줌
    if (LAB.location.trim() !== '' || LAB.address.trim() !== '') {
      expect(mapSearchUrl(LAB.mapQuery), '위치가 있는데 지도 검색어(mapQuery)가 비어 있음').not.toBeNull()
    }
  })

  test('UT-90b lab.ts 소개 문단 — 빈 줄 없음 (빈 줄은 화면에서 빼지만 데이터 실수일 가능성이 커서 알려 줌)', () => {
    LAB.about.forEach((paragraph, index) => {
      expect(paragraph.trim(), `소개 문단 ${index + 1}번째 줄이 비어 있음`).not.toBe('')
    })
  })
})
