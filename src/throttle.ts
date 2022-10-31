export function throttle<T extends (...args: any[]) => ReturnType<T>>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => ReturnType<T> {
  let isThrottle: boolean
  let lastResult: ReturnType<T>

  return (...args) => {
    if (!isThrottle) {
      isThrottle = true
      setTimeout(() => (isThrottle = false), ms)
      lastResult = fn(args)
    }

    return lastResult
  }
}
