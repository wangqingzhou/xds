<template>
  <div class="score-rules-container">
    <el-card class="score-rules-card">
      <template #header>
        <div class="card-header">
          <el-icon class="blue-icon"><Trophy /></el-icon>
          <span class="card-title">选调生评分规则量表</span>
          <div class="header-actions">
            <el-button type="primary" :loading="saving" @click="saveRules">
              <el-icon><Check /></el-icon>
              保存规则
            </el-button>
            <el-button :loading="resetting" @click="resetRules">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </div>
        </div>
      </template>
      <div class="rules-tabs">
        <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
          <!-- 学习成绩评分规则 -->
          <el-tab-pane label="学习成绩 (40分)" name="academic">
            <div class="rule-section">
              <div class="section-header">
                <div class="section-title">学习成绩评分规则</div>
                <el-button type="primary" size="small" @click="addRule('academic')">
                  <el-icon><Plus /></el-icon>
                  添加规则
                </el-button>
              </div>
              <el-table :data="academicRules" border style="width: 100%">
                <el-table-column prop="condition" label="评分条件" width="200">
                  <template #default="scope">
                    <el-input v-model="scope.row.condition" placeholder="请输入评分条件" />
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
                        <el-option label="范围判断" value="range" />
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
                    <el-button
                      type="danger"
                      size="small"
                      @click="removeRule('academic', scope.$index)"
                    >
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <!-- 政治面貌评分规则 -->
          <el-tab-pane label="政治面貌 (15分)" name="political">
            <div class="rule-section">
              <div class="section-header">
                <div class="section-title">政治面貌评分规则</div>
                <el-button type="primary" size="small" @click="addRule('political')">
                  <el-icon><Plus /></el-icon>
                  添加规则
                </el-button>
              </div>
              <el-table :data="politicalRules" border style="width: 100%">
                <el-table-column prop="condition" label="政治面貌" width="220">
                  <template #default="scope">
                    <div class="dict-select-container">
                      <Dict
                        v-model="scope.row.condition"
                        code="politicalstatus"
                        class="political-dict"
                        popper-class="political-dict-popper"
                        @change="handlePoliticalStatusChange(scope.row)"
                      >
                        <template #prefix>
                          <el-icon class="input-icon"><Flag /></el-icon>
                        </template>
                      </Dict>
                    </div>
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
                    <el-button
                      type="danger"
                      size="small"
                      @click="removeRule('political', scope.$index)"
                    >
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <!-- 学生干部经历评分规则 -->
          <el-tab-pane label="学生干部经历 (15分)" name="cadre">
            <div class="rule-section">
              <div class="section-header">
                <div class="section-title">学生干部经历评分规则</div>
                <el-button type="primary" size="small" @click="addRule('cadre')">
                  <el-icon><Plus /></el-icon>
                  添加规则
                </el-button>
              </div>
              <el-table :data="cadreRules" border style="width: 100%">
                <el-table-column prop="condition" label="职务级别" width="200">
                  <template #default="scope">
                    <el-input v-model="scope.row.condition" placeholder="请输入职务级别" />
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
                    <el-button
                      type="danger"
                      size="small"
                      @click="removeRule('cadre', scope.$index)"
                    >
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <!-- 获奖情况评分规则 -->
          <el-tab-pane label="获奖情况 (20分)" name="award">
            <div class="rule-section">
              <div class="section-header">
                <div class="section-title">获奖情况评分规则</div>
                <el-button type="primary" size="small" @click="addRule('award')">
                  <el-icon><Plus /></el-icon>
                  添加规则
                </el-button>
              </div>
              <el-table :data="awardRules" border style="width: 100%">
                <el-table-column prop="condition" label="奖项级别" width="150">
                  <template #default="scope">
                    <el-input v-model="scope.row.condition" placeholder="请输入奖项级别" />
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
                    <el-button
                      type="danger"
                      size="small"
                      @click="removeRule('award', scope.$index)"
                    >
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <!-- 参军入伍经历评分规则 -->
          <el-tab-pane label="参军入伍经历 (10分)" name="military">
            <div class="rule-section">
              <div class="section-header">
                <div class="section-title">参军入伍经历评分规则</div>
                <el-button type="primary" size="small" @click="addRule('military')">
                  <el-icon><Plus /></el-icon>
                  添加规则
                </el-button>
              </div>
              <el-table :data="militaryRules" border style="width: 100%">
                <el-table-column prop="condition" label="参军经历" width="150">
                  <template #default="scope">
                    <el-input v-model="scope.row.condition" placeholder="请输入参军经历" />
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
                    <el-button
                      type="danger"
                      size="small"
                      @click="removeRule('military', scope.$index)"
                    >
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 总分计算公式 -->
      <div class="total-score-section">
        <div class="total-header">
          <div class="total-title">总分计算公式</div>
          <el-button type="primary" size="small" @click="editTotalFormula">
            <el-icon><Edit /></el-icon>
            编辑公式
          </el-button>
        </div>
        <div class="formula-box">
          <div class="formula-item">
            <span class="formula-label">总分 =</span>
            <span class="formula-content">{{ totalFormula }}</span>
          </div>
        </div>
      </div>
      <!-- 变量定义 -->
      <div class="variables-section">
        <div class="variables-header">
          <el-icon class="variables-icon"><InfoFilled /></el-icon>
          <span>变量定义</span>
          <el-button type="primary" size="small" @click="addVariable">
            <el-icon><Plus /></el-icon>
            添加变量
          </el-button>
        </div>
        <div class="variables-content">
          <div v-for="(variable, index) in variables" :key="index" class="variable-item">
            <el-input v-model="variable.name" placeholder="变量名" style="width: 150px" />
            <span class="equal-sign">=</span>
            <el-input v-model="variable.formula" placeholder="变量公式" style="flex: 1" />
            <el-button type="danger" size="small" @click="removeVariable(index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      <!-- 评分说明 -->
      <div class="score-notes">
        <div class="notes-header">
          <el-icon class="notes-icon"><InfoFilled /></el-icon>
          <span>评分说明</span>
        </div>
        <ul class="notes-list">
          <li>各项得分需提供相应证明材料，无证明材料不得分</li>
          <li>学习成绩需提供教务处盖章的成绩单和专业排名证明</li>
          <li>政治面貌需提供党组织盖章的党员证明</li>
          <li>学生干部经历需提供学校或学院盖章的任职证明</li>
          <li>获奖情况需提供获奖证书原件或复印件</li>
          <li>参军入伍经历需提供相关部门盖章的证明材料</li>
          <li>所有证明材料需确认真实性，如有虚假取消资格</li>
          <li>系统将根据输入数据自动计算得分，无需人工计算</li>
        </ul>
      </div>
    </el-card>
    <!-- 编辑总分公式对话框 -->
    <el-dialog v-model="showFormulaDialog" title="编辑总分计算公式" width="50%">
      <el-input
        v-model="editingFormula"
        type="textarea"
        :rows="4"
        placeholder="请输入总分计算公式"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showFormulaDialog = false">取消</el-button>
          <el-button type="primary" @click="saveTotalFormula">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Trophy,
  InfoFilled,
  Plus,
  Delete,
  Check,
  Refresh,
  Edit,
  Flag,
} from "@element-plus/icons-vue";
import Dict from "@/components/Dict/index.vue";
import ScoreRulesAPI, {
  ScoreRulesConfig,
  ScoreRulesConfigForm,
  VariableVO,
  VariableForm,
  TotalFormulaForm,
} from "@/api/system/scoreRules.api";

