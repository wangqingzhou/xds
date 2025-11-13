<template>
  <el-dialog
    v-model="visible"
    title="申请审核"
    width="95%"
    :fullscreen="fullscreen"
    :close-on-click-modal="false"
    destroy-on-close
    class="audit-dialog"
    :top="dialogTop"
    @open="handleOpen"
  >
    <template #header>
      <div class="dialog-header">
        <div class="header-left">
          <span class="dialog-title">状态</span>
          <el-tag :type="getStatusType(formData.status)" class="status-tag">
            {{ getStatusText(formData.status) }}
          </el-tag>
        </div>
        <div class="header-right">
          <el-button circle title="全屏" @click="toggleFullscreen">
            <el-icon><FullScreen /></el-icon>
          </el-button>
          <el-button circle title="关闭" @click="visible = false">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </div>
    </template>

    <div v-loading="loading" class="dialog-content">
      <el-tabs v-model="activeTab" class="custom-tabs">
        <!-- 审批流程页签 -->
        <el-tab-pane label="审批流程" name="process">
          <div class="steps-container">
            <el-steps :active="getActiveStep()" finish-status="success" align-center>
              <el-step
                title="提交"
                :status="getStepStatus(0)"
                @click="scrollToSection('basic-info')"
              />
              <el-step
                title="院领导审批"
                :status="getStepStatus(1)"
                @click="scrollToSection('director-audit')"
              />
              <el-step title="完成" :status="getStepStatus(2)" />
            </el-steps>
            <div class="process-details">
              <el-card class="process-card">
                <template #header>
                  <div class="card-header">
                    <el-icon class="blue-icon"><Document /></el-icon>
                    <span class="card-title">审批详情</span>
                  </div>
                </template>
                <div class="process-content">
                  <div class="process-section">
                    <h4>当前状态</h4>
                    <el-tag :type="getStatusType(formData.status)" class="status-tag">
                      <el-icon
                        v-if="formData.status === 'APPROVED'"
                        class="status-icon success-icon"
                      >
                        <Check />
                      </el-icon>
                      <el-icon
                        v-else-if="formData.status === 'SUBMITTED'"
                        class="status-icon primary-icon"
                      >
                        <Loading />
                      </el-icon>
                      <el-icon
                        v-else-if="formData.status === 'RETURNED'"
                        class="status-icon warning-icon"
                      >
                        <Warning />
                      </el-icon>
                      <el-icon v-else class="status-icon info-icon">
                        <Document />
                      </el-icon>
                      {{ getStatusText(formData.status) }}
                    </el-tag>
                  </div>
                  <div class="process-section">
                    <h4>审批进度</h4>
                    <div class="progress-list">
                      <div class="progress-item" :class="{ active: formData.status !== 'DRAFT' }">
                        <div class="progress-icon">
                          <el-icon><Check /></el-icon>
                        </div>
                        <div class="progress-text">提交申请</div>
                        <div class="progress-time">
                          <el-date-picker
                            v-if="
                              formData.status === 'SUBMITTED' ||
                              formData.status === 'APPROVED' ||
                              formData.status === 'RETURNED'
                            "
                            v-model="formData.submitTime"
                            type="datetime"
                            readonly
                            format="YYYY-MM-DD HH:mm:ss"
                            :disabled="true"
                            class="time-value"
                          />
                        </div>
                      </div>
                      <div
                        class="progress-item"
                        :class="{
                          active: formData.status === 'APPROVED' || formData.status === 'RETURNED',
                        }"
                      >
                        <div class="progress-icon">
                          <el-icon><User /></el-icon>
                        </div>
                        <div class="progress-text">院领导审批</div>
                        <div class="progress-time">
                          <el-date-picker
                            v-if="formData.status === 'APPROVED' || formData.status === 'RETURNED'"
                            v-model="formData.updateTime"
                            type="datetime"
                            readonly
                            format="YYYY-MM-DD HH:mm:ss"
                            :disabled="true"
                            class="time-value"
                          />
                          <span v-else>-</span>
                        </div>
                      </div>
                      <div
                        class="progress-item"
                        :class="{ active: formData.status === 'APPROVED' }"
                      >
                        <div class="progress-icon">
                          <el-icon><Check /></el-icon>
                        </div>
                        <div class="progress-text">完成审批</div>
                        <div class="progress-time">
                          <el-date-picker
                            v-if="formData.status === 'APPROVED'"
                            v-model="formData.updateTime"
                            type="datetime"
                            readonly
                            format="YYYY-MM-DD HH:mm:ss"
                            :disabled="true"
                            class="time-value"
                          />
                          <span v-else>-</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="process-section">
                    <h4>审批意见</h4>
                    <div class="opinion-list">
                      <div v-if="formData.reviewRemark" class="opinion-item">
                        <div class="opinion-header">
                          <el-icon class="blue-icon"><User /></el-icon>
                          <span>院领导意见</span>
                          <span class="opinion-time">
                            <el-date-picker
                              v-if="formData.reviewRemark"
                              v-model="formData.updateTime"
                              type="datetime"
                              readonly
                              format="YYYY-MM-DD HH:mm:ss"
                              :disabled="true"
                              class="time-value"
                            />
                          </span>
                        </div>
                        <div class="opinion-content">{{ formData.reviewRemark }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>

        <!-- 审批日志页签 -->
        <el-tab-pane label="审批日志" name="logs">
          <div class="logs-container">
            <el-card class="log-card">
              <template #header>
                <div class="card-header">
                  <el-icon class="blue-icon"><Document /></el-icon>
                  <span class="card-title">流转日志</span>
                </div>
              </template>
              <div class="log-content">
                <el-timeline v-if="flowLogs.length > 0">
                  <el-timeline-item
                    v-for="(log, index) in flowLogs"
                    :key="index"
                    :type="getLogType(log.content)"
                    :color="getLogColor(log.content)"
                    :timestamp="formatTime(log.create_time)"
                  >
                    <div class="log-item">
                      <div class="log-title">{{ log.content }}</div>
                      <div class="log-user">操作人：{{ log.username }}</div>
                      <div v-if="log.remark" class="log-remark">备注：{{ log.remark }}</div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
                <div v-else class="empty-log">暂无流转记录</div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 底部操作栏 -->
    <template #footer>
      <div class="dialog-footer">
        <div class="footer-left">
          <span>当前状态：</span>
          <el-tag :type="getStatusType(formData.status)">
            {{ getStatusText(formData.status) }}
          </el-tag>
        </div>
        <div class="footer-right">
          <el-button @click="visible = false">关闭</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Document,
  User,
  Close,
  Check,
  FullScreen,
  Loading,
  Warning,
} from "@element-plus/icons-vue";
import MaterialAPI, { MaterialForm, FlowLog } from "@/api/system/material.api";
import { useUserStore } from "@/store";
import dayjs from "dayjs";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  id: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "success"]);

