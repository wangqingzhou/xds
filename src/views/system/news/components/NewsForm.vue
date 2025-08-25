<!-- src/views/system/news/components/NewsForm.vue -->
<template>
  <div class="app-container">
    <el-card>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="单图上传">
          <SingleImageUpload v-model="formData.picUrl" />
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
          />
        </el-form-item>

        <el-form-item label="文章内容" prop="content">
          <WangEditor v-model="formData.content" />
        </el-form-item>

        <el-form-item v-if="formData.id" label="状态" prop="publishStatus">
          <el-tag v-if="formData.publishStatus == 0" type="info">未发布</el-tag>
          <el-tag v-if="formData.publishStatus == 1" type="success">已发布</el-tag>
          <el-tag v-if="formData.publishStatus == -1" type="warning">已撤回</el-tag>
        </el-form-item>

        <el-form-item>
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

import ClassTree from "./components/ClassTree.vue";
// 以下是必要的组件逻辑
const route = useRoute();
const router = useRouter();
const formRef = ref();
const formData = reactive<NoticeForm>({
  status: 1,
});

const rules = reactive({
  title: [{ required: true, message: "文章标题不能为空", trigger: "blur" }],

  classid: [{ required: true, message: "请选择所属栏目", trigger: "change" }],
  content: [{ required: true, message: "文章内容不能为空", trigger: "blur" }],
});

const classOptions = ref<OptionType[]>();
const roleOptions = ref<OptionType[]>();

async function loadFormData() {
  try {
    const [classes] = await Promise.all([ClassAPI.getOptions()]);

    classOptions.value = classes;
    console.log(route.params.id);
    if (route.params.id) {
      const data = await NoticeAPI.getDetail(route.params.id);
      Object.assign(formData, { ...data });
    }
  } catch (error) {
    ElMessage.error("加载表单数据失败");
    router.back();
  }
}

const handleSubmit = useDebounceFn(() => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        console.log(formData);
        if (formData.id) {
          await NoticeAPI.update(formData.id, formData);
          ElMessage.success("修改成功");
        } else {
          await NoticeAPI.add(formData);
          ElMessage.success("新增成功");
        }
        router.push({ name: "News" });
      } catch (error) {
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
  padding: 20px;
}

.el-card {
  max-width: 800px;
  margin: 0 auto;
}

.el-form {
  padding: 20px;
}
</style>
