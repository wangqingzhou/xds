<template>
  <el-upload
    v-model:file-list="internalFileList"
    list-type="picture-card"
    :before-upload="handleBeforeUpload"
    :http-request="handleUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :accept="props.accept"
    :limit="props.limit"
    :multiple="props.limit > 1"
  >
    <!-- 上传触发按钮 -->
    <slot name="trigger">
      <el-icon><Plus /></el-icon>
    </slot>

    <!-- 文件列表项 -->
    <template #file="{ file }">
      <div style="width: 100%">
        <!-- 图片预览 -->
        <img
          v-if="isImageFile(file)"
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          :alt="file.name || '图片'"
        />

        <!-- PDF预览 -->
        <div v-else-if="isPdfFile(file)" class="pdf-preview-container">
          <div class="pdf-preview-placeholder">
            <el-icon class="pdf-icon"><Document /></el-icon>
            <div class="pdf-name">{{ file.name || "PDF文件" }}</div>
          </div>
        </div>

        <!-- 非图片/非PDF文件图标 -->
        <div v-else class="file-icon-container">
          <el-icon class="file-icon"><Document /></el-icon>
          <div class="file-name-text">{{ file.name || "未知文件" }}</div>
        </div>

        <!-- 操作按钮 -->
        <span class="el-upload-list__item-actions">
          <!-- 预览 -->
          <span v-if="isImageFile(file) || isPdfFile(file)" @click="handlePreview(file)">
            <el-icon><ZoomIn /></el-icon>
          </span>
          <!-- 删除 -->
          <span @click="handleRemove(file)">
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <!-- 图片预览组件 -->
  <el-image-viewer
    v-if="previewVisible && safeUrlList.length > 0"
    :zoom-rate="1.2"
    :initial-index="safePreviewIndex"
    :url-list="safeUrlList"
    @close="handlePreviewClose"
  />

  <!-- PDF预览对话框 -->
  <el-dialog
    v-model="pdfPreviewVisible"
    :title="currentPdfName"
    width="80%"
    :before-close="handlePdfPreviewClose"
  >
    <div class="pdf-preview-wrapper">
      <iframe
        v-if="currentPdfUrl"
        :src="currentPdfUrl"
        class="pdf-preview-iframe"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import type { PropType } from "vue";
import { UploadRawFile, UploadRequestOptions, UploadUserFile } from "element-plus";
import { ElMessage } from "element-plus";
import { Plus, ZoomIn, Delete, Document } from "@element-plus/icons-vue";
import FileAPI from "@/api/file.api";

// 定义组件属性
const props = defineProps({
  data: { type: Object, default: () => ({}) },
  name: { type: String, default: "file" },
  limit: { type: Number, default: 10 },
  maxFileSize: { type: String, default: "10" },
  accept: { type: String, default: ".pdf,.jpg,.png" },
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

// 定义事件
const emit = defineEmits(["update:modelValue", "remove", "change"]);

// 组件内部文件列表
const internalFileList = ref<UploadUserFile[]>([]);
const previewVisible = ref(false);
const previewImageIndex = ref(0);
const pdfPreviewVisible = ref(false);
const currentPdfUrl = ref("");
const currentPdfName = ref("");

// 存储已上传文件的信息
const uploadedFiles = ref(new Map<string, { name: string; url: string }>());

// 正在上传的文件映射，用于跟踪上传状态
const uploadingFiles = ref(new Map<string, UploadUserFile>());

// 初始化文件列表
onMounted(() => {
  console.log("MultipleFileUpload 组件挂载，初始 modelValue:", props.modelValue);

  // 延迟初始化，确保父组件数据已加载
  nextTick(() => {
    console.log("延迟初始化文件列表");
    initFileListFromModelValue();
  });
});

// 从 modelValue 初始化文件列表
function initFileListFromModelValue() {
  console.log("初始化文件列表，modelValue:", props.modelValue);

  if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
    const newFileList: UploadUserFile[] = [];
    const processedUrls = new Set(); // 用于去重

    props.modelValue.forEach((url, index) => {
      if (!url) return;

      console.log(`处理文件URL ${index}:`, url);

      // 清理URL，确保格式正确
      const cleanUrl = url.replace(/^"+|"+$/g, "").trim();
      if (!cleanUrl || processedUrls.has(cleanUrl)) {
        console.log(`跳过重复或空URL: ${cleanUrl}`);
        return;
      }

      processedUrls.add(cleanUrl);

      // 优先使用已上传文件的信息
      const fileInfo = uploadedFiles.value.get(cleanUrl);
      if (fileInfo) {
        newFileList.push({
          uid: `uploaded-${index}-${Date.now()}`,
          name: fileInfo.name,
          url: fileInfo.url,
          status: "success",
        });
      } else {
        // 从URL提取文件名
        const fileName = extractFileNameFromUrl(cleanUrl);
        const ext = getExtFromUrl(cleanUrl);
        const displayName = fileName || (ext ? `文件${index + 1}${ext}` : `文件${index + 1}`);

        newFileList.push({
          uid: `init-${index}-${Date.now()}`,
          name: displayName,
          url: cleanUrl,
          status: "success",
        });

        // 存储文件信息
        uploadedFiles.value.set(cleanUrl, {
          name: displayName,
          url: cleanUrl,
        });
      }
    });

    console.log("最终文件列表:", newFileList);
    internalFileList.value = newFileList;
  } else {
    console.log("没有URL数据，清空文件列表");
    internalFileList.value = [];
  }
}

// 从URL提取文件名
function extractFileNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.split("/").pop() || "文件";
  } catch (error) {
    const segments = url.split("/");
    return segments.pop() || "文件";
  }
}

