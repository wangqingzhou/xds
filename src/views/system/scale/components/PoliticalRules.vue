<template>
  <div class="rule-section">
    <div class="section-header">
      <div class="section-title">政治面貌评分规则</div>
      <el-button type="primary" size="small" @click="$emit('add-rule')">
        <el-icon><Plus /></el-icon>
        添加规则
      </el-button>
    </div>
    <el-table :data="rules" border style="width: 100%">
      <el-table-column prop="condition" label="政治面貌" width="150">
        <template #default="scope">
          <Dict
            v-model="scope.row.condition"
            code="politicalstatus"
            @change="handlePoliticalStatusChange(scope.row)"
          >
            <template #prefix>
              <el-icon class="input-icon"><Flag /></el-icon>
            </template>
          </Dict>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分值" width="100">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.score"
            :min="0"
            :max="100"
            controls-position="right"
            placeholder="分值"
          />
        </template>
      </el-table-column>
      <el-table-column prop="formula" label="计算公式" width="300">
        <template #default="scope">
          <div class="formula-cell">
            <el-select
              v-model="scope.row.formulaType"
              placeholder="公式类型"
              style="width: 120px"
              @change="handleFormulaTypeChange(scope.row)"
            >
              <el-option label="IF条件" value="if" />
              <el-option label="直接赋值" value="direct" />
            </el-select>
            <el-input
              v-model="scope.row.formula"
              placeholder="请输入计算公式"
              style="margin-left: 8px; flex: 1"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="评分说明">
        <template #default="scope">
          <el-input v-model="scope.row.description" placeholder="请输入评分说明" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="danger" size="small" @click="$emit('remove-rule', scope.$index)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { Flag } from "@element-plus/icons-vue";
import Dict from "@/components/Dict/index.vue";
// 定义props
defineProps({
  rules: {
    type: Array,
    required: true,
  },
});
// 定义emits
defineEmits(["add-rule", "remove-rule"]);
// 处理政治面貌变化
const handlePoliticalStatusChange = (row) => {
  // 根据选择的政治面貌自动设置对应的公式
  switch (row.condition) {
    case "communist": // 中共党员
      row.score = 15;
      row.formula = 'IF(政治面貌 == "中共党员", 15, 0)';
      row.description = "需提供党组织盖章的党员证明";
      break;
    case "probationary": // 中共预备党员
      row.score = 12;
      row.formula = 'IF(政治面貌 == "中共预备党员", 12, 0)';
      row.description = "需提供党组织盖章的预备党员证明";
      break;
    case "league": // 共青团员
      row.score = 8;
      row.formula = 'IF(政治面貌 == "共青团员", 8, 0)';
      row.description = "需提供团组织证明";
      break;
    default: // 其他
      row.score = 5;
      row.formula = 'IF(政治面貌 NOT IN ("中共党员", "中共预备党员", "共青团员"), 5, 0)';
      row.description = "群众或其他政治面貌";
      break;
  }
};
// 处理公式类型变化
const handleFormulaTypeChange = (row) => {
  // 根据公式类型设置默认公式
  switch (row.formulaType) {
    case "if":
      row.formula = "IF(条件, 值, 0)";
      break;
    case "direct":
      row.formula = "值";
      break;
  }
};
</script>
<style scoped>
.rule-section {
  margin-bottom: 20px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.formula-cell {
  display: flex;
  align-items: center;
}
.input-icon {
  color: #409eff;
  margin-right: 5px;
}
</style>
