import { observeElement } from './observeElement.js'

export function waitObserveElement<T extends Element = Element>(
  selector: string,
  target?: Node
): Promise<T> {
  return new Promise((resolve) => {
    const el = document.querySelector<T>(selector)
    if (el) {
      resolve(el)
    }

    const observer = observeElement<T>(
      selector,
      (el) => {
        observer.disconnect()
        resolve(el)
      },
      target
    )
  })
}
