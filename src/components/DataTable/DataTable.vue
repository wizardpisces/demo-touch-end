<template>
  <div class="table-wrapper">
    <div class="table-frame">
      <!-- 四角大型发光装饰 -->
      <span class="corner-deco tl" />
      <span class="corner-deco tr" />
      <span class="corner-deco bl" />
      <span class="corner-deco br" />
      <!-- 上下中间发光点 -->
      <span class="edge-dot top" />
      <span class="edge-dot bottom" />

      <div class="table-inner">
        <table class="data-table">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.key" :style="{ width: col.width }">
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in data"
              :key="row.id"
              :class="{ 'row-alt': idx % 2 === 1 }"
            >
              <td>{{ row.orderNo }}</td>
              <td>{{ row.inspectionType }}</td>
              <td>{{ row.materialCode }}</td>
              <td>{{ row.materialName }}</td>
              <td>
                <span :class="row.result === '合格' ? 'badge-pass' : 'badge-fail'">
                  {{ row.result }}
                </span>
              </td>
              <td>{{ row.inspectionTime }}</td>
              <td class="actions">
                <button class="btn-action btn-edit" @click="$emit('edit', row)">修改</button>
                <button class="btn-action btn-delete" @click="$emit('delete', row)">删除</button>
              </td>
            </tr>
            <tr v-if="data.length === 0">
              <td :colspan="columns.length" class="empty-cell">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InspectionRecord } from '../../types/inspection'

interface Column {
  key: string
  label: string
  width?: string
}

defineProps<{
  columns: Column[]
  data: InspectionRecord[]
}>()

defineEmits<{
  edit: [row: InspectionRecord]
  delete: [row: InspectionRecord]
}>()
</script>

<style scoped>
.table-wrapper {
  padding: 8px 32px 0;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.table-frame {
  position: relative;
  flex: 1;
  overflow: hidden;
  border: 1px solid rgba(0, 240, 255, 0.4);
  background:
    linear-gradient(180deg, rgba(0, 240, 255, 0.08) 0%, rgba(0, 240, 255, 0.01) 30%),
    rgba(4, 12, 23, 0.8);
  animation: frame-breathe 4s ease-in-out infinite;
}

@keyframes frame-breathe {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.15), inset 0 0 30px rgba(0, 240, 255, 0.08); }
  50% { box-shadow: 0 0 35px rgba(0, 240, 255, 0.3), inset 0 0 50px rgba(0, 240, 255, 0.15); }
}

/* ---- 四角装饰 ---- */
.corner-deco {
  position: absolute;
  width: 28px;
  height: 28px;
  z-index: 5;
}

.corner-deco::before,
.corner-deco::after {
  content: '';
  position: absolute;
  background: var(--color-primary);
  box-shadow: 0 0 12px var(--color-primary), 0 0 25px rgba(0, 240, 255, 0.6);
}

.corner-deco::before { width: 28px; height: 3px; }
.corner-deco::after  { width: 3px; height: 28px; }

.corner-deco.tl { top: -1px; left: -1px; }
.corner-deco.tl::before { top: 0; left: 0; }
.corner-deco.tl::after  { top: 0; left: 0; }

.corner-deco.tr { top: -1px; right: -1px; }
.corner-deco.tr::before { top: 0; right: 0; }
.corner-deco.tr::after  { top: 0; right: 0; }

.corner-deco.bl { bottom: -1px; left: -1px; }
.corner-deco.bl::before { bottom: 0; left: 0; }
.corner-deco.bl::after  { bottom: 0; left: 0; }

.corner-deco.br { bottom: -1px; right: -1px; }
.corner-deco.br::before { bottom: 0; right: 0; }
.corner-deco.br::after  { bottom: 0; right: 0; }

/* 上下边中间的装饰小亮点 */
.edge-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px #fff, 0 0 20px var(--color-primary);
  z-index: 5;
  animation: breathe 2s ease-in-out infinite;
}

.edge-dot.top { top: -4px; }
.edge-dot.bottom { bottom: -4px; }

.table-inner {
  height: 100%;
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

thead {
  position: sticky;
  top: 0;
  z-index: 3;
}

thead tr {
  background:
    linear-gradient(
      180deg,
      rgba(0, 240, 255, 0.25) 0%,
      rgba(0, 240, 255, 0.1) 100%
    );
  border-bottom: 2px solid var(--color-primary);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3);
}

th {
  position: relative;
  padding: 16px 12px;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 15px var(--color-primary);
  letter-spacing: 2px;
}

/* 表头分割线营造立体感 */
th:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 2px;
  background: linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.2) 100%);
}

td {
  padding: 14px 12px;
  font-size: 14px;
  text-align: center;
  color: var(--color-text-bright);
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  white-space: nowrap;
}

.row-alt {
  background: rgba(0, 0, 0, 0.2);
}

tbody tr {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  /* 基础行厚度感 */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
}

tbody tr:hover {
  background: linear-gradient(90deg, rgba(0, 240, 255, 0.05) 0%, rgba(0, 240, 255, 0.15) 50%, rgba(0, 240, 255, 0.05) 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2);
  transform: translateY(-1px) scale(1.002);
  z-index: 2;
  position: relative;
}

.badge-pass {
  color: var(--color-success);
  font-weight: 600;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
}

.badge-fail {
  color: var(--color-fail);
  font-weight: 600;
  text-shadow: 0 0 8px rgba(255, 51, 51, 0.6);
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-action {
  position: relative;
  padding: 6px 18px;
  font-size: 13px;
  border-radius: 4px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  overflow: hidden;
  /* 基础立体底座 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2);
}

.btn-action:active {
  transform: translateY(2px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.btn-edit {
  color: #fff;
  border: 1px solid rgba(0, 240, 255, 0.8);
  background: linear-gradient(180deg, rgba(0, 240, 255, 0.3) 0%, rgba(0, 240, 255, 0.1) 100%);
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.8);
}

.btn-edit:hover {
  background: linear-gradient(180deg, rgba(0, 240, 255, 0.5) 0%, rgba(0, 240, 255, 0.2) 100%);
  box-shadow: 0 0 15px var(--color-primary), inset 0 2px 4px rgba(255, 255, 255, 0.5);
  border-color: #fff;
}

.btn-delete {
  color: #fff;
  border: 1px solid rgba(255, 51, 51, 0.8);
  background: linear-gradient(180deg, rgba(255, 51, 51, 0.3) 0%, rgba(255, 51, 51, 0.1) 100%);
  text-shadow: 0 0 8px rgba(255, 51, 51, 0.8);
}

.btn-delete:hover {
  background: linear-gradient(180deg, rgba(255, 51, 51, 0.5) 0%, rgba(255, 51, 51, 0.2) 100%);
  box-shadow: 0 0 15px var(--color-fail), inset 0 2px 4px rgba(255, 255, 255, 0.5);
  border-color: #fff;
}

.empty-cell {
  padding: 60px;
  color: var(--color-text-muted);
  font-size: 16px;
  text-shadow: 0 0 5px rgba(123, 166, 196, 0.5);
}
</style>