// 弹窗状态
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const activeTab = ref("process");
const loading = ref(false);
const fullscreen = ref(false);
const dialogTop = ref("5vh");

// 表单数据
const formData = reactive<MaterialForm>({
  studentId: "",
  studentName: "",
  school: "",
  major: "",
  education: "",
  graduationDate: "",
  majorClass: "",
  qualify: "",
  status: "",
  isDeleted: 0,
  submitTime: "",
  reviewRemark: "",
  updateTime: "",
});

// 流转日志
const flowLogs = ref<FlowLog[]>([]);

// 监听弹窗状态，打开时重置页签
watch(visible, (newVal) => {
  if (newVal) {
    activeTab.value = "process";
  }
});

// 获取状态文本
function getStatusText(status: string) {
  switch (status) {
    case "DRAFT":
      return "草稿";
    case "SUBMITTED":
      return "已提交";
    case "RETURNED":
      return "已退回";
    case "APPROVED":
      return "已审核";
    default:
      return status;
  }
}

// 获取状态类型
function getStatusType(status: string) {
  switch (status) {
    case "DRAFT":
      return "info";
    case "SUBMITTED":
      return "primary";
    case "RETURNED":
      return "warning";
    case "APPROVED":
      return "success";
    default:
      return "info";
  }
}

function formatTime(time: string) {
  if (!time) return "";
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
}

// 获取日志类型
function getLogType(operation: string) {
  if (operation.includes("提交")) return "primary";
  if (operation.includes("审核通过")) return "success";
  if (operation.includes("退回")) return "warning";
  return "info";
}

// 获取日志颜色
function getLogColor(operation: string) {
  if (operation.includes("提交")) return "#409eff";
  if (operation.includes("审核通过")) return "#67c23a";
  if (operation.includes("退回")) return "#e6a23c";
  return "#909399";
}

