<!-- ImageAndPdfUpload.vue -->
<template>
  <div class="manual-upload-container">
    <!-- 显示已上传文件 -->
    <!-- 显示已上传文件 -->
    <div v-if="displayFiles.length > 0" class="file-list">
      <div v-for="(file, index) in displayFiles" :key="file.uid" class="file-item">
        <div class="file-preview">
          <img v-if="isImage(file.url)" :src="file.url" class="preview-image" />
          <div v-else-if="isPdf(file.url)" class="pdf-preview">
            <el-icon><Document /></el-icon>
            <span>PDF</span>
          </div>
          <div v-else class="other-preview">
            <el-icon><QuestionFilled /></el-icon>
            <span>{{ getFileExtension(file.url) }}</span>
          </div>
        </div>
        <div class="file-info">
          <div class="file-name">{{ file.name }}</div>
          <div class="file-status" :class="file.status">
            {{ file.status === "success" ? "上传成功" : "上传中" }}
          </div>
        </div>
        <div class="file-actions">
          <el-button link @click="handlePreview(file, index)">
            <el-icon><ZoomIn /></el-icon>
          </el-button>
          <el-button link @click="handleFileRemove(index)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 上传按钮 -->
    <!-- 上传按钮 -->
    <el-upload
      v-if="displayFiles.length < props.limit"
      :show-file-list="false"
      :before-upload="handleBeforeUpload"
      :http-request="handleUpload"
      :accept="props.accept"
      :multiple="true"
    >
      <div class="upload-trigger">
        <el-icon class="upload-icon"><Plus /></el-icon>
        <div class="upload-text">点击上传</div>
      </div>
    </el-upload>

    <!-- 图片预览 -->
    <el-image-viewer
      v-if="previewVisible && previewType === 'image'"
      :zoom-rate="1.2"
      :initial-index="previewIndex"
      :url-list="previewUrlList"
      @close="handlePreviewClose"
    />

    <!-- PDF 或文件预览 -->
    <el-dialog
      v-else-if="previewVisible && previewType === 'pdf'"
      v-model="previewVisible"
      title="文件预览"
      width="80%"
    >
      <iframe :src="previewUrl" width="100%" height="600px" style="border: none"></iframe>
    </el-dialog>

    <!-- 其他文件预览 -->
    <el-dialog
      v-else-if="previewVisible && previewType === 'other'"
      v-model="previewVisible"
      title="文件预览"
      width="60%"
    >
      <div style="text-align: center; padding: 20px">
        <el-icon style="font-size: 48px; color: #909399"><QuestionFilled /></el-icon>
        <p style="margin-top: 16px; color: #606266">该文件格式不支持在线预览</p>
        <el-button type="primary" @click="downloadFile(previewUrl)">
          <el-icon><Download /></el-icon>
          下载文件
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { UploadRawFile, UploadRequestOptions } from "element-plus";
import { ElMessage } from "element-plus";
import FileAPI, { FileInfo } from "@/api/file.api";

// 图标
import { Plus, ZoomIn, Delete, Document, QuestionFilled, Download } from "@element-plus/icons-vue";

interface UploadFile {
  uid: string;
  name: string;
  url: string;
  status: "success" | "uploading";
}

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  name: {
    type: String,
    default: "file",
  },
  limit: {
    type: Number,
    default: 10,
  },
  maxFileSize: {
    type: Number,
    default: 10,
  },
  accept: {
    type: String,
    default: "image/*,.pdf",
  },
});

// 接收 v-model
const modelValue = defineModel<string[]>("modelValue", {
  type: Array,
  default: () => [],
});

// 内部文件状态管理
const internalFiles = ref<Map<string, UploadFile>>(new Map());
const uploadQueue = ref<Map<string, File>>(new Map());

// 显示的文件列表（计算属性）
const displayFiles = computed(() => {
  return Array.from(internalFiles.value.values());
});

