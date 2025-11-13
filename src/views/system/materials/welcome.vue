<template>
  <div class="guide-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <h1>欢迎，{{ studentName }}同学！</h1>
      <p>请按照以下步骤完成您的选调生申请流程</p>
    </div>
    <!-- 进度条 -->
    <div class="progress-section">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="完善信息" />
        <el-step title="提交申请" />
        <el-step title="等待审核" />
      </el-steps>
    </div>
    <!-- 步骤引导卡片 -->
    <div class="steps-section">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-card"
        :class="{
          active: activeStep === index,
          completed: step.status === 'completed',
          'disabled-step': !hasApplication && index > 0, // 未申请时禁用后两个步骤
        }"
      >
        <div class="step-header">
          <div class="step-number">{{ index + 1 }}</div>
          <h3>{{ step.title }}</h3>
          <el-tag :type="getStatusType(step.status)" class="status-tag">
            {{ getStatusText(step.status) }}
          </el-tag>
        </div>
        <div class="step-content">
          <p>{{ step.description }}</p>
          <div class="step-actions">
            <el-button
              v-if="
                step.status === 'pending' && ((!hasApplication && index === 0) || hasApplication)
              "
              type="primary"
              @click="handleStepAction(index)"
            >
              {{ step.actionText }}
            </el-button>
            <el-button
              v-else-if="step.status === 'in-progress'"
              type="warning"
              @click="handleStepAction(index)"
            >
              {{ index === 2 ? "查看进度" : "编辑" }}
            </el-button>
            <el-button
              v-else-if="step.status === 'completed' || index === 0"
              type="info"
              @click="handleStepAction(index)"
            >
              {{ step.actionText }}
            </el-button>
            <el-button v-else type="info" disabled>请先开始申请</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 快速操作区 - 根据申请状态动态显示 -->
    <div v-if="showQuickActions" class="quick-actions">
      <el-button v-if="showStartApplication" type="primary" :icon="Plus" @click="goToApplication">
        开始申请
      </el-button>
      <el-button
        v-if="showViewStatus"
        type="success"
        :icon="Document"
        @click="viewApplicationStatus"
      >
        查看申请状态
      </el-button>
      <el-button v-if="showEditApplication" type="warning" :icon="Edit" @click="editApplication">
        修改申请材料
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Plus, Document, Edit } from "@element-plus/icons-vue";
import { useUserStore } from "@/store";
import MaterialAPI from "@/api/system/material.api";

const router = useRouter();
const userStore = useUserStore();

// 学生信息 - 从userStore获取真实用户名
const studentName = computed(
  () => userStore.userInfo?.nickname || userStore.userInfo?.username || "同学"
);

// 判断是否为研究生 - 根据roles数组判断
const isPostgraduate = computed(() => {
  const roles = userStore.userInfo?.roles || [];
  return roles.includes("ROLE_POSTGRADUATE");
});

// 当前激活步骤
const activeStep = ref(0);

// 当前申请记录ID
const currentApplicationId = ref<number | null>(null);

// 当前申请状态
const currentApplicationStatus = ref<string>("");

// 是否有申请记录
const hasApplication = computed(() => {
  return !!currentApplicationId.value;
});

// 步骤数据 - 根据角色动态设置路由
const steps = computed(() => {
  const baseRoute = isPostgraduate.value ? "/materialsyjs" : "/materials";

  return [
    {
      title: "完善个人信息",
      description: "请填写您的个人基本信息，包括学号、姓名、专业班级等",
      status: "completed", // 状态为已完成
      actionText: "修改信息", // 按钮文字为修改信息
      route: "/profile",
    },
    {
      title: "提交申请材料",
      description: "上传您的证明材料，包括党员证明、学生干部证明、获奖证书等",
      status: hasApplication.value ? "in-progress" : "pending",
      actionText: hasApplication.value ? "编辑材料" : "上传材料",
      route: isPostgraduate.value ? `${baseRoute}/edit` : `${baseRoute}/edit`,
    },
    {
      title: "等待审核",
      description: "您的申请材料正在审核中，请耐心等待审核结果",
      status: "pending",
      actionText: "查看进度",
      route: isPostgraduate.value ? "/materials/cg" : "/materials/cg", // 修正查看进度路由
    },
  ];
});

// 是否显示快速操作区
const showQuickActions = computed(() => {
  return showStartApplication.value || showViewStatus.value || showEditApplication.value;
});

// 是否显示"开始申请"按钮（无申请记录时显示）
const showStartApplication = computed(() => {
  return !hasApplication.value;
});

// 是否显示"查看申请状态"按钮（已提交或已审核时显示）
const showViewStatus = computed(() => {
  return currentApplicationStatus.value === "已提交" || currentApplicationStatus.value === "已审核";
});

// 是否显示"修改申请材料"按钮（草稿或已退回时显示）
const showEditApplication = computed(() => {
  return currentApplicationStatus.value === "草稿" || currentApplicationStatus.value === "已退回";
});

// 加载状态
const loading = ref(false);

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 页面数据
const pageData = ref([]);
const total = ref(0);

// 获取状态文本
function getStatusText(status: string) {
  switch (status) {
    case "completed":
      return "已完成";
    case "in-progress":
      return "进行中";
    case "pending":
      return "待完成";
    case "rejected":
      return "已退回";
    default:
      return status;
  }
}

// 获取状态类型
function getStatusType(status: string) {
  switch (status) {
    case "completed":
      return "success";
    case "in-progress":
      return "warning";
    case "pending":
      return "info";
    case "rejected":
      return "danger";
    default:
      return "info";
  }
}

