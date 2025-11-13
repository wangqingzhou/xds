export default {
  // 菜单国际化
  route: {
    dashboard: "首页",
    document: "项目文档",
    articlemanager: "文章管理",
    articlelist: "文章列表",
    classmanager: "栏目管理",
    usermanager: "用户管理",
    rolemanager: "角色管理",
    deptmanager: "部门管理",
    unitmanager: "单位管理",
    dicttreemanager: "字典管理",
    menumanager: "菜单管理",
    logmanager: "日志管理",
  },
  // 登录页面国际化
  login: {
    themeToggle: "主题切换",
    languageToggle: "语言切换",
    dark: "暗黑",
    light: "明亮",
    username: "用户名",
    password: "密码",
    login: "登 录",
    captchaCode: "验证码",
    capsLock: "大写锁定已打开",
    rememberMe: "记住我",
    forgetPassword: "忘记密码？",

    otherLoginMethods: "其他",
    resetPassword: "重置密码",
    thinkOfPasswd: "想起密码？",
    register: "注册账号",
    agree: "我已同意并阅读",
    userAgreement: "用户协议",
    haveAccount: "已有账号？",
    noAccount: "您没有账号？",
    quickFill: "快速填写",

    reg: "注 册",

    getCode: "获取验证码",
    newPassword: {
      placeholder: "请输入新密码",
    },
    confirmPassword: {
      placeholder: "请确认新密码",
    },
    code: {
      placeholder: "请输入验证码",
    },
    phone: {
      placeholder: "请输入手机号",
    },
    message: {
      username: {
        required: "请输入学号或手机号",
        // 可扩展其他规则，如格式校验
        invalid: "请输入正确的学号或手机号格式",
      },
      password: {
        required: "请输入密码",
        min: "密码长度不能少于6位",
      },
      phone: {
        required: "请输入手机号",
        invalid: "请输入正确的手机号格式",
      },
      code: {
        required: "请输入验证码",
        invalid: "验证码为6位数字",
        sent: "验证码发送成功",
        failed: "验证码发送失败",
      },
      newPassword: {
        required: "请输入新密码",
      },
      confirmPassword: {
        required: "请确认密码",
        notMatch: "两次输入的密码不一致",
      },

      resetPassword: {
        success: "密码重置成功",
        failed: "密码重置失败",
      },
    },
  },
  // 导航栏国际化
  navbar: {
    dashboard: "首页",
    logout: "退出登录",
    document: "项目文档",
    gitee: "项目地址",
    profile: "个人中心",
  },
  sizeSelect: {
    tooltip: "布局大小",
    default: "默认",
    large: "大型",
    small: "小型",
    message: {
      success: "切换布局大小成功！",
    },
  },
  langSelect: {
    message: {
      success: "切换语言成功！",
    },
  },
  settings: {
    project: "项目配置",
    theme: "主题设置",
    interface: "界面设置",
    navigation: "导航设置",
    themeColor: "主题颜色",
    themeColorTip: "主题颜色",
    darkMode: "暗黑模式",
    layoutSetting: "布局设置",
    sidebarColorScheme: "侧边栏配色",
    showTagsView: "显示页签",
    showAppLogo: "显示Logo",
    showWatermark: "显示水印",
    classicBlue: "经典蓝",
    minimalWhite: "极简白",
    copyConfig: "复制配置",
    resetConfig: "重置默认",
    copySuccess: "配置已复制到剪贴板",
    resetSuccess: "已重置为默认配置",
    copyDescription: "复制配置将生成当前设置的代码，重置将恢复所有设置为默认值",
    confirmReset: "确定要重置所有设置为默认值吗？此操作不可恢复。",
    applyToFile: "应用到文件",
    onlyCopy: "仅复制",
    leftLayout: "左侧模式",
    topLayout: "顶部模式",
    mixLayout: "混合模式",
    configManagement: "配置管理",
    copyConfigDescription: "生成当前设置的代码并复制到剪贴板，然后覆盖 src/settings.ts 文件",
    resetConfigDescription: "恢复所有设置为系统默认值",
  },
};
