<template>
  <header class="app-header">
    <div class="header-deco-left" />
    <div class="header-left">
      <span class="station-label">{{ stationName }}</span>
    </div>
    <div class="header-center">
      <span class="title-deco" />
      <h1 class="header-title">智能制造-触控屏端</h1>
      <span class="title-deco" />
    </div>
    <div class="header-right">
      <span class="user-dot" />
      <span class="user-name">{{ userName }}</span>
    </div>
    <div class="header-deco-right" />
    <div class="header-line" />
  </header>
</template>

<script setup lang="ts">
defineProps<{
  stationName?: string
  userName?: string
}>()
</script>

<style scoped>
.app-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 28px;
  background: linear-gradient(180deg, rgba(10, 30, 60, 0.95) 0%, rgba(4, 12, 23, 0.98) 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.8), inset 0 -1px 0 rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  z-index: 10;
}

.header-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 240, 255, 0.8) 20%, rgba(0, 240, 255, 0.8) 80%, transparent 100%);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
}

.header-line::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.15) 30%, rgba(0, 229, 255, 0.15) 70%, transparent 100%);
}

.header-deco-left,
.header-deco-right {
  position: absolute;
  top: 50%;
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, var(--color-border), transparent);
  transform: translateY(-50%);
}

.header-deco-left { left: 0; }
.header-deco-right {
  right: 0;
  background: linear-gradient(90deg, transparent, var(--color-border));
}

.header-left {
  z-index: 1;
}

.station-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-deco {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.9));
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
  border-radius: 2px;
}

.title-deco:last-child {
  background: linear-gradient(90deg, rgba(0, 240, 255, 0.9), transparent);
}

.header-title {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 8px;
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 0 15px rgba(0, 240, 255, 0.8),
    0 0 30px rgba(0, 240, 255, 0.4);
  white-space: nowrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

.user-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle, #8ab4d0 30%, #4a7a9a 100%);
  box-shadow: 0 0 6px rgba(138, 180, 208, 0.4);
}

.user-name {
  font-size: 14px;
  color: var(--color-text);
}
</style>
