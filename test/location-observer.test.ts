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
  })

  test('replaceState', () => {
    locationObserver.on('replaceState', (location, state) => {
      expectTypeOf(state).toEqualTypeOf<{ id: number }>()
      expect(state).toEqual({ id: 2 })
      expect(location.pathname).toBe('/bar')
    })

    history.replaceState({ id: 2 }, '', '/bar')
  })

  // uncovered `popState`
})
