import { describe, expect, expectTypeOf } from 'vitest'

import { el, nbsp, text } from '../src/html.js'

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

  test('snapshot example test', () => {
    expect(
      el('div', { id: 'foo', style: { background: 'red' } }, 'Hello world')
    ).toMatchSnapshot()
    expect(el('div', 'Hello world')).toMatchSnapshot()
    expect(
      el('div', [el('span', 'Hello'), el('span', 'world')])
    ).toMatchSnapshot()
    expect(el('div', el('span', 'Hello world'))).toMatchSnapshot()
    expect(
      el('div', el('span', 'Hello'), el('span', 'world'))
    ).toMatchSnapshot()
    expect(el('div', el('span', 'Hello world'), 'world')).toMatchSnapshot()
    expect(el('div', 'Hello', nbsp(), text('world'))).toMatchSnapshot()
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
