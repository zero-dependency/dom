// prettier-ignore
type Attributes<T extends keyof HTMLElementTagNameMap> = Partial<{
  style: Partial<CSSStyleDeclaration>
} & Omit<HTMLElementTagNameMap[T], 'style'>>

type Children = (string | Node | HTMLElement)[]

export function el<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attributes?: Children | Attributes<T>,
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

export function text(str: string): Text {
  return document.createTextNode(str)
}

export function nbsp(): Text {
  return text('\u00a0')
}

export async function domReady(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState == 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve(), {
        once: true
      })
    } else {
      resolve()
    }
  })
}

export function isDisabled(element: HTMLElement): boolean {
  return (
    Boolean(element.getAttribute('disabled')) === true ||
    Boolean(element.getAttribute('aria-disabled')) === true
  )
}

export function addEventListener(
  target: EventTarget,
  eventName: string,
  handler: EventListener,
  options?: AddEventListenerOptions
) {
  target.addEventListener(eventName, handler, options)
  return () => {
    target.removeEventListener(eventName, handler, options)
  }
}
