import request from "@/utils/request";

const NOTICE_BASE_URL = "/api/v1/news";

const NoticeAPI = {
  /** 获取文章公告分页数据 */
  getPage(queryParams?: NoticePageQuery) {
    return request<any, PageResult<NoticePageVO[]>>({
      url: `${NOTICE_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取文章公告表单数据
   *
   * @param id NoticeID
   * @returns Notice表单数据
   */
  getFormData(id: number) {
    return request<any, NoticeForm>({
      url: `${NOTICE_BASE_URL}/${id}/form`,
      method: "get",
    });
  },
  /**
   * 分享
   *
   * @param id 被发布的文章公告id
   * @returns
   */
  xhs(id: number) {
    return request({
      url: `${NOTICE_BASE_URL}/${id}/xhs`,
      method: "get",
    });
  },
  /**
   * 添加文章公告
   *
   * @param data Notice表单数据
   * @returns
   */
  add(data: NoticeForm) {
    return request({
      url: `${NOTICE_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新文章公告
   *
   * @param id NoticeID
   * @param data Notice表单数据
   */
  update(id: number, data: NoticeForm) {
    return request({
      url: `${NOTICE_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除文章公告，多个以英文逗号(,)分割
   *
   * @param ids 文章公告ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${NOTICE_BASE_URL}/${ids}`,
      method: "delete",
    });
  },

  /**
   * 发布文章
   *
   * @param id 被发布的文章公告id
   * @returns
   */
  publish(id: number) {
    return request({
      url: `${NOTICE_BASE_URL}/${id}/publish`,
      method: "put",
    });
  },

  /**
   * 撤回文章
   *
   * @param id 撤回的文章id
   * @returns
   */
  revoke(id: number) {
    return request({
      url: `${NOTICE_BASE_URL}/${id}/revoke`,
      method: "put",
    });
  },
  /**
   * 查看文章
   *
   * @param id
   */
  getDetail(id: string) {
    return request<any, NoticeDetailVO>({
      url: `${NOTICE_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /* 全部已读 */
  readAll() {
    return request({
      url: `${NOTICE_BASE_URL}/read-all`,
      method: "put",
    });
  },

  /** 获取我的文章分页列表 */
  getMyNoticePage(queryParams?: NoticePageQuery) {
    return request<any, PageResult<NoticePageVO[]>>({
      url: `${NOTICE_BASE_URL}/my-page`,
      method: "get",
      params: queryParams,
    });
  },
};

export default NoticeAPI;

/** 文章公告分页查询参数 */
export interface NoticePageQuery extends PageQuery {
  /** 标题 */
  title?: string;
  /** 发布状态(0：未发布，1：已发布，-1：已撤回) */
  publishStatus?: number;

  isRead?: number;
  /** 搜索关键字 */
  keywords?: string;

  /** 用户状态 */
  status?: number;

  /** 栏目ID */
  classId?: string;

  /** 开始时间 */
  createTime?: [string, string];
}

/** 文章公告表单对象 */
export interface NoticeForm {
  id?: number;
  /** 文章标题 */
  title?: string;
  /** 单图 */
  picurl?: string;

  /** 文章内容 */
  content?: string;
  /** 栏目 */
  classid?: number;
  /** 优先级(L：低，M：中，H：高) */
  level?: string;
  /** 目标类型(1-全体 2-指定) */
  targetType?: number;
  /** 目标ID合集，以,分割 */
  targetUserIds?: string;
}

/** 文章公告分页对象 */
export interface NoticePageVO {
  id: string;
  /** 文章标题 */
  title?: string;
  /** 文章内容 */
  content?: string;
  /** 文章类型 */
  type?: number;
  /** 发布人 */
  publisherId?: bigint;
  /** 优先级(0-低 1-中 2-高) */
  priority?: number;
  /** 目标类型(0-全体 1-指定) */
  targetType?: number;
  /** 发布状态(0-未发布 1已发布 2已撤回) */
  publishStatus?: number;
  /** 发布时间 */
  publishTime?: Date;
  /** 撤回时间 */
  revokeTime?: Date;
}

export interface NoticeDetailVO {
  /** 文章ID */
  id?: string;

  /** 文章标题 */
  title?: string;
  /** 单图 */
  picurl?: string;
  /** 文章内容 */
  content?: string;

  /** 文章类型 */
  type?: number;

  /** 发布人 */
  publisherName?: string;

  /** 优先级(L-低 M-中 H-高) */
  level?: string;

  /** 发布时间 */
  publishTime?: Date;

  /** 发布状态 */
  publishStatus?: number;
}
