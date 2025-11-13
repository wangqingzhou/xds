<!-- src/views/system/news/components/NewsForm.vue -->
<template>
  <div class="app-container">
    <el-card class="form-card">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="auto">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入文章标题" />
        </el-form-item>

        <el-form-item label="封面图上传">
          <!-- 调试信息 -->
          <div v-if="debugMode" class="debug-info">
            <el-tag type="info">picUrl值: {{ JSON.stringify(formData.picUrl) }}</el-tag>
            <el-tag type="info">picUrl长度: {{ formData.picUrl?.length }}</el-tag>
          </div>

          <MultipleFileUpload
            v-model="formData.picUrl"
            :limit="1"
            :max-file-size="1"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <template #trigger>
              <div class="upload-trigger">
                <el-icon class="upload-icon"><Picture /></el-icon>
                <span>点击或拖放图片到此处</span>
              </div>
            </template>
          </MultipleFileUpload>
          <div class="form-tip">
            <el-icon class="tip-icon"><InfoFilled /></el-icon>
            支持上传1张图片，最多1张，单张图片不超过1MB
          </div>
        </el-form-item>

        <el-form-item label="文章权重" prop="level">
          <Dict v-model="formData.level" code="weight" />
        </el-form-item>

        <el-form-item label="所属栏目" prop="classid">
          <el-tree-select
            v-model="formData.classid"
            placeholder="请选择所属栏目"
            :data="classOptions"
            filterable
            check-strictly
            :render-after-expand="false"
            class="full-width-select"
          />
        </el-form-item>

        <el-form-item label="文章内容" prop="content">
          <WangEditor v-model="formData.content" class="editor-container" />
        </el-form-item>

        <el-form-item v-if="formData.id" label="状态" prop="publishStatus">
          <el-tag v-if="formData.publishStatus == 0" type="info">未发布</el-tag>
          <el-tag v-if="formData.publishStatus == 1" type="success">已发布</el-tag>
          <el-tag v-if="formData.publishStatus == -1" type="warning">已撤回</el-tag>
        </el-form-item>

        <el-form-item class="form-actions">
          <div class="action-buttons">
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button @click="handleClose">取消</el-button>

            <el-button
              v-if="formData.id && formData.publishStatus != 1"
              v-hasPerm="['sys:news:publish']"
              type="success"
              @click="handlePublish"
            >
              发布
            </el-button>

            <el-button
              v-if="formData.id && formData.publishStatus == 1"
              v-hasPerm="['sys:news:revoke']"
              type="warning"
              @click="handleRevoke"
            >
              撤回
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app.store";
import { DeviceEnum } from "@/enums/settings/device.enum";

import NoticeAPI, { NoticeForm } from "@/api/system/news.api";

import ClassAPI from "@/api/system/class.api";
import RoleAPI from "@/api/system/role.api";
import { Picture, InfoFilled } from "@element-plus/icons-vue";
import SingleFileUpload from "@/components/Upload/SingleImageUpload.vue";
import MultipleFileUpload from "@/components/Upload/MultiImageUpload.vue";

// 以下是必要的组件逻辑
const route = useRoute();
const router = useRouter();
const formRef = ref();
const debugMode = ref(false); // 调试模式开关

const formData = reactive<NoticeForm>({
  status: 1,
  picUrl: [], // 保持字段名不变，直接改为数组
});

const rules = reactive({
  title: [{ required: true, message: "文章标题不能为空", trigger: "blur" }],
  classid: [{ required: true, message: "请选择所属栏目", trigger: "change" }],
  content: [{ required: true, message: "文章内容不能为空", trigger: "blur" }],
});

const classOptions = ref<OptionType[]>();
const roleOptions = ref<OptionType[]>();

// 解析文件URL数组
const parseFileUrlArray = (
  jsonStr: string | undefined,
  readyArray: any[] | undefined
): string[] => {
  // 1. 优先使用后端返回的现成数组
  if (readyArray && Array.isArray(readyArray)) {
    return readyArray.map((item) => item?.toString().trim()).filter(Boolean);
  }
  // 2. 解析JSON数组字符串
  if (jsonStr && typeof jsonStr === "string" && jsonStr.startsWith("[") && jsonStr.endsWith("]")) {
    try {
      const formattedStr = jsonStr.replace(/\\"/g, '"');
      const parsed = JSON.parse(formattedStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => item?.toString().trim()).filter(Boolean);
      }
    } catch (e) {
      console.error("文件URL数组解析失败：", e, "原始数据：", jsonStr);
    }
  }
  // 3. 如果是单个字符串，包装成数组
  if (jsonStr && typeof jsonStr === "string" && jsonStr.trim() !== "") {
    return [jsonStr.trim()];
  }
  // 4. 无有效数据返回空数组
  return [];
};

