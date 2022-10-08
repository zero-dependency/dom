import { el } from '../src/index.js'
import { expect, test,  } from 'vitest'

test('dom createElement', () => {
  expect(el('div', { textContent: 'Hello' })).toBeDefined()
})
