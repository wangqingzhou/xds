<template>
  <div class="login-form-container">
    <h3 class="form-title">{{ t("login.login") }}</h3>

    <el-form
      ref="loginFormRef"
      :model="loginFormData"
      :rules="loginRules"
      size="large"
      :validate-on-rule-change="false"
      class="login-form"
    >
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input
          v-model.trim="loginFormData.username"
          placeholder="学号/ 工号 /手机号"
          class="custom-input"
        >
          <template #prefix>
            <el-icon class="input-icon"><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-tooltip :visible="isCapsLock" :content="t('login.capsLock')" placement="right">
          <el-input
            v-model.trim="loginFormData.password"
            :placeholder="t('login.password')"
            type="password"
            show-password
            class="custom-input"
            @keyup="checkCapsLock"
            @keyup.enter="handleLoginSubmit"
          >
            <template #prefix>
              <el-icon class="input-icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>

      <!-- 操作区域 -->
      <div class="action-area">
        <el-checkbox v-model="loginFormData.rememberMe" class="remember-me">
          {{ t("login.rememberMe") }}
        </el-checkbox>
        <el-link
          type="primary"
          underline="never"
          class="forgot-link"
          @click="toOtherForm('resetPwd')"
        >
          {{ t("login.forgetPassword") }}
        </el-link>
      </div>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="handleLoginSubmit">
          <template v-if="!loading">
            <el-icon class="btn-icon"><Right /></el-icon>
            {{ t("login.login") }}
          </template>
          <template v-else>
            <el-icon class="is-loading"><Loading /></el-icon>
            登录中...
          </template>
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 注册链接 -->
    <div class="register-link">
      <span class="link-text">{{ t("login.noAccount") }}</span>
      <el-link
        type="primary"
        underline="never"
        class="register-link-btn"
        @click="toOtherForm('register')"
      >
        {{ t("login.reg") }}
      </el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import {
  User,
  Lock,
  Right,
  Loading,
  InfoFilled,
  ChatRound,
  Iphone,
  Comment,
} from "@element-plus/icons-vue";
import AuthAPI, { type LoginFormData } from "@/api/auth.api";
import router from "@/router";
import { useUserStore } from "@/store";
import { Auth } from "@/utils/auth";

const { t } = useI18n();
const userStore = useUserStore();
const route = useRoute();

const loginFormRef = ref<FormInstance>();
const loading = ref(false);
const isCapsLock = ref(false);
const rememberMe = Auth.getRememberMe();

const loginFormData = ref<LoginFormData>({
  username: "",
  password: "",
  captchaKey: "",
  captchaCode: "",
  rememberMe,
});

const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.username.required"),
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.password.required"),
      },
      {
        min: 6,
        message: t("login.message.password.min"),
        trigger: "blur",
      },
    ],
  };
});

async function handleLoginSubmit() {
  try {
    const valid = await loginFormRef.value?.validate();
    if (!valid) return;

    loading.value = true;
    await userStore.login(loginFormData.value);
    await userStore.getUserInfo();

    // const redirectPath = (route.query.redirect as string) || "/";

    // 获取用户角色数组
    const userRoles = userStore.userInfo?.roles || [];
    console.log("userRoles:", userRoles);
    // 定义角色标识到首页路径的映射
    const roleHomePages = {
      ROLE_ADMIN: "/dashboard",
      ROLE_POSTGRADUATE: "/materials/welcome",
      ROLE_STUDENT: "/materials/welcome",
      // 可以添加更多角色映射
    };

    // 遍历用户角色，找到第一个匹配的角色并跳转
    let redirectPath = (route.query.redirect as string) || "/";
    if (!redirectPath || !redirectPath.startsWith("/")) {
      redirectPath = "/";
    }

    // 如果没有重定向路径，则根据角色跳转
    if (!route.query.redirect) {
      for (const role of userRoles) {
        if (roleHomePages[role]) {
          redirectPath = roleHomePages[role];
          break;
        }
      }
    }

    // 确保路径安全（防止开放重定向）
    if (!isValidRedirectPath(redirectPath)) {
      redirectPath = "/";
    }
    await router.push(decodeURIComponent(redirectPath));
  } catch (error) {
    console.error("登录失败:", error);
  } finally {
    loading.value = false;
  }
}
// 辅助函数：验证重定向路径是否安全
function isValidRedirectPath(path: string): boolean {
  // 只允许以/开头的路径，不允许包含../等可能用于路径遍历的字符
  return path.startsWith("/") && !path.includes("..");
}
function checkCapsLock(event: KeyboardEvent) {
  if (event instanceof KeyboardEvent) {
    isCapsLock.value = event.getModifierState("CapsLock");
  }
}

