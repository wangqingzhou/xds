import request from "@/utils/request";

const AUTH_BASE_URL = "/api/v1/auth";

const AuthAPI = {
  /** 登录接口*/
  login(data: LoginFormData) {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("captchaKey", data.captchaKey);
    formData.append("captchaCode", data.captchaCode);
    return request<any, LoginResult>({
      url: `${AUTH_BASE_URL}/login`,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "application/json", // 明确指定JSON类型
      },
    });
  },
  /** 注册接口 */
  registerUser(data: RegisterFormData) {
    return request<any, ApiResult>({
      url: `/api/v1/users/regUser`,
      method: "post",
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  // 发送重置密码验证码
  sendResetCode(data: { mobile: string; type: string }) {
    return request<any, any>({
      url: "/api/v1/sms/send-reset-code",
      method: "post",
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: "no-auth", // 明确指定不需要认证
      },
    });
  },

  // 通过手机号重置密码
  resetPasswordByMobile(data: {
    mobile: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    return request<any, any>({
      url: "/api/v1/sms/reset-password-by-mobile",
      method: "post",
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: "no-auth", // 明确指定不需要认证
      },
    });
  },
  /** 刷新 token 接口*/
  refreshToken(refreshToken: string) {
    return request<any, LoginResult>({
      url: `${AUTH_BASE_URL}/refresh-token`,
      method: "post",
      params: { refreshToken },
      headers: {
        Authorization: "no-auth",
      },
    });
  },

  /** 退出登录接口 */
  logout() {
    return request({
      url: `${AUTH_BASE_URL}/logout`,
      method: "delete",
    });
  },

  /** 获取验证码接口*/
  getCaptcha() {
    return request<any, CaptchaInfo>({
      url: `${AUTH_BASE_URL}/captcha`,
      method: "get",
    });
  },
};

export default AuthAPI;

/** 登录表单数据 */
export interface LoginFormData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 验证码缓存key */
  captchaKey: string;
  /** 验证码 */
  captchaCode: string;
  /** 记住我 */
  rememberMe: boolean;
}

/** 登录响应 */
export interface LoginResult {
  /** 访问令牌 */
  accessToken: string;
  /** 刷新令牌 */
  refreshToken: string;
  /** 令牌类型 */
  tokenType: string;
  /** 过期时间(秒) */
  expiresIn: number;
}

/** 验证码信息 */
export interface CaptchaInfo {
  /** 验证码缓存key */
  captchaKey: string;
  /** 验证码图片Base64字符串 */
  captchaBase64: string;
}
/** 注册表单数据 */
export interface RegisterFormData {
  /** 用户名 */
  username: string;
  /** 班级名称 */
  className: string;
  /** 学号 */
  studentId: string;
  /** 手机号 */
  phone: string;
  /** 密码 */
  password: string;
}
