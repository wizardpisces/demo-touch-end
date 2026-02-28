import type {
  InspectionRecord,
  InspectionTypeName,
  InspectionResult,
  PaginatedResponse,
  InspectionQuery,
} from '../types/inspection'

const TYPES: InspectionTypeName[] = [
  '来料检验', '首检', '巡检', '自检', '成品检', '出货检验',
]

const RESULTS: InspectionResult[] = ['合格', '不合格']

function randomDate(): string {
  const year = 2025
  const month = 9 + Math.floor(Math.random() * 4)
  const day = 1 + Math.floor(Math.random() * 28)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function generateRecords(count: number): InspectionRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `rec-${i + 1}`,
    orderNo: `T00T70602202${String(2000 + i * 6).slice(-4)}`,
    inspectionType: TYPES[i % TYPES.length] as InspectionTypeName,
    materialCode: 'IT2022101001101',
    materialName: '博世螺丝刀',
    result: RESULTS[Math.random() > 0.35 ? 0 : 1] as InspectionResult,
    inspectionTime: randomDate(),
  }))
}

const ALL_RECORDS = generateRecords(60)

function delay(ms = 200): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export async function fetchInspectionList(
  query: InspectionQuery = {},
): Promise<PaginatedResponse<InspectionRecord>> {
  await delay()

  const { type, page = 1, pageSize = 10 } = query
  let filtered = ALL_RECORDS
  if (type) {
    filtered = ALL_RECORDS.filter((r) => r.inspectionType === type)
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, total, page, pageSize, totalPages }
}

export async function updateInspectionRecord(
  id: string,
  patch: Partial<InspectionRecord>,
): Promise<InspectionRecord> {
  await delay()
  const record = ALL_RECORDS.find((r) => r.id === id)
  if (!record) throw new Error(`Record ${id} not found`)
  return Object.assign(record, patch)
}

export async function deleteInspectionRecord(id: string): Promise<void> {
  await delay()
  const idx = ALL_RECORDS.findIndex((r) => r.id === id)
  if (idx === -1) throw new Error(`Record ${id} not found`)
  ALL_RECORDS.splice(idx, 1)
}
