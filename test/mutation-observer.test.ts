import { describe, expect } from 'vitest'

import { observeElement } from '../src/observe-element.js'

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
