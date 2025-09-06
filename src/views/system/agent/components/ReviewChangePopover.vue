<template>
  <div class="review-change-popover">
    <el-popover
      v-model:visible="visible"
      placement="top"
      width="500"
      trigger="click"
      :close-on-click-outside="false"
    >
      <template #reference>
        <button class="review-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          查看修改
          <span v-if="changeCount > 0" class="change-badge">{{ changeCount }}</span>
        </button>
      </template>

      <div class="popover-content">
        <div class="popover-header">
          <h3>AI 修改建议</h3>
          <p class="subtitle">共 {{ changeCount }} 处修改</p>
        </div>

        <div v-if="changeCount > 0" class="changes-list">
          <div v-for="(change, index) in changes" :key="index" class="change-item">
            <div class="change-type" :class="change.type">
              {{ change.type === "addition" ? "新增" : "删除" }}
            </div>

            <div class="change-content">
              <div v-if="change.type === 'deletion'" class="original-content">
                <span class="label">原内容:</span>
                <pre>{{ change.original }}</pre>
              </div>

              <div v-if="change.type === 'addition'" class="new-content">
                <span class="label">新内容:</span>
                <pre>{{ change.new }}</pre>
              </div>

              <div v-if="change.type === 'modification'" class="modified-content">
                <span class="label">原内容:</span>
                <pre>{{ change.original }}</pre>
                <span class="label">修改为:</span>
                <pre>{{ change.new }}</pre>
              </div>
            </div>

            <div class="change-actions">
              <button class="action-btn accept" @click="handleAcceptChange(index)">接受</button>
              <button class="action-btn reject" @click="handleRejectChange(index)">拒绝</button>
            </div>
          </div>
        </div>

        <div v-else class="no-changes">没有待处理的修改建议</div>

        <div class="popover-actions">
          <button class="btn bulk-action" :disabled="changeCount === 0" @click="handleAcceptAll">
            接受全部
          </button>
          <button
            class="btn bulk-action destructive"
            :disabled="changeCount === 0"
            @click="handleRejectAll"
          >
            拒绝全部
          </button>
          <button class="btn close-btn" @click="visible = false">关闭</button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, inject, watch, defineProps, defineEmits } from "vue";
import { ElMessage } from "element-plus";

// 组件属性
const props = defineProps({
  // 控制弹出框是否可见
  modelValue: {
    type: Boolean,
    default: false,
  },
});

// 组件事件
const emit = defineEmits(["update:modelValue", "changeApplied", "changeRejected"]);

// 状态管理
const visible = ref(props.modelValue);
const changes = ref([]);
const changeCount = ref(0);

// 从上下文获取编辑器和AI代理
const { editor, provider } = inject("AiAgentContext");

// 监听可见性变化
watch(
  () => visible.value,
  (newValue) => {
    emit("update:modelValue", newValue);
  }
);

// 监听父组件的可见性变化
watch(
  () => props.modelValue,
  (newValue) => {
    visible.value = newValue;
  }
);

// 监听AI代理的修改建议
watch(
  () => provider?.changes,
  (newChanges) => {
    if (newChanges) {
      changes.value = [...newChanges];
      changeCount.value = newChanges.length;
    }
  },
  { immediate: true }
);

// 接受单个修改
const handleAcceptChange = (index) => {
  if (!provider || !editor) return;

  const change = changes.value[index];

  try {
    // 应用修改到编辑器
    provider.applyChange(change);

    // 从列表中移除该修改
    changes.value.splice(index, 1);
    changeCount.value = changes.value.length;

    // 通知父组件
    emit("changeApplied", change);
    ElMessage.success("已接受修改");
  } catch (error) {
    console.error("应用修改失败:", error);
    ElMessage.error("应用修改失败");
  }
};

// 拒绝单个修改
const handleRejectChange = (index) => {
  if (!provider) return;

  const change = changes.value[index];

  try {
    // 记录拒绝的修改
    provider.rejectChange(change);

    // 从列表中移除该修改
    changes.value.splice(index, 1);
    changeCount.value = changes.value.length;

    // 通知父组件
    emit("changeRejected", change);
    ElMessage.info("已拒绝修改");
  } catch (error) {
    console.error("拒绝修改失败:", error);
    ElMessage.error("操作失败");
  }
};

// 接受所有修改
const handleAcceptAll = () => {
  if (!provider || !editor || changeCount.value === 0) return;

  try {
    // 应用所有修改
    provider.applyAllChanges(changes.value);

    // 清空修改列表
    changes.value = [];
    changeCount.value = 0;

    emit("changeApplied", null); // null 表示全部应用
    ElMessage.success("已接受所有修改");
  } catch (error) {
    console.error("应用所有修改失败:", error);
    ElMessage.error("应用所有修改失败");
  }
};

// 拒绝所有修改
const handleRejectAll = () => {
  if (!provider || changeCount.value === 0) return;

  try {
    // 记录所有拒绝的修改
    provider.rejectAllChanges(changes.value);

    // 清空修改列表
    changes.value = [];
    changeCount.value = 0;

    emit("changeRejected", null); // null 表示全部拒绝
    ElMessage.info("已拒绝所有修改");
  } catch (error) {
    console.error("拒绝所有修改失败:", error);
    ElMessage.error("操作失败");
  }
};
</script>

<style scoped lang="scss">
.review-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  background-color: #f5f7fa;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #eef2f7;
    border-color: #409eff;
    color: #409eff;
  }
}

.change-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  background-color: #409eff;
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.popover-content {
  padding: 12px;
}

.popover-header {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;

  h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
  }

  .subtitle {
    margin: 0;
    color: #666;
    font-size: 13px;
  }
}

.changes-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.change-item {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  background-color: #f9fafb;
  border: 1px solid #f0f2f5;

  &:last-child {
    margin-bottom: 0;
  }
}

.change-type {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;

  &.addition {
    background-color: #f0fdf4;
    color: #166534;
  }

  &.deletion {
    background-color: #fef2f2;
    color: #b91c1c;
  }

  &.modification {
    background-color: #f0f9ff;
    color: #0369a1;
  }
}

.change-content {
  margin-bottom: 10px;
  font-size: 14px;

  .label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
    color: #666;
    font-size: 13px;
  }

  pre {
    margin: 0 0 8px 0;
    padding: 8px;
    border-radius: 4px;
    font-size: 13px;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .original-content pre {
    background-color: #fef2f2;
    border: 1px solid #fee2e2;
  }

  .new-content pre {
    background-color: #f0fdf4;
    border: 1px solid #dcfce7;
  }

  .modified-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.change-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  padding: 4px 10px;
  border-radius: 4px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.accept {
    background-color: #ecfdf5;
    color: #059669;

    &:hover {
      background-color: #d1fae5;
    }
  }

  &.reject {
    background-color: #fee2e2;
    color: #b91c1c;

    &:hover {
      background-color: #fecaca;
    }
  }
}

.no-changes {
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
  background-color: #f9fafb;
  border-radius: 6px;
  margin-bottom: 16px;
}

.popover-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 6px 16px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.bulk-action {
    background-color: #ecf2ff;
    color: #165dff;
    border-color: #d9e8ff;

    &:hover {
      background-color: #d9e8ff;
    }

    &.destructive {
      background-color: #fff1f0;
      color: #cf1322;
      border-color: #ffe8e6;

      &:hover {
        background-color: #ffe8e6;
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        background-color: inherit;
      }
    }
  }

  &.close-btn {
    background-color: #f5f7fa;
    color: #666;
    border-color: #e5e7eb;

    &:hover {
      background-color: #eef2f7;
    }
  }
}
</style>
