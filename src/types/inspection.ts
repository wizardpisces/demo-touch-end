export type InspectionResult = '合格' | '不合格'

export type InspectionTypeName =
  | '来料检验'
  | '首检'
  | '巡检'
  | '自检'
  | '成品检'
  | '出货检验'

export interface InspectionRecord {
  id: string
  orderNo: string
  inspectionType: InspectionTypeName
  materialCode: string
  materialName: string
  result: InspectionResult
  inspectionTime: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface InspectionQuery {
  type?: InspectionTypeName
  page?: number
  pageSize?: number
}
