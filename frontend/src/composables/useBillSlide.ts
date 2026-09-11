import { computed, inject, type ComputedRef, type Ref } from 'vue'

export const billActiveIndexKey = Symbol('billActiveIndex')
export const billGoNextKey = Symbol('billGoNext')

/** 从 BillView 注入当前激活屏索引，避免翻页过渡中误重置动效 */
export function useBillSlide(slideIndex: number): { isActive: ComputedRef<boolean> } {
  const activeIndex = inject<Ref<number>>(billActiveIndexKey)
  const isActive = computed(() => (activeIndex?.value ?? 0) === slideIndex)
  return { isActive }
}

export function useBillGoNext(): () => void {
  return inject(billGoNextKey, () => {})
}
