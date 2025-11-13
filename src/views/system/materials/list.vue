<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col v-show="showDeptTree" :lg="4" :xs="24" class="mb-[12px]">
        <div class="dept-tree-container">
          <div class="dept-tree-header">
            <span class="dept-tree-title">
              <el-icon><Office /></el-icon>
              部门列表
            </span>
            <el-button circle size="small" class="close-btn" @click="toggleDeptTree">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          <DeptTree ref="deptTreeRef" v-model="queryParams.deptId" @node-click="handleQuery" />
        </div>
      </el-col>

      <!-- 列表 -->
      <el-col :lg="showDeptTree ? 20 : 24" :xs="24">
        <!-- 搜索区域 -->
        <div class="search-container">
          <div class="search-header">
            <div class="search-title">
              <el-button
                circle
                size="small"
                :title="showDeptTree ? '隐藏部门树' : '显示部门树'"
                class="menu-toggle"
                @click="toggleDeptTree"
              >
                <el-icon><Menu /></el-icon>
              </el-button>
              <span class="title-text">申请列表</span>
            </div>
          </div>
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="auto">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="学号/姓名/专业班级"
                clearable
                class="search-input"
                @keyup.enter="handleQuery"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="学历" prop="education">
              <el-select
                v-model="queryParams.education"
                placeholder="全部学历"
                clearable
                style="width: 120px"
                class="search-select"
              >
                <el-option label="本科生" value="本科生" />
                <el-option label="研究生" value="研究生" />
              </el-select>
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                style="width: 120px"
                class="search-select"
              >
                <el-option label="草稿" value="DRAFT" />
                <el-option label="已提交" value="SUBMITTED" />
                <el-option label="已退回" value="RETURNED" />
                <el-option label="已审核" value="APPROVED" />
              </el-select>
            </el-form-item>

            <el-form-item label="创建时间">
              <el-date-picker
                v-model="queryParams.createTime"
                :editable="false"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="截止时间"
                value-format="YYYY-MM-DD"
                class="date-picker"
              />
            </el-form-item>

            <el-form-item class="search-buttons">
              <el-button type="primary" icon="search" class="search-btn" @click="handleQuery">
                搜索
              </el-button>
              <el-button icon="refresh" class="reset-btn" @click="handleResetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="hover" class="data-table">
          <div class="data-table__toolbar">
            <div class="data-table__toolbar--actions">
              <el-button
                v-if="false"
                v-hasPerm="['material:batchApprove']"
                type="success"
                :disabled="selectIds.length === 0"
                icon="check"
                class="batch-approve-btn"
                @click="handleBatchApprove"
              >
                批量审核
              </el-button>
              <el-button
                v-hasPerm="['material:return']"
                type="warning"
                :disabled="selectIds.length === 0"
                icon="close"
                class="batch-return-btn"
                @click="handleBatchReturn"
              >
                批量退回
              </el-button>
            </div>
          </div>

          <el-table
            ref="dataTableRef"
            v-loading="loading"
            :data="pageData"
            border
            highlight-current-row
            class="data-table__content"
            :default-sort="{ prop: 'score', order: 'descending' }"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="ID" prop="id" width="100" sortable="custom" />
            <el-table-column label="学历" prop="education" width="100" sortable="custom" />
            <el-table-column label="学号" prop="studentId" width="120" sortable="custom" />
            <el-table-column label="姓名" prop="studentName" width="100" sortable="custom" />
            <el-table-column label="专业班级" prop="majorClass" min-width="150" sortable="custom" />

            <el-table-column
              align="center"
              label="是否符合"
              prop="qualify"
              width="150"
              sortable="custom"
            >
              <template #default="scope">
                <DictLabel v-model="scope.row.qualify" code="yesno" />
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="自评分数"
              prop="score"
              width="120"
              sortable="custom"
            >
              <template #default="scope">
                <span :class="getScoreClass(scope.row.score)">{{ scope.row.score || "-" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="审核分数"
              prop="score"
              width="120"
              sortable="custom"
            >
              <template #default="scope">
                <span :class="getScoreClass(scope.row.shscore)">
                  {{ scope.row.shscore || "-" }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="状态"
              prop="status"
              width="150"
              sortable="custom"
            >
              <template #default="scope">
                <el-tag v-if="scope.row.statusText == '已审核'" type="success" size="small">
                  已审核
                </el-tag>
                <el-tag v-else type="primary" size="small">
                  {{ scope.row.statusText }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" prop="submit_time" width="230" sortable="custom">
              <template #default="scope">
                <div class="time-display-container">
                  <div class="time-item">
                    <el-date-picker
                      v-model="scope.row.createTime"
                      type="datetime"
                      readonly
                      format="YYYY-MM-DD HH:mm:ss"
                      :disabled="true"
                      class="time-value"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>

            <!-- 适配手机端的操作列 - 移除了 fixed 属性 -->
            <el-table-column
              align="center"
              label="操作"
              :width="getOperationColumnWidth"
              class-name="operation-column"
              :min-width="isMobile ? 100 : 200"
            >
              <template #default="scope">
                <div class="operation-buttons">
                  <!-- 查看日志按钮 -->
                  <el-tooltip content="查看日志" placement="top" :disabled="!isMobile">
                    <el-button
                      type="primary"
                      size="small"
                      link
                      class="action-btn"
                      @click="openAuditDialog(scope.row.id)"
                    >
                      <el-icon><View /></el-icon>
                      <span v-show="!isMobile" class="button-text">查看日志</span>
                    </el-button>
                  </el-tooltip>

                  <!-- 编辑/查看按钮 -->
                  <el-tooltip
                    :content="scope.row.statusText === '已提交' ? '查看' : '编辑'"
                    placement="top"
                    :disabled="!isMobile"
                  >
                    <router-link :to="getEditRoute(scope.row)">
                      <el-button
                        v-hasPerm="['material:add']"
                        type="primary"
                        size="small"
                        link
                        class="action-btn"
                      >
                        <el-icon><Edit /></el-icon>
                        <span v-show="!isMobile" class="button-text">
                          {{ scope.row.statusText === "已提交" ? "查看" : "编辑" }}
                        </span>
                      </el-button>
                    </router-link>
                  </el-tooltip>

                  <!-- 查看审核按钮 -->
                  <el-tooltip content="查看审核" placement="top" :disabled="!isMobile">
                    <router-link :to="getEditRoute(scope.row)">
                      <el-button
                        v-hasPerm="['material:approve']"
                        type="primary"
                        size="small"
                        link
                        class="action-btn"
                      >
                        <el-icon><Search /></el-icon>
                        <span v-show="!isMobile" class="button-text">查看审核</span>
                      </el-button>
                    </router-link>
                  </el-tooltip>

                  <!-- 退回按钮 -->
                  <el-tooltip
                    v-if="scope.row.status === 'SUBMITTED' || scope.row.status == 'APPROVED'"
                    content="退回"
                    placement="top"
                    :disabled="!isMobile"
                  >
                    <el-button
                      v-hasPerm="['material:return']"
                      type="warning"
                      size="small"
                      link
                      class="action-btn"
                      @click="handleReturn(scope.row.id)"
                    >
                      <el-icon><Close /></el-icon>
                      <span v-show="!isMobile" class="button-text">退回</span>
                    </el-button>
                  </el-tooltip>

                  <!-- 删除按钮 -->
                  <el-tooltip
                    v-if="scope.row.status !== 'APPROVED'"
                    content="删除"
                    placement="top"
                    :disabled="!isMobile"
                  >
                    <el-button
                      v-hasPerm="['material:delete']"
                      type="danger"
                      size="small"
                      link
                      class="action-btn"
                      @click="handleDelete(scope.row.id)"
                    >
                      <el-icon><Delete /></el-icon>
                      <span v-show="!isMobile" class="button-text">删除</span>
                    </el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            class="pagination-container"
            @pagination="fetchData()"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 申请详情 -->
    <el-dialog
      v-model="detailDialog.visible"
      :show-close="false"
      width="80%"
      append-to-body
      class="detail-dialog"
      @close="closeDetailDialog"
    >
      <template #header>
        <div class="flex-x-between">
          <span class="dialog-title">申请详情</span>
          <div class="dialog-toolbar">
            <el-button circle class="close-dialog-btn" @click="closeDetailDialog">
              <template #icon>
                <Close />
              </template>
            </el-button>
          </div>
        </div>
      </template>
      <el-descriptions :column="2" border class="detail-descriptions">
        <el-descriptions-item label="学号">{{ currentMaterial.studentId }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentMaterial.studentName }}</el-descriptions-item>
        <el-descriptions-item label="学校">{{ currentMaterial.school }}</el-descriptions-item>
        <el-descriptions-item label="专业">{{ currentMaterial.major }}</el-descriptions-item>
        <el-descriptions-item label="所属院系">{{ currentMaterial.deptName }}</el-descriptions-item>
        <el-descriptions-item label="最高学历">
          {{ currentMaterial.education }}
        </el-descriptions-item>
        <el-descriptions-item label="毕业日期">
          {{ currentMaterial.graduationDate }}
        </el-descriptions-item>
        <el-descriptions-item label="政治面貌">
          <el-tag
            v-if="currentMaterial.politicalStatus === 'communist'"
            type="success"
            size="small"
          >
            中共党员
          </el-tag>
          <el-tag
            v-else-if="currentMaterial.politicalStatus === 'probationary'"
            type="primary"
            size="small"
          >
            预备党员
          </el-tag>
          <el-tag v-else-if="currentMaterial.politicalStatus === 'league'" type="info" size="small">
            共青团员
          </el-tag>
          <el-tag v-else type="warning" size="small">群众</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="分数">
          <span :class="getScoreClass(currentMaterial.score)">
            {{ currentMaterial.score || "-" }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="学生干部经历">
          <DictLabel v-model="currentMaterial.cadreExperience" code="cadrelevel" />
        </el-descriptions-item>
        <el-descriptions-item label="参军入伍经历">
          <el-tag v-if="currentMaterial.militaryExperience === 'yes'" type="success" size="small">
            有
          </el-tag>
          <el-tag v-else type="info" size="small">无</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="获奖情况">
          <DictLabel v-model="currentMaterial.awardLevel" code="awardlevel" />
        </el-descriptions-item>
        <el-descriptions-item label="专业排名">
          {{ currentMaterial.rankNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="currentMaterial.status === 'DRAFT'" type="info" size="small">草稿</el-tag>
          <el-tag v-else-if="currentMaterial.status === 'SUBMITTED'" type="primary" size="small">
            已提交
          </el-tag>
          <el-tag v-else-if="currentMaterial.status === 'RETURNED'" type="warning" size="small">
            已退回
          </el-tag>
          <el-tag v-else-if="currentMaterial.status === 'APPROVED'" type="success" size="small">
            已审核
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentMaterial.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ currentMaterial.updateTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 添加审核详情模态框 -->
    <AuditDetailDialog
      :id="auditDialog.id"
      v-model="auditDialog.visible"
      @success="handleAuditSuccess"
    />

    <!-- 审核/退回对话框 -->
    <el-dialog
      v-model="approveDialog.visible"
      :title="approveDialog.title"
      width="500px"
      append-to-body
      class="approve-dialog"
    >
      <el-form ref="approveFormRef" :model="approveForm" :rules="approveRules" label-width="80px">
        <el-form-item label="是否符合" prop="qualify" required>
          <Dict v-model="approveForm.qualify" code="yesno" class="mobile-input">
            <template #prefix>
              <el-icon class="input-icon"><Check /></el-icon>
            </template>
          </Dict>
        </el-form-item>
        <el-form-item
          :label="approveDialog.type === 'approve' ? '意见' : '意见'"
          prop="remark"
          required
        >
          <el-input
            v-model="approveForm.remark"
            type="textarea"
            :rows="3"
            :placeholder="approveDialog.type === 'approve' ? '请输入审核意见' : '请输入退回意见'"
            class="remark-input"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="approveDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitApprove">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量审核/退回对话框 -->
    <el-dialog
      v-model="batchApproveDialog.visible"
      :title="batchApproveDialog.title"
      width="500px"
      append-to-body
      class="batch-approve-dialog"
    >
      <el-form
        ref="batchApproveFormRef"
        :model="batchApproveForm"
        :rules="batchApproveRules"
        label-width="80px"
      >
        <el-form-item label="是否符合" prop="qualify" required>
          <Dict v-model="batchApproveForm.qualify" code="yesno" class="mobile-input">
            <template #prefix>
              <el-icon class="input-icon"><Check /></el-icon>
            </template>
          </Dict>
        </el-form-item>
        <el-form-item
          :label="batchApproveDialog.type === 'approve' ? '意见' : '意见'"
          prop="remark"
          required
        >
          <el-input
            v-model="batchApproveForm.remark"
            type="textarea"
            :rows="3"
            :placeholder="
              batchApproveDialog.type === 'approve' ? '请输入审核意见' : '请输入退回意见'
            "
            class="remark-input"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="batchApproveDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitBatchApprove">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormRules, FormInstance } from "element-plus";
import { useAppStore } from "@/store/modules/app.store";
import { DeviceEnum } from "@/enums/settings/device.enum";
import MaterialAPI, {
  MaterialForm,
  MaterialPageQuery,
  MaterialPageVO,
} from "@/api/system/material.api";
import DeptAPI from "@/api/system/dept.api";

import DeptTree from "../user/components/DeptTree.vue";
import AuditDetailDialog from "./components/AuditDetailDialog.vue";

const auditDialog = reactive({
  visible: false,
  id: 0,
});

// 是否显示部门树
const showDeptTree = ref(false);

// 切换部门树显示/隐藏
function toggleDeptTree() {
  showDeptTree.value = !showDeptTree.value;
}

// 打开审核对话框
function openAuditDialog(id) {
  auditDialog.id = id;
  auditDialog.visible = true;
}

// 审核成功回调
function handleAuditSuccess() {
  // 重新加载数据
  fetchData();
}

defineOptions({
  name: "MaterialList",
  inheritAttrs: false,
});

const appStore = useAppStore();
const router = useRouter();

const queryFormRef = ref();
const approveFormRef = ref<FormInstance>();
const batchApproveFormRef = ref<FormInstance>();
const deptTreeRef = ref();

const queryParams = reactive<MaterialPageQuery>({
  pageNum: 1,
  pageSize: 10,
  sort: "score", // 默认按分数排序
  order: "descending", // 默认降序
  status: "", // 状态参数，初始为空
  education: "", // 学历参数，初始为空
});

// 申请表格数据
const pageData = ref<MaterialPageVO[]>([]);

const total = ref(0);
const loading = ref(false);

// 选中的申请ID
const selectIds = ref<number[]>([]);

// 组织机构树数据
const deptTreeData = ref<any[]>([]);

// 详情弹窗
const detailDialog = reactive({
  visible: false,
});
const currentMaterial = ref<MaterialForm>({});

// 审核弹窗
const approveDialog = reactive({
  visible: false,
  title: "",
  type: "", // approve 或 return
  id: 0,
});
const approveForm = reactive({
  qualify: 0,
  remark: "",
});
const approveRules: FormRules = {
  qualify: [{ required: true, message: "请选择是否符合", trigger: "change" }],
  remark: [
    { required: true, message: "请输入意见", trigger: "blur" },
    { min: 1, max: 500, message: "意见长度在 1 到 500 个字符", trigger: "blur" },
  ],
};

// 批量审核弹窗
const batchApproveDialog = reactive({
  visible: false,
  title: "",
  type: "", // approve 或 return
});
const batchApproveForm = reactive({
  qualify: 0,
  remark: "",
});
const batchApproveRules: FormRules = {
  qualify: [{ required: true, message: "请选择是否符合", trigger: "change" }],
  remark: [
    { required: true, message: "请输入意见", trigger: "blur" },
    { min: 1, max: 500, message: "意见长度在 1 到 500 个字符", trigger: "blur" },
  ],
};

// 响应式计算属性
const isMobile = computed(() => appStore.device === DeviceEnum.Mobile);

// 获取操作列宽度
const getOperationColumnWidth = computed(() => {
  return isMobile.value ? 100 : 280;
});

// 获取编辑路由
function getEditRoute(row: any) {
  return row.education === "研究生" ? "/materialsyjs/edit/" + row.id : "/materials/edit/" + row.id;
}

// 获取组织机构树
async function getDeptTree() {
  try {
    const data = await DeptAPI.getTree();
    deptTreeData.value = data;
  } catch (error) {
    console.error("获取组织机构树失败", error);
  }
}

// 获取数据
async function fetchData() {
  loading.value = true;
  try {
    const data = await MaterialAPI.getPage(queryParams);
    pageData.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

// 查询（重置页码后获取数据）
function handleQuery() {
  console.log("筛选条件：", queryParams.value);
  queryParams.pageNum = 1;
  fetchData();
}

// 同步路由参数到查询条件的核心方法
const syncRouteStatusToQuery = () => {
  // 路由数据容错判断
  if (!router || !router.currentRoute || !router.currentRoute.value) {
    console.warn("路由数据未准备好，跳过同步");
    return;
  }

  const currentRouteData = router.currentRoute.value;
  // 路由有 status 则同步值，无则设为空字符串
  const routeStatus = currentRouteData.query?.status || "";
  const currentQueryStatus = queryParams.status || "";

  // 状态变化时更新查询条件并触发查询
  if (routeStatus !== currentQueryStatus) {
    queryParams.status = routeStatus;
    handleQuery();
  } else handleQuery();
};

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  queryParams.deptId = undefined;
  queryParams.status = undefined;
  queryParams.education = undefined; // 重置学历筛选
  queryParams.createTime = undefined;
  queryParams.sort = "score"; // 重置为默认排序
  queryParams.order = "descending"; // 重置为默认排序
  // 重置组织机构树选中状态
  if (deptTreeRef.value) {
    deptTreeRef.value.setCurrentKey(null);
  }
  fetchData();
}

// 选中项发生变化
function handleSelectionChange(selection: any[]) {
  selectIds.value = selection.map((item) => item.id);
}

// 组织机构节点点击
function handleDeptNodeClick(data: any) {
  queryParams.deptId = data.id;
  handleQuery();
}

// 处理表格排序变化
function handleSortChange({ prop, order }: { prop: string; order: string }) {
  // 字段映射表 - 前端显示字段名 : 数据库字段名
  const fieldMapping: { [key: string]: string } = {
    studentId: "student_Id",
    studentName: "student_name",
    majorClass: "major_class",
    createTime: "create_time",
    updateTime: "update_time",
  };

  // 获取数据库字段名，如果没有映射就使用原字段名
  const dbField = fieldMapping[prop] || prop;

  queryParams.sort = dbField;
  queryParams.order = order === "ascending" ? "asc" : order === "descending" ? "desc" : "";
  handleQuery();
}

// 获取分数样式类
function getScoreClass(score: number | null | undefined) {
  if (score === null || score === undefined) return "";
  if (score >= 90) return "score-excellent";
  if (score >= 80) return "score-good";
  if (score >= 70) return "score-average";
  if (score >= 60) return "score-pass";
  return "score-fail";
}

// 审核
function handleApprove(id: number) {
  approveDialog.title = "审核";
  approveDialog.type = "approve";
  approveDialog.id = id;
  approveForm.qualify = 0;
  approveForm.remark = "";
  approveDialog.visible = true;
}

// 退回申请
function handleReturn(id: number) {
  approveDialog.title = "退回申请";
  approveDialog.type = "return";
  approveDialog.id = id;
  approveForm.qualify = 0;
  approveForm.remark = "";
  approveDialog.visible = true;
}

// 批量审核
function handleBatchApprove() {
  if (selectIds.value.length === 0) {
    ElMessage.warning("请选择要审核的申请");
    return;
  }

  // 检查选中的申请是否都是已提交状态
  const notSubmitted = pageData.value.filter(
    (item) => selectIds.value.includes(item.id) && item.status !== "SUBMITTED"
  );

  if (notSubmitted.length > 0) {
    ElMessage.warning("只能审核已提交状态的申请");
    return;
  }

  batchApproveDialog.title = "批量审核";
  batchApproveDialog.type = "approve";
  batchApproveForm.qualify = 0;
  batchApproveForm.remark = "";
  batchApproveDialog.visible = true;
}

// 批量退回
function handleBatchReturn() {
  if (selectIds.value.length === 0) {
    ElMessage.warning("请选择要退回的申请");
    return;
  }

  // 检查选中的申请是否都是可退回状态
  const notReturnable = pageData.value.filter(
    (item) => selectIds.value.includes(item.id) && !["SUBMITTED", "APPROVED"].includes(item.status)
  );

  if (notReturnable.length > 0) {
    ElMessage.warning("只能退回已提交或已审核状态的申请");
    return;
  }

  batchApproveDialog.title = "批量退回";
  batchApproveDialog.type = "return";
  batchApproveForm.qualify = 0;
  batchApproveForm.remark = "";
  batchApproveDialog.visible = true;
}

// 提交审核/退回
function submitApprove() {
  if (!approveFormRef.value) return;

  approveFormRef.value.validate((valid) => {
    if (!valid) return;

    const action = approveDialog.type === "approve" ? "APPROVED" : "RETURNED";
    const successMessage = approveDialog.type === "approve" ? "审核成功" : "已退回";

    MaterialAPI.updatestatus(approveDialog.id, action, approveForm.remark, approveForm.qualify)
      .then(() => {
        ElMessage.success(successMessage);
        approveDialog.visible = false;
        fetchData();
      })
      .catch((error) => {
        console.error(`${approveDialog.title}失败:`, error);
        ElMessage.error(`${approveDialog.title}失败`);
      });
  });
}

// 提交批量审核/退回
function submitBatchApprove() {
  if (!batchApproveFormRef.value) return;

  batchApproveFormRef.value.validate((valid) => {
    if (!valid) return;

    const action = batchApproveDialog.type === "approve" ? "APPROVED" : "RETURNED";
    const successMessage = batchApproveDialog.type === "approve" ? "批量审核成功" : "批量退回成功";

    MaterialAPI.updatestatus(
      selectIds.value,
      action,
      batchApproveForm.remark,
      batchApproveForm.qualify
    )
      .then(() => {
        ElMessage.success(successMessage);
        batchApproveDialog.visible = false;
        fetchData();
      })
      .catch((error) => {
        console.error(`${batchApproveDialog.title}失败:`, error);
        ElMessage.error(`${batchApproveDialog.title}失败`);
      });
  });
}

// 计算得分
function handleCalculateScore(studentId: string) {
  console.log(studentId);
  MaterialAPI.calculateScore(studentId).then((data) => {
    ElMessageBox.alert(
      `学习成绩得分: ${data.academicScore}分<br>
      政治面貌得分: ${data.politicalStatusScore}分<br>
      学生干部经历得分: ${data.cadreScore}分<br>
      获奖情况得分: ${data.awardsScore}分<br>
      参军入伍经历得分: ${data.militaryScore}分<br>
      总分: ${data.totalScore}分`,
      "得分预览",
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
      }
    );
  });
}

// 导出数据
function handleExport() {
  ElMessageBox.confirm("确认导出所选数据吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    MaterialAPI.export(selectIds.value).then(() => {
      ElMessage.success("导出成功");
    });
  });
}

/**
 * 删除申请
 *
 * @param id  申请ID
 */
function handleDelete(id?: number) {
  const ids = id ? [id] : selectIds.value;
  if (ids.length === 0) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除申请吗？删除后不可恢复", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    MaterialAPI.batchDelete(ids)
      .then(() => {
        ElMessage.success("删除成功");
        handleResetQuery();
      })
      .finally(() => (loading.value = false));
  });
}

