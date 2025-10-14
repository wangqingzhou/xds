<template>
  <div class="register-container">
    <!-- 顶部标题 -->
    <div class="register-header">
      <h2 class="register-title">用户注册</h2>
      <p class="register-subtitle">欢迎加入我们，请填写以下信息完成注册</p>
    </div>

    <!-- 注册表单 -->
    <el-form ref="formRef" :model="model" :rules="rules" size="large" class="register-form">
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input v-model.trim="model.username" placeholder="请输入姓名" class="custom-input">
          <template #prefix>
            <el-icon class="input-icon"><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 性别 -->
      <el-form-item prop="gender">
        <el-select v-model="model.gender" placeholder="请选择性别" class="custom-select">
          <template #prefix>
            <el-icon class="input-icon"><UserFilled /></el-icon>
          </template>
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 专业班级 -->
      <el-form-item prop="className">
        <el-input
          v-model.trim="model.className"
          placeholder="请输入专业班级名称"
          class="custom-input"
        >
          <template #prefix>
            <el-icon class="input-icon"><School /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 角色选择：添加 multiple 属性，支持多选 -->
      <el-form-item prop="roleIds">
        <el-select
          v-model="model.roleIds"
          placeholder="请选择学历类型"
          class="custom-select"
          multiple
          max="1"
        >
          <template #prefix>
            <el-icon class="input-icon"><Avatar /></el-icon>
          </template>
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <div class="role-option">
              <el-icon class="role-icon">
                <component :is="item.value === 1 ? 'User' : 'GraduationCap'" />
              </el-icon>
              <span class="role-label">{{ item.label }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 学号 -->
      <el-form-item prop="studentId">
        <el-input v-model.trim="model.studentId" placeholder="请输入学号" class="custom-input">
          <template #prefix>
            <el-icon class="input-icon"><Ticket /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item prop="phone">
        <el-input v-model.trim="model.phone" placeholder="请输入手机号" class="custom-input">
          <template #prefix>
            <el-icon class="input-icon"><Iphone /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item prop="password">
        <el-tooltip :visible="isCapsLock" content="大写锁定已打开" placement="right">
          <el-input
            v-model.trim="model.password"
            placeholder="请输入密码（至少6位）"
            type="password"
            show-password
            class="custom-input"
            @keyup="checkCapsLock"
            @keyup.enter="submit"
          >
            <template #prefix>
              <el-icon class="input-icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item prop="confirmPassword">
        <el-tooltip :visible="isCapsLock" content="大写锁定已打开" placement="right">
          <el-input
            v-model.trim="model.confirmPassword"
            placeholder="请再次输入密码"
            type="password"
            show-password
            class="custom-input"
            @keyup="checkCapsLock"
            @keyup.enter="submit"
          >
            <template #prefix>
              <el-icon class="input-icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>

      <!-- 用户协议 -->
      <el-form-item>
        <div class="agreement-container">
          <el-checkbox v-model="isRead" class="agreement-checkbox">我已阅读并同意</el-checkbox>
          <el-link type="primary" underline class="agreement-link">《用户协议》</el-link>
          和
          <el-link type="primary" underline class="agreement-link">《隐私政策》</el-link>
        </div>
      </el-form-item>

      <!-- 注册按钮 -->
      <el-form-item>
        <el-button :loading="loading" type="primary" class="register-btn" @click="submit">
          {{ loading ? "注册中..." : "立即注册" }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 底部登录链接 -->
    <div class="register-footer">
      <span class="footer-text">已有账号？</span>
      <el-link type="primary" class="login-link" @click="toLogin">立即登录</el-link>
    </div>

    <!-- 装饰元素 -->
    <div class="decoration deco-1"></div>
    <div class="decoration deco-2"></div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import {
  Lock,
  User,
  School,
  Ticket,
  Iphone,
  Avatar,
  Reading,
  Promotion,
  UserFilled,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import AuthAPI from "@/api/auth.api";

const emit = defineEmits(["update:modelValue"]);
const toLogin = () => emit("update:modelValue", "login");

const formRef = ref<FormInstance>();
const loading = ref(false);
const isCapsLock = ref(false);
const isRead = ref(false);

interface RegisterModel {
  username: string;
  gender: string;
  className: string;
  studentId: string;
  phone: string;
  password: string;
  confirmPassword: string;

  /** 角色ID集合：适配后端 List<Long>，定义为 number 数组 */
  roleIds?: number[];
  /** 用户状态(1:正常;0:禁用) */
  status?: number;
}

const model = ref<RegisterModel>({
  username: "",
  gender: "",
  className: "",
  studentId: "",
  phone: "",
  password: "",
  confirmPassword: "",
  roleIds: [],
  status: 1,
});

// 性别选项
const genderOptions = ref([
  {
    label: "男",
    value: 64,
  },
  {
    label: "女",
    value: 65,
  },
]);

// 固定角色选项（带图标）
const roleOptions = ref([
  {
    label: "本科生",
    value: 14,
    icon: Reading,
  },
  {
    label: "研究生",
    value: 15,
    icon: Promotion,
  },
]);

const rules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  gender: [
    {
      required: true,
      message: "请选择性别",
      trigger: "change",
    },
  ],
  roleIds: [
    {
      required: true,
      message: "请选择学历",
      trigger: "blur",
      type: "array", // 校验数组类型
    },
    {
      min: 1,
      max: 1, // 限制数组长度只能为1（即只能选一个）
      message: "只能选择一种学历类型",
      trigger: "blur",
      type: "array",
    },
  ],
  className: [
    {
      required: true,
      message: "请输入班级名称",
      trigger: "blur",
    },
  ],
  studentId: [
    {
      required: true,
      message: "请输入学号",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "blur",
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号格式",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    {
      min: 6,
      message: "密码长度不能少于6位",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: "请再次输入密码",
      trigger: "blur",
    },
    {
      validator: (_: any, value: string, callback: any) => {
        if (value !== model.value.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

// 检查输入大小写
function checkCapsLock(event: KeyboardEvent) {
  if (event instanceof KeyboardEvent) {
    isCapsLock.value = event.getModifierState("CapsLock");
  }
}

const submit = async () => {
  // 表单验证
  try {
    await formRef.value?.validate();
  } catch (error) {
    return;
  }

  // 检查是否同意协议
  if (!isRead.value) {
    ElMessage.warning("请阅读并同意用户协议");
    return;
  }

  loading.value = true;
  try {
    // 准备提交数据
    const submitData = {
      username: model.value.username,
      gender: model.value.gender,
      className: model.value.className,
      studentId: model.value.studentId,
      mobile: model.value.phone,
      password: model.value.password,
      roleIds: model.value.roleIds, // 添加角色类型
      status: 1,
    };

    // 调用注册API
    // 由于拦截器只返回 data，我们需要用 try-catch 判断成功
    const responseData = await AuthAPI.registerUser(submitData);

    // 如果执行到这里，说明请求成功（没有进入 catch）
    ElMessage.success("注册成功！");
    setTimeout(() => {
      toLogin();
    }, 1500);
  } catch (error) {
    // 这里处理业务错误
    console.error("注册失败:", error);
    ElMessage.error(error.message || "注册失败，请重试");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {});
</script>

<style scoped>
.register-container {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 30px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 400;
}

.register-form {
  margin-bottom: 20px;
}

.custom-input {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.custom-input:deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.custom-input:deep(.el-input__wrapper:hover),
.custom-input:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(76, 87, 235, 0.2);
  /* 移除 transform 避免元素移动 */
}

.input-icon {
  color: #667eea;
  font-size: 18px;
}

.agreement-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
}

.agreement-checkbox {
  margin-right: 4px;
}

.agreement-link {
  font-size: 13px;
}

.register-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.register-btn:hover {
  /* 移除 transform 避免按钮移动 */
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.register-btn:active {
  /* 移除 transform 避免按钮移动 */
}

.register-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}

.footer-text {
  color: #7f8c8d;
  font-size: 14px;
}

.login-link {
  font-weight: 600;
  font-size: 14px;
}

.decoration {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.1;
  z-index: -1;
}

.deco-1 {
  width: 120px;
  height: 120px;
  top: -40px;
  right: -40px;
}

.deco-2 {
  width: 80px;
  height: 80px;
  bottom: -20px;
  left: -20px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-container {
    padding: 30px 20px;
    margin: 20px;
  }

  .register-title {
    font-size: 24px;
  }

  .agreement-container {
    flex-direction: column;
    gap: 8px;
  }
}

/* 动画效果 */
.register-container {
  animation: slideInUp 0.6s ease;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 选择框样式 - 修复圆角问题 */
.custom-select {
  border-radius: 12px;
  transition: all 0.3s ease;
  width: 100%;
}

.custom-select:deep(.el-select__wrapper) {
  border-radius: 12px;
}

.custom-select:deep(.el-input__wrapper) {
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
}

.custom-select:deep(.el-input__wrapper:hover),
.custom-select:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(76, 87, 235, 0.2) !important;
  /* 移除 transform 避免元素移动 */
}

/* 下拉菜单圆角 */
.custom-select:deep(.el-select-dropdown) {
  border-radius: 12px !important;
  overflow: hidden;
}

.custom-select:deep(.el-select-dropdown__list) {
  padding: 8px;
}

.custom-select:deep(.el-select-dropdown__item) {
  border-radius: 8px;
  margin: 2px 0;
}

/* 角色选项样式 */
.role-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-icon {
  color: #667eea;
  font-size: 16px;
}

.role-label {
  font-size: 14px;
}
</style>
