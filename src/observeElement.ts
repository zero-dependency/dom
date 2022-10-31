export function observeElement<T extends Element = Element>(
  el: T,
  callback: (mutation: MutationRecord, observer: MutationObserver) => void,
  options?: MutationObserverInit
) {
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

  return observe
}
