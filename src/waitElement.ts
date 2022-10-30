export function waitElement<T extends Element = Element>(
  selector: string,
  target = document.documentElement
): Promise<T> {
  return new Promise((resolve) => {
    const el = target.querySelector<T>(selector)
    if (el) {
      return resolve(el)
    }

    new MutationObserver((_, observer) => {
      const elements = target.querySelectorAll<T>(selector)
      for (const element of elements) {
        resolve(element)
        observer.disconnect()
      }
    }).observe(target, {
      childList: true,
      subtree: true
    })
  })
}
