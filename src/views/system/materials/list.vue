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
                v-hasPerm="['material:batchApprove']"
                type="success"
                :disabled="selectIds.length === 0"
                icon="check"
                class="batch-approve-btn"
                @click="handleBatchApprove"
              >
                批量审核
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
            <el-table-column label="学号" prop="studentId" width="120" />
            <el-table-column label="姓名" prop="studentName" width="100" />
            <el-table-column label="专业班级" prop="majorClass" min-width="150" />

            <el-table-column align="center" label="是否符合申报条件" width="150">
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

            <el-table-column align="center" label="状态" width="150">
              <template #default="scope">
                <el-tag v-if="scope.row.statusText == '已审核'" type="success" size="small">
                  已审核
                </el-tag>
                <el-tag v-else type="primary" size="small">
                  {{ scope.row.statusText }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" width="230">
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
            <el-table-column align="center" fixed="right" label="操作" width="320">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  link
                  class="action-btn"
                  @click="openAuditDialog(scope.row.id)"
                >
                  <el-icon><View /></el-icon>
                  查看日志
                </el-button>
                <router-link :to="'/materials/edit/' + scope.row.id">
                  <el-button
                    v-hasPerm="['material:add']"
                    type="primary"
                    size="small"
                    icon="Edit"
                    class="action-btn"
                  >
                    编辑
                  </el-button>
                </router-link>
                <router-link :to="'/materials/edit/' + scope.row.id">
                  <el-button
                    v-hasPerm="['material:approve']"
                    type="primary"
                    size="small"
                    icon="Edit"
                    class="action-btn"
                  >
                    查看审核
                  </el-button>
                </router-link>
                <el-button
                  v-if="scope.row.status === 'SUBMITTED'"
                  v-hasPerm="['material:approve']"
                  type="success"
                  size="small"
                  link
                  class="action-btn"
                  @click="handleApprove(scope.row.id)"
                >
                  <el-icon><Check /></el-icon>
                  审核
                </el-button>

                <el-button
                  v-if="scope.row.status === 'SUBMITTED' || scope.row.status == 'APPROVED'"
                  v-hasPerm="['material:return']"
                  type="warning"
                  size="small"
                  link
                  class="action-btn"
                  @click="handleReturn(scope.row.id)"
                >
                  <el-icon><Close /></el-icon>
                  退回
                </el-button>

                <el-button
                  v-if="scope.row.status !== 'APPROVED'"
                  v-hasPerm="['material:delete']"
                  type="danger"
                  size="small"
                  link
                  class="action-btn"
                  @click="handleDelete(scope.row.id)"
                >
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
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

    <!-- 审核对话框 -->
    <el-dialog
      v-model="approveDialog.visible"
      :title="approveDialog.title"
      width="500px"
      append-to-body
      class="approve-dialog"
    >
      <el-form ref="approveFormRef" :model="approveForm" label-width="80px">
        <el-form-item label="是否符合" prop="qualify">
          <Dict v-model="approveForm.qualify" code="yesno" class="mobile-input">
            <template #prefix>
              <el-icon class="input-icon"><Check /></el-icon>
            </template>
          </Dict>
        </el-form-item>
        <el-form-item label="审核意见" prop="remark">
          <el-input
            v-model="approveForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入审核意见"
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

    <!-- 批量审核对话框 -->
    <el-dialog
      v-model="batchApproveDialog.visible"
      title="批量审核"
      width="500px"
      append-to-body
      class="batch-approve-dialog"
    >
      <el-form ref="batchApproveFormRef" :model="batchApproveForm" label-width="80px">
        <el-form-item label="是否符合" prop="qualify">
          <Dict v-model="batchApproveForm.qualify" code="yesno" class="mobile-input">
            <template #prefix>
              <el-icon class="input-icon"><Check /></el-icon>
            </template>
          </Dict>
        </el-form-item>
        <el-form-item label="审核意见" prop="remark">
          <el-input
            v-model="batchApproveForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入审核意见"
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
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
//import { Menu, Close, Search, Office, View, Edit, Check, Delete } from "@element-plus/icons-vue";
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
const approveFormRef = ref();
const batchApproveFormRef = ref();
const deptTreeRef = ref();

const queryParams = reactive<MaterialPageQuery>({
  pageNum: 1,
  pageSize: 10,
  sort: "score", // 默认按分数排序
  order: "descending", // 默认降序
  status: "", // 状态参数，初始为空
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
  remark: "",
});

// 批量审核弹窗
const batchApproveDialog = reactive({
  visible: false,
});
const batchApproveForm = reactive({
  qualify: 0,
  remark: "",
});

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
// 5. 同步路由参数到查询条件的核心方法
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
  queryParams.sort = prop;
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
  approveForm.remark = "";
  approveDialog.visible = true;
}

// 退回申请
function handleReturn(id: number) {
  approveDialog.title = "退回申请";
  approveDialog.type = "return";
  approveDialog.id = id;
  approveForm.remark = "";
  approveDialog.visible = true;
}

// 提交审核
function submitApprove() {
  if (!approveForm.remark.trim()) {
    ElMessage.warning("请输入审核意见");
    return;
  }

  if (approveDialog.type === "approve") {
    MaterialAPI.updatestatus(
      approveDialog.id,
      "APPROVED",
      approveForm.remark,
      approveForm.qualify
    ).then(() => {
      ElMessage.success("审核成功");
      approveDialog.visible = false;
      fetchData();
    });
  } else {
    MaterialAPI.updatestatus(
      approveDialog.id,
      "RETURNED",
      approveForm.remark,
      approveForm.qualify
    ).then(() => {
      ElMessage.success("已退回");
      approveDialog.visible = false;
      fetchData();
    });
  }
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

  batchApproveForm.remark = "";
  batchApproveDialog.visible = true;
}

// 提交批量审核
function submitBatchApprove() {
  if (!batchApproveForm.remark.trim()) {
    ElMessage.warning("请输入审核意见");
    return;
  }
  console.log(selectIds.value);
  MaterialAPI.updatestatus(
    selectIds.value,
    "APPROVED",
    batchApproveForm.remark,
    batchApproveForm.qualify
  ).then(() => {
    ElMessage.success("批量审核成功");
    batchApproveDialog.visible = false;
    fetchData();
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
  //handleQuery();
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

.action-btn {
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

  .action-btn {
    margin: 0 4px;
  }
}
</style>
