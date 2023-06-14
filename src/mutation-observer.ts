type Disconnect = () => void

/**
 * Observes changes to an element and invokes a callback function for each mutation.
 *
 * @param {T extends Element} el - the element to observe
 * @param {(mutation: MutationRecord, observer: MutationObserver) => void} callback - the function to call when a mutation occurs
 * @param {MutationObserverInit} [options] - optional configuration options for the MutationObserver
 * @returns {Disconnect} a function that disconnects the observer
 * @example
 * const disconnect = observeElement(document.body, (mutation, observer) => {
 *   console.log(mutation)
 * })
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
 * Returns a Promise that resolves with the first element matching the given selector
 * in the specified target, or rejects if no matches are found.
 *
 * @param {string} selector - The CSS selector to match.
 * @param {Element} [target=document.documentElement] - The element to search in.
 * @returns {Promise<T>} A Promise that resolves with the first matching element.
 * @example
 * const el = await waitElement('.foo')
 */
export function waitElement<T extends Element = Element>(
  selector: string,
  target: Element = document.documentElement
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
