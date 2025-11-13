<!-- 文章管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 栏目树 -->
      <el-col :lg="4" :xs="24" class="mb-[12px]">
        <ClassTree v-model="queryParams.classId" @node-click="handleQuery" />
      </el-col>

      <!-- 列表 -->
      <el-col :lg="20" :xs="24">
        <!-- 搜索区域 -->
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="auto">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="标题"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                style="width: 100px"
              >
                <el-option label="已发布" :value="1" />
                <el-option label="未发布" :value="0" />
                <el-option label="已撤回" :value="-1" />
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
              />
            </el-form-item>

            <el-form-item class="search-buttons">
              <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
              <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="hover" class="data-table">
          <div class="data-table__toolbar">
            <div class="data-table__toolbar--actions">
              <!-- 链接地址与路由配置的path对应 -->
              <router-link to="/news/create">
                <el-button type="success" icon="plus">新增</el-button>
              </router-link>
              <el-button
                v-hasPerm="['sys:news:delete']"
                type="danger"
                :disabled="selectIds.length === 0"
                icon="delete"
                @click="handleDelete()"
              >
                删除
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
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column
              label="标题"
              prop="title"
              min-width="200"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              align="center"
              label="栏目"
              prop="classname"
              width="150"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              align="center"
              label="发布人"
              prop="createByName"
              width="150"
              :show-overflow-tooltip="true"
            />
            <el-table-column align="center" label="文章权重" width="100">
              <template #default="scope">
                <DictLabel v-model="scope.row.level" code="weight" />
              </template>
            </el-table-column>

            <el-table-column align="center" label="状态" min-width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.publishStatus == 0" type="info" size="small">未发布</el-tag>
                <el-tag v-if="scope.row.publishStatus == 1" type="success" size="small">
                  已发布
                </el-tag>
                <el-tag v-if="scope.row.publishStatus == -1" type="warning" size="small">
                  已撤回
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" width="180">
              <template #default="scope">
                <div class="time-display">
                  {{ formatTime(scope.row.createTime) }}
                </div>
              </template>
            </el-table-column>

            <!-- 响应式操作列 -->
            <el-table-column
              align="center"
              label="操作"
              :width="isMobile ? 120 : 280"
              class-name="operation-column"
              :fixed="isMobile ? false : 'right'"
            >
              <template #default="scope">
                <!-- 移动端操作菜单 -->
                <div v-if="isMobile" class="mobile-actions">
                  <el-button
                    type="primary"
                    size="small"
                    link
                    class="mobile-view-btn"
                    @click="openDetailDialog(scope.row.id)"
                  >
                    查看
                  </el-button>
                  <el-dropdown
                    size="small"
                    trigger="click"
                    @command="(command) => handleMobileAction(command, scope.row)"
                  >
                    <el-button type="primary" link size="small" class="mobile-more-btn">
                      <el-icon><More /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          v-if="scope.row.publishStatus != 1"
                          v-hasPerm="['sys:news:publish']"
                          command="publish"
                        >
                          <el-icon><Promotion /></el-icon>
                          发布
                        </el-dropdown-item>
                        <el-dropdown-item command="share">
                          <el-icon><Share /></el-icon>
                          分享到小红书
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="scope.row.publishStatus == 1"
                          v-hasPerm="['sys:news:revoke']"
                          command="revoke"
                        >
                          <el-icon><RefreshLeft /></el-icon>
                          撤回
                        </el-dropdown-item>
                        <el-dropdown-item command="edit">
                          <el-icon><Edit /></el-icon>
                          编辑
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="scope.row.publishStatus != 1"
                          v-hasPerm="['sys:news:delete']"
                          command="delete"
                          class="danger-item"
                        >
                          <el-icon><Delete /></el-icon>
                          删除
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>

                <!-- PC端操作按钮 -->
                <div v-else class="pc-actions">
                  <el-button
                    type="primary"
                    size="small"
                    link
                    @click="openDetailDialog(scope.row.id)"
                  >
                    查看
                  </el-button>

                  <el-button
                    v-if="scope.row.publishStatus != 1"
                    v-hasPerm="['sys:news:publish']"
                    type="primary"
                    size="small"
                    link
                    @click="handlePublish(scope.row.id)"
                  >
                    发布
                  </el-button>
                  <el-button type="primary" size="small" link @click="shareXhs(scope.row.id)">
                    分享
                  </el-button>
                  <el-button
                    v-if="scope.row.publishStatus == 1"
                    v-hasPerm="['sys:news:revoke']"
                    type="primary"
                    size="small"
                    link
                    @click="handleRevoke(scope.row.id)"
                  >
                    撤回
                  </el-button>

                  <router-link :to="'/news/edit/' + scope.row.id">
                    <el-button type="primary" size="small">编辑</el-button>
                  </router-link>

                  <el-button
                    v-if="scope.row.publishStatus != 1"
                    v-hasPerm="['sys:news:delete']"
                    type="danger"
                    size="small"
                    link
                    @click="handleDelete(scope.row.id)"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="fetchData()"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 文章详情 -->
    <el-dialog
      v-model="detailDialog.visible"
      :show-close="false"
      width="80%"
      append-to-body
      @close="closeDetailDialog"
    >
      <template #header>
        <div class="flex-x-between">
          <span>文章详情</span>
          <div class="dialog-toolbar">
            <el-button circle @click="closeDetailDialog">
              <template #icon>
                <Close />
              </template>
            </el-button>
          </div>
        </div>
      </template>
      <el-descriptions :column="1">
        <el-descriptions-item label="标题：">
          {{ currentNotice.title }}
        </el-descriptions-item>
        <el-descriptions-item label="封面：">
          <!-- 使用img标签显示已有图片 -->
          <img
            v-if="currentNotice.picUrl"
            :src="currentNotice.picUrl"
            style="max-width: 200px; max-height: 200px"
            alt="文章封面"
          />
          <span v-else>无封面</span>
        </el-descriptions-item>

        <el-descriptions-item label="发布状态：">
          <el-tag v-if="currentNotice.publishStatus == 0" type="info">未发布</el-tag>
          <el-tag v-else-if="currentNotice.publishStatus == 1" type="success">已发布</el-tag>
          <el-tag v-else-if="currentNotice.publishStatus == -1" type="warning">已撤回</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建人：">
          {{ currentNotice.createByName }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间：">
          <el-date-picker
            v-model="currentNotice.createTime"
            type="datetime"
            readonly
            format="YYYY-MM-DD HH:mm:ss"
          />
        </el-descriptions-item>
        <el-descriptions-item label="内容：">
          <div class="notice-content" v-html="currentNotice.content" />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/modules/app.store";
import { DeviceEnum } from "@/enums/settings/device.enum";
import { Close, More, Promotion, Share, RefreshLeft, Edit, Delete } from "@element-plus/icons-vue";

import NoticeAPI, {
  NoticePageVO,
  NoticeForm,
  NoticePageQuery,
  NoticeDetailVO,
} from "@/api/system/news.api";

import ClassAPI from "@/api/system/class.api";
import RoleAPI from "@/api/system/role.api";

import ClassTree from "./components/ClassTree.vue";

defineOptions({
  name: "Notice",
  inheritAttrs: false,
});

const appStore = useAppStore();
const router = useRouter();

const queryFormRef = ref();
const userFormRef = ref();

const queryParams = reactive<NoticePageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 文章表格数据
const pageData = ref<NoticePageVO[]>([]);

const total = ref(0);
const loading = ref(false);

// 选中的文章ID
const selectIds = ref<number[]>([]);
// 栏目下拉数据源
const classOptions = ref<OptionType[]>();

// 计算是否移动端
const isMobile = computed(() => {
  return appStore.device === DeviceEnum.MOBILE;
});

// 格式化时间显示（移动端简化）
const formatTime = (timeString: string) => {
  if (!timeString) return "";
  if (isMobile.value) {
    // 移动端显示简化的日期
    return timeString.split(" ")[0];
  }
  return timeString;
};

// 获取数据
async function fetchData() {
  loading.value = true;
  try {
    const data = await NoticeAPI.getPage(queryParams);
    pageData.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

const detailDialog = reactive({
  visible: false,
});
const currentNotice = ref<NoticeDetailVO>({});

// 查询（重置页码后获取数据）
function handleQuery() {
  queryParams.pageNum = 1;
  fetchData();
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  queryParams.classId = undefined;
  queryParams.createTime = undefined;
  fetchData();
}

// 选中项发生变化
function handleSelectionChange(selection: any[]) {
  selectIds.value = selection.map((item) => item.id);
}

// 发布通知公告
function handlePublish(id: string) {
  NoticeAPI.publish(id).then(() => {
    ElMessage.success("发布成功");
    handleQuery();
  });
}

// 撤回通知公告
function handleRevoke(id: string) {
  NoticeAPI.revoke(id).then(() => {
    ElMessage.success("撤回成功");
    handleQuery();
  });
}

// 移动端操作处理
const handleMobileAction = (command: string, row: any) => {
  switch (command) {
    case "publish":
      handlePublish(row.id);
      break;
    case "share":
      shareXhs(row.id);
      break;
    case "revoke":
      handleRevoke(row.id);
      break;
    case "edit":
      // 使用编程式导航
      router.push(`/news/edit/${row.id}`);
      break;
    case "delete":
      handleDelete(row.id);
      break;
  }
};

// 分享文章
declare global {
  interface Window {
    xhs: any;
  }
}
function shareXhs(id: number) {
  console.log(id);
  NoticeAPI.xhs(id).then((data: any) => {
    console.log(data);
    console.log(data.picUrl);
    // 提取单个图片URL
    let imageUrl = "";
    if (Array.isArray(data.picUrl) && data.picUrl.length > 0) {
      imageUrl = data.picUrl[0];
    } else if (typeof data.picUrl === "string") {
      // 如果是字符串格式的数组，尝试解析
      try {
        const parsed = JSON.parse(data.picUrl);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imageUrl = parsed[0];
        }
      } catch (e) {
        imageUrl = data.picUrl;
      }
    }

    console.log("使用的图片URL:", imageUrl);
    window.xhs.share({
      shareInfo: {
        type: "normal", // 或 'video'
        title: data.title, // 分享标题
        content: data.content, // 分享内容
        images: [imageUrl], // 图片地址（必须是服务器地址）
      },
      verifyConfig: {
        appKey: data.appKey,
        nonce: data.nonce,
        timestamp: data.timestamp,
        signature: data.signature,
      },
      fail: (error: any) => {
        console.error("分享失败:", error);
      },
    });
  });
}

/**
 * 删除文章
 *
 * @param id  文章ID
 */
function handleDelete(id?: number) {
  const userIds = [id || selectIds.value].join(",");
  if (!userIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除文章?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    function () {
      loading.value = true;
      NoticeAPI.deleteByIds(userIds)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    function () {
      ElMessage.info("已取消删除");
    }
  );
}

const closeDetailDialog = () => {
  detailDialog.visible = false;
};

const openDetailDialog = async (id: string) => {
  const noticeDetail = await NoticeAPI.getDetail(id);
  currentNotice.value = noticeDetail;
  detailDialog.visible = true;
};

onMounted(() => {
  handleQuery();
});
</script>

<style scoped>
/* 移动端优化 */
@media (max-width: 768px) {
  .mobile-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    min-height: 32px;
  }

  .mobile-view-btn,
  .mobile-more-btn {
    padding: 6px 8px;
    min-height: 28px;
    font-size: 12px;
  }

  .time-display {
    font-size: 12px;
    white-space: nowrap;
  }

  .data-table__content .el-table__body-wrapper {
    overflow-x: auto;
  }

  /* 在移动端隐藏部分非关键列 */
  .data-table__content :deep(.el-table__row td:nth-child(4)),
  .data-table__content :deep(.el-table__row td:nth-child(5)) {
    display: none;
  }

  .data-table__content :deep(.el-table__header th:nth-child(4)),
  .data-table__content :deep(.el-table__header th:nth-child(5)) {
    display: none;
  }

  /* 操作列在移动端不固定 */
  .operation-column {
    position: relative !important;
  }

  /* 移动端下拉菜单样式 */
  .mobile-actions :deep(.el-dropdown) {
    line-height: 1;
  }

  .mobile-actions :deep(.el-button) {
    padding: 6px 8px;
    height: auto;
  }
}

/* 操作列样式 */
.operation-column :deep(.cell) {
  padding: 4px !important;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pc-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
  align-items: center;
}

.mobile-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.danger-item {
  color: #f56c6c;
}

.danger-item:hover {
  color: #f56c6c;
  background-color: transparent;
}

/* 时间显示容器 */
.time-display {
  font-size: 12px;
  color: #606266;
}

/* 表格内容区域响应式 */
.data-table__content {
  width: 100%;
}

/* 搜索区域响应式 */
@media (max-width: 768px) {
  .search-container .el-form--inline .el-form-item {
    margin-right: 8px;
    margin-bottom: 8px;
  }

  .search-buttons {
    display: flex;
    gap: 8px;
  }
}

/* 确保下拉菜单在移动端可点击 */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 16px;
}

/* 移动端表格单元格点击区域优化 */
:deep(.el-table__row td) {
  padding: 8px 4px;
}

:deep(.el-table .cell) {
  line-height: 1.4;
}
</style>