// 预览相关变量
const previewVisible = ref(false);
const previewUrl = ref("");
const previewIndex = ref(0);
const previewType = ref<"image" | "pdf" | "other">("image");

// 预览图片URL列表
const previewUrlList = computed(() =>
  displayFiles.value.filter((file) => isImage(file.url)).map((file) => file.url)
);

/**
 * 生成唯一ID
 */
function generateUID(): string {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * 安全解析 JSON 字符串
 */
function tryParseJson(str: any): string[] {
  if (Array.isArray(str)) return str;
  if (typeof str === "string") {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("JSON 解析失败:", str);
      return [];
    }
  }
  return [];
}

/**
 * 从 modelValue 同步到内部状态
 */
function syncFromModelValue() {
  console.log("开始从 modelValue 同步:", modelValue.value);

  const urls = tryParseJson(modelValue.value);
  const newMap = new Map<string, UploadFile>();

  urls.forEach((url, index) => {
    if (url && typeof url === "string") {
      const uid = generateUID();
      newMap.set(uid, {
        uid,
        name: decodeURIComponent(url.split("/").pop() || `file-${index}`),
        url,
        status: "success",
      });
    }
  });

  internalFiles.value = newMap;
  console.log("同步完成，当前文件:", Array.from(newMap.values()));
}

/**
 * 同步内部状态到 modelValue
 */
function syncToModelValue() {
  const urls = displayFiles.value
    .filter((file) => file.status === "success" && file.url)
    .map((file) => file.url)
    .filter(Boolean);

  console.log("同步到 modelValue:", urls);
  modelValue.value = urls;
}

/**
 * 获取文件扩展名
 */
function getFileExtension(url: string): string {
  const match = url.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toUpperCase() : "FILE";
}

/**
 * 删除文件
 */
function handleFileRemove(index: number) {
  const file = displayFiles.value[index];
  console.log("删除文件:", file);

  if (file.url) {
    // 从服务器删除文件
    FileAPI.delete(file.url).catch((err) => {
      console.warn("服务器文件删除失败:", err);
    });
  }

  // 从内部状态中移除
  internalFiles.value.delete(file.uid);

  // 同步到 modelValue
  syncToModelValue();
}

/**
 * 上传前校验
 */
function handleBeforeUpload(file: UploadRawFile) {
  console.log("开始上传文件:", file.name);

  const acceptTypes = props.accept.split(",").map((t) => t.trim().toLowerCase());

  let isValidType = false;
  for (const type of acceptTypes) {
    if (type === "image/*") {
      if (file.type.startsWith("image/")) {
        isValidType = true;
        break;
      }
    } else if (type === ".pdf") {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        isValidType = true;
        break;
      }
    } else if (type.startsWith(".")) {
      if (file.name.toLowerCase().endsWith(type)) {
        isValidType = true;
        break;
      }
    } else {
      if (file.type === type) {
        isValidType = true;
        break;
      }
    }
  }

  if (!isValidType) {
    ElMessage.warning(`格式不支持，请上传：${props.accept}`);
    return false;
  }

  if (file.size > props.maxFileSize * 1024 * 1024) {
    ElMessage.warning(`文件不能超过 ${props.maxFileSize} MB`);
    return false;
  }

  // 创建上传中的文件记录
  const uid = generateUID();
  internalFiles.value.set(uid, {
    uid,
    name: file.name,
    url: "",
    status: "uploading",
  });

  // 添加到上传队列
  uploadQueue.value.set(uid, file);

  console.log("添加上传任务:", file.name, "当前文件数:", internalFiles.value.size);

  return true;
}

/**
 * 执行实际上传
 */
