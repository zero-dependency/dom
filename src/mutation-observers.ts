type Disconnect = () => void

/**
 * Observe mutations on an element
 * @param el The element to observe
 * @param callback The callback to call when a mutation occurs
 * @param options The options to pass to the `MutationObserver`
 * @returns A function to disconnect the observer
 */
export function observeElement<T extends Element = Element>(
  el: T,
  callback: (mutation: MutationRecord, observer: MutationObserver) => void,
  options?: MutationObserverInit
): Disconnect {
  const observe = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
      callback(mutation, observer)
    }
  })

  observe.observe(el, {
    childList: true,
    subtree: true,
    ...options
  })

  return () => observe.disconnect()
}

/**
 * Wait for an element to appear in the DOM
 * @param selector The selector to wait for
 * @param target The element to search in
 * @returns A promise that resolves when the element is found
 */
export function waitElement<T extends Element = Element>(
  selector: string,
  target = document.documentElement
): Promise<T> {
  return new Promise((resolve) => {
    observeElement(target, (_, observer) => {
      const el = target.querySelector<T>(selector)
      if (el) {
        observer.disconnect()
        resolve(el)
      }
    })
  })
}
