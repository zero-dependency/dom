import * as CSS from 'csstype'

// prettier-ignore
type Attributes<T extends keyof HTMLElementTagNameMap> = Partial<{
  style: CSS.Properties
} & Omit<HTMLElementTagNameMap[T], 'style'>>

type Children = (string | Node | HTMLElement)[]

/**
 * Create an element
 * @param tag The tag name of the element to create
 * @param attributes The attributes or children to set on the element
 * @param children The children to append to the element
 * @returns The created element
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
    el.append(...attributes)
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
 * Create a text node
 * @param text The string to create a text node from
 */
export function text(text: string): Text {
  return document.createTextNode(text)
}

/**
 * A non-breaking space
 */
export function nbsp(): Text {
  return text('\u00a0')
}

type WindowEvent<T extends string> = T extends keyof WindowEventMap
  ? WindowEventMap[T]
  : Event

/**
 * Add an event listener to an element
 * @param el The element to add the event listener to
 * @param type The event type to listen for
 * @param callback The callback to call when the event is fired
 * @param options The options to pass to `addEventListener`
 */
export function addEvent<T extends string>(
  el: HTMLElement,
  type: T,
  callback: (event: WindowEvent<T>) => void,
  options?: boolean | AddEventListenerOptions
): () => void
export function addEvent(
  el: HTMLElement,
  type: string,
  cb: (event: Event) => void,
  options?: boolean | AddEventListenerOptions
): () => void {
  el.addEventListener(type, cb, options)
  return () => el.removeEventListener(type, cb, options)
}
