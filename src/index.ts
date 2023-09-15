import { type Ref, type UnwrapRef, isRef } from '@vue/reactivity'

export function useReactiveShake<T extends Ref<object> | object>(obj: T): [T, UnwrapRef<T>] {
  const shaked: UnwrapRef<T> = Object.create(null)

  function walk(
    target: object,
    key: string,
    receiver: object,
    parentKey: string
  ): object | string | null | undefined {
    if (typeof key !== 'string') {
      return '[property type]' + typeof key
    }
    const keyPath = parentKey ? `${parentKey}.${key}` : key
    const res = Reflect.get(target, key, receiver)
    if (typeof res === 'function') {
      return typeof res
    }
    if (typeof res === 'symbol') {
      return typeof res
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
        deepSet(shaked, keyPath.replace(/^value./, ''), res)
      } else {
        deepSet(shaked, keyPath, res)
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

function deepSet<T extends object>(target: T, path: string, value: any): T {
  const keys = path.split('.')
  let t: any = target
  keys.forEach((key, idx) => {
    if (idx === keys.length - 1) {
      Reflect.set(t, key, value)
      return
    }
    if (typeof t[key] === 'undefined') {
      Reflect.set(t, key, {})
    }
    t = t[key]
  })

  return target
}