// 滚动到指定部分
function scrollToSection(sectionId: string) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// 切换全屏
function toggleFullscreen() {
  fullscreen.value = !fullscreen.value;
}

// 页签验证函数
function validateTab(tabName: string): boolean {
  const validTabs = ["process", "logs"];
  return validTabs.includes(tabName);
}

// 监听activeTab变化，确保有效性
watch(activeTab, (newTab) => {
  if (!validateTab(newTab)) {
    console.warn(`无效的页签: ${newTab}，重置为process`);
    activeTab.value = "process";
  }
});

// 打开弹窗时的处理
async function handleOpen() {
  loading.value = true;
  try {
    // 重置到第一个页签
    activeTab.value = "process";

    // 加载表单数据
    const data = await MaterialAPI.getDetail(props.id);
    Object.assign(formData, data);

    // 加载流转日志
    await loadFlowLogs();

    // 滚动到顶部
    await nextTick();
    document.querySelector(".dialog-content")?.scrollTo(0, 0);
  } catch (error) {
    ElMessage.error("加载数据失败");
    visible.value = false;
  } finally {
    loading.value = false;
  }
}

// 加载流转日志
async function loadFlowLogs() {
  try {
    const logs = await MaterialAPI.getFlowLogs(props.id);
    flowLogs.value = logs.scoreDetails || [];
  } catch (error) {
    console.error("加载流转日志失败", error);
  }
}

// 获取当前步骤
function getActiveStep() {
  if (formData.status === "APPROVED") {
    return 3; // 完成步骤
  } else if (formData.status === "RETURNED") {
    return 1; // 退回步骤
  } else if (formData.status === "SUBMITTED") {
    return 1; // 提交步骤
  }
  return 0; // 草稿步骤
}

// 获取步骤状态
function getStepStatus(stepIndex: number) {
  const activeStepIndex = getActiveStep();
  if (stepIndex < activeStepIndex) {
    return "finish"; // 已完成
  } else if (stepIndex === activeStepIndex) {
    return "process"; // 进行中
  } else {
    return "wait"; // 等待中
  }
}
</script>

<style scoped>
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dialog-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.status-tag {
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 5px;
}

.dialog-content {
  height: 70vh;
  overflow: hidden;
}

.custom-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.custom-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.steps-container {
  padding: 10px;
}

.process-details {
  margin-top: 20px;
}

.process-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.process-section {
  margin-bottom: 20px;
}

.process-section h4 {
  margin-bottom: 10px;
  color: #303133;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.progress-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 6px;
  transition: all 0.3s;
}

.progress-item.active {
  background-color: #ecf5ff;
  border-left: 3px solid #409eff;
}

.progress-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  margin-right: 10px;
}

.progress-text {
  flex: 1;
  font-weight: 500;
}

.progress-time {
  font-size: 12px;
  color: #909399;
}

.opinion-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.opinion-item {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.opinion-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 500;
}

.opinion-header .blue-icon {
  margin-right: 6px;
  color: #409eff;
}

.opinion-time {
  margin-left: auto;
  font-size: 12px;
  color: #909399;
}

.opinion-content {
  color: #606266;
  line-height: 1.5;
}

.logs-container {
  padding: 10px;
}

.log-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.log-content {
  padding: 8px;
  max-height: 500px;
  overflow-y: auto;
}

.log-item {
  padding: 5px 0;
}

.log-title {
  font-weight: bold;
  margin-bottom: 3px;
}

.log-user,
.log-remark {
  font-size: 12px;
  color: #606266;
  margin-top: 2px;
}

.empty-log {
  text-align: center;
  color: #909399;
  padding: 15px 0;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-right {
  display: flex;
  gap: 10px;
}

.blue-icon {
  color: #409eff;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}

.status-icon {
  margin-right: 5px;
}

.success-icon {
  color: #67c23a;
}

.primary-icon {
  color: #409eff;
  animation: rotating 2s linear infinite;
}

.warning-icon {
  color: #e6a23c;
}

.info-icon {
  color: #909399;
}

/* 添加旋转动画 */
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 移动端自适应样式 */
@media screen and (max-width: 768px) {
  .dialog-content {
    height: 60vh;
  }

  .steps-container {
    padding: 5px;
  }

  .process-details {
    margin-top: 15px;
  }
}

/* 平板端样式 */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .dialog-content {
    height: 65vh;
  }
}
</style>
