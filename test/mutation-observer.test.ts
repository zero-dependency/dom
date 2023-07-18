import { describe, expect } from 'vitest'
import { observeElement, waitElement } from '../src/mutation-observer.js'

describe('observeElement', (test) => {
  test('should observe element', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const observerDisconnect = observeElement(div, (mutation, observer) => {
      expect(mutation.target).toBe(div)
      observer.disconnect()
    })
    expect(observerDisconnect).toBeDefined()

    div.textContent = 'bar'
  })
})

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
      waitElement({ selector: 'div', rejectAfterMs: 100 })
    ).rejects.toThrowError('waitElement rejected after 100ms')
  })
})