// 当前激活的标签页
const activeTab = ref("academic");

// 保存和重置状态
const saving = ref(false);
const resetting = ref(false);

// 总分计算公式
const totalFormula = ref(
  "学习成绩得分 + 政治面貌得分 + 学生干部经历得分 + 获奖情况得分 + 参军入伍经历得分"
);
const editingFormula = ref("");
const showFormulaDialog = ref(false);

// 变量定义
const variables = ref<VariableVO[]>([
  { name: "排名百分比", formula: "(专业排名 / 专业总人数) × 100%" },
  { name: "不及格课程数", formula: "成绩单中不及格课程数量" },
  { name: "政治面貌", formula: "党员证明中的政治面貌" },
  { name: "职务级别", formula: "学生干部证明中的职务级别" },
  { name: "奖项级别", formula: "获奖证书中的最高奖项级别" },
  { name: "参军经历", formula: "参军入伍证明中的经历（是/否）" },
]);

// 学习成绩评分规则
const academicRules = ref([
  {
    condition: "专业排名前5%",
    score: 40,
    formulaType: "if",
    formula: "IF(排名百分比 <= 5%, 40, 0)",
    description: "需提供教务处盖章的专业排名证明",
  },
  {
    condition: "专业排名前6%-10%",
    score: 35,
    formulaType: "range",
    formula: "IF(排名百分比 > 5% AND 排名百分比 <= 10%, 35, 0)",
    description: "需提供教务处盖章的专业排名证明",
  },
  {
    condition: "专业排名前11%-20%",
    score: 30,
    formulaType: "range",
    formula: "IF(排名百分比 > 10% AND 排名百分比 <= 20%, 30, 0)",
    description: "需提供教务处盖章的专业排名证明",
  },
  {
    condition: "专业排名前21%-30%",
    score: 25,
    formulaType: "range",
    formula: "IF(排名百分比 > 20% AND 排名百分比 <= 30%, 25, 0)",
    description: "需提供教务处盖章的专业排名证明",
  },
  {
    condition: "专业排名前31%-50%",
    score: 20,
    formulaType: "range",
    formula: "IF(排名百分比 > 30% AND 排名百分比 <= 50%, 20, 0)",
    description: "需提供教务处盖章的专业排名证明",
  },
  {
    condition: "专业排名51%以后",
    score: 15,
    formulaType: "if",
    formula: "IF(排名百分比 > 50%, 15, 0)",
    description: "需提供教务处盖章的专业排名证明",
  },
  {
    condition: "无不及格课程",
    score: 5,
    formulaType: "if",
    formula: "IF(不及格课程数 == 0, 5, 0)",
    description: "额外加分，需在成绩单中体现",
  },
]);

