<template>
  <div class="pagination" ref="paginationRef">
    <span class="page-info">共{{ totalPages }}页</span>
    <button
      class="page-btn"
      :disabled="modelValue <= 1"
      @click="$emit('update:modelValue', modelValue - 1)"
    >
      ‹
    </button>
    <span class="page-current">{{ modelValue }}</span>
    <button
      class="page-btn"
      :disabled="modelValue >= totalPages"
      @click="$emit('update:modelValue', modelValue + 1)"
    >
      ›
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSwipe } from '../../composables/useTouch'

const props = defineProps<{
  modelValue: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const paginationRef = ref<HTMLElement | null>(null)

useSwipe(paginationRef, {
  onSwipeLeft: () => {
    if (props.modelValue < props.totalPages) {
      emit('update:modelValue', props.modelValue + 1)
    }
  },
  onSwipeRight: () => {
    if (props.modelValue > 1) {
      emit('update:modelValue', props.modelValue - 1)
    }
  },
}, 60)
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 0;
  flex-shrink: 0;
  z-index: 10;
}

.page-info {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-right: 4px;
}

.page-current {
  font-size: 16px;
  font-weight: bold;
  color: var(--color-primary);
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-primary);
  background: rgba(0, 240, 255, 0.15);
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.4), inset 0 0 8px rgba(0, 240, 255, 0.2);
  border-radius: 6px;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
}

.page-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: var(--color-text-bright);
  border: 1px solid rgba(0, 240, 255, 0.3);
  background: rgba(0, 240, 255, 0.05);
  transition: all 0.15s ease;
  border-radius: 6px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.page-btn:hover:not(:disabled) {
  color: #fff;
  border-color: var(--color-primary);
  background: var(--color-primary-dim);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

.page-btn:active:not(:disabled) {
  transform: scale(0.9);
  background: rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.8), inset 0 0 10px rgba(0, 240, 255, 0.4);
  transition: all 0.05s ease-out !important;
}

.page-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .pagination { gap: 8px; padding: 8px 0; }
  .page-btn { width: 40px; height: 40px; font-size: 18px; }
  .page-current { min-width: 40px; height: 40px; font-size: 14px; }
  .page-info { font-size: 12px; }
}

@media (max-height: 500px) and (orientation: landscape) {
  .pagination { padding: 4px 0; }
  .page-btn { width: 36px; height: 36px; }
  .page-current { min-width: 36px; height: 36px; }
}
</style>
