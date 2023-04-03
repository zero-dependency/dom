type LocationCallback<T = any> = (location: Location, args: T) => void

type Events<T> = {
  pushState: LocationCallback<T>
  replaceState: LocationCallback<T>
  popState: LocationCallback<
    Omit<PopStateEvent, 'state'> & { readonly state: T }
  >
}

/**
 * Observe changes to the location
 * @example
 * const observer = new LocationObserver<{ id: string }>()
 * observer.on('pushState', (location, state) => {
 *   console.log(state.id)
 * })
 */
export class LocationObserver<T> {
  #events = {} as Record<keyof Events<T>, LocationCallback<any>>

  constructor() {
    const { history, location } = window
    const { pushState, replaceState } = history

    history.pushState = (...args) => {
      pushState.apply(history, args)
      this.#events?.pushState(location, args[0])
    }

    history.replaceState = (...args) => {
      replaceState.apply(history, args)
      this.#events?.replaceState(location, args[0])
    }

    window.addEventListener('popstate', (event) => {
      this.#events?.popState(location, event)
    })
  }

  on<E extends keyof Events<T>>(event: E, listener: Events<T>[E]): () => void {
    this.#events[event] = listener
    return () => this.off(event)
  }

  off<E extends keyof Events<T>>(event: E): void {
    delete this.#events[event]
  }
}
