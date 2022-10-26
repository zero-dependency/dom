export function observeElement<T extends Element = Element>(
  selector: string,
  callback: (el: T) => void,
  target = document.body
): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      const el = (mutation.target as T).querySelector<T>(selector)
      if (el) {
        callback(el)
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
