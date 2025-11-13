<template>
  <div>
    <h3 text-center m-0 mb-20px>{{ t("login.resetPassword") }}</h3>
    <el-form ref="formRef" :model="model" :rules="rules" size="large">
      <!-- 手机号 -->
      <el-form-item prop="phone">
        <el-input
          v-model.trim="model.phone"
          :placeholder="t('login.phone.placeholder')"
          maxlength="11"
        >
          <template #prefix>
            <el-icon><Iphone /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 验证码 -->
      <el-form-item prop="code">
        <div flex gap-10px>
          <el-input
            v-model.trim="model.code"
            :placeholder="t('login.code.placeholder')"
            maxlength="6"
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
          <el-button
            type="primary"
            :disabled="isCountingDown || !isPhoneValid"
            class="w-120px"
            @click="sendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : t("login.getCode") }}
          </el-button>
        </div>
      </el-form-item>

      <!-- 新密码 -->
      <el-form-item prop="newPassword">
        <el-input
          v-model.trim="model.newPassword"
          type="password"
          :placeholder="t('login.newPassword.placeholder')"
          show-password
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item prop="confirmPassword">
        <el-input
          v-model.trim="model.confirmPassword"
          type="password"
          :placeholder="t('login.confirmPassword.placeholder')"
          show-password
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="warning" class="w-full" :loading="loading" @click="submit">
          {{ t("login.resetPassword") }}
        </el-button>
      </el-form-item>
    </el-form>

    <div flex-center gap-10px>
      <el-text size="default">{{ t("login.thinkOfPasswd") }}</el-text>
      <el-link type="primary" underline="never" @click="toLogin">{{ t("login.login") }}</el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { FormInstance } from "element-plus";
import { Iphone, Message, Lock } from "@element-plus/icons-vue";
import AuthAPI from "@/api/auth.api";
const { t } = useI18n();

const emit = defineEmits(["update:modelValue"]);
const toLogin = () => emit("update:modelValue", "login");

const model = ref({
  phone: "",
  code: "",
  newPassword: "",
  confirmPassword: "",
});

const formRef = ref<FormInstance>();
const loading = ref(false);
const countdown = ref(0);
const isCountingDown = computed(() => countdown.value > 0);

// 手机号验证
const isPhoneValid = computed(() => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(model.value.phone);
});

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error(t("login.message.confirmPassword.required")));
  } else if (value !== model.value.newPassword) {
    callback(new Error(t("login.message.confirmPassword.notMatch")));
  } else {
    callback();
  }
};

const rules = computed(() => {
  return {
    phone: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.phone.required"),
      },
      {
        pattern: /^1[3-9]\d{9}$/,
        message: t("login.message.phone.invalid"),
        trigger: "blur",
      },
    ],
    code: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.code.required"),
      },
      {
        pattern: /^\d{6}$/,
        message: t("login.message.code.invalid"),
        trigger: "blur",
      },
    ],
    newPassword: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.newPassword.required"),
      },
      {
        min: 6,
        max: 20,
        message: t("login.message.password.length"),
        trigger: "blur",
      },
    ],
    confirmPassword: [
      {
        required: true,
        trigger: "blur",
        validator: validateConfirmPassword,
      },
    ],
  };
});

// 发送验证码
const sendCode = async () => {
  if (!isPhoneValid.value) {
    ElMessage.warning(t("login.message.phone.invalid"));
    return;
  }

  try {
    // 调用发送验证码API
    await AuthAPI.sendResetCode({
      mobile: model.value.phone,
      type: "reset_password", // 指定为重置密码类型
    });

    ElMessage.success(t("login.message.code.sent"));

    // 开始倒计时
    countdown.value = 60;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  } catch (error) {
    ElMessage.error(error.message || t("login.message.code.failed"));
  }
};

// 提交重置密码
const submit = async () => {
  // 表单验证
  try {
    await formRef.value?.validate();
  } catch (error) {
    return;
  }

  loading.value = true;

  try {
    // 准备提交数据
    const submitData = {
      mobile: model.value.phone,
      code: model.value.code,
      newPassword: model.value.newPassword,
      confirmPassword: model.value.confirmPassword,
    };

    // 调用重置密码API
    await AuthAPI.resetPasswordByMobile(submitData);

    ElMessage.success(t("login.message.resetPassword.success"));

    setTimeout(() => {
      toLogin();
    }, 1500);
  } catch (error) {
    console.error("重置密码失败:", error);
    ElMessage.error(error.message || t("login.message.resetPassword.failed"));
  } finally {
    loading.value = false;
  }
};
</script>
