/**
 * API 层：生产环境替换 mock 为真实请求即可，接口签名保持不变。
 */
import {
  fetchInspectionList,
  updateInspectionRecord,
  deleteInspectionRecord,
} from '../mock/inspection'

export {
  fetchInspectionList,
  updateInspectionRecord,
  deleteInspectionRecord,
}
