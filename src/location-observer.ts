type LocationCallback<T = any> = (location: Location, args: T) => void

type Events<T> = {
  onPush: LocationCallback<T>
  onReplace: LocationCallback<T>
}

/**
 * Observes changes to the browser's location and history, and invokes
 * the specified callbacks when the user navigates to a new page or updates the
 * current page's state.
 *
 * @param {Events<T>} events
 * An object that contains optional callback functions for push and replace actions.
 *
 * @example
 * locationObserver<{ id: string }>({
 *   onPush: (location, args) => {},
 *   onReplace: (location, args) => {}
 * })
 */
export function locationObserver<T>(events: Events<T>): void {
  const { history, location } = window
  const { pushState, replaceState } = history

  history.pushState = (...args) => {
    pushState.apply(history, args)
    events.onPush(location, args[0])
  }

  history.replaceState = (...args) => {
    replaceState.apply(history, args)
    events.onReplace(location, args[0])
  }
}
