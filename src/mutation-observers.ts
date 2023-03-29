type Disconnect = () => void

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
