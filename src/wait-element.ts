import { observeElement } from './observe-element.js'

export interface WaitElementParams {
  selector: string
  target?: Element
  rejectTimeoutMs?: number
  signal?: AbortSignal
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
 * @param {number} [params.rejectTimeoutMs]
 * The timeout in milliseconds after which the promise is rejected.
 *
 * @param {AbortSignal} [params.signal]
 * An optional AbortSignal instance to abort the waiting.
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
  rejectTimeoutMs,
  signal
}: WaitElementParams): Promise<T> {
  return new Promise((resolve, reject) => {
    const disconnect = observeElement(target, (_, observer) => {
      const el = target.querySelector<T>(selector)
      if (el) {
        observer.disconnect()
        resolve(el)
      }
    })

    const listeners: {
      timeout: ReturnType<typeof setTimeout> | null
      abort: (() => void) | null
    } = {
      timeout: null,
      abort: null
    }

    const dispose = (message: string) => {
      if (listeners.timeout) {
        clearTimeout(listeners.timeout)
      }

      if (signal && listeners.abort) {
        signal.removeEventListener('abort', listeners.abort)
      }

      disconnect()
      reject(message)
    }

    if (rejectTimeoutMs && rejectTimeoutMs > 0) {
      listeners.timeout = setTimeout(
        () => dispose(`${waitElement.name} rejected (${rejectTimeoutMs}ms)`),
        rejectTimeoutMs
      )
    }

    if (signal && !signal.aborted) {
      listeners.abort = () => dispose(signal.reason)
      signal.addEventListener('abort', listeners.abort)
    }
  })
}