async function loadFormData() {
  try {
    const [classes] = await Promise.all([ClassAPI.getOptions()]);

    classOptions.value = classes;
    console.log(route.params.id);
    if (route.params.id) {
      const data = await NoticeAPI.getDetail(route.params.id);

      // 先处理 picUrl，确保是普通数组
      let picUrlArray: string[] = [];

      if (data.picUrl) {
        if (Array.isArray(data.picUrl)) {
          picUrlArray = [...data.picUrl]; // 创建新数组
        } else if (typeof data.picUrl === "string") {
          try {
            const parsed = JSON.parse(data.picUrl);
            picUrlArray = Array.isArray(parsed) ? [...parsed] : [data.picUrl];
          } catch (e) {
            picUrlArray = [data.picUrl];
          }
        }
      }

      // 先赋值普通数组，再合并其他数据
      formData.picUrl = picUrlArray;
      Object.assign(formData, { ...data, picUrl: picUrlArray });

      console.log("解析后的图片URL:", formData.picUrl);
      console.log("是否是普通数组:", Array.isArray(formData.picUrl) && !formData.picUrl._isVue);
    }
  } catch (error) {
    ElMessage.error("加载表单数据失败");
    router.back();
  }
}

// 创建提交专用数据（数组转JSON字符串）
const getSubmitData = (): NoticeForm => {
  const submitData = JSON.parse(JSON.stringify(formData)) as NoticeForm;

  // 图片URL数组转为JSON字符串
  submitData.picUrl = Array.isArray(submitData.picUrl)
    ? JSON.stringify(submitData.picUrl.filter(Boolean))
    : "[]";

  return submitData;
};

const handleSubmit = useDebounceFn(() => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        console.log("提交数据:", formData);

        // 使用转换后的数据提交
        const submitData = getSubmitData();
        console.log("转换后的提交数据:", submitData);

        if (formData.id) {
          await NoticeAPI.update(formData.id, submitData);
          ElMessage.success("修改成功");
        } else {
          await NoticeAPI.add(submitData);
          ElMessage.success("新增成功");
        }
        router.push({ name: "News" });
      } catch (error) {
        console.error("提交失败:", error);
        ElMessage.error("操作失败");
      }
    }
  });
}, 1000);

async function handlePublish() {
  try {
    await NoticeAPI.publish(formData.id);
    ElMessage.success("发布成功");
    loadFormData();
  } catch (error) {
    ElMessage.error("发布失败");
  }
}

async function handleRevoke() {
  try {
    await NoticeAPI.revoke(formData.id);
    ElMessage.success("撤回成功");
    loadFormData();
  } catch (error) {
    ElMessage.error("撤回失败");
  }
}

function handleClose() {
  router.back();
}

onMounted(() => {
  loadFormData();
});
</script>

<style scoped>
.app-container {
  padding: 16px;
  max-width: 100%;
  box-sizing: border-box;
}

.form-card {
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.el-card__body) {
  padding: 0;
}

.el-form {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .app-container {
    padding: 12px;
  }

  .el-form {
    padding: 16px;
  }

  :deep(.el-form-item__label) {
    font-size: 14px;
  }

  :deep(.el-input) {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 8px;
  }

  .el-form {
    padding: 12px;
  }
}

/* 上传组件样式 */
.upload-trigger {
  width: 100%;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 20px;
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.upload-trigger:hover {
  border-color: #165dff;
  background-color: #f0f7ff;
}

.upload-icon {
  font-size: 24px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.upload-trigger span {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

@media (max-width: 768px) {
  .upload-trigger {
    height: 100px;
    padding: 16px;
  }

  .upload-icon {
    font-size: 20px;
  }
}

/* 表单提示 */
.form-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tip-icon {
  font-size: 14px;
  color: #9ca3af;
}

/* 调试信息 */
.debug-info {
  margin-bottom: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.debug-info .el-tag {
  font-size: 12px;
}

/* 全宽选择器 */
.full-width-select {
  width: 100%;
}

/* 编辑器容器 */
.editor-container {
  width: 100%;
  min-height: 400px;
}

@media (max-width: 768px) {
  .editor-container {
    min-height: 300px;
  }
}

/* 表单操作按钮 */
.form-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

@media (max-width: 768px) {
  .form-actions {
    margin-top: 20px;
    padding-top: 12px;
  }

  .action-buttons {
    gap: 8px;
    justify-content: flex-start;
  }

  .action-buttons .el-button {
    flex: 1;
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .action-buttons .el-button {
    width: 100%;
    margin: 0;
  }
}

/* 表单项间距优化 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  :deep(.el-form-item) {
    margin-bottom: 16px;
  }
}

/* 输入框和选择器自适应 */
:deep(.el-input),
:deep(.el-select),
:deep(.el-tree-select) {
  width: 100%;
}

/* 标签响应式 */
:deep(.el-form-item__label) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 480px) {
  :deep(.el-form-item__label) {
    font-size: 13px;
  }
}
</style>
