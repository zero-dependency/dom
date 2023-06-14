import * as CSS from 'csstype'

// prettier-ignore
type Attributes<T extends keyof HTMLElementTagNameMap> = Partial<{
  style: CSS.Properties
} & Omit<HTMLElementTagNameMap[T], 'style'>>

type Children = (string | Node | HTMLElement)[]

/**
 * Creates a new HTML element of the specified type and with the given attributes and children nodes.
 *
 * @param {T} tag - The type of HTML element to create.
 * @param {Attributes<T> | Children | HTMLElement} [attributes] - The attributes or children nodes to add to the element.
 * @param {...Children} children - The children nodes to add to the element.
 * @return {HTMLElementTagNameMap[T]} The newly created HTML element of the specified type.
 * @example
 * el('div', { id: 'foo' }, 'Hello world')
 * el('div', 'Hello world')
 * el('div', [el('span', 'Hello'), el('span', 'world')])
 * el('div', el('span', 'Hello world'))
 * el('div', el('span', 'Hello'), el('span', 'world'))
 * el('div', el('span', 'Hello world'), 'world')
 */
export function el<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attributes?: Attributes<T> | Children | HTMLElement,
  ...children: Children
): HTMLElementTagNameMap[T] {
  const el = document.createElement(tag)

  if (typeof attributes === 'string') {
    el.append(text(attributes))
  } else if (Array.isArray(attributes)) {
    children.unshift(...attributes)
  } else {
    Object.assign(el, attributes)
    Object.assign(el.style, attributes?.style)
  }

  if (children.length) {
    el.append(...children)
  }

  return el
}

/**
 * Creates a new Text node with the provided text.
 *
 * @param {string} text - The text to create the Text node with.
 * @return {Text} A new Text node with the provided text.
 */
export function text(text: string): Text {
  return document.createTextNode(text)
}

/**
 * Returns a Text object containing a non-breaking space character.
 *
 * @return {Text} A Text object containing a non-breaking space character.
 */
export function nbsp(): Text {
  return text('\u00a0')
}
