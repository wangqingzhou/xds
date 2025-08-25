<template>
  <div class="app-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? "编辑新闻" : "创建新闻" }}</span>
          <el-button type="text" icon="arrow-left" class="back-btn" @click="$router.back()">
            返回列表
          </el-button>
        </div>
      </template>

      <el-form
        ref="newsFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        class="news-form"
      >
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入新闻标题" maxlength="100" />
        </el-form-item>

        <el-form-item label="所属栏目" prop="classId">
          <el-tree-select
            v-model="formData.classId"
            placeholder="请选择所属栏目"
            :data="classOptions"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>

        <el-form-item label="新闻内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            rows="10"
            placeholder="请输入新闻内容"
          />
        </el-form-item>

        <el-form-item label="发布状态" prop="status">
          <el-switch
            v-model="formData.status"
            inline-prompt
            active-text="已发布"
            inactive-text="草稿"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>

        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker
            v-model="formData.publishTime"
            type="datetime"
            placeholder="选择发布时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item class="form-actions">
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ClassAPI from "@/api/system/class.api";
import NewsAPI, { NewsForm } from "@/api/system/notice.api";

const route = useRoute();
const router = useRouter();

const newsFormRef = ref();
const loading = ref(false);
const isEdit = ref(!!route.params.id);

// 表单数据
const formData = reactive<NewsForm>({
  title: "",
  classId: "",
  content: "",
  status: 0,
  publishTime: new Date().toISOString().slice(0, 19).replace("T", " "),
});

// 表单验证规则
const rules = reactive({
  title: [
    { required: true, message: "请输入新闻标题", trigger: "blur" },
    { max: 100, message: "标题长度不能超过100个字符", trigger: "blur" },
  ],
  classId: [{ required: true, message: "请选择所属栏目", trigger: "blur" }],
  content: [{ required: true, message: "请输入新闻内容", trigger: "blur" }],
});

// 栏目选项
const classOptions = ref([]);

// 获取栏目列表
const getClassOptions = async () => {
  try {
    classOptions.value = await ClassAPI.getOptions();
  } catch (error) {
    console.error("获取栏目列表失败", error);
  }
};

// 获取编辑数据
const getEditData = async () => {
  if (isEdit.value && route.params.id) {
    try {
      const data = await NewsAPI.getFormData(route.params.id);
      Object.assign(formData, data);
    } catch (error) {
      console.error("获取新闻详情失败", error);
    }
  }
};

// 提交表单
const handleSubmit = async () => {
  newsFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        if (isEdit.value && route.params.id) {
          await NewsAPI.update(route.params.id, formData);
          ElMessage.success("修改成功");
        } else {
          await NewsAPI.create(formData);
          ElMessage.success("创建成功");
        }
        router.push("/news/list"); // 提交成功后返回列表页
      } catch (error) {
        console.error("提交失败", error);
      } finally {
        loading.value = false;
      }
    }
  });
};

const closeDetailDialog = () => {
  detailDialog.visible = false;
};

const openDetailDialog = async (id: string) => {
  const noticeDetail = await NewsAPI.getDetail(id);
  currentNotice.value = noticeDetail;
  detailDialog.visible = true;
};

onMounted(() => {
  getClassOptions();
  if (isEdit.value) {
    getEditData();
  }
});
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  margin-left: auto;
}

.news-form {
  margin-top: 20px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
}
</style>
