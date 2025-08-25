<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="keywords" label="关键字">
          <el-input
            v-model="queryParams.keywords"
            placeholder="单位名称/联系人"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 100px">
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
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
          <el-button type="success" icon="plus" @click="handleOpenDialog()">新增</el-button>
          <el-button
            type="danger"
            :disabled="ids.length === 0"
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
        :data="unitList"
        highlight-current-row
        border
        class="data-table__content"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="单位名称" prop="name" min-width="120" />
        <el-table-column label="联系人" prop="linkman" width="100" />
        <el-table-column label="联系电话" prop="linktel" width="120" />

        <el-table-column label="成员数" width="80">
          <template #default="scope">
            <router-link :to="{ name: 'Usermanager', query: { companyid: scope.row.id } }">
              <el-button type="info" size="small" icon="el-icon-user">
                {{ scope.row.membercount }}
              </el-button>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" prop="createTime" />

        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              icon="edit"
              @click="handleOpenDialog(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              icon="delete"
              @click="handleDelete(scope.row.id)"
            >
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
        @pagination="fetchData"
      />
    </el-card>

    <!-- 单位表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="unitFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入单位名称" />
        </el-form-item>

        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="formData.linkman" placeholder="请输入联系人" />
        </el-form-item>

        <el-form-item label="联系电话" prop="linktel">
          <el-input v-model="formData.linktel" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item label="单位简介" prop="content">
          <el-input v-model="formData.content" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import UnitAPI, { type UnitPageVO, type UnitForm, type UnitPageQuery } from "@/api/system/unit.api";

defineOptions({
  name: "Unit",
  inheritAttrs: false,
});

const queryFormRef = ref();
const unitFormRef = ref();
const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<UnitPageQuery>({
  pageNum: 1,
  pageSize: 10,
  keywords: "",
  status: undefined,
});

// 单位列表数据
const unitList = ref<UnitPageVO[]>();

// 弹窗配置
const dialog = reactive({
  title: "",
  visible: false,
});

// 表单数据
const formData = reactive<UnitForm>({
  name: "",
  linkman: "",
  linktel: "",
  content: "",
  status: 1,
});

// 表单验证规则
const rules = reactive({
  name: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
  linkman: [{ required: true, message: "请输入联系人", trigger: "blur" }],
  linktel: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
});

// 获取数据
function fetchData() {
  loading.value = true;
  UnitAPI.getPage(queryParams)
    .then((data) => {
      unitList.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

// 查询（重置页码后获取数据）
function handleQuery() {
  queryParams.pageNum = 1;
  fetchData();
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  fetchData();
}

// 行复选框选中
function handleSelectionChange(selection: UnitPageVO[]) {
  ids.value = selection.map((item) => item.id);
}

// 打开单位弹窗
function handleOpenDialog(unitId?: number) {
  dialog.visible = true;
  if (unitId) {
    dialog.title = "修改单位";
    UnitAPI.getFormData(unitId).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增单位";
  }
}

// 提交单位表单
function handleSubmit() {
  unitFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      const unitId = formData.id;
      if (unitId) {
        UnitAPI.update(unitId, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            fetchData();
          })
          .finally(() => (loading.value = false));
      } else {
        UnitAPI.create(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            fetchData();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  unitFormRef.value.resetFields();
  Object.assign(formData, {
    id: undefined,
    name: "",
    linkman: "",
    linktel: "",
    content: "",
    status: 1,
  });
}

// 删除单位
function handleDelete(unitId?: number) {
  const deleteIds = unitId ? [unitId] : ids.value;
  if (deleteIds.length === 0) {
    ElMessage.warning("请选择要删除的单位");
    return;
  }

  ElMessageBox.confirm("确定删除选中的单位吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    UnitAPI.deleteByIds(deleteIds)
      .then(() => {
        ElMessage.success("删除成功");
        fetchData();
      })
      .finally(() => (loading.value = false));
  });
}

onMounted(() => {
  fetchData();
});
</script>
