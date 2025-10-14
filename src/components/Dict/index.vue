<template>
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

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
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
});

const emit = defineEmits(["update:modelValue"]);

// 存储最终用于下拉框的选项（只包含 children）
const options = ref<Array<{ label: string; value: string | number }>>([]);

const selectedValue = ref<any>(
  typeof props.modelValue === "string" || typeof props.modelValue === "number"
    ? props.modelValue
    : Array.isArray(props.modelValue)
      ? props.modelValue
      : undefined
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
  },
  { immediate: true }
);

function handleChange(val: any) {
  emit("update:modelValue", val);
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
});
</script>
