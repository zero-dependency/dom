import { Emitter } from '@zero-dependency/emitter'

type LocationCallback<T = any> = (location: Location, args: T) => void

type Events<T> = {
  pushState: LocationCallback<T>
  replaceState: LocationCallback<T>
  popState: LocationCallback<
    Omit<PopStateEvent, 'state'> & { readonly state: T }
  >
}

export class LocationObserver<T> extends Emitter<Events<T>> {
  constructor() {
    super()

    const { history, location } = window
    const { pushState, replaceState } = history

    history.pushState = (...args) => {
      pushState.apply(history, args)
      this.emit('pushState', location, args[0])
    }

    history.replaceState = (...args) => {
      replaceState.apply(history, args)
      this.emit('replaceState', location, args[0])
    }

    window.addEventListener('popstate', (event) => {
      this.emit('popState', location, event)
    })
  }
}
