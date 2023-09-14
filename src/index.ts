import { type Ref, type UnwrapRef, isRef } from '@vue/reactivity'
import lodashSet from 'lodash.set'

export function useReactiveShake<T extends Ref<object> | object>(obj: T): [T, UnwrapRef<T>] {
  const shaked: UnwrapRef<T> = Object.create(null)

  function walk(
    target: object,
    key: string,
    receiver: object,
    parentKey: string
  ): object | string | null | undefined {
    const keyPath = parentKey ? `${parentKey}.${key}` : key
    const res = Reflect.get(target, key, receiver)
    if (typeof res === 'function') {
      return '[function]'
    }
    if (typeof res === 'symbol') {
      return '[symbol]'
    }
    if (res === null) {
      return null
    }
    if (typeof res === 'object') {
      return new Proxy(res, {
        get(target, key, receiver) {
          return walk(target, key as string, receiver, keyPath)
        }
      })
    }
    const isVueReactiveDefined = key.startsWith('__v_')
    const isRefPrivate = keyPath.startsWith('_value')
    if (!isVueReactiveDefined && !isRefPrivate) {
      if (isRef(obj)) {
        lodashSet(shaked, keyPath.replace(/^value./, ''), res)
      } else {
        lodashSet(shaked, keyPath, res)
      }
    }
    return res
  }

  const proxy = new Proxy(obj, {
    get(target, key, receiver) {
      return walk(target, key as string, receiver, '')
    }
  })

  return [proxy, shaked]
}