// 政治面貌评分规则
const politicalRules = ref([
  {
    condition: "communist", // 中共党员
    score: 15,
    formulaType: "if",
    formula: 'IF(政治面貌 == "中共党员", 15, 0)',
    description: "需提供党组织盖章的党员证明",
  },
  {
    condition: "probationary", // 中共预备党员
    score: 12,
    formulaType: "if",
    formula: 'IF(政治面貌 == "中共预备党员", 12, 0)',
    description: "需提供党组织盖章的预备党员证明",
  },
  {
    condition: "league", // 共青团员
    score: 8,
    formulaType: "if",
    formula: 'IF(政治面貌 == "共青团员", 8, 0)',
    description: "需提供团组织证明",
  },
  {
    condition: "other", // 其他
    score: 5,
    formulaType: "if",
    formula: 'IF(政治面貌 NOT IN ("中共党员", "中共预备党员", "共青团员"), 5, 0)',
    description: "群众或其他政治面貌",
  },
]);

// 学生干部经历评分规则
const cadreRules = ref([
  {
    condition: "校级学生会主席/副主席",
    score: 15,
    formulaType: "if",
    formula: 'IF(职务级别 == "校级学生会主席/副主席", 15, 0)',
    description: "需提供学校盖章的任职证明",
  },
  {
    condition: "院级学生会主席/副主席",
    score: 12,
    formulaType: "if",
    formula: 'IF(职务级别 == "院级学生会主席/副主席", 12, 0)',
    description: "需提供学院盖章的任职证明",
  },
  {
    condition: "校级学生会部长/班长",
    score: 10,
    formulaType: "if",
    formula: 'IF(职务级别 == "校级学生会部长/班长", 10, 0)',
    description: "需提供学校或学院盖章的任职证明",
  },
  {
    condition: "院级学生会部长/团支书",
    score: 8,
    formulaType: "if",
    formula: 'IF(职务级别 == "院级学生会部长/团支书", 8, 0)',
    description: "需提供学院盖章的任职证明",
  },
  {
    condition: "其他学生干部",
    score: 5,
    formulaType: "if",
    formula: 'IF(职务级别 == "其他学生干部", 5, 0)',
    description: "需提供学校或学院盖章的任职证明",
  },
  {
    condition: "无学生干部经历",
    score: 0,
    formulaType: "direct",
    formula: "0",
    description: "无相关经历",
  },
]);

// 获奖情况评分规则
const awardRules = ref([
  {
    condition: "国家级奖项",
    score: 20,
    formulaType: "if",
    formula: 'IF(奖项级别 == "国家级", 20, 0)',
    description: "需提供获奖证书原件或复印件",
  },
  {
    condition: "省级奖项",
    score: 15,
    formulaType: "if",
    formula: 'IF(奖项级别 == "省级", 15, 0)',
    description: "需提供获奖证书原件或复印件",
  },
  {
    condition: "市级奖项",
    score: 10,
    formulaType: "if",
    formula: 'IF(奖项级别 == "市级", 10, 0)',
    description: "需提供获奖证书原件或复印件",
  },
  {
    condition: "校级一等奖",
    score: 8,
    formulaType: "if",
    formula: 'IF(奖项级别 == "校级一等奖", 8, 0)',
    description: "需提供获奖证书原件或复印件",
  },
  {
    condition: "校级二等奖",
    score: 5,
    formulaType: "if",
    formula: 'IF(奖项级别 == "校级二等奖", 5, 0)',
    description: "需提供获奖证书原件或复印件",
  },
  {
    condition: "校级三等奖",
    score: 3,
    formulaType: "if",
    formula: 'IF(奖项级别 == "校级三等奖", 3, 0)',
    description: "需提供获奖证书原件或复印件",
  },
  {
    condition: "无获奖",
    score: 0,
    formulaType: "direct",
    formula: "0",
    description: "无相关奖项",
  },
]);

