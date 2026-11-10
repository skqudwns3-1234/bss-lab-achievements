import { afterEach, describe, expect, test, vi } from 'vitest'
import { fetchCrossrefWork } from './crossref.ts'

// Crossref 호출 테스트 (spec/03 C-3, test-cases UT-73~76). 실행: npm test
// 진짜 인터넷을 쓰지 않고 fetch를 가짜로 바꿔(vi.stubGlobal) 응답을 마음대로 만들어 본다.
// 진짜 Crossref 호출은 개발 화면에서 따로 확인 (03 검증 표)

const DOI = '10.1038/nature14539'

// P219에 실제로 받은 응답 모양을 줄인 것
const NATURE_MESSAGE = {
  title: ['Deep learning'],
  author: [
    { given: 'Yann', family: 'LeCun' },
    { given: 'Yoshua', family: 'Bengio' },
    { given: 'Geoffrey', family: 'Hinton' },
  ],
  'container-title': ['Nature'],
  issued: { 'date-parts': [[2015, 5, 27]] },
  URL: 'http://dx.doi.org/10.1038/nature14539',
}

// 가짜 fetch — 받은 주소를 기록하고, 정해 둔 응답(또는 오류)을 돌려준다
function stubFetch(answer: () => Response | Promise<Response>) {
  const fake = vi.fn((_url: string, _init?: RequestInit) => Promise.resolve().then(answer))
  vi.stubGlobal('fetch', fake)
  return fake
}

