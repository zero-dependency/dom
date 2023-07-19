type Disconnect = () => void

/**
 * Observes changes to an element and invokes a callback function for each mutation.
 *
 * @param {T extends Element} el
 * The element to observe.
 *
 * @param {(mutation: MutationRecord, observer: MutationObserver) => void} callback
 * The function to call when a mutation occurs.
 *
 * @param {MutationObserverInit} [options]
 * Optional configuration options for the MutationObserver.
 *
 * @returns {Disconnect}
 * A function that disconnects the observer.
 *
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