async function executeUpload(uid: string, file: File) {
  try {
    console.log("执行上传:", file.name);

    const formData = new FormData();
    formData.append(props.name, file);
    Object.keys(props.data).forEach((key) => {
      formData.append(key, props.data[key]);
    });

    const fileInfo = await FileAPI.upload(formData);
    console.log("上传成功:", fileInfo);

    // 更新文件状态
    internalFiles.value.set(uid, {
      uid,
      name: fileInfo.name || decodeURIComponent(fileInfo.url.split("/").pop() || file.name),
      url: fileInfo.url,
      status: "success",
    });

    ElMessage.success(`${file.name} 上传成功`);

    // 同步到 modelValue
    syncToModelValue();
  } catch (error) {
    console.error("上传失败:", error);
    ElMessage.error(`${file.name} 上传失败`);

    // 上传失败，移除文件记录
    internalFiles.value.delete(uid);
  } finally {
    // 从上传队列中移除
    uploadQueue.value.delete(uid);
  }
}

/**
 * 自定义上传
 */
function handleUpload(options: UploadRequestOptions) {
  // 立即执行上传
  const uid = Array.from(uploadQueue.value.entries()).find(
    ([_, file]) => file === options.file
  )?.[0];

  if (uid) {
    executeUpload(uid, options.file);
  }

  // 返回一个空的 promise，因为我们自己处理上传
  return Promise.resolve();
}

function isImage(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url);
}

function isPdf(url: string): boolean {
  return /\.pdf$/i.test(url);
}

/**
 * 预览文件
 */
function handlePreview(file: UploadFile, index: number) {
  console.log("预览文件:", file);

  if (!file.url) {
    ElMessage.warning("文件尚未上传完成，无法预览");
    return;
  }

  previewUrl.value = file.url;

  if (isImage(file.url)) {
    previewType.value = "image";
    // 计算在图片列表中的索引
    const imageFiles = displayFiles.value.filter((f) => isImage(f.url));
    previewIndex.value = imageFiles.findIndex((f) => f.uid === file.uid);
    previewVisible.value = true;
  } else if (isPdf(file.url)) {
    previewType.value = "pdf";
    previewVisible.value = true;
  } else {
    previewType.value = "other";
    previewVisible.value = true;
  }
}

/**
 * 关闭预览
 */
function handlePreviewClose() {
  previewVisible.value = false;
  previewUrl.value = "";
  previewIndex.value = 0;
}

/**
 * 下载文件
 */
function downloadFile(url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = url.split("/").pop() || "download";
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 监听 modelValue 变化
watch(
  () => modelValue.value,
  (newValue) => {
    console.log("modelValue 变化:", newValue);
    syncFromModelValue();
  },
  { immediate: true, deep: true }
);

// 初始化
onMounted(() => {
  console.log("组件挂载，初始 modelValue:", modelValue.value);
  syncFromModelValue();
});
</script>

<style scoped>
.manual-upload-container {
  width: 100%;
}

.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.file-item {
  width: 120px;
  height: 140px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  transition: border-color 0.2s;
}

.file-item:hover {
  border-color: #165dff;
}

.file-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f9fafb;
  border-radius: 4px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.pdf-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #f56c6c;
  font-size: 12px;
}

.pdf-preview .el-icon {
  font-size: 32px;
  margin-bottom: 4px;
}

.other-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 12px;
}

.other-preview .el-icon {
  font-size: 32px;
  margin-bottom: 4px;
}

.file-info {
  margin-top: 8px;
}

.file-name {
  font-size: 12px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.file-status {
  font-size: 10px;
  text-align: center;
  margin-top: 2px;
}

.file-status.success {
  color: #10b981;
}

.file-status.uploading {
  color: #f59e0b;
}

.file-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.file-item:hover .file-actions {
  opacity: 1;
}

.upload-trigger {
  width: 120px;
  height: 120px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s;
  color: #6b7280;
  background: #f9fafb;
}

.upload-trigger:hover {
  border-color: #165dff;
  color: #165dff;
  background: #f0f7ff;
}

.upload-trigger .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.upload-tip {
  font-size: 12px;
  margin-top: 4px;
  text-align: center;
  color: #9ca3af;
}
</style>
