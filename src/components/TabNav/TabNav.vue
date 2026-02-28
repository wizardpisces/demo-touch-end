<template>
  <nav class="tab-nav">
    <div class="tab-track-container">
      <div class="tab-track">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="tab-btn"
          :class="{ active: modelValue === tab }"
          @click="$emit('update:modelValue', tab)"
          ref="tabRefs"
        >
          <!-- 悬浮环境光晕 -->
          <div class="tab-halo" />
          
          <div class="tab-glass-panel">
            <!-- 主体内发光面板 -->
            <span class="tab-body">
              <!-- 顶部高光 -->
              <span class="tab-bevel-light" />
              <!-- 侧边高光 -->
              <span class="tab-side-light left" />
              <span class="tab-side-light right" />
              
              <span class="tab-label">{{ tab }}</span>
            </span>
          </div>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import VanillaTilt from 'vanilla-tilt'

const props = defineProps<{
  tabs: string[]
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const tabRefs = ref<HTMLElement[]>([])

onMounted(() => {
  initTilt()
})

watch(() => props.tabs, async () => {
  await nextTick()
  initTilt()
})

function initTilt() {
  if (!tabRefs.value.length) return
  
  // 销毁旧的实例
  tabRefs.value.forEach(el => {
    if ((el as any).vanillaTilt) {
      (el as any).vanillaTilt.destroy()
    }
  })

  // 极简化的 Tilt：去除导致歪斜的 X/Y 轴大旋转，仅保留极微小的反光偏移
  VanillaTilt.init(tabRefs.value, {
    max: 2,             // 将倾斜角度从 15 降到 2，几乎看不出歪斜，但能带动光效
    speed: 600,
    glare: true,        
    "max-glare": 0.3,   
    scale: 1,           // 取消放大
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    perspective: 2000,  // 增大视距，减弱透视畸变
  })
}

onBeforeUnmount(() => {
  tabRefs.value.forEach(el => {
    if ((el as any).vanillaTilt) {
      (el as any).vanillaTilt.destroy()
    }
  })
})
</script>

<style scoped>
.tab-nav {
  padding: 20px 24px 10px;
  flex-shrink: 0;
  z-index: 10;
  position: relative;
}

/* ===== 背景卡槽 (嵌入感来源) ===== */
.tab-track-container {
  display: flex;
  justify-content: center;
  position: relative;
}

/* 卡槽的背板与内阴影 */
.tab-track-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 48px;
  background: rgba(0, 10, 20, 0.6);
  border-radius: 6px;
  box-shadow: 
    inset 0 4px 10px rgba(0, 0, 0, 0.8),
    inset 0 -1px 1px rgba(255, 255, 255, 0.05),
    0 1px 0 rgba(255, 255, 255, 0.05);
  pointer-events: none;
  z-index: 0;
}

.tab-track {
  display: flex;
  align-items: center; /* 改为居中对齐，符合卡槽概念 */
  justify-content: center;
  gap: 8px; /* 适度拉近间距 */
  position: relative;
  z-index: 1;
}

/* ===== 环境光晕 (代替倒影) ===== */
.tab-halo {
  position: absolute;
  inset: -10px;
  background: radial-gradient(ellipse at center, rgba(0, 240, 255, 0.3) 0%, transparent 60%);
  opacity: 0;
  transition: all 0.4s ease;
  pointer-events: none;
  z-index: 0;
}

.tab-btn.active .tab-halo {
  opacity: 1;
}

/* ===== 标签按钮 容器 ===== */
.tab-btn {
  position: relative;
  width: 120px; /* 稍微缩窄，配合间距 */
  height: 38px; /* 匹配卡槽高度 */
  flex-shrink: 0;
  cursor: pointer;
  /* 稳重的悬浮抬升 */
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.tab-btn:hover {
  transform: translateY(-2px);
}

.tab-btn.active {
  z-index: 5;
  transform: translateY(-3px); /* 激活时固定抬起 */
}

.tab-btn:active {
  transform: translateY(1px); /* 物理按压感 */
}

.tab-glass-panel {
  position: absolute;
  inset: 0;
}

/* ===== 主体面板 (金属/玻璃质感) ===== */
.tab-body {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%);
  
  /* 深色玻璃底色 */
  background: rgba(8, 20, 35, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 240, 255, 0.3);
  
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* 多重 3D 阴影 */
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.2), 
    inset 0 -4px 6px rgba(0, 0, 0, 0.8),
    0 8px 16px rgba(0, 0, 0, 0.6);
  
  /* 元素抬升距离 */
  transform: translateZ(10px);
}

/* 顶部物理高光倒角 */
.tab-bevel-light {
  position: absolute;
  top: 0;
  left: 10%;
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  opacity: 0.5;
}

/* 底部深度实体厚度层 */
.tab-depth {
  position: absolute;
  bottom: -4px;
  left: 5%;
  width: 90%;
  height: 100%;
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%);
  background: linear-gradient(180deg, #000 0%, rgba(0, 50, 80, 0.8) 100%);
  transform: translateZ(-5px); /* 在 3D 空间中放在下面 */
  filter: blur(2px);
  transition: all 0.4s;
}

.tab-label {
  position: relative;
  z-index: 5; /* 确保文字在最高层 */
  font-size: 15px;
  font-weight: 600;
  color: #7ba6c4;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 1);
  transform: translateZ(20px); /* 让文字从面板上浮起来！ */
  transition: all 0.4s;
}

/* ===== 倒影层 (极致 3D 细节) ===== */
.tab-reflection {
  position: absolute;
  bottom: -44px; /* 向下翻转到底部 */
  left: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%);
  
  /* 翻转并做透明度渐变遮罩 */
  transform: scaleY(-1) translateZ(0);
  opacity: 0.15;
  background: linear-gradient(180deg, rgba(8, 20, 35, 0.8) 0%, transparent 100%);
  pointer-events: none;
  
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s;
}

.tab-reflection-text {
  font-size: 15px;
  font-weight: 600;
  color: #7ba6c4;
  letter-spacing: 2px;
  transform: scaleY(-1); /* 文字需要再次翻转回来否则是反的 */
  -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, transparent 80%);
  mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, transparent 80%);
}

/* ================== 激活状态 ================== */
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
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  height: 2px;
}

.tab-btn.active .tab-side-light {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, transparent 80%);
  width: 2px;
}

.tab-btn.active .tab-label {
  color: #ffffff;
  font-weight: bold;
  text-shadow: 
    0 0 8px rgba(255, 255, 255, 0.8),
    0 0 15px rgba(0, 240, 255, 1);
}

/* ================== Tilt 的反光层样式覆盖 ================== */
/* vanilla-tilt 会自动生成 js-tilt-glare 元素，我们需要修改它的裁剪路径匹配梯形 */
:deep(.js-tilt-glare) {
  border-radius: 0 !important;
  clip-path: polygon(15% 0, 85% 0, 100% 100%, 0% 100%);
}
</style>
