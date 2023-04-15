import { describe, expect, expectTypeOf, vi } from 'vitest'
import { addEvent, el, nbsp, text } from '../src/html.js'

describe('el', (test) => {
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

describe('nbsp', (test) => {
  test('should be defined', () => {
    expect(nbsp).toBeDefined()
  })

  test('should create a text node', () => {
    expect(nbsp()).toBeInstanceOf(Text)
    expect(nbsp().textContent).toBe('\u00a0')
  })
})

describe('text', (test) => {
  test('should be defined', () => {
    expect(text).toBeDefined()
  })

  test('should create a text node', () => {
    expect(text('foo')).toBeInstanceOf(Text)
  })
})

describe('addEvent', (test) => {
  test('should be defined', () => {
    expect(addEvent).toBeDefined()
  })

  test('should add an event listener', () => {
    const el = document.createElement('div')
    const handler = vi.fn()

    addEvent(el, 'click', handler)
    el.click()

    expect(handler).toBeCalled()
  })

  test('should add an event listener with options', () => {
    const el = document.createElement('div')
    const handler = vi.fn()

    addEvent(el, 'click', handler, { once: true })
    el.click()
    el.click()

    expect(handler).toBeCalledTimes(1)
  })

  test('should remove an event listener', () => {
    const el = document.createElement('div')
    const handler = vi.fn()

    const remove = addEvent(el, 'click', handler)
    el.click()
    remove()
    el.click()

    expect(handler).toBeCalledTimes(1)
  })
})
