<template>
  <!-- 普通字典选择器 -->
  <template v-if="!isSpecialCategory">
    <el-select
      v-if="type === 'select'"
      v-model="selectedValue"
      :placeholder="placeholder"
      :disabled="disabled"
      clearable
      :style="style"
      @change="handleChange"
    >
      <el-option
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>

    <el-radio-group
      v-else-if="type === 'radio'"
      v-model="selectedValue"
      :disabled="disabled"
      :style="style"
      @change="handleChange"
    >
      <el-radio v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </el-radio>
    </el-radio-group>

    <el-checkbox-group
      v-else-if="type === 'checkbox'"
      v-model="selectedValue"
      :disabled="disabled"
      :style="style"
      @change="handleChange"
    >
      <el-checkbox v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </el-checkbox>
    </el-checkbox-group>
  </template>

  <!-- 特殊分类：知识产权和发表文章（带数量输入） -->
  <template v-else>
    <div class="special-category">
      <!-- 选择器部分 -->
      <div class="selection-section">
        <el-checkbox-group
          v-if="type === 'checkbox'"
          v-model="selectedValue"
          :disabled="disabled"
          @change="handleSelectionChange"
        >
          <el-checkbox v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
          </el-checkbox>
        </el-checkbox-group>

        <el-select
          v-else
          v-model="selectedValue"
          :placeholder="placeholder"
          :disabled="disabled"
          clearable
          :style="style"
          @change="handleSelectionChange"
        >
          <el-option
            v-for="option in options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>

      <!-- 数量输入部分 -->
      <div v-if="showCountInput" class="count-section">
        <div class="count-title">数量统计</div>
        <div class="count-inputs">
          <div v-for="option in selectedOptions" :key="option.value" class="count-item">
            <span class="count-label">{{ option.label }}数量：</span>
            <el-input-number
              v-model="countValues[option.value]"
              :min="0"
              :max="99"
              controls-position="right"
              size="small"
              :disabled="disabled"
              placeholder="0"
              @change="handleCountChange"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useDictStore } from "@/store";

const dictStore = useDictStore();

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number, Array],
    required: false,
  },
  type: {
    type: String,
    default: "select",
    validator: (value: string) => ["select", "radio", "checkbox"].includes(value),
  },
  placeholder: {
    type: String,
    default: "请选择",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  style: {
    type: Object,
    default: () => ({
      width: "300px",
    }),
  },
  // 新增：是否显示数量输入
  showCount: {
    type: Boolean,
    default: false,
  },
  // 新增：外部传入的数量数据
  externalCounts: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "countChange"]);

// 存储最终用于下拉框的选项（只包含 children）
const options = ref<Array<{ label: string; value: string | number }>>([]);

// 数量值存储
const countValues = ref<Record<string | number, number>>({});

const selectedValue = ref<any>(
  typeof props.modelValue === "string" || typeof props.modelValue === "number"
    ? props.modelValue
    : Array.isArray(props.modelValue)
      ? props.modelValue
      : undefined
);

// 计算属性：判断是否为特殊分类
const isSpecialCategory = computed(() => {
  return props.showCount && (props.code === "ip_type" || props.code === "article_type");
});

// 计算属性：是否显示数量输入区域
const showCountInput = computed(() => {
  if (!isSpecialCategory.value) return false;
  if (props.type === "checkbox") {
    return Array.isArray(selectedValue.value) && selectedValue.value.length > 0;
  } else {
    return selectedValue.value !== undefined && selectedValue.value !== "";
  }
});

// 计算属性：选中的选项
const selectedOptions = computed(() => {
  if (!isSpecialCategory.value) return [];

  if (props.type === "checkbox" && Array.isArray(selectedValue.value)) {
    return options.value.filter((option) => selectedValue.value.includes(option.value));
  } else {
    const selectedOption = options.value.find((option) => option.value === selectedValue.value);
    return selectedOption ? [selectedOption] : [];
  }
});

// 监听外部数量数据变化
watch(
  () => props.externalCounts,
  (newCounts) => {
    if (isSpecialCategory.value && newCounts) {
      // 合并外部数量数据
      Object.keys(newCounts).forEach((key) => {
        const countValue = newCounts[key];
        if (countValue !== undefined && countValue !== null) {
          countValues.value[key] = Number(countValue);
        }
      });

      // 触发一次数量变化事件，确保父组件知道当前的数量状态
      emitCountChange();
    }
  },
  { deep: true, immediate: true }
);

// 监听 modelValue 和 options 变化
watch(
  [() => props.modelValue, () => options.value],
  ([newValue, newOptions]) => {
    if (newOptions.length > 0 && newValue !== undefined) {
      if (props.type === "checkbox") {
        selectedValue.value = Array.isArray(newValue) ? newValue : [];
      } else {
        const matchedOption = newOptions.find(
          (option) => String(option.value) === String(newValue)
        );
        selectedValue.value = matchedOption?.value ?? undefined;
      }
    } else {
      selectedValue.value = undefined;
    }

    // 初始化数量值
    if (isSpecialCategory.value && newOptions.length > 0) {
      newOptions.forEach((option) => {
        if (!(option.value in countValues.value)) {
          countValues.value[option.value] = 0;
        }
      });

      // 如果有外部数量数据，应用它们
      if (props.externalCounts) {
        Object.keys(props.externalCounts).forEach((key) => {
          const countValue = props.externalCounts[key];
          if (countValue !== undefined && countValue !== null) {
            countValues.value[key] = Number(countValue);
          }
        });
      }
    }
  },
  { immediate: true }
);

function handleChange(val: any) {
  emit("update:modelValue", val);
}

function handleSelectionChange(val: any) {
  emit("update:modelValue", val);

  // 特殊分类：选择变化时触发数量变化事件
  if (isSpecialCategory.value) {
    emitCountChange();
  }
}

function handleCountChange() {
  // 特殊分类：数量变化时触发事件
  if (isSpecialCategory.value) {
    emitCountChange();
  }
}

function emitCountChange() {
  const countData: Record<string | number, number> = {};

  // 收集所有选中项的数量
  selectedOptions.value.forEach((option) => {
    countData[option.value] = countValues.value[option.value] || 0;
  });

  emit("countChange", {
    selected: selectedValue.value,
    counts: countData,
  });
}

// 获取字典数据，并提取 children
onMounted(async () => {
  await dictStore.loadDictItems(props.code);
  const dictData = dictStore.getDictItems(props.code);

  // 关键：提取第一项的 children 作为 options
  if (dictData && dictData.length > 0 && dictData[0].children) {
    options.value = dictData[0].children.map((child: any) => ({
      label: child.label,
      value: child.value,
    }));
  } else {
    // 如果没有 children，fallback 到原始数据（防止异常）
    options.value = dictData
      .map((item: any) => ({
        label: item.label,
        value: item.value,
      }))
      .filter((item: any) => !item.children); // 排除有 children 的父节点
  }

  // 初始化数量值
  if (isSpecialCategory.value) {
    options.value.forEach((option) => {
      // 如果外部有传入数量数据，使用外部数据，否则初始化为0
      if (props.externalCounts && props.externalCounts[option.value] !== undefined) {
        countValues.value[option.value] = Number(props.externalCounts[option.value]);
      } else {
        countValues.value[option.value] = 0;
      }
    });

    // 初始化完成后触发一次数量变化事件
    setTimeout(() => {
      emitCountChange();
    }, 100);
  }
});
</script>
