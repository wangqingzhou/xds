import request from "@/utils/request";
export interface MaterialForm {
  id?: string | number;
  // 个人基本信息
  studentId: string;
  studentName: string;
  school: string;
  major: string;
  education: string;
  graduationDate: string;
  // 政治面貌和党员信息
  politicalStatus: string;
  partyProofFileIds: number[]; // 修改为数组类型
  partyValid: string;
  // 学生干部经历
  cadreExperience: string;
  cadrePosition: string;
  cadreProofFileId: number | null;
  cadreValid: string;
  // 参军入伍经历
  militaryExperience: string;
  militaryProofFileId: number | null;
  militaryValid: string;
  // 获奖情况
  awardLevel: string;
  awardName: string;
  awardsProofFileIds: number[];
  awardValid: string;
  // 成绩信息
  rankNumber: number | null;
  totalStudents: number | null;
  failedCourses: string;
  transcriptFileId: number | null;
  transcriptValid: string;
  rankProofFileId: number | null;
  rankValid: string;
  // 身份信息
  idCardFileId: number | null;
  idValid: string;
  // 总体声明
  overallValid: string;
  // 添加状态字段
  status: string;
  reviewRemark: string;
  // 发表文章数量统计
  articleCounts: {};

  // 知识产权数量统计
  ipCounts: {};
}
export interface MaterialPageQuery {
  pageNum?: number;
  pageSize?: number;
  studentId?: string;
  studentName?: string;
  school?: string;
  status?: string; // 状态筛选：DRAFT, SUBMITTED, RETURNED, APPROVED
  politicalStatus?: string;
  cadreExperience?: string;
  militaryExperience?: string;
  awardLevel?: string;
  startTime?: string; // 开始时间
  endTime?: string; // 结束时间
  education?: string; // 学历参数
}
export interface MaterialPageVO {
  id: number;
  studentId: string;
  studentName: string;
  school: string;
  major: string;
  education: string;
  graduationDate: string;
  politicalStatus: string;
  cadreExperience: string;
  militaryExperience: string;
  awardLevel: string;
  status: string;
  statusText: string; // 状态文本：草稿、已提交、已退回、已审核通过
  createBy: string;
  createTime: string;
  updateTime: string;
  score?: number; // 可选的得分字段
}
export interface PageResult<T> {
  total: number;
  records: T;
}
export interface ScoreResult {
  academicScore: number;
  academicProgress: number;
  rankingPercent: number;
  politicalStatusScore: number;
  politicalStatusProgress: number;
  politicalStatusText: string;
  cadreScore: number;
  cadreProgress: number;
  cadreText: string;
  awardsScore: number;
  awardsProgress: number;
  awardsText: string;
  militaryScore: number;
  militaryProgress: number;
  militaryText: string;
  totalScore: number;
}
// 1. 定义流转日志的类型接口（与后端返回字段对齐）
export interface FlowLog {
  id: number | string; // 日志ID
  materialId: number | string; // 材料ID（关联申请表）
  operation: string; // 操作类型（如：提交申请、审核通过、退回）
  createBy: number | string; // 操作人ID
  createByName: string; // 操作人姓名（后端返回，避免前端二次查询）
  remark: string; // 操作备注（如退回原因）
  createTime: string; // 操作时间（格式：YYYY-MM-DD HH:mm:ss）
  module: string; // 业务模块（如：Material）
}
const MATERIAL_BASE_URL = "/api/v1/materials";
export default {
  /** 获取申请分页数据 */
  getPage(queryParams?: MaterialPageQuery) {
    return request<any, PageResult<MaterialPageVO[]>>({
      url: `${MATERIAL_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  // 获取详情
  getDetail(id: string | number) {
    return request<MaterialForm>({
      url: `${MATERIAL_BASE_URL}/${id}/form`,
      method: "get",
    });
  },
  // 新增
  add(data: MaterialForm) {
    return request({
      url: MATERIAL_BASE_URL,
      method: "post",
      data,
    });
  },
  // 更新
  update(id: string | number, data: MaterialForm) {
    return request({
      url: `${MATERIAL_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },
  // 保存草稿
  saveDraft(data: MaterialForm) {
    return request({
      url: `${MATERIAL_BASE_URL}/draft`,
      method: "post",
      data,
    });
  },
  // 计算得分
  calculateScore(materialId: string) {
    console.log(materialId);
    return request<ScoreResult>({
      url: `${MATERIAL_BASE_URL}/score`,
      method: "get",
      params: {
        // ✅ 使用 params 发送查询参数
        materialId, // → 生成 ?studentId=xxx
      },
    });
  },
  // 计算得分id
  getScoreDetails(materialId: string) {
    console.log(materialId);
    return request<ScoreResult>({
      url: `${MATERIAL_BASE_URL}/score`,
      method: "get",
      params: {
        // ✅ 使用 params 发送查询参数
        materialId, // → 生成 ?studentId=xxx
      },
    });
  },
  // 新增：获取流转日志（核心补充）
  getFlowLogs: (materialId: string | number) => {
    console.log("获取流转日志 - materialId:", materialId);
    return request<FlowLog[]>({
      // 后端返回日志数组
      url: `${MATERIAL_BASE_URL}/flowlogs`, // 后端日志接口URL
      method: "get",
      params: { materialId }, // 与得分明细一致，用查询参数传递材料ID
    });
  },
  // 删除
  delete(id: string | number) {
    return request({
      url: `${MATERIAL_BASE_URL}/${id}`,
      method: "delete",
    });
  },
  // 批量删除
  batchDelete(ids: (string | number)[]) {
    return request({
      url: `${MATERIAL_BASE_URL}/batch`,
      method: "delete",
      data: { ids },
    });
  },
  // 提交申请
  submit(id: string | number) {
    return request({
      url: `${MATERIAL_BASE_URL}/${id}/submit`,
      method: "put",
    });
  },

  // 审核
  approve(data: MaterialForm) {
    return request({
      url: `${MATERIAL_BASE_URL}/approve`,
      method: "post",
      data,
    });
  },
  // 通用状态变更
  return(materialIds: string | number, status: string, remark: string) {
    return request({
      url: `${MATERIAL_BASE_URL}/updatestatus`,
      method: "put",
      data: { materialIds, status, remark }, // ✅ 使用  data 发送到 URL 查询参数
    });
  },
  // 通用状态变更增加是否符合
  updatestatus(
    materialIds: string | number,
    status: string,
    remark: string,
    qualify: string | number
  ) {
    return request({
      url: `${MATERIAL_BASE_URL}/updatestatus`,
      method: "put",
      data: { materialIds, status, remark, qualify }, // ✅ 使用  data 发送到 URL 查询参数
    });
  },
};
