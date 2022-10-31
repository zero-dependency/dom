import { observeElement } from './observeElement.js'

export function waitElement<T extends Element = Element>(
  selector: string,
  target = document.documentElement
): Promise<T> {
  return new Promise((resolve) => {
    function resolveElement() {
      const el = target.querySelector<T>(selector)
      if (el) {
        resolve(el)
      }
    }

    observeElement(target, (_, observer) => {
      resolveElement()
      observer.disconnect()
    })
  })
}
