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
        <el-step title="查看结果" />
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
          completed: activeStep > index,
          'no-hover-animation': step.title === '完善个人信息' || step.status === 'completed',
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
              v-if="step.status === 'pending'"
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
            <el-button v-else type="info" @click="handleStepAction(index)">查看详情</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 快速操作区 -->
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Plus, Document } from "@element-plus/icons-vue";
import { useUserStore } from "@/store";
import MaterialAPI from "@/api/system/material.api";
const router = useRouter();
const userStore = useUserStore();
// 学生信息 - 从userStore获取真实用户名
const studentName = computed(
  () => userStore.userInfo?.nickname || userStore.userInfo?.username || "同学"
);
// 当前激活步骤
const activeStep = ref(0);
// 当前申请记录ID
const currentApplicationId = ref<number | null>(null);
// 步骤数据
const steps = ref([
  {
    title: "完善个人信息",
    description: "请填写您的个人基本信息，包括学号、姓名、专业班级等",
    status: "completed", // 初始即为已完成
    actionText: "查看信息",
    route: "/profile",
  },
  {
    title: "提交申请材料",
    description: "上传您的证明材料，包括党员证明、学生干部证明、获奖证书等",
    status: "pending",
    actionText: "上传材料",
    route: "/materials",
  },
  {
    title: "等待审核",
    description: "您的申请材料正在审核中，请耐心等待审核结果",
    status: "pending",
    actionText: "查看进度",
    route: "/materials/cg",
  },
  {
    title: "查看结果",
    description: "审核完成后，您可以在此查看最终得分和审核结果",
    status: "pending",
    actionText: "查看结果",
    route: "/materials/cg",
  },
]);
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

  // 第一步始终为已完成状态
  newSteps[0].status = "completed";

  switch (statusText) {
    case "草稿":
      newSteps[1].status = "in-progress"; // 提交申请材料进行中
      newSteps[2].status = "pending"; // 等待审核待完成
      newSteps[3].status = "pending"; // 查看结果待完成
      activeStep.value = 1; // 当前激活步骤1
      break;
    case "已提交":
      newSteps[1].status = "completed";
      newSteps[2].status = "in-progress"; // 等待审核进行中
      newSteps[3].status = "pending";
      activeStep.value = 2; // 当前激活步骤2
      break;
    case "已退回":
      newSteps[1].status = "rejected"; // 提交申请材料已退回
      newSteps[2].status = "pending";
      newSteps[3].status = "pending";
      activeStep.value = 1; // 当前激活步骤1（需要修改材料）
      break;
    case "已审核":
      newSteps[1].status = "completed";
      newSteps[2].status = "completed";
      newSteps[3].status = "in-progress"; // 查看结果进行中
      activeStep.value = 3; // 当前激活步骤3
      break;
    default:
      // 默认状态：第一步已完成，其他步骤待完成
      newSteps[0].status = "completed";
      newSteps[1].status = "pending";
      newSteps[2].status = "pending";
      newSteps[3].status = "pending";
      activeStep.value = 0;
      break;
  }
  steps.value = newSteps;
}
// 处理步骤点击
function handleStepAction(index: number) {
  const step = steps.value[index];
  // 根据步骤和状态处理不同的跳转逻辑
  if (index === 1 && currentApplicationId.value) {
    // 如果是提交申请材料步骤且状态为进行中，则跳转到编辑页面并传入ID
    router.push(`/materials/edit/${currentApplicationId.value}`);
  } else if (step.route) {
    // 其他情况正常跳转
    router.push(step.route);
  }
}
// 前往申请页面
function goToApplication() {
  router.push({ name: "Materials" });
}
// 查看申请状态
function viewApplicationStatus() {
  router.push("/materials/cg");
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
      // 保存申请ID
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
/* 欢迎区域 */
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
/* 进度条 */
.progress-section {
  margin-bottom: 40px;
}
/* 步骤区域 */
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
/* 为已完成的步骤添加特殊样式 */
.step-card.completed {
  background-color: #f0f9ff;
  border-color: #67c23a;
}
/* 为"已退回"步骤添加特殊样式 */
.step-card.rejected {
  background-color: #fef0f0;
  border-color: #f56c6c;
}
/* 为"完善个人信息"步骤添加特殊样式 */
.step-card.no-hover-animation {
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}
.step-card.no-hover-animation:hover {
  transform: none !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.step-card:not(.no-hover-animation):hover {
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
/* 快速操作区 */
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
/* 响应式设计 */
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
