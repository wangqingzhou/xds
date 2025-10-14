<!-- components/DictTag.vue -->
<template>
  <el-tag v-if="label" :type="tagType" :size="size" effect="light">{{ label }}</el-tag>
  <span v-else>{{ modelValue }}</span>
</template>

<script setup lang="ts">
import { useDictStore } from "@/store";

const props = defineProps({
  code: { type: String, required: true },
  modelValue: { type: [String, Number], required: true },
  size: { type: String, default: "small" },
});

const label = ref("");
const tagType = ref("info");
const dictStore = useDictStore();

/**
 * 根据值获取对应的标签类型
 */
const getTagTypeByValue = (value: any): string => {
  // 针对 yesno 字典的特殊处理
  if (props.code === "yesno") {
    // 根据您的字典值配置
    if (value === 1 || value === 20) return "success"; // 是 - 绿色
    if (value === 0 || value === 21) return "danger"; // 否 - 红色
  }

  if (props.code === "status") {
    // 根据您的字典值配置
    if (value === 36) return "success"; // 是 - 绿色
    if (value === 35) return "danger"; // 否 - 红色
  }
  // 针对 sex 字典的特殊处理
  if (props.code === "sex") {
    if (value === 64) return "primary"; // 男 - 蓝色
    if (value === 65) return "danger"; // 女 - 红色
  }

  return "info"; // 默认 - 灰色
};

/**
 * 根据字典项的值获取对应的 label
 */
const getLabelByValue = async (dictCode: string, value: any) => {
  await dictStore.loadDictItems(dictCode);
  const dictItems = dictStore.getDictItems(dictCode);

  let dictItem = null;
  for (const item of dictItems) {
    if (item.children) {
      dictItem = item.children.find((child: any) => child.value == value);
      if (dictItem) break;
    } else if (item.value == value) {
      dictItem = item;
      break;
    }
  }

  return dictItem?.label || ``;
};

/**
 * 更新 label
 */
const updateLabel = async () => {
  if (!props.code || props.modelValue === undefined) return;

  const newLabel = await getLabelByValue(props.code, props.modelValue);
  label.value = newLabel;
  tagType.value = getTagTypeByValue(props.modelValue);
};

// 监听变化
watch(
  [() => props.code, () => props.modelValue],
  async () => {
    if (props.code) {
      await updateLabel();
    }
  },
  { immediate: true }
);
</script>
