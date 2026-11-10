import { describe, expect, test } from 'vitest'
import type { Achievement } from '../types.ts'
import { findDuplicateDoi, isValidDoi, normalizeDoi } from './doi.ts'

// DOI 글자 규칙 테스트 (spec/03 C-3, test-cases UT-71~72). 실행: npm test

describe('normalizeDoi · isValidDoi — DOI 정리·모양 (BR-05, EX-02)', () => {
  test('UT-71 붙여 넣은 앞부분·공백을 떼고 번호만 (대소문자 무시)', () => {
    const doi = '10.1038/nature14539'
    expect(normalizeDoi(doi)).toBe(doi) // 이미 번호면 그대로
    expect(normalizeDoi('  10.1038/nature14539  ')).toBe(doi)
    expect(normalizeDoi('https://doi.org/10.1038/nature14539')).toBe(doi)
    expect(normalizeDoi('HTTPS://DOI.ORG/10.1038/nature14539')).toBe(doi)
    expect(normalizeDoi('http://dx.doi.org/10.1038/nature14539')).toBe(doi)
    expect(normalizeDoi('DOI: 10.1038/nature14539')).toBe(doi)
    expect(normalizeDoi('https://doi.org/ 10.1038/nature14539')).toBe(doi) // 떼고 남은 공백도
    expect(normalizeDoi('   ')).toBe('')
  })

  test('UT-72 "10." + 숫자 4~9자리 + "/" + 공백 없는 글자만 DOI 모양', () => {
    expect(isValidDoi('10.1038/nature14539')).toBe(true)
    expect(isValidDoi('10.1002/(SICI)1097-4636(199706)35:3<283::AID-JBM1>3.0.CO;2-L')).toBe(true) // 특수 글자 DOI
    for (const doi of ['abc', '10.1038', '10.1038/', '10.12/x', '10.1038/a b', '', 'doi:10.1038/nature14539']) {
      expect(isValidDoi(doi)).toBe(false)
    }
  })
})

describe('findDuplicateDoi — 같은 DOI 경고 (Q-C7, C-4)', () => {
  const make = (id: number, doi: string): Achievement => ({
    id, type: 'PAPER', title: `성과 ${id}`, achievedOn: '2026-01-01', authors: '', advisors: '', venue: '', doi, link: '', isSample: false,
  })
  const list = [make(1, '10.1038/Nature14539'), make(2, ''), make(3, 'https://doi.org/10.5555/abc')]

  test('UT-77 대소문자·주소째 저장도 같은 DOI로, 자기 자신·빈 DOI는 빼고 찾음', () => {
    expect(findDuplicateDoi(list, '10.1038/nature14539', null)?.id).toBe(1) // 대소문자 무시
    expect(findDuplicateDoi(list, 'doi: 10.5555/ABC', null)?.id).toBe(3) // 주소째 저장된 옛 값
    expect(findDuplicateDoi(list, '10.1038/nature14539', 1)).toBeNull() // 수정 중인 자기 자신
    expect(findDuplicateDoi(list, '   ', null)).toBeNull() // 빈 DOI끼리는 같은 DOI가 아님
    expect(findDuplicateDoi(list, '10.9999/none', null)).toBeNull()
  })
})
