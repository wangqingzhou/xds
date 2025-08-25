import request from "@/utils/request";

const UNIT_BASE_URL = "/api/v1/units";

const UnitAPI = {
  /** 获取单位分页数据 */
  getPage(queryParams?: UnitPageQuery) {
    return request<PageResult<UnitPageVO[]>>({
      url: `${UNIT_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },

  getFormData(id: string) {
    return request<any, UnitDetailVO>({
      url: `${UNIT_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加单位 */
  create(data: UnitForm) {
    return request({
      url: UNIT_BASE_URL,
      method: "post",
      data,
    });
  },

  /** 更新单位 */
  update(id: number, data: UnitForm) {
    return request({
      url: `${UNIT_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },
  /**
   * 批量删除角色，多个以英文逗号(,)分割
   *
   * @param ids 角色ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${UNIT_BASE_URL}/delete/${ids}`,
      method: "delete",
    });
  },
  /** 删除单位 */
  delete(id: number) {
    return request({
      url: `${UNIT_BASE_URL}/delete/${id}`,
      method: "delete",
    });
  },
};

export default UnitAPI;

/** 单位分页查询参数 */
export interface UnitPageQuery extends PageQuery {
  name?: string;
  linkman?: string;
  status?: number;
  createTimeRange?: [string, string];
}

/** 单位分页对象 */
export interface UnitPageVO {
  id: number;
  name: string;
  linkman: string;
  linktel: string;
  status: number;
  createTime: string;
  updateTime?: string;
  avatar?: string;
}

/** 单位详情对象 */
export interface UnitDetailVO {
  id: number;
  name: string;
  linkman: string;
  linktel: string;
  content?: string;
  avatar?: string;
  mobile?: string;
  status: number;
  email?: string;
  createTime: string;
  updateTime?: string;
  createBy?: number;
  updateBy?: number;
  openid?: string;
  remark?: string;
  ip?: string;
}

/** 单位表单对象 */
export interface UnitForm {
  id?: number;
  name: string;
  linkman?: string;
  linktel?: string;
  content?: string;
  avatar?: string;
  mobile?: string;
  status?: number;
  email?: string;
  openid?: string;
  remark?: string;
}
