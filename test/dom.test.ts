import { expect, test } from 'vitest'
import { el } from '../src/index.js'

test('dom createElement', () => {
  expect(el('div', { textContent: 'Hello' })).toBeDefined()
})
