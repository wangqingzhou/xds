import request from "@/utils/request";

const SCORE_RULES_BASE_URL = "/api/v1/score-rules";

/** 评分规则查询参数 */
export interface ScoreRulesQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 规则类型(academic/political/cadre/award/military) */
  ruleType?: string;
  /** 状态(1:启用；0:禁用) */
  status?: number;
}

/** 评分规则类型 */
export interface ScoreRulesVO {
  /** 子规则 */
  children?: ScoreRulesVO[];
  /** 创建时间 */
  createTime?: Date;
  /** 规则ID */
  id?: string;
  /** 规则名称 */
  name?: string;
  /** 规则代码 */
  code?: string;
  /** 父规则ID */
  parentId?: string;
  /** 排序 */
  sort?: number;
  /** 状态(1:启用；0:禁用) */
  status?: number;
  /** 修改时间 */
  updateTime?: Date;
  /** 规则类型(academic/political/cadre/award/military) */
  ruleType?: string;
  /** 评分条件 */
  condition?: string;
  /** 分值 */
  score?: number;
  /** 公式类型(if/range/direct) */
  formulaType?: string;
  /** 计算公式 */
  formula?: string;
  /** 评分说明 */
  description?: string;
}

/** 评分规则表单类型 */
export interface ScoreRulesForm {
  /** 规则ID(新增不填) */
  id?: string;
  /** 规则名称 */
  name?: string;
  /** 规则代码 */
  code?: string;
  /** 父规则ID */
  parentId: string;
  /** 排序 */
  sort?: number;
  /** 状态(1:启用；0：禁用) */
  status?: number;
  /** 规则类型(academic/political/cadre/award/military) */
  ruleType?: string;
  /** 评分条件 */
  condition?: string;
  /** 分值 */
  score?: number;
  /** 公式类型(if/range/direct) */
  formulaType?: string;
  /** 计算公式 */
  formula?: string;
  /** 评分说明 */
  description?: string;
}

/** 变量定义类型 */
export interface VariableVO {
  /** 变量ID */
  id?: string;
  /** 变量名称 */
  name?: string;
  /** 变量公式 */
  formula?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 修改时间 */
  updateTime?: Date;
}

/** 变量定义表单类型 */
export interface VariableForm {
  /** 变量ID(新增不填) */
  id?: string;
  /** 变量名称 */
  name?: string;
  /** 变量公式 */
  formula?: string;
}

/** 总分计算公式类型 */
export interface TotalFormulaVO {
  /** 公式ID */
  id?: string;
  /** 公式内容 */
  formula?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 修改时间 */
  updateTime?: Date;
}

/** 总分计算公式表单类型 */
export interface TotalFormulaForm {
  /** 公式ID(新增不填) */
  id?: string;
  /** 公式内容 */
  formula?: string;
}

/** 完整评分规则配置类型 */
export interface ScoreRulesConfig {
  /** 学习成绩评分规则 */
  academic: ScoreRulesVO[];
  /** 政治面貌评分规则 */
  political: ScoreRulesVO[];
  /** 学生干部经历评分规则 */
  cadre: ScoreRulesVO[];
  /** 获奖情况评分规则 */
  award: ScoreRulesVO[];
  /** 参军入伍经历评分规则 */
  military: ScoreRulesVO[];
  /** 总分计算公式 */
  totalFormula: string;
  /** 变量定义 */
  variables: VariableVO[];
}

/** 评分规则配置表单类型 */
export interface ScoreRulesConfigForm {
  /** 学习成绩评分规则 */
  academic: ScoreRulesForm[];
  /** 政治面貌评分规则 */
  political: ScoreRulesForm[];
  /** 学生干部经历评分规则 */
  cadre: ScoreRulesForm[];
  /** 获奖情况评分规则 */
  award: ScoreRulesForm[];
  /** 参军入伍经历评分规则 */
  military: ScoreRulesForm[];
  /** 总分计算公式 */
  totalFormula: string;
  /** 变量定义 */
  variables: VariableForm[];
}

