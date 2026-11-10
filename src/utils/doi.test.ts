import { describe, expect, test } from 'vitest'
import { isValidDoi, normalizeDoi } from './doi.ts'

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
