<template>
  <div class="dock-wrapper">
    <!-- 连在一起的 3D 共享底盘 -->
    <div class="dock-base">
      <div class="dock-glow-line" />
    </div>

    <nav class="bottom-nav">
      <button
        v-for="(item, index) in items"
        :key="item.key"
        class="nav-item"
        :class="[
          { active: modelValue === item.key },
          `theme-${item.color || 'cyan'}`,
          { hovered: hoveredIndex === index },
          { pressed: pressedIndex === index }
        ]"
        @click="$emit('update:modelValue', item.key)"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
        @touchstart.passive="pressedIndex = index; hoveredIndex = index"
        @touchend.passive="pressedIndex = null; hoveredIndex = null"
        @touchcancel.passive="pressedIndex = null; hoveredIndex = null"
      >
        <div class="badge-container">
          <!-- 环境发光垫片 -->
          <div class="badge-glow" />
          
          <div class="badge-3d-model">
            <!-- 底部物理阴影 -->
            <div class="badge-shadow" />
            
            <!-- 六边形外壳 -->
            <div class="hex-outer">
              <div class="hex-bevel-light" />
              <div class="hex-inner">
                <div class="center-ring">
                  <div class="center-dot">
                    <span class="icon-text">{{ item.icon }}</span>
                  </div>
                </div>
              </div>
              <div class="top-tri" />
            </div>
            
            <!-- 镜面反射倒影 -->
            <div class="badge-reflection">
              <div class="hex-outer">
                <div class="hex-inner">
                  <div class="center-ring">
                    <div class="center-dot" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 标签文字在底部 -->
        <span class="nav-label">{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface NavItem {
  key: string
  label: string
  icon: string
  color?: 'cyan' | 'amber'
}

defineProps<{
  items: NavItem[]
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const hoveredIndex = ref<number | null>(null)
const pressedIndex = ref<number | null>(null)
</script>

<style scoped>
.dock-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
  perspective: 1000px;
}

.bottom-nav {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 40px; /* 拉开间距，凸显分离感 */
  padding: 0 40px 20px;
  z-index: 10;
  transform-style: preserve-3d;
}

/* ===== 连在一起的 3D 共享底盘 ===== */
.dock-base {
  position: absolute;
  bottom: 0px; /* 沉底 */
  left: 50%;
  transform: translateX(-50%) perspective(800px) rotateX(60deg);
  width: 520px;
  height: 80px;
  background: rgba(2, 8, 16, 0.85);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 12px;
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.9),
    inset 0 0 20px rgba(0, 240, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  z-index: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
}

.dock-glow-line {
  position: absolute;
  top: 10%;
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.8), transparent);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

/* ===== 导航项容器 ===== */
.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 90px;
  height: 140px;
  z-index: 5;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* 触摸按压态：替代桌面的 hover，要求极速响应 */
.nav-item.pressed .badge-container {
  transform: translateY(-4px) scale(1.08);
  transition: transform 0.05s ease-out !important;
}
.nav-item.pressed .nav-label {
  color: #fff;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
  transition: all 0.05s ease-out !important;
}

/* 文字在底部绝对定位，绝不被遮挡 */
.nav-label {
  position: absolute;
  bottom: -20px; /* 将文字固定在底座下方 */
  font-size: 13px;
  font-weight: 500;
  color: #4a7a9a;
  transition: all 0.3s ease;
  z-index: 15;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
}

.theme-cyan.active .nav-label {
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
  font-weight: 700;
}

.theme-amber.active .nav-label {
  color: #ffcc00;
  text-shadow: 0 0 10px rgba(255, 204, 0, 0.8);
  font-weight: 700;
}

.nav-item.hovered .nav-label {
  color: #fff;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
}

/* 移除 nav-item 整体的悬停放大，改为只放大内部的徽章容器 */
.nav-item.hovered {
  z-index: 10;
}
.nav-item:active {
  transition: all 0.1s;
}