// 从URL获取扩展名
function getExtFromUrl(url: string): string {
  const match = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);
  return match ? `.${match[1]}` : "";
}

// 判断是否为图片文件
function isImageFile(file: UploadUserFile): boolean {
  if (file.raw) {
    return file.raw.type.startsWith("image/");
  }
  const ext = getExtFromUrl(file.url || "").toLowerCase();
  return [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"].includes(ext);
}

// 判断是否为PDF文件
function isPdfFile(file: UploadUserFile): boolean {
  if (file.raw) {
    return file.raw.type === "application/pdf";
  }
  const ext = getExtFromUrl(file.url || "").toLowerCase();
  return ext === ".pdf";
}

// 安全的预览URL列表
const safeUrlList = computed(() => {
  return Array.isArray(props.modelValue)
    ? props.modelValue.filter((url) => typeof url === "string" && url.trim() !== "")
    : [];
});

// 安全的预览索引
const safePreviewIndex = computed(() => {
  return Math.max(0, Math.min(previewImageIndex.value, safeUrlList.value.length - 1));
});

// 处理文件删除
function handleRemove(file: UploadUserFile) {
  console.log("删除文件:", file);

  // 如果文件正在上传，直接从前端移除
  if (file.status === "uploading") {
    internalFileList.value = internalFileList.value.filter((item) => item.uid !== file.uid);
    uploadingFiles.value.delete(file.uid!);
    updateParentModelValue();
    return;
  }

  // 如果文件已上传到服务器，调用删除接口
  if (file.url) {
    FileAPI.delete(file.url)
      .then(() => {
        ElMessage.success("文件删除成功");
        // 从已上传文件信息中删除
        uploadedFiles.value.delete(file.url!);
        internalFileList.value = internalFileList.value.filter((item) => item.uid !== file.uid);
        updateParentModelValue();
        emit("remove", file.url);
      })
      .catch((error) => {
        console.error("删除文件失败：", error);
        ElMessage.error("删除文件失败，请重试");
      });
  } else {
    // 本地文件直接移除
    internalFileList.value = internalFileList.value.filter((item) => item.uid !== file.uid);
    updateParentModelValue();
  }
}

// 更新父组件的modelValue
function updateParentModelValue() {
  const successFiles = internalFileList.value.filter(
    (item) => item.status === "success" && item.url
  );

  // 去重，确保每个URL只出现一次
  const uniqueUrls = [...new Set(successFiles.map((item) => item.url!))];

  console.log("更新父组件modelValue:", uniqueUrls);
  emit("update:modelValue", uniqueUrls);
  emit("change", uniqueUrls);
}

// 上传前验证
function handleBeforeUpload(file: UploadRawFile) {
  const acceptTypes = props.accept.split(",").map((type) => type.trim());
  const fileExt = "." + (file.name.toLowerCase().split(".").pop() || "");
  const isValidType = acceptTypes.some((type) => {
    if (type === "image/*") return file.type.startsWith("image/");
    if (type.startsWith(".")) return fileExt === type.toLowerCase();
    return file.type === type;
  });

  if (!isValidType) {
    ElMessage.warning(`仅支持上传 ${props.accept} 格式的文件`);
    return false;
  }

  const maxSize = parseFloat(props.maxFileSize);
  if (!isNaN(maxSize) && file.size > maxSize * 1024 * 1024) {
    ElMessage.warning(`文件大小不能超过 ${maxSize}MB`);
    return false;
  }

  return true;
}

// 自定义上传逻辑
function handleUpload(options: UploadRequestOptions) {
  // 将文件添加到上传中列表
  const uploadingFile: UploadUserFile = {
    ...options.file,
    status: "uploading",
    name: options.file.name,
  };
  uploadingFiles.value.set(options.file.uid!, uploadingFile);

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    const file = options.file as UploadRawFile;
    formData.append(props.name, file);

    Object.keys(props.data).forEach((key) => {
      formData.append(key, props.data[key]);
    });

    FileAPI.upload(formData)
      .then((response: any) => {
        console.log("上传响应:", response);

        // 存储已上传文件的信息
        uploadedFiles.value.set(response.url, {
          name: response.name || file.name,
          url: response.url,
        });

        // 从上传中列表移除
        uploadingFiles.value.delete(options.file.uid!);

        // 返回完整的上传文件对象
        resolve({
          ...file,
          url: response.url,
          name: response.name || file.name,
          uid: options.file.uid,
          status: "success",
        });
      })
      .catch((error) => {
        // 从上传中列表移除
        uploadingFiles.value.delete(options.file.uid!);
        reject(error);
      });
  });
}