const ScoreRulesAPI = {
  /**
   * 获取评分规则列表
   *
   * @param queryParams 查询参数（可选）
   * @returns 评分规则树形表格数据
   */
  getList(queryParams?: ScoreRulesQuery) {
    return request<any, ScoreRulesVO[]>({
      url: `${SCORE_RULES_BASE_URL}`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取评分规则配置
   *
   * @returns 完整评分规则配置数据
   */
  getConfig() {
    return request<any, ScoreRulesConfig>({
      url: `${SCORE_RULES_BASE_URL}/config`,
      method: "get",
    });
  },

  /**
   * 获取评分规则表单数据
   *
   * @param id 规则ID
   * @returns 评分规则表单数据
   */
  getFormData(id: string) {
    return request<any, ScoreRulesForm>({
      url: `${SCORE_RULES_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   * 新增评分规则
   *
   * @param data 评分规则表单数据
   * @returns 请求结果
   */
  create(data: ScoreRulesForm) {
    return request({
      url: `${SCORE_RULES_BASE_URL}/add`,
      method: "post",
      data,
    });
  },

  /**
   * 修改评分规则
   *
   * @param id 规则ID
   * @param data 评分规则表单数据
   * @returns 请求结果
   */
  update(id: string, data: ScoreRulesForm) {
    return request({
      url: `${SCORE_RULES_BASE_URL}/edit/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 删除评分规则
   *
   * @param ids 规则ID，多个以英文逗号(,)分隔
   * @returns 请求结果
   */
  deleteByIds(ids: string) {
    return request({
      url: `${SCORE_RULES_BASE_URL}/delete/${ids}`,
      method: "delete",
    });
  },

  /**
   * 保存评分规则配置
   *
   * @param data 完整评分规则配置数据
   * @returns 请求结果
   */
  saveConfig(data: ScoreRulesConfigForm) {
    return request({
      url: `${SCORE_RULES_BASE_URL}/config/save`,
      method: "post",
      data,
    });
  },

  /**
   * 重置评分规则配置为默认值
   *
   * @returns 请求结果
   */
  resetConfig() {
    return request({
      url: `${SCORE_RULES_BASE_URL}/config/reset`,
      method: "post",
    });
  },

  /**
   * 获取变量定义列表
   *
   * @returns 变量定义列表
   */
  getVariables() {
    return request<any, VariableVO[]>({
      url: `${SCORE_RULES_BASE_URL}/variables`,
      method: "get",
    });
  },

  /**
   * 新增变量定义
   *
   * @param data 变量定义表单数据
   * @returns 请求结果
   */
  createVariable(data: VariableForm) {
    return request({
      url: `${SCORE_RULES_BASE_URL}/variables/add`,
      method: "post",
      data,
    });
  },

  /**
   * 修改变量定义
   *
   * @param id 变量ID
   * @param data 变量定义表单数据
   * @returns 请求结果
   */
  updateVariable(id: string, data: VariableForm) {
    return request({
      url: `${SCORE_RULES_BASE_URL}/variables/edit/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 删除变量定义
   *
   * @param ids 变量ID，多个以英文逗号(,)分隔
   * @returns 请求结果
   */
  deleteVariables(ids: string) {
    return request({
      url: `${SCORE_RULES_BASE_URL}/variables/delete/${ids}`,
      method: "delete",
    });
  },

  /**
   * 获取总分计算公式
   *
   * @returns 总分计算公式
   */
  getTotalFormula() {
    return request<any, TotalFormulaVO>({
      url: `${SCORE_RULES_BASE_URL}/total-formula`,
      method: "get",
    });
  },

  /**
   * 更新总分计算公式
   *
   * @param data 总分计算公式表单数据
   * @returns 请求结果
   */
  updateTotalFormula(data: TotalFormulaForm) {
    return request({
      url: `${SCORE_RULES_BASE_URL}/total-formula`,
      method: "put",
      data,
    });
  },
};

export default ScoreRulesAPI;
