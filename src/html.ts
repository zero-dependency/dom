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
  if (Array.isArray(attributes)) {
    el.append(...attributes)
  } else {
    Object.assign(el, attributes)
    Object.assign(el.style, attributes?.style)
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