// 上传成功处理
function handleSuccess(response: any, uploadFile: UploadUserFile) {
  console.log("上传成功:", response);

  ElMessage.success("文件上传成功");

  // 确保文件信息正确更新
  const fileUrl = response.url;
  const fileName = response.name || uploadFile.name;

  // 检查是否已经存在相同URL的文件
  const existingIndex = internalFileList.value.findIndex((item) => item.url === fileUrl);

  if (existingIndex !== -1) {
    // 更新现有文件
    internalFileList.value[existingIndex] = {
      ...uploadFile,
      url: fileUrl,
      status: "success",
      name: fileName,
    };
  } else {
    // 添加新文件
    const newFile = {
      uid: uploadFile.uid,
      name: fileName,
      url: fileUrl,
      status: "success",
    };

    // 检查是否正在上传的文件，如果是则替换，否则添加
    const uploadingIndex = internalFileList.value.findIndex((item) => item.uid === uploadFile.uid);
    if (uploadingIndex !== -1) {
      internalFileList.value[uploadingIndex] = newFile;
    } else {
      internalFileList.value.push(newFile);
    }
  }

  // 存储已上传文件的信息
  uploadedFiles.value.set(fileUrl, {
    name: fileName,
    url: fileUrl,
  });

  // 同步父组件
  updateParentModelValue();
}

// 处理上传超出限制
function handleExceed() {
  ElMessage.warning(`最多只能上传 ${props.limit} 个文件`);
}

// 处理上传错误
function handleError(error: any) {
  console.error("上传失败：", error);
  ElMessage.error(`上传失败：${error.message || "未知错误"}`);

  // 上传失败时从上传中列表移除
  if (error.uid) {
    uploadingFiles.value.delete(error.uid);
  }
}

// 统一预览处理
function handlePreview(file: UploadUserFile) {
  if (!file.url) {
    ElMessage.warning("文件尚未上传完成，无法预览");
    return;
  }

  if (isImageFile(file)) {
    if (safeUrlList.value.length === 0) {
      ElMessage.warning("没有可预览的文件");
      return;
    }
    previewImageIndex.value = safeUrlList.value.findIndex((url) => url === file.url);
    previewVisible.value = true;
  } else if (isPdfFile(file)) {
    currentPdfUrl.value = file.url;
    currentPdfName.value = file.name || "PDF预览";
    pdfPreviewVisible.value = true;
  }
}

// 关闭图片预览
function handlePreviewClose() {
  previewVisible.value = false;
}

// 关闭PDF预览
function handlePdfPreviewClose() {
  pdfPreviewVisible.value = false;
  currentPdfUrl.value = "";
  currentPdfName.value = "";
}
</script>

<style scoped>
.el-upload-list__item-thumbnail {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.el-upload-list__item-actions {
  opacity: 0;
  transition: opacity 0.3s;
}

.el-upload-list__item:hover .el-upload-list__item-actions {
  opacity: 1;
}

.file-icon-container {
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.file-icon {
  font-size: 24px;
  color: #165dff;
  margin-bottom: 8px;
}

.file-name-text {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
  text-align: center;
}

.pdf-preview-container {
  width: 100%;
  height: 100px;
  overflow: hidden;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.pdf-preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.pdf-icon {
  font-size: 32px;
  color: #e6a23c;
  margin-bottom: 8px;
}

.pdf-name {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
  text-align: center;
}

.pdf-preview-wrapper {
  width: 100%;
  height: 70vh;
}

.pdf-preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 6px;
}
</style>
