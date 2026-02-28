<template>
  <nav class="tab-nav" ref="navRef">
    <div class="tab-track-container">
      <div class="tab-track" ref="trackRef">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="tab-btn"
          :class="{ active: modelValue === tab, pressed: pressedTab === tab }"
          @click="$emit('update:modelValue', tab)"
          @touchstart.passive="pressedTab = tab"
          @touchend.passive="pressedTab = null"
          @touchcancel.passive="pressedTab = null"
          ref="tabRefs"
        >
          <div class="tab-halo" />
          
          <div class="tab-glass-panel">
            <span class="tab-depth" />
            <span class="tab-body">
              <span class="tab-bevel-light" />
              <span class="tab-side-light left" />
              <span class="tab-side-light right" />
              <span class="tab-label">{{ tab }}</span>
            </span>
            <span class="tab-reflection">
              <span class="tab-body reflection-body">
                <span class="tab-label reflection-text">{{ tab }}</span>
              </span>
            </span>
          </div>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue'
import VanillaTilt from 'vanilla-tilt'
import { useSwipe } from '../../composables/useTouch'

const props = defineProps<{
  tabs: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const tabRefs = ref<HTMLElement[]>([])
const navRef = ref<HTMLElement | null>(null)
const pressedTab = ref<string | null>(null)
const isTouchDevice = ref(false)

const currentIndex = computed(() => props.tabs.indexOf(props.modelValue))

onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window
  if (!isTouchDevice.value) initTilt()
})

// 非触屏设备才启用滑动切换 Tab（手机端用原生横向滚动浏览）
if (typeof window !== 'undefined' && !('ontouchstart' in window)) {
  useSwipe(navRef, {
    onSwipeLeft: () => {
      const idx = currentIndex.value
      if (idx >= 0 && idx < props.tabs.length - 1) {
        emit('update:modelValue', props.tabs[idx + 1]!)
      }
    },
    onSwipeRight: () => {
      const idx = currentIndex.value
      if (idx > 0) {
        emit('update:modelValue', props.tabs[idx - 1]!)
      }
    },
  })
}

watch(() => props.tabs, async () => {
  await nextTick()
  if (!isTouchDevice.value) initTilt()
})

function initTilt() {
  if (!tabRefs.value.length) return
  tabRefs.value.forEach(el => {
    if ((el as any).vanillaTilt) (el as any).vanillaTilt.destroy()
  })
  VanillaTilt.init(tabRefs.value, {
    max: 2, speed: 600, glare: true, "max-glare": 0.3,
    scale: 1, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", perspective: 2000,
  })
}

onBeforeUnmount(() => {
  tabRefs.value.forEach(el => {
    if ((el as any).vanillaTilt) (el as any).vanillaTilt.destroy()
  })
})
</script>

<style scoped>
.tab-nav {
  padding: 10px 24px 20px;
  flex-shrink: 0;
  z-index: 10;
  position: relative;
  perspective: 1200px;
}

.tab-track-container {
  display: inline-flex;
  justify-content: center;
  position: relative;
  transform-style: preserve-3d;
  left: 50%;
  transform: translateX(-50%);
}