const emit = defineEmits(["update:modelValue"]);
function toOtherForm(type: "register" | "resetPwd") {
  emit("update:modelValue", type);
}
</script>

<style lang="scss" scoped>
.login-form-container {
  width: 100%;
}

.form-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 32px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-form {
  margin-bottom: 24px;
}

.custom-input {
  border-radius: 12px;

  :deep(.el-input__wrapper) {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover,
    &.is-focus {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }
  }
}

.input-icon {
  color: #667eea;
  font-size: 18px;
}

.action-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  :deep(.el-checkbox__label) {
    color: #7f8c8d;
    font-size: 14px;
  }
}

.forgot-link {
  font-size: 14px;
  font-weight: 500;
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  .btn-icon {
    margin-right: 8px;
  }
}

.register-link {
  text-align: center;
  margin: 24px 0;
  padding: 16px 0;
  border-top: 1px solid #ecf0f1;

  .link-text {
    color: #7f8c8d;
    font-size: 14px;
    margin-right: 8px;
  }

  .register-link-btn {
    font-weight: 600;
    font-size: 14px;
  }
}

.test-account {
  text-align: center;
  margin: 16px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;

  .el-icon {
    margin-right: 6px;
    color: #667eea;
  }
}

.third-party-login {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #ecf0f1;

  .divider {
    position: relative;
    text-align: center;
    margin-bottom: 24px;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(to right, transparent, #dcdfe6, transparent);
    }

    .divider-text {
      position: relative;
      display: inline-block;
      padding: 0 16px;
      background: white;
      color: #7f8c8d;
      font-size: 12px;
      z-index: 1;
    }
  }

  .social-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .social-btn {
    width: 48px;
    height: 48px;
    border: 1px solid #dcdfe6;
    background: white;
    transition: all 0.3s ease;

    &.wechat:hover {
      border-color: #07c160;
      color: #07c160;
      transform: translateY(-2px);
    }

    &.qq:hover {
      border-color: #12b7f5;
      color: #12b7f5;
      transform: translateY(-2px);
    }

    &.weibo:hover {
      border-color: #e6162d;
      color: #e6162d;
      transform: translateY(-2px);
    }
  }
}

/* 深色模式适配 */
/* 修复深色模式文字看不清的问题 */
:global(.dark) {
  .form-title {
    color: rgba(255, 255, 255, 0.9) !important; /* 确保标题在深色模式下可见 */
  }

  .link-text,
  .test-account .el-text {
    color: rgba(255, 255, 255, 0.8) !important;
  }

  /* 确保所有表单文字在深色模式下清晰 */
  :deep(.el-form-item__label),
  :deep(.el-input__inner),
  :deep(.el-checkbox__label),
  :deep(.el-link) {
    color: rgba(255, 255, 255, 0.85) !important;
  }

  /* 修复输入框在深色模式下的背景 */
  :deep(.el-input__wrapper) {
    background-color: rgba(255, 255, 255, 0.05);

    &:hover {
      box-shadow: 0 0 0 1px var(--el-color-primary);
    }
  }

  /* 测试账号背景在深色模式下调整 */
  .test-account {
    background: rgba(255, 255, 255, 0.05);
  }
}

/* 修复白天模式标题对比度 */
.form-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #1f2d3d; /* 使用更深的颜色确保在浅色背景下对比度足够 */
  margin: 0 0 32px 0;
}

/* 确保版本号在任何模式下都清晰 */
:deep(.el-badge__content) {
  font-weight: 600;
  border: none;
}
/* 响应式设计 */
@media (max-width: 480px) {
  .form-title {
    font-size: 20px;
    margin-bottom: 24px;
  }

  .action-area {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .social-buttons {
    gap: 12px;
  }

  .social-btn {
    width: 44px;
    height: 44px;
  }
}
</style>
