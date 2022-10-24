export function observeElement<T extends Element = Element>(
  selector: string,
  callback: (el: T, observer: MutationObserver) => void,
  target = document.body
): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      const el = mutation.target as T
      if (el.matches?.(selector)) {
        callback(el, observer)
      }
    }
  })

  observer.observe(target, {
    attributes: true,
    childList: true,
    subtree: true
  })

  return observer
}
