import { describe, expect, test } from 'vitest'
import { doiUrl, safeLink } from './links.ts'

// 링크·DOI 테스트 (spec/01 1-9, test-cases UT-55~56). 실행: npm test

describe('safeLink · doiUrl — 팝업에 거는 링크', () => {
  test('UT-55 원문 링크는 http(s)일 때만 (대문자 OK, javascript:·ftp:·빈칸·주소 아님은 null)', () => {
    expect(safeLink('https://example.com/paper-1')).toBe('https://example.com/paper-1')
    expect(safeLink('  HTTPS://Example.com/a  ')).toBe('https://example.com/a')
    expect(safeLink('http://lab.ac.kr')).toBe('http://lab.ac.kr/')
    expect(safeLink('javascript:alert(1)')).toBeNull()
    expect(safeLink('ftp://files.example.com')).toBeNull()
    expect(safeLink('example.com/paper')).toBeNull()
    expect(safeLink('   ')).toBeNull()
  })

  test('UT-56 DOI는 doi.org 주소로 (붙여 넣은 앞부분 정리, 이상한 글자 안전하게, 빈칸은 null)', () => {
    expect(doiUrl('10.1038/nature14539')).toBe('https://doi.org/10.1038/nature14539')
    expect(doiUrl('https://doi.org/10.1038/nature14539')).toBe('https://doi.org/10.1038/nature14539')
    expect(doiUrl('doi: 10.1038/nature14539')).toBe('https://doi.org/10.1038/nature14539')
    expect(doiUrl('10.1000/a b<c>')).toBe('https://doi.org/10.1000/a%20b%3Cc%3E')
    expect(doiUrl('  ')).toBeNull()
  })
})
