import { observeElement } from './observeElement.js'

export function waitElement<T extends Element = Element>(
  selector: string,
  target = document.body
): Promise<T> {
  return new Promise((resolve) => {
    const el = target.querySelector<T>(selector)
    if (el) {
      resolve(el)
    } else {
      const observer = observeElement<T>(
        selector,
        (el) => {
          observer.disconnect()
          resolve(el)
        },
        target
      )
    }
  })
}
