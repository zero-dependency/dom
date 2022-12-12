import { Emitter } from '@zero-dependency/emitter'

type LocationCallback = (location: Location, state: any) => void

type Events = {
  pushState: LocationCallback
  replaceState: LocationCallback
  popState: LocationCallback
}

export class LocationObserver extends Emitter<Events> {
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

    window.addEventListener('popstate', ({ state }) => {
      this.emit('popState', location, state)
    })
  }
}
