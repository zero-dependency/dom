import { describe, expect } from 'vitest'

import { waitElement } from '../src/wait-element.js'

describe('waitElement', (test) => {
  test('should wait element', async () => {
    const div = document.createElement('div')
    div.classList.add('foo')
    setTimeout(() => document.body.appendChild(div), 0)
    const el = await waitElement({ selector: 'div.foo' })
    expect(el).toBe(div)
  })

  test('reject wait element after ms', async () => {
    await expect(() =>
      waitElement({ selector: 'div', rejectTimeoutMs: 100 })
    ).rejects.toThrowError('waitElement rejected (100ms)')
  })

  test('reject abort controller', async () => {
    await expect(() => {
      const abortController = new AbortController()
      const promise = waitElement({
        selector: 'div',
        signal: abortController.signal
      })
      abortController.abort('Aborted')
      return promise
    }).rejects.toThrowError('Aborted')

    await expect(async () => {
      const abortController = new AbortController()
      const promise = waitElement({
        selector: 'dev',
        rejectTimeoutMs: 100,
        signal: abortController.signal
      })

      await new Promise((resolve) => setTimeout(resolve, 100))
      abortController.abort('Abort?')
      abortController.abort('Abort??')
      return promise
    }).rejects.toThrowError('waitElement rejected (100ms)')
  })
})