/* ===== 徽章容器 ===== */
.badge-container {
  position: absolute;
  bottom: 25px; /* 悬浮在底座上方 */
  width: 60px;
  height: 66px;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 随父元素放大，只让图标自己动 */
.nav-item.hovered .badge-container { transform: translateY(-12px) scale(1.15); }
.nav-item.prev-hovered .badge-container,
.nav-item.next-hovered .badge-container { transform: translateY(-4px) scale(1.05); }

.badge-3d-model {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

/* 底部投影 */
.badge-shadow {
  position: absolute;
  bottom: -10px;
  left: 10%;
  width: 80%;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  filter: blur(6px);
  transform: translateZ(-10px);
  transition: all 0.3s;
}

.nav-item.hovered .badge-shadow {
  bottom: -20px;
  filter: blur(10px);
  background: rgba(0, 240, 255, 0.3);
}

.theme-amber.hovered .badge-shadow {
  background: rgba(255, 204, 0, 0.3);
}

/* ===== 六边形外壳 ===== */
.hex-outer {
  position: absolute;
  inset: 0;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  transition: all 0.35s ease;
  transform-style: preserve-3d;
}

/* 顶部玻璃高光反射 */
.hex-bevel-light {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 40%);
  pointer-events: none;
  z-index: 5;
  mix-blend-mode: overlay;
}

/* 青色主题 */
.theme-cyan .hex-outer {
  background: linear-gradient(180deg, #103a5a 0%, #05182a 100%);
  box-shadow: inset 0 0 0 2px rgba(0, 240, 255, 0.5); /* 用内阴影代替 border */
}

.theme-cyan.active .hex-outer {
  background: linear-gradient(180deg, #007090 0%, #003050 100%);
  box-shadow: inset 0 0 0 2px #00f0ff;
}

/* 金色主题 */
.theme-amber .hex-outer {
  background: linear-gradient(180deg, #504010 0%, #201505 100%);
  box-shadow: inset 0 0 0 2px rgba(255, 204, 0, 0.5);
}

.theme-amber.active .hex-outer {
  background: linear-gradient(180deg, #806000 0%, #403000 100%);
  box-shadow: inset 0 0 0 2px #ffcc00;
}

/* ===== 内部发光面板 ===== */
.hex-inner {
  position: absolute;
  top: 6%;
  left: 6%;
  width: 88%;
  height: 88%;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateZ(5px); /* 在 3D 空间往外凸 */
}

.theme-cyan .hex-inner {
  background: linear-gradient(180deg, #051828 0%, #020810 100%);
  box-shadow: inset 0 4px 10px rgba(0, 240, 255, 0.2);
}

.theme-cyan.active .hex-inner {
  background: linear-gradient(180deg, #004060 0%, #001525 100%);
  box-shadow: inset 0 4px 15px rgba(0, 240, 255, 0.5);
}

.theme-amber .hex-inner {
  background: linear-gradient(180deg, #201505 0%, #0a0802 100%);
  box-shadow: inset 0 4px 10px rgba(255, 204, 0, 0.2);
}

.theme-amber.active .hex-inner {
  background: linear-gradient(180deg, #403000 0%, #151000 100%);
  box-shadow: inset 0 4px 15px rgba(255, 204, 0, 0.5);
}

/* ===== 中心发光圆环 ===== */
.center-ring {
  width: 45%;
  height: 45%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s ease;
  transform: translateZ(10px); /* 最高层悬浮 */
}

.theme-cyan .center-ring {
  border: 2px solid rgba(0, 240, 255, 0.4);
  background: radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 70%);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
}

.theme-cyan.active .center-ring {
  border-color: #00f0ff;
  background: radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, transparent 70%);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.6), inset 0 0 10px rgba(0, 240, 255, 0.4);
}

.theme-amber .center-ring {
  border: 2px solid rgba(255, 204, 0, 0.4);
  background: radial-gradient(circle, rgba(255, 204, 0, 0.1) 0%, transparent 70%);
  box-shadow: 0 0 10px rgba(255, 204, 0, 0.2);
}

.theme-amber.active .center-ring {
  border-color: #ffcc00;
  background: radial-gradient(circle, rgba(255, 204, 0, 0.3) 0%, transparent 70%);
  box-shadow: 0 0 20px rgba(255, 204, 0, 0.6), inset 0 0 10px rgba(255, 204, 0, 0.4);
}

/* ===== 中心实体圆点 ===== */
.center-dot {
  width: 40%;
  height: 40%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 14px;
  color: #fff;
  z-index: 5;
  transform: translateZ(5px);
}

.theme-cyan .center-dot {
  background: radial-gradient(circle, #00f0ff 30%, #0080a0 100%);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
}

.theme-cyan.active .center-dot {
  background: radial-gradient(circle, #fff 10%, #00f0ff 50%, #0080a0 100%);
  box-shadow: 0 0 15px #00f0ff, 0 0 5px #fff;
}

.theme-amber .center-dot {
  background: radial-gradient(circle, #ffcc00 30%, #a08000 100%);
  box-shadow: 0 0 8px rgba(255, 204, 0, 0.6);
}

.theme-amber.active .center-dot {
  background: radial-gradient(circle, #fff 10%, #ffcc00 50%, #a08000 100%);
  box-shadow: 0 0 15px #ffcc00, 0 0 5px #fff;
}

/* ===== 顶部三角装饰 ===== */
.top-tri {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%) translateZ(8px);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
}

.theme-cyan .top-tri { border-bottom: 8px solid rgba(0, 240, 255, 0.5); }
.theme-cyan.active .top-tri {
  border-bottom-color: #00f0ff;
  filter: drop-shadow(0 0 5px #00f0ff);
}

.theme-amber .top-tri { border-bottom: 8px solid rgba(255, 204, 0, 0.5); }
.theme-amber.active .top-tri {
  border-bottom-color: #ffcc00;
  filter: drop-shadow(0 0 5px #ffcc00);
}

/* ===== 镜像倒影 (极其关键的立体感来源) ===== */
.badge-reflection {
  position: absolute;
  top: 105%; /* 倒影起始位置 */
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleY(-1); /* 垂直翻转 */
  opacity: 0.5;
  pointer-events: none;
  /* 渐变遮罩让倒影逐渐消失 */
  -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 60%);
  mask-image: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 60%);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: blur(1px); /* 加一点微弱模糊更像真实的镜面反射 */
}

.nav-item.active .badge-reflection { opacity: 0.8; }
/* 当图标悬浮抬升时，倒影应在视觉上保持在底座上，即相对图标要下沉更多并且更模糊 */
.nav-item.hovered .badge-reflection { 
  opacity: 0.3; 
  transform: scaleY(-1) translateY(-24px); 
  filter: blur(3px);
}

/* ===== 标签文字 ===== */
.nav-label {
  position: absolute;
  bottom: -20px; /* 将文字固定在底座下方，确保放大时绝不遮挡 */
  font-size: 13px;
  font-weight: 500;
  color: #4a7a9a;
  transition: all 0.3s ease;
  z-index: 15;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
}

.theme-cyan.active .nav-label {
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
  font-weight: 700;
}

.theme-amber.active .nav-label {
  color: #ffcc00;
  text-shadow: 0 0 10px rgba(255, 204, 0, 0.8);
  font-weight: 700;
}

/* Hover 时文字保持原位，仅仅提亮 */
.nav-item.hovered .nav-label {
  color: #fff;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
}

/* ===== 响应式：保留高级科技3D审美，固定在底部 ===== */
@media (max-width: 768px) {
  .dock-wrapper { 
    position: fixed; 
    bottom: 0; 
    left: 0; 
    width: 100%; 
    padding-bottom: env(safe-area-inset-bottom);
    background: linear-gradient(180deg, transparent 0%, rgba(2, 6, 16, 0.8) 40%, rgba(2, 6, 16, 0.95) 100%);
    z-index: 100;
  }
  .bottom-nav { gap: 15px; padding: 10px 15px 15px; }
  .dock-base { width: 95%; max-width: 400px; height: 50px; bottom: 5px; transform: translateX(-50%) perspective(800px) rotateX(45deg); }
  .nav-item { width: 64px; height: 80px; }
  .badge-container { bottom: 15px; width: 44px; height: 48px; }
  .nav-label { font-size: 12px; bottom: -8px; }
  .badge-reflection { filter: blur(2px); opacity: 0.3; }
  .icon-text { font-size: 13px; }
}

@media (max-width: 480px) {
  .bottom-nav { gap: 8px; padding: 8px 10px 12px; }
  .dock-base { width: 95%; max-width: 340px; height: 45px; bottom: 0px; }
  .nav-item { width: 60px; height: 75px; }
  .badge-container { bottom: 10px; width: 42px; height: 46px; }
  .nav-label { font-size: 11px; bottom: -10px; }
  .icon-text { font-size: 12px; }
}

@media (max-height: 500px) and (orientation: landscape) {
  .dock-wrapper { position: fixed; bottom: 0; left: 0; width: 100%; padding-bottom: 0; z-index: 100; background: rgba(2, 6, 16, 0.9); }
  .bottom-nav { gap: 12px; padding: 6px 12px 8px; }
  .dock-base { width: 85%; max-width: 400px; height: 40px; bottom: 0px; transform: translateX(-50%) perspective(800px) rotateX(40deg); }
  .nav-item { width: 60px; height: 70px; }
  .badge-container { bottom: 8px; width: 38px; height: 42px; }
  .nav-label { font-size: 11px; bottom: -10px; }
  .badge-reflection { display: none; }
}
</style>

