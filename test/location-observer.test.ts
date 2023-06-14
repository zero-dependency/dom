import { describe, expect, expectTypeOf } from 'vitest'
import { locationObserver } from '../src/location-observer.js'

describe('locationObserver', (test) => {
  test('should be defined', () => {
    expect(locationObserver).toBeDefined()
  })

  test('pushState/replaceState', () => {
    locationObserver<{ id: number }>({
      onPush(location, args) {
        expectTypeOf(args).toEqualTypeOf<{ id: number }>()
        expect(args).toEqual({ id: 1 })
        expect(location.pathname).toBe('/foo')
      },
      onReplace(location, args) {
        expectTypeOf(args).toEqualTypeOf<{ id: number }>()
        expect(args).toEqual({ id: 2 })
        expect(location.pathname).toBe('/bar')
      }
    })

    history.pushState({ id: 1 }, '', '/foo')
    history.replaceState({ id: 2 }, '', '/bar')
  })
})