// 根据申请状态更新步骤状态
function updateStepsByApplicationStatus(statusText: string) {
  const newSteps = [...steps.value];
  currentApplicationStatus.value = statusText;

  // 第一步始终为已完成状态，但可以修改
  newSteps[0].status = "completed";

  switch (statusText) {
    case "草稿":
      newSteps[1].status = "in-progress"; // 提交申请材料进行中
      newSteps[2].status = "pending"; // 等待审核待完成
      activeStep.value = 1; // 当前激活步骤1
      break;
    case "已提交":
      newSteps[1].status = "completed";
      newSteps[2].status = "in-progress"; // 等待审核进行中
      activeStep.value = 2; // 当前激活步骤2
      break;
    case "已退回":
      newSteps[1].status = "rejected"; // 提交申请材料已退回
      newSteps[2].status = "pending";
      activeStep.value = 1; // 当前激活步骤1（需要修改材料）
      break;
    case "已审核":
      newSteps[1].status = "completed";
      newSteps[2].status = "completed"; // 等待审核已完成
      activeStep.value = 2; // 当前激活步骤2
      break;
    default:
      // 默认状态：第一步已完成，其他步骤待完成
      newSteps[0].status = "completed";
      newSteps[1].status = "pending";
      newSteps[2].status = "pending";
      activeStep.value = 0;
      break;
  }
}

// 处理步骤点击
function handleStepAction(index: number) {
  // 如果没有申请记录且不是第一步，不允许操作
  if (!hasApplication.value && index > 0) {
    return;
  }

  const step = steps.value[index];

  // 根据步骤和状态处理不同的跳转逻辑
  if (index === 1 && currentApplicationId.value) {
    // 如果是提交申请材料步骤且状态为进行中，则跳转到编辑页面并传入ID
    const baseRoute = isPostgraduate.value ? "/materialsyjs" : "/materials";
    router.push(`${baseRoute}/edit/${currentApplicationId.value}`);
  } else if (step.route) {
    // 其他情况正常跳转
    router.push(step.route);
  }
}

// 前往申请页面
function goToApplication() {
  const route = isPostgraduate.value ? "/materials/materialsyjs" : "/materials";
  router.push(route);
}

// 查看申请状态
function viewApplicationStatus() {
  router.push("/materials/cg");
}

// 修改申请材料
function editApplication() {
  if (currentApplicationId.value) {
    const baseRoute = isPostgraduate.value ? "/materialsyjs" : "/materials";
    router.push(`${baseRoute}/edit/${currentApplicationId.value}`);
  }
}

// 获取数据
async function fetchStudentData() {
  loading.value = true;
  try {
    const data = await MaterialAPI.getPage(queryParams);
    pageData.value = data.list;
    total.value = data.total;

    // 获取最新申请记录
    if (data.list && data.list.length > 0) {
      // 按更新时间倒序排序，取最新一条
      const latestApplication = [...data.list].sort(
        (a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
      )[0];

      // 保存申请ID和状态
      currentApplicationId.value = latestApplication.id;

      // 根据申请状态更新步骤
      updateStepsByApplicationStatus(latestApplication.statusText);
    } else {
      // 如果没有申请记录，使用默认状态（第一步已完成）
      updateStepsByApplicationStatus("");
    }
  } finally {
    loading.value = false;
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchStudentData();
});
</script>

<style scoped>
.guide-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.welcome-section h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.welcome-section p {
  font-size: 18px;
  opacity: 0.9;
}

.progress-section {
  margin-bottom: 40px;
}

.steps-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.step-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
  position: relative;
  overflow: hidden;
}

.step-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #409eff;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s ease;
}

.step-card.active::before {
  transform: scaleY(1);
}

.step-card.completed::before {
  background-color: #67c23a;
  transform: scaleY(1);
}

/* 完成状态的样式 - 保持正常交互 */
.step-card.completed {
  background-color: #f0f9ff;
  border-color: #67c23a;
}

.step-card.completed:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.step-card.rejected {
  background-color: #fef0f0;
  border-color: #f56c6c;
}

/* 禁用步骤的样式 - 只有未申请时的后两个步骤才用灰色 */
.step-card.disabled-step {
  background-color: #f8f9fa;
  border-color: #e9ecef;
  opacity: 0.6;
  cursor: not-allowed;
}

.step-card.disabled-step::before {
  background-color: #6c757d;
}

.step-card.disabled-step .step-number {
  background-color: #6c757d;
}

.step-card.disabled-step .step-content p {
  color: #6c757d;
}

/* 禁用步骤没有悬停效果 */
.step-card.disabled-step:hover {
  transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 正常步骤（包括完成状态）都有悬停效果 */
.step-card:not(.disabled-step):hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.step-card.completed .step-number {
  background-color: #67c23a;
}

.step-card.active .step-number {
  background-color: #e6a23c;
}

.step-card.rejected .step-number {
  background-color: #f56c6c;
}

.step-header h3 {
  font-size: 18px;
  margin: 0;
  flex: 1;
}

.status-tag {
  font-size: 12px;
}

.step-content {
  padding-left: 48px;
}

.step-content p {
  color: #606266;
  margin-bottom: 15px;
  line-height: 1.6;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.quick-actions .el-button {
  padding: 12px 30px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .guide-container {
    padding: 15px;
  }

  .welcome-section {
    padding: 20px;
  }

  .welcome-section h1 {
    font-size: 24px;
  }

  .welcome-section p {
    font-size: 16px;
  }

  .steps-section {
    grid-template-columns: 1fr;
  }

  .step-content {
    padding-left: 0;
  }

  .step-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .step-number {
    margin-bottom: 10px;
  }

  .quick-actions {
    flex-direction: column;
  }

  .quick-actions .el-button {
    width: 100%;
  }
}
</style>
