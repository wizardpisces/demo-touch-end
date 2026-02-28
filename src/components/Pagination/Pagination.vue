<template>
  <div class="pagination">
    <span class="page-info">共{{ totalPages }}页</span>
    <button
      class="page-btn"
      :disabled="modelValue <= 1"
      @click="$emit('update:modelValue', modelValue - 1)"
    >
      &lt;
    </button>
    <span class="page-current">{{ modelValue }}</span>
    <button
      class="page-btn"
      :disabled="modelValue >= totalPages"
      @click="$emit('update:modelValue', modelValue + 1)"
    >
      &gt;
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number
  totalPages: number
}>()

defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 0;
  flex-shrink: 0;
  z-index: 10;
}

.page-info {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-right: 4px;
}

.page-current {
  font-size: 14px;
  font-weight: bold;
  color: var(--color-primary);
  min-width: 30px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-primary);
  background: rgba(0, 240, 255, 0.15);
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.4), inset 0 0 8px rgba(0, 240, 255, 0.2);
  border-radius: 4px;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
}

.page-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  color: var(--color-text-bright);
  border: 1px solid rgba(0, 240, 255, 0.3);
  background: rgba(0, 240, 255, 0.05);
  transition: all 0.2s ease;
  border-radius: 4px;
}

.page-btn:hover:not(:disabled) {
  color: #fff;
  border-color: var(--color-primary);
  background: var(--color-primary-dim);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

.page-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}
</style>