// message만 바꿔 정상(200) 응답 만들기
function okWith(message: unknown) {
  return () => new Response(JSON.stringify({ status: 'ok', message }), { status: 200 })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchCrossrefWork — DOI로 논문 정보 (FR-13)', () => {
  test('UT-73 정상 응답 → 폼 5칸, 요청 주소는 DOI를 안전하게 바꾼 것이고 이메일(mailto)이 없음', async () => {
    const fake = stubFetch(okWith(NATURE_MESSAGE))
    const result = await fetchCrossrefWork(DOI)
    expect(result).toEqual({
      ok: true,
      work: {
        title: 'Deep learning',
        authors: 'Yann LeCun, Yoshua Bengio, Geoffrey Hinton',
        venue: 'Nature',
        achievedOn: '2015-05-27',
        link: 'https://doi.org/10.1038/nature14539', // 응답의 http://dx.doi.org 대신 직접 (결정 ⑥)
      },
    })
    const url = fake.mock.calls[0][0]
    expect(url).toBe('https://api.crossref.org/works/10.1038%2Fnature14539')
    expect(url).not.toContain('mailto')
  })

  test('UT-74 실패 종류 — 404는 not-found, 서버 오류·인터넷 끊김·깨진 응답은 failed, 취소는 aborted', async () => {
    stubFetch(() => new Response('Resource not found.', { status: 404 }))
    expect(await fetchCrossrefWork(DOI)).toEqual({ ok: false, reason: 'not-found' })

    for (const status of [500, 429, 503]) {
      stubFetch(() => new Response('error', { status }))
      expect(await fetchCrossrefWork(DOI)).toEqual({ ok: false, reason: 'failed' })
    }

    // 인터넷 끊김: 브라우저 fetch는 TypeError를 던진다
    stubFetch(() => Promise.reject(new TypeError('Failed to fetch')))
    expect(await fetchCrossrefWork(DOI)).toEqual({ ok: false, reason: 'failed' })

    // 취소: 신호가 취소된 상태에서 fetch가 AbortError를 던짐
    const controller = new AbortController()
    controller.abort()
    stubFetch(() => Promise.reject(new DOMException('aborted', 'AbortError')))
    expect(await fetchCrossrefWork(DOI, controller.signal)).toEqual({ ok: false, reason: 'aborted' })

    // 200인데 JSON이 깨짐 / message가 없음 / message가 배열
    stubFetch(() => new Response('{ "message": ', { status: 200 }))
    expect(await fetchCrossrefWork(DOI)).toEqual({ ok: false, reason: 'failed' })
    stubFetch(() => new Response(JSON.stringify({ status: 'ok' }), { status: 200 }))
    expect(await fetchCrossrefWork(DOI)).toEqual({ ok: false, reason: 'failed' })
    stubFetch(okWith([]))
    expect(await fetchCrossrefWork(DOI)).toEqual({ ok: false, reason: 'failed' })

    // 짝 없는 특수 문자 DOI — 주소로 만들 수 없어도 오류를 던지지 않고 failed (UT-60과 같은 경우)
    const fake = stubFetch(okWith(NATURE_MESSAGE))
    await expect(fetchCrossrefWork('10.1234/\ud800')).resolves.toEqual({ ok: false, reason: 'failed' })
    expect(fake).not.toHaveBeenCalled()
  })

  test('UT-75 빠진 칸은 빈칸 — 저자 없음·단체·성만·처음 3명 + 외 N명, 날짜는 issued만(빠진 월·일 01, 없는 날짜는 빈칸)', async () => {
    const run = async (message: unknown) => {
      stubFetch(okWith(message))
      const result = await fetchCrossrefWork(DOI)
      if (!result.ok) throw new Error('ok여야 함')
      return result.work
    }

    // 저자
    expect((await run({ title: ['T'] })).authors).toBe('') // author 없음
    expect((await run({ author: [{ name: 'ImageNet Consortium' }, { family: 'Kim' }, { given: ' ', family: ' ' }, 'abc'] })).authors).toBe(
      'ImageNet Consortium, Kim',
    )
    // 저자는 처음 3명 + " 외 N명" (C-4 결정 P235) — 3명은 그대로, 4명부터 줄임, 빈 이름은 세지 않음
    const people = (n: number) => Array.from({ length: n }, (_, i) => ({ given: 'A', family: `B${i}` }))
    expect((await run({ author: people(3) })).authors).toBe('A B0, A B1, A B2')
    expect((await run({ author: people(4) })).authors).toBe('A B0, A B1, A B2 외 1명')
    expect((await run({ author: [...people(1012), { given: '', family: '' }] })).authors).toBe('A B0, A B1, A B2 외 1009명')

    // 날짜
    expect((await run({ issued: { 'date-parts': [[2015]] } })).achievedOn).toBe('2015-01-01')
    expect((await run({ issued: { 'date-parts': [[2015, 5]] } })).achievedOn).toBe('2015-05-01')
    expect((await run({ issued: { 'date-parts': [[2015, 2, 30]] } })).achievedOn).toBe('') // 없는 날짜
    expect((await run({ issued: { 'date-parts': [[null]] } })).achievedOn).toBe('')
    expect((await run({ issued: {} })).achievedOn).toBe('')
    expect((await run({ title: ['T'] })).achievedOn).toBe('') // issued 없음

    // 학술지 없음(학회 발표 자료 등)·제목 없음 → 빈칸, 링크는 늘 있음
    const empty = await run({ 'container-title': [] })
    expect(empty).toEqual({ title: '', authors: '', venue: '', achievedOn: '', link: 'https://doi.org/10.1038/nature14539' })
  })

  test('UT-76 제목·학술지 다듬기 — 태그 지우기 → 표기 되돌리기 → 공백 하나로', async () => {
    stubFetch(
      okWith({
        title: ['<i>E. coli</i> &amp; H<sub>2</sub>O\n   study &#8211; part&#x2014;1 &lt;b&gt; &unknown;'],
        'container-title': ['Journal of A &amp; B'],
      }),
    )
    const result = await fetchCrossrefWork(DOI)
    if (!result.ok) throw new Error('ok여야 함')
    // 원래 글자였던 &lt;b&gt;는 태그로 지워지지 않고 "<b>" 글자로 남음, 모르는 표기는 그대로
    expect(result.work.title).toBe('E. coli & H2O study – part—1 <b> &unknown;')
    expect(result.work.venue).toBe('Journal of A & B')
  })
})