// 参军入伍经历评分规则
const militaryRules = ref([
  {
    condition: "有参军入伍经历",
    score: 10,
    formulaType: "if",
    formula: 'IF(参军经历 == "是", 10, 0)',
    description: "需提供相关部门盖章的证明材料",
  },
  {
    condition: "无参军入伍经历",
    score: 0,
    formulaType: "direct",
    formula: "0",
    description: "无相关经历",
  },
]);

// 处理标签页切换
const handleTabClick = () => {
  // 可以在这里添加切换标签页时的逻辑
};

// 添加规则
const addRule = (type: string) => {
  const newRule = {
    condition: "",
    score: 0,
    formulaType: "if",
    formula: "",
    description: "",
  };

  switch (type) {
    case "academic":
      academicRules.value.push(newRule);
      break;
    case "political":
      politicalRules.value.push(newRule);
      break;
    case "cadre":
      cadreRules.value.push(newRule);
      break;
    case "award":
      awardRules.value.push(newRule);
      break;
    case "military":
      militaryRules.value.push(newRule);
      break;
  }
};

// 删除规则
const removeRule = (type: string, index: number) => {
  ElMessageBox.confirm("确定要删除这条规则吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      switch (type) {
        case "academic":
          academicRules.value.splice(index, 1);
          break;
        case "political":
          politicalRules.value.splice(index, 1);
          break;
        case "cadre":
          cadreRules.value.splice(index, 1);
          break;
        case "award":
          awardRules.value.splice(index, 1);
          break;
        case "military":
          militaryRules.value.splice(index, 1);
          break;
      }
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

// 处理公式类型变化
const handleFormulaTypeChange = (row: any) => {
  // 根据公式类型设置默认公式
  switch (row.formulaType) {
    case "if":
      row.formula = "IF(条件, 值, 0)";
      break;
    case "range":
      row.formula = "IF(条件1 AND 条件2, 值, 0)";
      break;
    case "direct":
      row.formula = "值";
      break;
  }
};

// 处理政治面貌变化
const handlePoliticalStatusChange = (row: any) => {
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

// 保存规则
const saveRules = async () => {
  saving.value = true;
  try {
    // 构建要保存的数据
    const dataToSave: ScoreRulesConfigForm = {
      academic: academicRules.value,
      political: politicalRules.value,
      cadre: cadreRules.value,
      award: awardRules.value,
      military: militaryRules.value,
      totalFormula: totalFormula.value,
      variables: variables.value,
    };

    // 调用API保存规则
    const response = await ScoreRulesAPI.saveConfig(dataToSave);

    // 显示成功消息
    ElMessage.success("规则保存成功");
    console.log("保存响应:", response);
  } catch (error: any) {
    // 显示错误消息
    ElMessage.error("规则保存失败: " + (error.message || "未知错误"));
    console.error("保存错误:", error);
  } finally {
    saving.value = false;
  }
};

// 重置规则
const resetRules = async () => {
  ElMessageBox.confirm("确定要重置所有规则吗？此操作不可恢复。", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      resetting.value = true;
      try {
        // 调用API重置规则
        const response = await ScoreRulesAPI.resetConfig();

        // 重新加载页面或数据
        location.reload();

        // 显示成功消息
        ElMessage.success("规则重置成功");
      } catch (error: any) {
        // 显示错误消息
        ElMessage.error("规则重置失败: " + (error.message || "未知错误"));
        console.error("重置错误:", error);
      } finally {
        resetting.value = false;
      }
    })
    .catch(() => {});
};

// 编辑总分公式
const editTotalFormula = () => {
  editingFormula.value = totalFormula.value;
  showFormulaDialog.value = true;
};

// 保存总分公式
const saveTotalFormula = async () => {
  try {
    // 构建要保存的数据
    const dataToSave: TotalFormulaForm = {
      formula: editingFormula.value,
    };

    // 调用API更新总分公式
    const response = await ScoreRulesAPI.updateTotalFormula(dataToSave);

    // 更新本地数据
    totalFormula.value = editingFormula.value;
    showFormulaDialog.value = false;

    // 显示成功消息
    ElMessage.success("总分公式保存成功");
  } catch (error: any) {
    // 显示错误消息
    ElMessage.error("总分公式保存失败: " + (error.message || "未知错误"));
    console.error("保存错误:", error);
  }
};

// 添加变量
const addVariable = () => {
  variables.value.push({
    name: "",
    formula: "",
  });
};

// 删除变量
const removeVariable = (index: number) => {
  variables.value.splice(index, 1);
};

// 加载已保存的规则
const loadSavedRules = async () => {
  try {
    // 调用API获取规则
    const response = await ScoreRulesAPI.getConfig();

    // 更新组件数据
    if (response.data) {
      academicRules.value = response.data.academic || [];
      politicalRules.value = response.data.political || [];
      cadreRules.value = response.data.cadre || [];
      awardRules.value = response.data.award || [];
      militaryRules.value = response.data.military || [];
      totalFormula.value =
        response.data.totalFormula ||
        "学习成绩得分 + 政治面貌得分 + 学生干部经历得分 + 获奖情况得分 + 参军入伍经历得分";
      variables.value = response.data.variables || [];
    }
  } catch (error: any) {
    console.error("加载规则失败:", error);
    // 如果是首次加载，没有保存的规则，使用默认值
  }
};

onMounted(() => {
  // 组件挂载时加载已保存的规则
  loadSavedRules();
});
</script>

<style scoped>
/* 样式保持不变 */
.score-rules-container {
  padding: 20px;
  background-color: #f5f7fa;
}
.score-rules-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title {
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
  color: #303133;
}
.blue-icon {
  color: #409eff;
  font-size: 20px;
}
.header-actions {
  display: flex;
  gap: 10px;
}
.rules-tabs {
  margin-top: 20px;
}
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
/* 政治面貌下拉框样式 */
.dict-select-container {
  width: 100%;
}
.political-dict {
  width: 100%;
}
/* 全局样式，确保下拉框能够完整显示 */
:deep(.political-dict-popper) {
  z-index: 3000 !important;
  min-width: 220px !important;
}
.total-score-section {
  margin-top: 30px;
  padding: 15px;
  background-color: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}
.total-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.total-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.formula-box {
  padding: 10px;
  background-color: #fff;
  border-radius: 6px;
}
.formula-item {
  display: flex;
  align-items: center;
}
.formula-label {
  font-weight: bold;
  color: #606266;
  min-width: 80px;
}
.formula-content {
  flex: 1;
  color: #303133;
  font-family: monospace;
  background-color: #f5f7fa;
  padding: 8px 12px;
  border-radius: 4px;
}
.variables-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}
.variables-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-weight: bold;
  color: #303133;
}
.variables-icon {
  color: #409eff;
  margin-right: 8px;
}
.variables-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.variable-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #fff;
  border-radius: 6px;
}
.equal-sign {
  margin: 0 10px;
  color: #606266;
  font-weight: bold;
}
.score-notes {
  margin-top: 20px;
  padding: 15px;
  background-color: #fdf6ec;
  border-radius: 8px;
  border-left: 4px solid #e6a23c;
}
.notes-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
  color: #303133;
}
.notes-icon {
  color: #e6a23c;
  margin-right: 8px;
}
.notes-list {
  padding-left: 25px;
}
.notes-list li {
  margin-bottom: 8px;
  color: #606266;
  line-height: 1.5;
}
/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 6px;
  overflow: hidden;
}
:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: bold;
}
:deep(.el-table td) {
  padding: 8px 0;
}
:deep(.el-table .cell) {
  padding: 0 10px;
}
/* 下拉框样式优化 */
:deep(.el-select) {
  width: 100%;
}
:deep(.el-input__inner) {
  height: 32px;
}
:deep(.el-select-dropdown) {
  max-width: 300px;
}
:deep(.el-select-dropdown__item) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 响应式布局 */
@media (max-width: 768px) {
  .formula-cell {
    flex-direction: column;
    align-items: stretch;
  }
  .formula-cell .el-select {
    margin-bottom: 8px;
  }
  .variable-item {
    flex-direction: column;
    align-items: stretch;
  }
  .equal-sign {
    margin: 8px 0;
    align-self: center;
  }
}
</style>
