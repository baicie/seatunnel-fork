import { useResizeObserver } from '@vueuse/core'
import { debounce } from 'lodash'
import { Ref, ref } from 'vue'

export const useComputedHeight = (cardRef: Ref<any>) => {
  const body = document.querySelector('body')
  const height = ref(220)
  const resize = debounce(() => {
    const el = cardRef.value.$el as HTMLDivElement
    const divHeight = el.offsetHeight
    const bodyHeight = body!.offsetHeight
    if (bodyHeight <= divHeight * 2) {
      height.value = height.value / 2
    }
  }, 200)
  useResizeObserver(body, resize)

  return {
    height
  }
}
