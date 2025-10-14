<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <!-- 左侧个人信息卡片 -->
      <el-col :xs="24" :sm="8">
        <el-card class="user-card">
          <div class="user-info">
            <div class="avatar-wrapper">
              <el-avatar :src="userProfile.avatar" :size="100" />
              <el-button
                type="info"
                class="avatar-edit-btn"
                circle
                :icon="Camera"
                size="small"
                @click="triggerFileUpload"
              />
              <input ref="fileInput" type="file" style="display: none" @change="handleFileChange" />
            </div>
            <div class="user-name">
              <span class="nickname">{{ userProfile.nickname }}</span>
              <el-icon class="edit-icon" @click="handleOpenDialog(DialogType.ACCOUNT)">
                <Edit />
              </el-icon>
            </div>
            <div class="user-role">{{ userProfile.roleNames }}</div>
          </div>
          <el-divider />
        </el-card>
      </el-col>

      <!-- 右侧信息卡片 -->
      <el-col :xs="24" :sm="16">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>账号信息</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="姓名">
              {{ userProfile.username }}
              <el-icon v-if="userProfile.gender === 64" class="gender-icon male">
                <Male />
              </el-icon>
              <el-icon v-else class="gender-icon female">
                <Female />
              </el-icon>
            </el-descriptions-item>
            <el-descriptions-item label="学号">
              {{ userProfile.studentId || "未填写" }}
            </el-descriptions-item>
            <el-descriptions-item label="专业班级">
              {{ userProfile.className || "未填写" }}
            </el-descriptions-item>
            <el-descriptions-item label="学历类型">
              {{ userProfile.roleNames || "未选择" }}
            </el-descriptions-item>
            <el-descriptions-item label="手机号码">
              {{ userProfile.mobile || "未绑定" }}
              <!-- 只在特定条件下显示按钮 -->
              <el-button
                v-if="shouldShowMobileButtons"
                type="primary"
                link
                @click="() => handleOpenDialog(DialogType.MOBILE)"
              >
                {{ userProfile.mobile ? "更换" : "绑定" }}
              </el-button>
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
              {{ userProfile.email || "未绑定" }}

              <el-button
                v-if="shouldShowMobileButtons"
                type="primary"
                link
                @click="() => handleOpenDialog(DialogType.EMAIL)"
              >
                {{ userProfile.mobile ? "更换" : "绑定" }}
              </el-button>
            </el-descriptions-item>
            <el-descriptions-item label="部门">
              {{ userProfile.deptName }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              <el-date-picker
                v-model="userProfile.createTime"
                type="datetime"
                readonly
                format="YYYY-MM-DD HH:mm:ss"
                :disabled="true"
                class="time-value"
              />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="security-card">
          <template #header>
            <div class="card-header">
              <span>安全设置</span>
            </div>
          </template>
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">账户密码</div>
              <div class="security-desc">定期修改密码有助于保护账户安全</div>
            </div>
            <el-button type="primary" link @click="() => handleOpenDialog(DialogType.PASSWORD)">
              修改
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗：宽度自适应，最大500px -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="90%" :max-width="500">
      <!-- 账号资料 -->
      <el-form
        v-if="dialog.type === DialogType.ACCOUNT"
        ref="userProfileFormRef"
        :model="userProfileForm"
        :rules="userProfileRules"
        :label-width="100"
      >
        <el-form-item label="姓名" prop="username">
          <el-input
            v-model.trim="userProfileForm.username"
            placeholder="请输入姓名"
            class="custom-input"
          >
            <template #prefix>
              <el-icon class="input-icon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="学号" prop="studentId">
          <el-input
            v-model.trim="userProfileForm.studentId"
            placeholder="请输入学号"
            class="custom-input"
          >
            <template #prefix>
              <el-icon class="input-icon"><Ticket /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="专业班级" prop="className">
          <el-input
            v-model.trim="userProfileForm.className"
            placeholder="请输入专业班级名称"
            class="custom-input"
          >
            <template #prefix>
              <el-icon class="input-icon"><School /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="学历类型" prop="roleIds">
          <el-select
            v-model="userProfileForm.roleIds"
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
                  <component :is="item.icon" />
                </el-icon>
                <span class="role-label">{{ item.label }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userProfileForm.nickname" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <Dict v-model="userProfileForm.gender" code="sex" />
        </el-form-item>
      </el-form>

      <!-- 修改密码 -->
      <el-form
        v-if="dialog.type === DialogType.PASSWORD"
        ref="passwordChangeFormRef"
        :model="passwordChangeForm"
        :rules="passwordChangeRules"
        :label-width="100"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordChangeForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordChangeForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordChangeForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>

      <!-- 绑定手机 -->
      <el-form
        v-else-if="dialog.type === DialogType.MOBILE"
        ref="mobileBindingFormRef"
        :model="mobileUpdateForm"
        :rules="mobileBindingRules"
        :label-width="100"
      >
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="mobileUpdateForm.mobile" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="mobileUpdateForm.code">
            <template #append>
              <el-button :disabled="mobileCountdown > 0" @click="handleSendMobileCode">
                {{ mobileCountdown > 0 ? `${mobileCountdown}s后重新发送` : "发送验证码" }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <!-- 绑定邮箱 -->
      <el-form
        v-else-if="dialog.type === DialogType.EMAIL"
        ref="emailBindingFormRef"
        :model="emailUpdateForm"
        :rules="emailBindingRules"
        :label-width="100"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="emailUpdateForm.email" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="emailUpdateForm.code">
            <template #append>
              <el-button :disabled="emailCountdown > 0" @click="handleSendEmailCode">
                {{ emailCountdown > 0 ? `${emailCountdown}s后重新发送` : "发送验证码" }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import UserAPI, {
  UserProfileVO,
  PasswordChangeForm,
  MobileUpdateForm,
  EmailUpdateForm,
  UserProfileForm,
} from "@/api/system/user.api";

import FileAPI from "@/api/file.api";

import {
  Camera,
  Edit,
  Male,
  Female,
  User,
  Ticket,
  School,
  Avatar,
  Reading,
  Promotion,
} from "@element-plus/icons-vue";

const userProfile = ref<UserProfileVO>({});

const enum DialogType {
  ACCOUNT = "account",
  PASSWORD = "password",
  MOBILE = "mobile",
  EMAIL = "email",
}

const dialog = reactive({
  visible: false,
  title: "",
  type: "" as DialogType,
});
const userProfileFormRef = ref();
const passwordChangeFormRef = ref();
const mobileBindingFormRef = ref();
const emailBindingFormRef = ref();

const userProfileForm = reactive<UserProfileForm>({});
const passwordChangeForm = reactive<PasswordChangeForm>({});
const mobileUpdateForm = reactive<MobileUpdateForm>({});
const emailUpdateForm = reactive<EmailUpdateForm>({});

const mobileCountdown = ref(0);
const mobileTimer = ref();

const emailCountdown = ref(0);
const emailTimer = ref();
// 定义一个控制变量
const shouldShowMobileButtons = ref(false); // 或者根据业务逻辑设置
// 学历类型选项
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

// 账号资料校验规则
const userProfileRules = {
  username: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  studentId: [{ required: true, message: "请输入学号", trigger: "blur" }],
  className: [{ required: true, message: "请输入专业班级", trigger: "blur" }],
  roleIds: [
    {
      required: true,
      message: "请选择学历",
      trigger: "blur",
      type: "array",
    },
    {
      min: 1,
      max: 1,
      message: "只能选择一种学历类型",
      trigger: "blur",
      type: "array",
    },
  ],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
};

// 修改密码校验规则
const passwordChangeRules = {
  oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "请再次输入新密码", trigger: "blur" }],
};

// 手机号校验规则
const mobileBindingRules = {
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

// 邮箱校验规则
const emailBindingRules = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

/**
 * 打开弹窗
 */
const handleOpenDialog = (type: DialogType) => {
  dialog.type = type;
  dialog.visible = true;
  switch (type) {
    case DialogType.ACCOUNT:
      dialog.title = "账号资料";
      userProfileForm.id = userProfile.value.id;
      userProfileForm.username = userProfile.value.username;
      userProfileForm.studentId = userProfile.value.studentId;
      userProfileForm.className = userProfile.value.className;
      userProfileForm.roleIds = userProfile.value.roleIds || [];
      userProfileForm.nickname = userProfile.value.nickname;
      userProfileForm.gender = userProfile.value.gender;
      break;
    case DialogType.PASSWORD:
      dialog.title = "修改密码";
      break;
    case DialogType.MOBILE:
      dialog.title = "绑定手机";
      break;
    case DialogType.EMAIL:
      dialog.title = "绑定邮箱";
      break;
  }
};

/**
 * 发送手机验证码
 */
function handleSendMobileCode() {
  if (!mobileUpdateForm.mobile) {
    ElMessage.error("请输入手机号");
    return;
  }
  const reg = /^1[3-9]\d{9}$/;
  if (!reg.test(mobileUpdateForm.mobile)) {
    ElMessage.error("手机号格式不正确");
    return;
  }
  UserAPI.sendMobileCode(mobileUpdateForm.mobile).then(() => {
    ElMessage.success("验证码发送成功");
    mobileCountdown.value = 60;
    mobileTimer.value = setInterval(() => {
      if (mobileCountdown.value > 0) {
        mobileCountdown.value -= 1;
      } else {
        clearInterval(mobileTimer.value!);
      }
    }, 1000);
  });
}

/**
 * 发送邮箱验证码
 */
function handleSendEmailCode() {
  if (!emailUpdateForm.email) {
    ElMessage.error("请输入邮箱");
    return;
  }
  const reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
  if (!reg.test(emailUpdateForm.email)) {
    ElMessage.error("邮箱格式不正确");
    return;
  }
  UserAPI.sendEmailCode(emailUpdateForm.email).then(() => {
    ElMessage.success("验证码发送成功");
    emailCountdown.value = 60;
    emailTimer.value = setInterval(() => {
      if (emailCountdown.value > 0) {
        emailCountdown.value -= 1;
      } else {
        clearInterval(emailTimer.value!);
      }
    }, 1000);
  });
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (dialog.type === DialogType.ACCOUNT) {
    // 验证表单
    try {
      await userProfileFormRef.value?.validate();
    } catch (error) {
      return;
    }

    UserAPI.updateProfile(userProfileForm).then(() => {
      ElMessage.success("账号资料修改成功");
      dialog.visible = false;
      loadUserProfile();
    });
  } else if (dialog.type === DialogType.PASSWORD) {
    if (passwordChangeForm.newPassword !== passwordChangeForm.confirmPassword) {
      ElMessage.error("两次输入的密码不一致");
      return;
    }
    UserAPI.changePassword(passwordChangeForm).then(() => {
      ElMessage.success("密码修改成功");
      dialog.visible = false;
    });
  } else if (dialog.type === DialogType.MOBILE) {
    UserAPI.bindOrChangeMobile(mobileUpdateForm).then(() => {
      ElMessage.success("手机号绑定成功");
      dialog.visible = false;
      loadUserProfile();
    });
  } else if (dialog.type === DialogType.EMAIL) {
    UserAPI.bindOrChangeEmail(emailUpdateForm).then(() => {
      ElMessage.success("邮箱绑定成功");
      dialog.visible = false;
      loadUserProfile();
    });
  }
};

/**
 * 取消
 */
const handleCancel = () => {
  dialog.visible = false;
  if (dialog.type === DialogType.ACCOUNT) {
    userProfileFormRef.value?.resetFields();
  } else if (dialog.type === DialogType.PASSWORD) {
    passwordChangeFormRef.value?.resetFields();
  } else if (dialog.type === DialogType.MOBILE) {
    mobileBindingFormRef.value?.resetFields();
  } else if (dialog.type === DialogType.EMAIL) {
    emailBindingFormRef.value?.resetFields();
  }
};

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  if (file) {
    try {
      const data = await FileAPI.uploadFile(file);
      userProfile.value.avatar = data.url;
      await UserAPI.updateProfile({
        avatar: data.url,
      });
    } catch (error) {
      console.error("头像上传失败：" + error);
      ElMessage.error("头像上传失败");
    }
  }
};

/** 加载用户信息 */
const loadUserProfile = async () => {
  const data = await UserAPI.getProfile();
  userProfile.value = data;

  // 设置学历类型显示文本
  if (data.roleIds && data.roleIds.length > 0) {
    const roleId = data.roleIds[0];
    const roleOption = roleOptions.value.find((item) => item.value === roleId);
    if (roleOption) {
      userProfile.value.educationType = roleOption.label;
    }
  }
};

onMounted(async () => {
  if (mobileTimer.value) {
    clearInterval(mobileTimer.value);
  }
  if (emailTimer.value) {
    clearInterval(emailTimer.value);
  }
  await loadUserProfile();
});
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: calc(100vh - 84px);
  padding: 20px;
  background: var(--el-fill-color-blank);
}

.user-card {
  .user-info {
    padding: 20px 0;
    text-align: center;

    .avatar-wrapper {
      position: relative;
      display: inline-block;
      margin-bottom: 16px;

      .avatar-edit-btn {
        position: absolute;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        border: none;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(0, 0, 0, 0.7);
        }
      }
    }

    .user-name {
      margin-bottom: 8px;

      .nickname {
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .edit-icon {
        margin-left: 8px;
        color: var(--el-text-color-secondary);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          color: var(--el-color-primary);
        }
      }
    }

    .user-role {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .user-stats {
    display: flex;
    justify-content: space-around;
    padding: 16px 0;

    .stat-item {
      text-align: center;

      .stat-value {
        font-size: 20px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .stat-label {
        margin-top: 4px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.info-card,
.security-card {
  margin-bottom: 20px;

  .card-header {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;

  .security-info {
    .security-title {
      margin-bottom: 4px;
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }

    .security-desc {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
}

.el-descriptions {
  .el-descriptions__label {
    font-weight: 500;
    color: var(--el-text-color-regular);
  }

  .el-descriptions__content {
    color: var(--el-text-color-primary);
  }

  .gender-icon {
    margin-left: 8px;
    font-size: 16px;

    &.male {
      color: #409eff;
    }

    &.female {
      color: #f56c6c;
    }
  }
}

.el-dialog {
  .el-dialog__header {
    padding: 20px;
    margin: 0;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .el-dialog__body {
    padding: 30px 20px;
  }

  .el-dialog__footer {
    padding: 20px;
    border-top: 1px solid var(--el-border-color-light);
  }
}

// 输入框样式
.custom-input {
  width: 100%;
}

.input-icon {
  color: #667eea;
  font-size: 18px;
}

// 选择框样式
.custom-select {
  width: 100%;
}

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

// 响应式适配（移动端优化）
@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }

  // 输入框和按钮在移动端全宽
  .el-input,
  .el-button {
    width: 100% !important;
  }

  // 验证码按钮在移动端独占一行
  .el-input-group__append {
    display: block;
    .el-button {
      width: 100%;
    }
  }

  // 调整文字大小
  .user-name .nickname,
  .card-header,
  .security-title {
    font-size: 15px;
  }

  .user-role {
    font-size: 13px;
  }

  .security-desc {
    font-size: 13px;
  }

  // 头像编辑按钮稍大，便于触摸
  .avatar-edit-btn {
    transform: scale(1.15);
  }

  // 增加卡片内间距
  .info-card,
  .security-card {
    padding: 10px;
  }
}
</style>
