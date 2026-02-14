import type CSS from 'csstype'

// prettier-ignore
type Properties<T extends keyof HTMLElementTagNameMap> = Partial<{
  style: CSS.Properties
} & Omit<HTMLElementTagNameMap[T], 'style'>>

type ChildElement = string | Node | HTMLElement
type Childrens = ChildElement[]

/**
 * Creates a new HTML element of the specified type and with the given attributes and children nodes.
 *
 * @param {T} tag
 * The type of HTML element to create.
 *
 * @param {Properties<T> | Childrens | ChildElement} [props]
 * The properties or children nodes to add to the element.
 *
 * @param {Childrens | ChildElement} [children]
 * The children nodes to add to the element.
 *
 * @return {HTMLElementTagNameMap[T]}
 * The newly created HTML element of the specified type.
 *
 * @example
 * el('div', { id: 'foo' }, 'Hello world')
 * el('div', 'Hello world')
 * el('div', [el('span', 'Hello'), el('span', 'world')])
 * el('div', el('span', 'Hello world'))
 * el('div', el('span', 'Hello'), el('span', 'world'))
 * el('div', el('span', 'Hello world'), 'world')
 * el('div', { id: 'foo' }, [el('span', 'Hello'), el('span', 'world')])
 */
export function el<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  props?: Properties<T> | Childrens | ChildElement,
  children?: Childrens | ChildElement
): HTMLElementTagNameMap[T] {
  const el = document.createElement(tag)

  if (props instanceof Node) {
    el.append(props)
  } else if (typeof props === 'string') {
    el.append(text(props))
  } else if (Array.isArray(props)) {
    el.append(...props)
  } else if (props) {
    Object.assign(el, props)
    Object.assign(el.style, props?.style)
  }

  if (children !== undefined) {
    if (Array.isArray(children)) {
      el.append(...children)
    } else if (children instanceof Node) {
      el.append(children)
    } else if (typeof children === 'string') {
      el.append(text(children))
    }
  }

  return el
}

/**
 * Creates a new Text node with the provided text.
 *
 * @param {string} text
 * The text to create the Text node with.
 *
 * @return {Text}
 * A new Text node with the provided text.
 */
export function text(text: string): Text {
  return document.createTextNode(text)
}

/**
 * Returns a Text object containing a non-breaking space character.
 *
 * @return {Text}
 * A Text object containing a non-breaking space character.
 */
export function nbsp(): Text {
  return text('\u00a0')
}
