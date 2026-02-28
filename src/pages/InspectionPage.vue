<template>
  <div class="inspection-page">
    <AppHeader station-name="1#组装工作站" user-name="admin" />

    <TabNav v-model="activeTab" :tabs="TAB_LIST" />

    <DataTable
      :columns="TABLE_COLUMNS"
      :data="records"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <Pagination v-model="currentPage" :total-pages="totalPages" />

    <BottomNav v-model="activeNav" :items="NAV_ITEMS" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { InspectionRecord, InspectionTypeName } from '../types/inspection'
import { fetchInspectionList, deleteInspectionRecord } from '../api/inspection'
import AppHeader from '../components/AppHeader/AppHeader.vue'
import TabNav from '../components/TabNav/TabNav.vue'
import DataTable from '../components/DataTable/DataTable.vue'
import Pagination from '../components/Pagination/Pagination.vue'
import BottomNav from '../components/BottomNav/BottomNav.vue'

const TAB_LIST = ['来料检验', '首检', '巡检', '自检', '成品检', '发货检验']

const TABLE_COLUMNS = [
  { key: 'orderNo', label: '检验单编号', width: '18%' },
  { key: 'inspectionType', label: '检验类型', width: '10%' },
  { key: 'materialCode', label: '物料产品编码', width: '18%' },
  { key: 'materialName', label: '物料产品名称', width: '14%' },
  { key: 'result', label: '检测结果', width: '10%' },
  { key: 'inspectionTime', label: '检测时间', width: '14%' },
  { key: 'actions', label: '操作', width: '16%' },
]

const NAV_ITEMS = [
  { key: 'production', label: '生产', icon: '⚙', color: 'amber' as const },
  { key: 'process', label: '工序', icon: '⛭', color: 'cyan' as const },
  { key: 'quality', label: '质量', icon: '✓', color: 'cyan' as const },
  { key: 'equipment', label: '设备', icon: '⚡', color: 'cyan' as const },
]

const activeTab = ref<string>('首检')
const activeNav = ref('equipment')
const currentPage = ref(1)
const totalPages = ref(1)
const records = ref<InspectionRecord[]>([])

async function loadData() {
  const res = await fetchInspectionList({
    type: activeTab.value as InspectionTypeName,
    page: currentPage.value,
    pageSize: 10,
  })
  records.value = res.data
  totalPages.value = res.totalPages
}

watch(activeTab, () => {
  currentPage.value = 1
  loadData()
})

watch(currentPage, loadData)

loadData()

function handleEdit(row: InspectionRecord) {
  alert(`编辑: ${row.orderNo}`)
}

async function handleDelete(row: InspectionRecord) {
  if (!confirm(`确认删除 ${row.orderNo}?`)) return
  await deleteInspectionRecord(row.id)
  loadData()
}
</script>

<style scoped>
.inspection-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* 更深的科技暗黑背景 */
  background: linear-gradient(180deg, #020610 0%, #061020 50%, #020610 100%);
  overflow: hidden;
}

.main-content {
  flex: 1;
  padding: 16px 32px 0; /* 减少顶部 Padding 腾出空间 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.data-table-container) {
  flex: 1;
  min-height: 0;
  margin-bottom: 16px;
}

/* 确保分页和底部导航之间有足够的空间，避免遮挡 */
:deep(.pagination) {
  margin-bottom: 30px;
}
</style>
