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

interface WaitElementParams {
  selector: string
  target?: Element
  rejectAfterMs?: number
}

/**
 * Waits for the specified element to be present in the DOM and returns it.
 *
 * @param {WaitElementParams} params
 * The parameters for waiting and locating the element.
 *
 * @param {string} params.selector
 * The CSS selector to locate the element.
 *
 * @param {Element} [params.target=document.body]
 * The target element to search for the element in.
 *
 * @param {number} [params.rejectAfterMs]
 * The time in milliseconds after which to reject the promise if the element is not found.
 *
 * @return {Promise<T>}
 * A promise that resolves with the found element.
 *
 * @throws {Error}
 * If the promise is rejected due to the element not being found within the specified time.
 *
 * @example
 * const fooElement = await waitElement({ selector: '.foo' })
 */
export function waitElement<T extends Element = Element>({
  selector,
  target = document.body,
  rejectAfterMs
}: WaitElementParams): Promise<T> {
  return new Promise((resolve, reject) => {
    const disconnect = observeElement(target, (_, observer) => {
      const el = target.querySelector<T>(selector)
      if (el) {
        observer.disconnect()
        resolve(el)
      }
    })

    if (rejectAfterMs > 0) {
      setTimeout(() => {
        disconnect()
        reject(new Error(`waitElement rejected after ${rejectAfterMs}ms`))
      }, rejectAfterMs)
    }
  })
}
