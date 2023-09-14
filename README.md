# vue-reactive-shake

### Use Cases

```js
import { ref } from 'vue'
import { useReactiveShake } from 'vue-reactive-shake'

const target = ref({
  a: {
    b: { c: 1, d: 2 },
    e: 3
  },
  f: 4
})

const [proxyTarget, shakedTarget] = useReactiveShake(target)

proxyTarget.value.a.b.c
console.log(shakedTarget) // { a: { b: { c: 1 } } }

proxyTarget.value.f
console.log(shakedTarget) // { a: { b: { c: 1 } }, f: 4 }
```

### Roadmap

- [ ] nested ref
- [ ] vue2 support
