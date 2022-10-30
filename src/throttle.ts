export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  delay = 500
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  let isThrottle = false
  let savedArgs: typeof fn.arguments | null = null
  let savedThis: ThisParameterType<T> | null = null

  function wrapper(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (isThrottle) {
      savedArgs = args
      savedThis = this

      return
    }

    fn.apply(this, args)

    isThrottle = true

    setTimeout(() => {
      isThrottle = false

      if (savedArgs !== null && savedThis !== null) {
        wrapper.apply(savedThis!, savedArgs)

        savedArgs = null
        savedThis = null
      }

    }, delay)
  }

  return wrapper
}