const closeDetailDialog = () => {
  detailDialog.visible = false;
};

const openDetailDialog = async (id: string) => {
  const materialDetail = await MaterialAPI.getDetail(id);
  currentMaterial.value = materialDetail;
  detailDialog.visible = true;
};

onMounted(() => {
  getDeptTree();
  syncRouteStatusToQuery();
});
</script>

<style lang="scss" scoped>
.app-container {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.dept-tree-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 16px;
  height: calc(100vh - 200px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.dept-tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.dept-tree-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;

  .el-icon {
    margin-right: 8px;
    color: #409eff;
  }
}

.close-btn {
  color: #909399;
  transition: all 0.3s;

  &:hover {
    color: #f56c6c;
    background-color: #fef0f0;
  }
}

.search-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.title-text {
  position: relative;
  padding-left: 12px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 18px;
    background-color: #409eff;
    border-radius: 2px;
  }
}

.menu-toggle {
  color: #606266;
  transition: all 0.3s;

  &:hover {
    color: #409eff;
    background-color: #ecf5ff;
  }
}

.search-input {
  width: 240px;

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    padding-left: 36px;
  }

  :deep(.el-input__inner) {
    height: 36px;
  }
}

.search-select {
  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }
}

.date-picker {
  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }
}

.search-buttons {
  margin-left: 16px;

  .el-button {
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 500;

    &.search-btn {
      background: linear-gradient(135deg, #409eff 0%, #3a8ee6 100%);
      border: none;

      &:hover {
        background: linear-gradient(135deg, #66b1ff 0%, #3a8ee6 100%);
      }
    }

    &.reset-btn {
      color: #606266;
      border-color: #dcdfe6;

      &:hover {
        color: #409eff;
        border-color: #409eff;
      }
    }
  }
}

.data-table {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 16px;

    &--actions {
      display: flex;
      gap: 12px;
    }
  }

  &__content {
    :deep(.el-table) {
      border-radius: 8px;
      overflow: hidden;

      th {
        background-color: #f5f7fa;
        color: #303133;
        font-weight: 600;
        text-align: center;
      }

      td {
        text-align: center;
      }

      .el-table__row {
        transition: all 0.2s;

        &:hover {
          background-color: #f5f7fa;
        }
      }

      // 操作列样式
      .operation-column {
        .cell {
          padding: 4px !important;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}

.operation-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 100%;

  .action-btn {
    width: 100%;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 28px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .el-icon {
      margin-right: 4px;
      font-size: 14px;
    }

    .button-text {
      font-size: 12px;
      white-space: nowrap;
    }
  }
}

.export-btn,
.batch-approve-btn {
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;

  &.export-btn {
    background: linear-gradient(135deg, #e6a23c 0%, #cf9236 100%);
    border: none;

    &:hover {
      background: linear-gradient(135deg, #ebb563 0%, #cf9236 100%);
    }
  }

  &.batch-approve-btn {
    background: linear-gradient(135deg, #67c23a 0%, #5daf34 100%);
    border: none;

    &:hover {
      background: linear-gradient(135deg, #85ce61 0%, #5daf34 100%);
    }
  }
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  margin-top: 16px;
}

// 分数样式
.score-excellent {
  color: #67c23a;
  font-weight: bold;
  font-size: 16px;
}

.score-good {
  color: #409eff;
  font-weight: bold;
  font-size: 16px;
}

.score-average {
  color: #e6a23c;
  font-weight: bold;
  font-size: 16px;
}

.score-pass {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.score-fail {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

// 详情对话框
.detail-dialog,
.approve-dialog,
.batch-approve-dialog {
  :deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #409eff 0%, #3a8ee6 100%);
    padding: 16px 24px;
    color: white;

    .dialog-title {
      font-size: 18px;
      font-weight: 600;
    }

    .dialog-toolbar {
      .close-dialog-btn {
        color: white;
        background-color: rgba(255, 255, 255, 0.2);
        transition: all 0.3s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }

  :deep(.el-dialog__body) {
    padding: 24px;
  }

  :deep(.el-dialog__footer) {
    padding: 16px 24px;
    border-top: 1px solid #ebeef5;
  }
}

.detail-descriptions {
  :deep(.el-descriptions__label) {
    font-weight: 500;
    color: #606266;
  }

  :deep(.el-descriptions__content) {
    color: #303133;
  }
}

.remark-input {
  :deep(.el-textarea__inner) {
    border-radius: 8px;
    resize: vertical;
    min-height: 100px;
  }
}

// 必填项红色星号样式
:deep(.el-form-item.is-required .el-form-item__label::before) {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

// 响应式设计
@media (max-width: 768px) {
  .app-container {
    padding: 8px;
  }

  .dept-tree-container {
    height: auto;
    margin-bottom: 16px;
  }

  .search-container {
    padding: 16px;
  }

  .search-input {
    width: 100%;
    margin-bottom: 12px;
  }

  .search-buttons {
    margin-left: 0;
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }

  .data-table__toolbar--actions {
    flex-wrap: wrap;
  }

  .export-btn,
  .batch-approve-btn {
    margin-bottom: 8px;
  }

  // 手机端操作列优化
  .operation-buttons {
    .action-btn {
      padding: 2px 4px;
      min-height: 24px;

      .el-icon {
        margin-right: 0;
        font-size: 12px;
      }

      .button-text {
        display: none;
      }
    }
  }

  // 手机端表格样式调整
  :deep(.el-table) {
    .el-table__body {
      .el-table__cell {
        padding: 4px 2px;
      }
    }
  }
}

// 中等屏幕适配
@media (max-width: 992px) and (min-width: 769px) {
  .operation-buttons {
    .action-btn {
      .button-text {
        font-size: 11px;
      }
    }
  }
}
</style>
