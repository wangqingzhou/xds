import request from "@/utils/request";

const DEPT_BASE_URL = "/api/v1/Dicttree";

const DeptAPI = {
  /**
   * 获取字典列表
   *
   * @param queryParams 查询参数（可选）
   * @returns 字典树形表格数据
   */
  getList(queryParams?: DeptQuery) {
    return request<any, DeptVO[]>({
      url: `${DEPT_BASE_URL}`,
      method: "get",
      params: queryParams,
    });
  },

  /** 获取字典下拉列表 */
  getOptions(type?: string) {
    return request<any, OptionType[]>({
      url: `${DEPT_BASE_URL}/options`,
      method: "get",
      params: { type }, // 添加type参数
    });
  },
  /**
   * 获取字典表单数据
   *
   * @param id 字典ID
   * @returns 字典表单数据
   */
  getFormData(id: string) {
    return request<any, DeptForm>({
      url: `${DEPT_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   * 新增字典
   *
   * @param data 字典表单数据
   * @returns 请求结果
   */
  create(data: DeptForm) {
    return request({
      url: `${DEPT_BASE_URL}/add`,
      method: "post",
      data,
    });
  },

  /**
   * 修改字典
   *
   * @param id 字典ID
   * @param data 字典表单数据
   * @returns 请求结果
   */
  update(id: string, data: DeptForm) {
    return request({
      url: `${DEPT_BASE_URL}/edit/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 删除字典
   *
   * @param ids 字典ID，多个以英文逗号(,)分隔
   * @returns 请求结果
   */
  deleteByIds(ids: string) {
    return request({
      url: `${DEPT_BASE_URL}/delete/${ids}`,
      method: "delete",
    });
  },
};

export default DeptAPI;

/** 字典查询参数 */
export interface DeptQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  status?: number;
  type?: string;
}

/** 字典类型 */
export interface DeptVO {
  /** 子字典 */
  children?: DeptVO[];
  /** 创建时间 */
  createTime?: Date;
  /** 字典ID */
  id?: string;
  /** 字典名称 */
  name?: string;
  type?: string;
  /** 字典编号 */
  code?: string;
  /** 父字典ID */
  parentid?: string;
  /** 排序 */
  sort?: number;
  /** 状态(1:启用；0:禁用) */
  status?: number;
  /** 修改时间 */
  updateTime?: Date;
}

/** 字典表单类型 */
export interface DeptForm {
  /** 字典ID(新增不填) */
  id?: string;
  /** 字典名称 */
  name?: string;
  type?: string;
  /** 字典编号 */
  code?: string;
  /** 父字典ID */
  parentId: string;
  /** 排序 */
  sort?: number;
  /** 状态(1:启用；0：禁用) */
  status?: number;
}
