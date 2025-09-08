<template>
  <div class="login-container">
    <!-- 右侧切换主题、语言按钮 -->
    <div class="action-bar">
      <el-tooltip :content="t('login.themeToggle')" placement="bottom">
        <CommonWrapper>
          <DarkModeSwitch class="action-btn" />
        </CommonWrapper>
      </el-tooltip>
      <el-tooltip :content="t('login.languageToggle')" placement="bottom">
        <CommonWrapper>
          <LangSelect size="text-20px" class="action-btn" />
        </CommonWrapper>
      </el-tooltip>
    </div>

    <!-- 登录页主体 -->
    <div class="login-main">
      <div class="login-card">
        <div class="login-content">
          <!-- logo -->
          <div class="logo-container">
            <el-image :src="logo" class="logo" />
          </div>

          <!-- 标题 - 修复对比度问题 -->
          <div class="title-container">
            <h2 class="title">
              <el-badge :value="`v ${defaultSettings.version}`" type="primary" class="badge">
                {{ defaultSettings.title }}
              </el-badge>
            </h2>
          </div>

          <!-- 组件切换 -->
          <transition name="fade-slide" mode="out-in">
            <component :is="formComponents[component]" v-model="component" class="form-container" />
          </transition>
        </div>
      </div>

      <!-- 登录页底部版权 -->
      <div class="footer">
        <el-text size="small" class="copyright">
          Copyright © 2025 micrai.com All Rights Reserved.
          <a href="http://beian.miit.gov.cn/" target="_blank" class="beian-link">
            黑ICP备17005919号-1
          </a>
        </el-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.png";
import { defaultSettings } from "@/settings";
import CommonWrapper from "@/components/CommonWrapper/index.vue";
import DarkModeSwitch from "@/components/DarkModeSwitch/index.vue";
import LangSelect from "@/components/LangSelect/index.vue";

type LayoutMap = "login" | "register" | "resetPwd";

const { t } = useI18n();

const component = ref<LayoutMap>("login");
const formComponents = {
  login: defineAsyncComponent(() => import("./components/Login.vue")),
  register: defineAsyncComponent(() => import("./components/Register.vue")),
  resetPwd: defineAsyncComponent(() => import("./components/ResetPwd.vue")),
};
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.login-container::before {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: "";
  background: url("@/assets/images/login-bg.svg") center/cover;
  opacity: 0.1;
  z-index: 0;
}

.action-bar {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 100;
  display: flex;
  gap: 12px;
  align-items: center;

  .action-btn {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    padding: 8px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      background: rgba(255, 255, 255, 1);
    }
  }

  @media (max-width: 768px) {
    top: 16px;
    right: 16px;

    .action-btn {
      padding: 6px;
    }
  }
}

.login-main {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  padding: 40px 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  margin: 0 auto;
  max-width: 450px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 480px) {
    padding: 40px 24px;
    border-radius: 20px;
  }
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.logo-container {
  .logo {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 12px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  }
}

.title-container {
  text-align: center;

  .title {
    font-size: 32px;
    font-weight: 700;
    color: #2c3e50; /* 确保在浅色背景下有足够对比度 */
    margin: 0;

    /* 移除渐变文字，使用纯色确保可读性 */
    /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text; */
  }

  .badge {
    :deep(.el-badge__content) {
      font-size: 10px;
      padding: 4px 8px;
      border-radius: 12px;
      background-color: var(--el-color-primary);
      color: white;
      border: none;
    }
  }
}

.form-container {
  width: 100%;
}

.footer {
  position: fixed;
  bottom: 24px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 1;

  .copyright {
    color: rgba(255, 255, 255, 0.9); /* 提高对比度 */
    font-weight: 500;
  }

  .beian-link {
    color: rgba(255, 255, 255, 0.95); /* 提高对比度 */
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #ffffff;
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    bottom: 16px;

    .copyright {
      font-size: 12px;
    }
  }
}

/* fade-slide 动画 */
.fade-slide-leave-active,
.fade-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .login-card {
    margin: 0 16px;
    padding: 40px 24px;
  }

  .title {
    font-size: 28px !important;
  }

  .logo {
    width: 80px !important;
    height: 80px !important;
  }
}

/* 深色模式适配 - 修复夜间模式看不清的问题 */
:global(.dark) {
  .login-card {
    background: rgba(23, 23, 30, 0.95); /* 更深的背景提高对比度 */
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  .title {
    color: rgba(255, 255, 255, 0.9); /* 在深色模式下使用浅色文字 */
  }

  .action-btn {
    background: rgba(30, 30, 40, 0.9);

    &:hover {
      background: rgba(40, 40, 50, 1);
    }
  }

  /* 确保所有文字在深色模式下都有足够对比度 */
  :deep(.el-form-item__label),
  :deep(.el-input__inner),
  :deep(.el-checkbox__label),
  :deep(.el-link) {
    color: rgba(255, 255, 255, 0.85) !important;
  }

  :deep(.el-input__wrapper) {
    background-color: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);

    &:hover {
      box-shadow: 0 0 0 1px var(--el-color-primary);
    }
  }
}
</style>
