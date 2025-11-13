<!-- components/DictLabel.vue -->
<template>
  <span v-if="isEmptyValue">-</span>
  <span v-else>{{ displayText }}</span>
</template>

<script setup lang="ts">
import { useDictStore } from "@/store";

const props = defineProps({
  code: { type: String, required: true },
  modelValue: { type: [String, Number], required: true },
});

const displayText = ref("");
const dictStore = useDictStore();

// 检查是否为空值
const isEmptyValue = computed(() => {
  return (
    props.modelValue === 0 ||
    props.modelValue === null ||
    props.modelValue === undefined ||
    props.modelValue === ""
  );
});

/**
 * 根据字典项的值获取对应的 label
 */
const getLabelByValue = async (dictCode: string, value: any) => {
  // 如果是空值，直接返回空字符串
  if (value === 0 || value === null || value === undefined || value === "") {
    return "";
  }

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
 * 更新显示文本
 */
const updateDisplayText = async () => {
  if (!props.code || props.modelValue === undefined) return;

  const newText = await getLabelByValue(props.code, props.modelValue);
  displayText.value = newText;
};

// 监听变化
watch(
  [() => props.code, () => props.modelValue],
  async () => {
    if (props.code) {
      await updateDisplayText();
    }
  },
  { immediate: true }
);
</script>