.tab-track {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.tab-track::-webkit-scrollbar { display: none; }

.tab-halo {
  position: absolute;
  inset: -10px;
  background: radial-gradient(ellipse at center, rgba(0, 240, 255, 0.3) 0%, transparent 60%);
  opacity: 0;
  transition: all 0.4s ease;
  pointer-events: none;
  z-index: 0;
}
.tab-btn.active .tab-halo { opacity: 1; }

/* ===== Tab 按钮：增大触摸区域至 44px+ ===== */
.tab-btn {
  position: relative;
  width: 120px;
  height: 44px; /* 符合 Apple HIG 最小触摸目标 */
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.tab-btn:hover { transform: translateY(-2px); }
.tab-btn.active { z-index: 5; transform: translateY(-3px); }

/* 触摸按压态：深按进去的物理反馈，极速响应 */
.tab-btn:active,
.tab-btn.pressed {
  transform: translateY(2px) scale(0.96) !important;
  transition: transform 0.05s ease-out !important;
}
.tab-btn.pressed .tab-body {
  box-shadow:
    inset 0 4px 8px rgba(0, 0, 0, 0.9),
    inset 0 -1px 2px rgba(255, 255, 255, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.6) !important;
  transition: all 0.05s ease-out !important;
}

.tab-glass-panel { position: absolute; inset: 0; }

.tab-body {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%);
  background: rgba(8, 20, 35, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 240, 255, 0.3);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    inset 0 -4px 6px rgba(0, 0, 0, 0.8),
    0 8px 16px rgba(0, 0, 0, 0.6);
  transform: translateZ(10px);
}

.tab-bevel-light {
  position: absolute; top: 0; left: 10%; width: 80%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  opacity: 0.5;
}

.tab-depth {
  position: absolute; bottom: -4px; left: 5%; width: 90%; height: 100%;
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%);
  background: linear-gradient(180deg, #000 0%, rgba(0, 50, 80, 0.8) 100%);
  transform: translateZ(-5px);
  filter: blur(2px);
  transition: all 0.4s;
}

.tab-label {
  position: relative; z-index: 5;
  font-size: 15px; font-weight: 600; color: #7ba6c4;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 1);
  transform: translateZ(20px);
  transition: all 0.4s;
}

/* ===== 倒影 ===== */
.tab-reflection {
  position: absolute; top: 110%; left: 0; width: 100%; height: 100%;
  transform: scaleY(-1); opacity: 0.5; pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 60%);
  mask-image: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 60%);
  transition: all 0.4s; filter: blur(1px);
}
.reflection-body { transform: none !important; box-shadow: none !important; }
.reflection-text { transform: scaleY(-1) !important; text-shadow: none !important; }
.tab-btn.active .tab-reflection { opacity: 0.8; }
.tab-btn:hover .tab-reflection { opacity: 0.3; filter: blur(2px); }

/* ===== 激活状态 ===== */
.tab-btn.active .tab-body {
  background: linear-gradient(180deg, rgba(0, 240, 255, 0.9) 0%, rgba(0, 100, 150, 0.95) 100%);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow:
    inset 0 2px 6px rgba(255, 255, 255, 0.8),
    inset 0 -4px 8px rgba(0, 50, 80, 0.9),
    0 0 15px rgba(0, 240, 255, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.6);
}
.tab-btn.active .tab-bevel-light {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 1), transparent);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8); height: 2px;
}
.tab-btn.active .tab-label {
  color: #ffffff; font-weight: bold;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 15px rgba(0, 240, 255, 1);
}

:deep(.js-tilt-glare) {
  border-radius: 0 !important;
  clip-path: polygon(15% 0, 85% 0, 100% 100%, 0% 100%);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .tab-nav { padding: 6px 0 8px; overflow: hidden; }
  .tab-track-container {
    display: flex; left: auto; transform: none;
    width: 100%; overflow-x: auto; overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding: 0 12px;
  }
  .tab-track-container::-webkit-scrollbar { display: none; }
  .tab-track { justify-content: flex-start; gap: 6px; flex-wrap: nowrap; }
  .tab-btn { width: 90px; height: 40px; }
  .tab-label { font-size: 13px; letter-spacing: 1px; }
  .tab-reflection { display: none; }
  .tab-depth { display: none; }
}

@media (max-width: 480px) {
  .tab-nav { padding: 4px 0 6px; }
  .tab-track-container { padding: 0 8px; }
  .tab-btn { width: 78px; height: 36px; }
  .tab-label { font-size: 12px; letter-spacing: 0; }
  .tab-body { clip-path: none; border-radius: 6px; }
}

@media (max-height: 500px) and (orientation: landscape) {
  .tab-nav { padding: 4px 0 6px; }
  .tab-btn { height: 32px; }
  .tab-reflection { display: none; }
}
</style>
