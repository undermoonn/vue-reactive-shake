import { ref, reactive } from '@vue/reactivity'
import { test, expect } from 'vitest'
import { useReactiveShake } from './index'

test('ref shake test', () => {
  const [p, s] = useReactiveShake(ref({ a: { b: 1 }, c: 2 }))
  p.value.a.b
  expect(s).toEqual({ a: { b: 1 } })
})

test('reactive shake test', () => {
  const [p, s] = useReactiveShake(reactive({ a: { b: 1 }, c: 2 }))
  p.a.b
  expect(s).toEqual({ a: { b: 1 } })
})
