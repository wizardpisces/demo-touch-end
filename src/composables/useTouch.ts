import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useTouchRipple(containerRef: Ref<HTMLElement | null>) {
  function createRipple(e: TouchEvent | MouseEvent) {
    const el = containerRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    let x: number, y: number
    if ('touches' in e && e.touches[0]) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = (e as MouseEvent).clientX - rect.left
      y = (e as MouseEvent).clientY - rect.top
    }

    const ripple = document.createElement('span')
    ripple.className = 'touch-ripple'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    el.appendChild(ripple)

    ripple.addEventListener('animationend', () => ripple.remove())
  }

  onMounted(() => {
    containerRef.value?.addEventListener('touchstart', createRipple, { passive: true })
  })

  onBeforeUnmount(() => {
    containerRef.value?.removeEventListener('touchstart', createRipple)
  })
}

export function useSwipe(
  containerRef: Ref<HTMLElement | null>,
  callbacks: { onSwipeLeft?: () => void; onSwipeRight?: () => void },
  threshold = 50
) {
  let startX = 0
  let startY = 0

  function onTouchStart(e: TouchEvent) {
    if (!e.touches[0]) return
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  }

  function onTouchEnd(e: TouchEvent) {
    if (!e.changedTouches[0]) return
    const dx = e.changedTouches[0].clientX - startX
    const dy = e.changedTouches[0].clientY - startY

    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return

    if (dx < 0) callbacks.onSwipeLeft?.()
    else callbacks.onSwipeRight?.()
  }

  onMounted(() => {
    const el = containerRef.value
    if (!el) return
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
  })

  onBeforeUnmount(() => {
    const el = containerRef.value
    if (!el) return
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchend', onTouchEnd)
  })
}

export function useTouchPress(elRef: Ref<HTMLElement | null>) {
  const isPressed = ref(false)

  function onStart() { isPressed.value = true }
  function onEnd() { isPressed.value = false }

  onMounted(() => {
    const el = elRef.value
    if (!el) return
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchend', onEnd, { passive: true })
    el.addEventListener('touchcancel', onEnd, { passive: true })
  })

  onBeforeUnmount(() => {
    const el = elRef.value
    if (!el) return
    el.removeEventListener('touchstart', onStart)
    el.removeEventListener('touchend', onEnd)
    el.removeEventListener('touchcancel', onEnd)
  })

  return { isPressed }
}
