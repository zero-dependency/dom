import { describe, expect, expectTypeOf } from 'vitest'
import { LocationObserver } from '../src/location-observer.js'

describe('LocationObserver', (test) => {
  const locationObserver = new LocationObserver<{ id: number }>()

  test('should be defined', () => {
    expect(locationObserver).toBeDefined()
  })

  test('pushState', () => {
    locationObserver.on('pushState', (location, state) => {
      expectTypeOf(state).toEqualTypeOf<{ id: number }>()
      expect(state).toEqual({ id: 1 })
      expect(location.pathname).toBe('/foo')
    })

    history.pushState({ id: 1 }, '', '/foo')
    locationObserver.off('pushState')
  })

  test('replaceState', () => {
    locationObserver.on('replaceState', (location, state) => {
      expectTypeOf(state).toEqualTypeOf<{ id: number }>()
      expect(state).toEqual({ id: 2 })
      expect(location.pathname).toBe('/bar')
    })

    history.replaceState({ id: 2 }, '', '/bar')
    locationObserver.off('replaceState')
  })

  test('popState', () => {
    locationObserver.on('popState', (location, event) => {
      expect(event.state).toEqual({ id: 3 })
      expect(location.pathname).toBe('/bar')
    })

    window.dispatchEvent(
      new PopStateEvent('popstate', {
        state: { id: 3 }
      })
    )
    locationObserver.off('popState')
  })
})
