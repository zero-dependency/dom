import { describe, expect, expectTypeOf, test, vi } from 'vitest'
import {
  domReady,
  el,
  isDisabled,
  nbsp,
  text
} from '../src/html.js'

describe('el', () => {
  test('should be defined', () => {
    expect(el).toBeDefined()
  })

  test('expectTypeOf', () => {
    expectTypeOf(el('div')).toEqualTypeOf<HTMLDivElement>()
    expectTypeOf(el('input')).toEqualTypeOf<HTMLInputElement>()
  })

  test('should create an element', () => {
    expect(el('div')).toBeInstanceOf(HTMLDivElement)
  })

  test('should create an element with attributes', () => {
    expect(el('div', { id: 'foo' }).id).toBe('foo')
  })

  test('should create an element with childrens', () => {
    expect(el('div', {}, 'foo').textContent).toBe('foo')
    expect(el('div', 'foo', 'bar').textContent).toBe('foobar')
    expect(el('div', ['foo', 'bar']).textContent).toBe('foobar')
  })
})

describe('nbsp', () => {
  test('should be defined', () => {
    expect(nbsp).toBeDefined()
  })

  test('should create a text node', () => {
    expect(nbsp()).toBeInstanceOf(Text)
    expect(nbsp().textContent).toBe('\u00a0')
  })
})

describe('text', () => {
  test('should be defined', () => {
    expect(text).toBeDefined()
  })

  test('should create a text node', () => {
    expect(text('foo')).toBeInstanceOf(Text)
  })
})

describe('domReady', () => {
  test('should be defined', () => {
    expect(domReady).toBeDefined()
  })

  // uncovered lines in src/html.ts:42-44
  test('should return a promise', () => {
    expect(domReady()).toBeInstanceOf(Promise)
  })
})

describe('isDisabled', () => {
  test('should be defined', () => {
    expect(isDisabled).toBeDefined()
  })

  // https://github.com/vitest-dev/vitest/issues/664
  // test('should return true when element is aria-disabled', () => {
  //   const div = el('div', { ariaDisabled: 'true' })
  //   expect(isDisabled(div)).toBe(true)
  // })

  // test('should return true when element is disabled', () => {
  //   const input = el('input', { disabled: true })
  //   expect(isDisabled(input)).toBe(true)
  // })

  // test('should return false when element is not disabled', () => {
  //   const div = el('div')
  //   expect(isDisabled(div)).toBe(false)
  // })
})
