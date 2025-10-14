<template>
  <div class="app-container">
    <!-- 步骤导航条 -->
    <div class="steps-nav">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="基本信息" :status="stepStatus[0]" @click="scrollToSection('basic-info')" />
        <el-step
          title="学业成绩"
          :status="stepStatus[1]"
          @click="scrollToSection('academic-info')"
        />
        <el-step title="学业奖励" :status="stepStatus[2]" @click="scrollToSection('reward-info')" />
        <el-step
          title="能力素质"
          :status="stepStatus[3]"
          @click="scrollToSection('ability-info')"
        />
        <el-step
          title="面试答辩"
          :status="stepStatus[4]"
          @click="scrollToSection('interview-info')"
        />
        <el-step
          title="身份经历"
          :status="stepStatus[5]"
          @click="scrollToSection('identity-info')"
        />
        <el-step
          title="服务方面"
          :status="stepStatus[6]"
          @click="scrollToSection('service-info')"
        />
        <el-step title="个人技能" :status="stepStatus[7]" @click="scrollToSection('skill-info')" />
      </el-steps>
    </div>

    <div class="main-layout">
      <!-- 左侧表单区域 -->
      <div class="form-container">
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <el-icon class="blue-icon"><Document /></el-icon>
              <span class="card-title">
                信息与电气工程学院申报2026年选调生考试资格量化考核评价表（本科生 试行）
              </span>
            </div>
          </template>
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="120px"
            class="compact-form"
          >
            <!-- 个人基本信息 -->
            <div id="basic-info" class="form-section">
              <div class="section-header">
                <el-icon class="blue-icon"><User /></el-icon>
                <span class="section-title">个人基本信息</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="24" :lg="12">
                  <el-form-item label="姓名" prop="studentName">
                    <el-input
                      v-model="formData.studentName"
                      placeholder="请输入姓名"
                      class="mobile-input"
                      :disabled="!isFieldEditable('normal')"
                      @blur="checkStepCompletion(0)"
                    >
                      <template #prefix>
                        <el-icon class="input-icon"><UserFilled /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24" :lg="12">
                  <el-form-item label="学号" prop="studentId">
                    <el-input
                      v-model="formData.studentId"
                      placeholder="请输入学号"
                      class="mobile-input"
                      :disabled="!isFieldEditable('normal')"
                      @blur="checkStepCompletion(0)"
                    >
                      <template #prefix>
                        <el-icon class="input-icon"><Key /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24" :lg="12">
                  <el-form-item label="专业班级" prop="majorClass">
                    <el-input
                      v-model="formData.majorClass"
                      placeholder="请输入专业班级"
                      class="mobile-input"
                      :disabled="!isFieldEditable('normal')"
                      @blur="checkStepCompletion(0)"
                    >
                      <template #prefix>
                        <el-icon class="input-icon"><Reading /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 学业成绩 -->
            <div id="academic-info" class="form-section">
              <div class="section-header">
                <el-icon class="blue-icon"><Reading /></el-icon>
                <span class="section-title">学业成绩（20分）</span>
              </div>
              <el-form-item label="学业平均学分绩" prop="gpaScore">
                <el-input-number
                  v-model="formData.gpaScore"
                  :min="0"
                  :max="100"
                  controls-position="right"
                  class="mobile-input"
                  :disabled="!isFieldEditable('normal')"
                  @change="checkStepCompletion(1)"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Trophy /></el-icon>
                  </template>
                </el-input-number>
                <span class="score-hint">（以前六学期为基准）</span>
              </el-form-item>
              <div class="score-display">
                <el-form-item label="自评分" prop="selfScoreAcademic">
                  <el-input-number
                    v-model="formData.selfScoreAcademic"
                    :min="0"
                    :max="20"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('normal')"
                    @change="updateScoreTable"
                  />
                </el-form-item>
                <el-form-item label="学院审核分" prop="collegeScoreAcademic">
                  <el-input-number
                    v-model="formData.collegeScoreAcademic"
                    :min="0"
                    :max="20"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('reviewScore')"
                    @change="updateScoreTable"
                  />
                  <span v-if="!isFieldEditable('reviewScore')" class="readonly-hint">
                    学院审核后显示
                  </span>
                </el-form-item>
              </div>
              <div class="upload-section">
                <el-form-item label="成绩单证明材料" prop="transcriptFileUrls">
                  <MultipleFileUpload
                    v-model="formData.transcriptFileUrls"
                    :limit="10"
                    :max-file-size="10"
                    accept=".pdf,.jpg,.png"
                    :disabled="!isFieldEditable('normal')"
                    @change="checkStepCompletion(1)"
                    @remove="checkStepCompletion(1)"
                  >
                    <template #trigger>
                      <div class="upload-trigger">
                        <el-icon class="upload-icon"><Document /></el-icon>
                        <span>点击或拖放文件到此处</span>
                      </div>
                    </template>
                  </MultipleFileUpload>

                  <div class="form-tip">
                    <el-icon class="tip-icon"><InfoFilled /></el-icon>
                    请上传前六学期成绩单及相关证明材料，需教务处盖章
                  </div>
                </el-form-item>
              </div>
            </div>

            <!-- 学业奖励 -->
            <div id="reward-info" class="form-section">
              <div class="section-header">
                <el-icon class="blue-icon"><Medal /></el-icon>
                <span class="section-title">学业奖励（10分）</span>
              </div>
              <el-form-item label="综合奖学金等级" prop="scholarship">
                <Dict
                  v-model="formData.scholarship"
                  code="scholarship"
                  type="checkbox"
                  class="mobile-input"
                  :disabled="!isFieldEditable('normal')"
                  @change="checkStepCompletion(2)"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Trophy /></el-icon>
                  </template>
                </Dict>
                <div class="score-hint">
                  可选择多个奖项，按最高等级计算得分：一等：40分、二等：30分、三等：20分、四等：10分（对应量化指标10分）
                </div>
              </el-form-item>
              <div
                v-if="formData.scholarship && formData.scholarship.length > 0"
                class="upload-section"
              >
                <el-form-item label="奖学金证明材料" prop="scholarshipFileUrls">
                  <MultipleFileUpload
                    v-model="formData.scholarshipFileUrls"
                    :limit="10"
                    :max-file-size="10"
                    accept=".pdf,.jpg,.png"
                    :disabled="!isFieldEditable('normal')"
                    @change="checkStepCompletion(2)"
                    @remove="checkStepCompletion(2)"
                  >
                    <template #trigger>
                      <div class="upload-trigger">
                        <el-icon class="upload-icon"><Document /></el-icon>
                        <span>点击或拖放文件到此处</span>
                      </div>
                    </template>
                  </MultipleFileUpload>
                  <div class="form-tip">
                    <el-icon class="tip-icon"><InfoFilled /></el-icon>
                    请上传综合奖学金证书或证明文件（多选时需上传所有选中奖项的证明）
                  </div>
                </el-form-item>
              </div>
              <div class="score-display">
                <el-form-item label="自评分" prop="selfScoreScholarship">
                  <el-input-number
                    v-model="formData.selfScoreScholarship"
                    :min="0"
                    :max="10"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('normal')"
                    @change="updateScoreTable"
                  />
                </el-form-item>
                <el-form-item label="学院审核分" prop="collegeScoreScholarship">
                  <el-input-number
                    v-model="formData.collegeScoreScholarship"
                    :min="0"
                    :max="10"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('reviewScore')"
                    @change="updateScoreTable"
                  />
                  <span v-if="!isFieldEditable('reviewScore')" class="readonly-hint">
                    学院审核后显示
                  </span>
                </el-form-item>
              </div>
            </div>

            <!-- 能力素质 -->
            <div id="ability-info" class="form-section">
              <div class="section-header">
                <el-icon class="blue-icon"><User /></el-icon>
                <span class="section-title">能力素质（40分）</span>
              </div>
              <el-form-item label="公务员知识考察" prop="civilExam">
                <el-input-number
                  v-model="formData.civilExam"
                  :min="0"
                  :max="200"
                  controls-position="right"
                  class="mobile-input"
                  :disabled="!isFieldEditable('normal')"
                  @change="checkStepCompletion(3)"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Document /></el-icon>
                  </template>
                </el-input-number>
                <span class="score-hint">（行政职业能力测验+申论）</span>
              </el-form-item>
              <div v-if="formData.civilExam !== null" class="upload-section">
                <el-form-item label="公务员考试证明材料" prop="civilExamFileUrls">
                  <MultipleFileUpload
                    v-model="formData.civilExamFileUrls"
                    :limit="10"
                    :max-file-size="10"
                    accept=".pdf,.jpg,.png"
                    :disabled="!isFieldEditable('normal')"
                    @change="checkStepCompletion(3)"
                    @remove="checkStepCompletion(3)"
                  >
                    <template #trigger>
                      <div class="upload-trigger">
                        <el-icon class="upload-icon"><Document /></el-icon>
                        <span>点击或拖放文件到此处</span>
                      </div>
                    </template>
                  </MultipleFileUpload>
                  <div class="form-tip">
                    <el-icon class="tip-icon"><InfoFilled /></el-icon>
                    请上传公务员考试成绩证明及相关材料
                  </div>
                </el-form-item>
              </div>
              <div class="score-display">
                <el-form-item label="自评分" prop="selfScoreAbility">
                  <el-input-number
                    v-model="formData.selfScoreAbility"
                    :min="0"
                    :max="40"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('normal')"
                    @change="updateScoreTable"
                  />
                </el-form-item>
                <el-form-item label="学院审核分" prop="collegeScoreAbility">
                  <el-input-number
                    v-model="formData.collegeScoreAbility"
                    :min="0"
                    :max="40"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('reviewScore')"
                    @change="updateScoreTable"
                  />
                  <span v-if="!isFieldEditable('reviewScore')" class="readonly-hint">
                    学院审核后显示
                  </span>
                </el-form-item>
              </div>
            </div>

            <!-- 面试答辩 -->
            <div id="interview-info" class="form-section">
              <div class="section-header">
                <el-icon class="blue-icon"><ChatDotRound /></el-icon>
                <span class="section-title">面试答辩（5分）</span>
              </div>
              <el-form-item label="现场面试成绩" prop="interviewScore">
                <el-input-number
                  v-model="formData.interviewScore"
                  :min="0"
                  :max="100"
                  controls-position="right"
                  class="mobile-input"
                  :disabled="!isFieldEditable('normal')"
                  @change="checkStepCompletion(4)"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><ChatDotRound /></el-icon>
                  </template>
                </el-input-number>
              </el-form-item>
              <div class="upload-section">
                <el-form-item label="面试证明材料" prop="interviewProofFileUrls">
                  <MultipleFileUpload
                    v-model="formData.interviewProofFileUrls"
                    :limit="10"
                    :max-file-size="10"
                    accept=".pdf,.jpg,.png"
                    :disabled="!isFieldEditable('normal')"
                    @change="checkStepCompletion(4)"
                    @remove="checkStepCompletion(4)"
                  >
                    <template #trigger>
                      <div class="upload-trigger">
                        <el-icon class="upload-icon"><Document /></el-icon>
                        <span>点击或拖放文件到此处</span>
                      </div>
                    </template>
                  </MultipleFileUpload>
                  <div class="form-tip">
                    <el-icon class="tip-icon"><InfoFilled /></el-icon>
                    请上传面试答辩相关证明文件
                  </div>
                </el-form-item>
              </div>
              <div class="score-display">
                <el-form-item label="自评分" prop="selfScoreInterview">
                  <el-input-number
                    v-model="formData.selfScoreInterview"
                    :min="0"
                    :max="5"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('normal')"
                    @change="updateScoreTable"
                  />
                </el-form-item>
                <el-form-item label="学院审核分" prop="collegeScoreInterview">
                  <el-input-number
                    v-model="formData.collegeScoreInterview"
                    :min="0"
                    :max="5"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('reviewScore')"
                    @change="updateScoreTable"
                  />
                  <span v-if="!isFieldEditable('reviewScore')" class="readonly-hint">
                    学院审核后显示
                  </span>
                </el-form-item>
              </div>
            </div>

            <!-- 身份经历 -->
            <div id="identity-info" class="form-section">
              <div class="section-header">
                <el-icon class="blue-icon"><Flag /></el-icon>
                <span class="section-title">身份经历（5分）</span>
              </div>
              <el-form-item label="政治面貌" prop="party">
                <Dict
                  v-model="formData.party"
                  code="politicalstatus"
                  class="mobile-input"
                  :disabled="!isFieldEditable('normal')"
                  @change="checkStepCompletion(5)"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><StarFilled /></el-icon>
                  </template>
                </Dict>
              </el-form-item>
              <div v-if="formData.party == '12' || formData.party == '13'" class="upload-section">
                <el-form-item label="政治面貌证明" prop="partyProofFileUrls">
                  <MultipleFileUpload
                    v-model="formData.partyProofFileUrls"
                    :limit="10"
                    :max-file-size="10"
                    accept=".pdf,.jpg,.png"
                    :disabled="!isFieldEditable('normal')"
                    @change="checkStepCompletion(5)"
                    @remove="checkStepCompletion(5)"
                  >
                    <template #trigger>
                      <div class="upload-trigger">
                        <el-icon class="upload-icon"><Document /></el-icon>
                        <span>点击或拖放文件到此处</span>
                      </div>
                    </template>
                  </MultipleFileUpload>
                  <div class="form-tip">
                    <el-icon class="tip-icon"><InfoFilled /></el-icon>
                    请上传中共党员或预备党员证明，需党组织盖章
                  </div>
                </el-form-item>
              </div>

              <el-form-item label="入伍经历" prop="military">
                <Dict
                  v-model="formData.military"
                  code="yesno"
                  class="mobile-input"
                  :disabled="!isFieldEditable('normal')"
                  @change="checkStepCompletion(5)"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Flag /></el-icon>
                  </template>
                </Dict>
              </el-form-item>
              <div v-if="formData.military == '20'" class="upload-section">
                <el-form-item label="入伍证明材料" prop="militaryProofFileUrls">
                  <MultipleFileUpload
                    v-model="formData.militaryProofFileUrls"
                    :limit="10"
                    :max-file-size="10"
                    accept=".pdf,.jpg,.png"
                    :disabled="!isFieldEditable('normal')"
                    @change="checkStepCompletion(5)"
                    @remove="checkStepCompletion(5)"
                  >
                    <template #trigger>
                      <div class="upload-trigger">
                        <el-icon class="upload-icon"><Document /></el-icon>
                        <span>点击或拖放文件到此处</span>
                      </div>
                    </template>
                  </MultipleFileUpload>
                  <div class="form-tip">
                    <el-icon class="tip-icon"><InfoFilled /></el-icon>
                    请上传参军入伍证明，需相关部门盖章（党员与入伍经历双重取值）
                  </div>
                </el-form-item>
              </div>
              <div class="score-display">
                <el-form-item label="自评分" prop="selfScoreIdentity">
                  <el-input-number
                    v-model="formData.selfScoreIdentity"
                    :min="0"
                    :max="5"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('normal')"
                    @change="updateScoreTable"
                  />
                </el-form-item>
                <el-form-item label="学院审核分" prop="collegeScoreIdentity">
                  <el-input-number
                    v-model="formData.collegeScoreIdentity"
                    :min="0"
                    :max="5"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('reviewScore')"
                    @change="updateScoreTable"
                  />
                  <span v-if="!isFieldEditable('reviewScore')" class="readonly-hint">
                    学院审核后显示
                  </span>
                </el-form-item>
              </div>
            </div>

            <!-- 服务方面（多选） -->
            <div id="service-info" class="form-section">
              <div class="section-header">
                <el-icon class="blue-icon"><User /></el-icon>
                <span class="section-title">服务方面（15分）</span>
              </div>

              <!-- 学生骨干 -->
              <el-form-item label="学生骨干" prop="cadre">
                <Dict
                  v-model="formData.cadre"
                  code="cadreExperience"
                  type="checkbox"
                  class="mobile-input"
                  :disabled="!isFieldEditable('normal')"
                  @change="checkStepCompletion(6)"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Star /></el-icon>
                  </template>
                </Dict>
                <div class="score-hint">
                  可选择多个任职，按最高等级计算得分：青马学员35分、管理层30分、副部长/班长20分、社团负责人15分、志愿者/其他班委5分
                </div>
              </el-form-item>
              <div v-if="formData.cadre && formData.cadre.length > 0" class="upload-section">
                <el-form-item label="骨干证明材料" prop="cadreProofFileUrls">
                  <MultipleFileUpload
                    v-model="formData.cadreProofFileUrls"
                    :limit="10"
                    :max-file-size="10"
                    accept=".pdf,.jpg,.png"
                    :disabled="!isFieldEditable('normal')"
                    @change="checkStepCompletion(6)"
                    @remove="checkStepCompletion(6)"
                  >
                    <template #trigger>
                      <div class="upload-trigger">
                        <el-icon class="upload-icon"><Document /></el-icon>
                        <span>点击或拖放文件到此处</span>
                      </div>
                    </template>
                  </MultipleFileUpload>
                  <div class="form-tip">
                    <el-icon class="tip-icon"><InfoFilled /></el-icon>
                    请上传学生骨干证明（多选时需上传所有选中任职的证明），需注明任职时间和职务
                  </div>
                </el-form-item>
              </div>

              <!-- 服务获奖情况 -->
              <el-form-item label="服务获奖情况" prop="serviceAward">
                <Dict
                  v-model="formData.serviceAward"
                  code="awardlevel"
                  type="checkbox"
                  class="mobile-input"
                  :disabled="!isFieldEditable('normal')"
                  @change="checkStepCompletion(6)"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Medal /></el-icon>
                  </template>
                </Dict>
                <div class="score-hint">
                  可选择多个奖项，按最高等级计算得分：国家级40分、省级35分、市级30分、校级十佳25分（提名23分）、校级三好学生20分、校级优秀团员10分
                </div>
              </el-form-item>
              <div
                v-if="formData.serviceAward && formData.serviceAward.length > 0"
                class="upload-section"
              >
                <el-form-item label="获奖证明材料" prop="serviceAwardFileUrls">
                  <MultipleFileUpload
                    v-model="formData.serviceAwardFileUrls"
                    :limit="10"
                    :max-file-size="10"
                    accept=".pdf,.jpg,.png"
                    :disabled="!isFieldEditable('normal')"
                    @change="checkStepCompletion(6)"
                    @remove="checkStepCompletion(6)"
                  >
                    <template #trigger>
                      <div class="upload-trigger">
                        <el-icon class="upload-icon"><Document /></el-icon>
                        <span>点击或拖放文件到此处</span>
                      </div>
                    </template>
                  </MultipleFileUpload>
                  <div class="form-tip">
                    <el-icon class="tip-icon"><InfoFilled /></el-icon>
                    请上传服务获奖证书或证明文件（多选时需上传所有选中奖项的证明）
                  </div>
                </el-form-item>
              </div>

              <!-- 志愿服务情况 -->
              <el-form-item label="志愿服务情况" prop="volunteer">
                <Dict
                  v-model="formData.volunteer"
                  code="volunteerservice"
                  type="checkbox"
                  class="mobile-input"
                  :disabled="!isFieldEditable('normal')"
                  @change="checkStepCompletion(6)"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Service /></el-icon>
                  </template>
                </Dict>
                <div class="score-hint">
                  可选择多个服务类型，有任意志愿服务经历即得5分（不分次数和类型，对应量化指标15分）
                </div>
              </el-form-item>
              <div
                v-if="formData.volunteer && formData.volunteer.length > 0"
                class="upload-section"
              >
                <el-form-item label="志愿服务证明材料" prop="volunteerFileUrls">
                  <MultipleFileUpload
                    v-model="formData.volunteerFileUrls"
                    :limit="10"
                    :max-file-size="10"
                    accept=".pdf,.jpg,.png"
                    :disabled="!isFieldEditable('normal')"
                    @change="checkStepCompletion(6)"
                    @remove="checkStepCompletion(6)"
                  >
                    <template #trigger>
                      <div class="upload-trigger">
                        <el-icon class="upload-icon"><Document /></el-icon>
                        <span>点击或拖放文件到此处</span>
                      </div>
                    </template>
                  </MultipleFileUpload>
                  <div class="form-tip">
                    <el-icon class="tip-icon"><InfoFilled /></el-icon>
                    请上传志愿服务证明材料（多选时需上传所有选中服务类型的证明）
                  </div>
                </el-form-item>
              </div>
              <div class="score-display">
                <el-form-item label="自评分" prop="selfScoreService">
                  <el-input-number
                    v-model="formData.selfScoreService"
                    :min="0"
                    :max="15"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('normal')"
                    @change="updateScoreTable"
                  />
                </el-form-item>
                <el-form-item label="学院审核分" prop="collegeScoreService">
                  <el-input-number
                    v-model="formData.collegeScoreService"
                    :min="0"
                    :max="15"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('reviewScore')"
                    @change="updateScoreTable"
                  />
                  <span v-if="!isFieldEditable('reviewScore')" class="readonly-hint">
                    学院审核后显示
                  </span>
                </el-form-item>
              </div>
            </div>

            <!-- 个人技能（多选） -->
            <div id="skill-info" class="form-section">
              <div class="section-header">
                <el-icon class="blue-icon"><StarFilled /></el-icon>
                <span class="section-title">个人技能（5分）</span>
              </div>
              <el-form-item label="各类赛事获奖" prop="competition">
                <Dict
                  v-model="formData.competition"
                  code="competitionlevel"
                  type="checkbox"
                  class="mobile-input"
                  :disabled="!isFieldEditable('normal')"
                  @change="checkStepCompletion(7)"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Trophy /></el-icon>
                  </template>
                </Dict>
                <div class="score-hint">
                  可选择多个赛事，按最高等级计算得分：国家级一等奖40分、二等奖30分、三等奖以下20分；区省级一等奖30分、二等奖20分、三等奖以下10分；市校级一等奖20分、二等奖15分、三等奖以下8分；院级一等奖10分、二等奖8分、三等奖以下6分
                </div>
                <div class="form-tip">
                  <el-icon class="tip-icon"><InfoFilled /></el-icon>
                  集体赛项目：第一位次满分，其他参赛人员按位次逐一减1.5分；可按国家/省市/校/院级分别取值
                </div>
              </el-form-item>
              <div
                v-if="formData.competition && formData.competition.length > 0"
                class="upload-section"
              >
                <el-form-item label="获奖证明材料" prop="competitionFileUrls">
                  <MultipleFileUpload
                    v-model="formData.competitionFileUrls"
                    :limit="10"
                    :max-file-size="10"
                    accept=".pdf,.jpg,.png"
                    :disabled="!isFieldEditable('normal')"
                    @change="checkStepCompletion(7)"
                    @remove="checkStepCompletion(7)"
                  >
                    <template #trigger>
                      <div class="upload-trigger">
                        <el-icon class="upload-icon"><Document /></el-icon>
                        <span>点击或拖放文件到此处</span>
                      </div>
                    </template>
                  </MultipleFileUpload>
                  <div class="form-tip">
                    <el-icon class="tip-icon"><InfoFilled /></el-icon>
                    请上传赛事获奖证书或证明文件（多选时需上传所有选中赛事的证明），经学院认定后生效
                  </div>
                </el-form-item>
              </div>
              <div class="score-display">
                <el-form-item label="自评分" prop="selfScoreSkill">
                  <el-input-number
                    v-model="formData.selfScoreSkill"
                    :min="0"
                    :max="5"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('normal')"
                    @change="updateScoreTable"
                  />
                </el-form-item>
                <el-form-item label="学院审核分" prop="collegeScoreSkill">
                  <el-input-number
                    v-model="formData.collegeScoreSkill"
                    :min="0"
                    :max="5"
                    controls-position="right"
                    class="mobile-input"
                    :disabled="!isFieldEditable('reviewScore')"
                    @change="updateScoreTable"
                  />
                  <span v-if="!isFieldEditable('reviewScore')" class="readonly-hint">
                    学院审核后显示
                  </span>
                </el-form-item>
              </div>
            </div>

            <!-- 身份信息 -->
            <div class="form-section">
              <div class="section-header">
                <el-icon class="blue-icon"><Key /></el-icon>
                <span class="section-title">身份信息材料</span>
              </div>
              <div class="upload-section">
                <el-form-item label="身份证件" prop="idCardFileUrls">
                  <MultipleFileUpload
                    v-model="formData.idCardFileUrls"
                    :limit="5"
                    :max-file-size="5"
                    accept=".jpg,.png,.pdf"
                    :disabled="!isFieldEditable('normal')"
                  >
                    <template #trigger>
                      <div class="upload-trigger">
                        <el-icon class="upload-icon"><Picture /></el-icon>
                        <span>点击或拖放文件到此处</span>
                      </div>
                    </template>
                  </MultipleFileUpload>
                  <div class="form-tip">
                    <el-icon class="tip-icon"><InfoFilled /></el-icon>
                    请上传身份证正反面及其他身份证明材料
                  </div>
                </el-form-item>
              </div>
            </div>

            <!-- 其他材料 -->
            <div class="form-section">
              <div class="section-header">
                <el-icon class="blue-icon"><Document /></el-icon>
                <span class="section-title">其他补充材料</span>
              </div>
              <div class="upload-section">
                <el-form-item label="其他证明材料" prop="otherFileUrls">
                  <MultipleFileUpload
                    v-model="formData.otherFileUrls"
                    :limit="15"
                    :max-file-size="10"
                    accept=".pdf,.jpg,.png"
                    :disabled="!isFieldEditable('normal')"
                  >
                    <template #trigger>
                      <div class="upload-trigger">
                        <el-icon class="upload-icon"><Document /></el-icon>
                        <span>点击或拖放文件到此处</span>
                      </div>
                    </template>
                  </MultipleFileUpload>
                  <div class="form-tip">
                    <el-icon class="tip-icon"><InfoFilled /></el-icon>
                    请上传其他未列事项的证明材料（由评审小组认定）
                  </div>
                </el-form-item>
              </div>
            </div>

            <!-- 总体声明 -->
            <div class="form-section">
              <div class="section-header">
                <el-icon class="blue-icon"><WarningFilled /></el-icon>
                <span class="section-title">真实性声明</span>
              </div>
              <el-form-item label="声明确认" prop="overallValid">
                <div class="declaration-content">
                  <el-icon class="declaration-icon"><InfoFilled /></el-icon>
                  <div class="declaration-text">
                    本人郑重声明：所提交的全部材料及填写的信息均真实、准确、完整，如有虚假，愿承担一切责任，包括取消选调生申请资格。量化考核按考核内容二级指标取代表作制，即取单项分数最高值（参与各类赛事可国家、省市、校、院级分别取值。集体赛项目参赛位次第一位次满分，其他参赛人员按位次逐一减1.5分）。党员与入伍经历双重取值。
                  </div>
                </div>
                <el-radio-group
                  v-model="formData.overallValid"
                  :disabled="!isFieldEditable('normal')"
                >
                  <el-radio value="yes">
                    <el-icon class="radio-icon"><Check /></el-icon>
                    我已阅读并同意上述声明，确认所有材料真实有效
                  </el-radio>
                  <el-radio value="no">
                    <el-icon class="radio-icon"><Close /></el-icon>
                    不同意
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </div>

            <!-- 操作按钮 -->
            <div class="form-actions">
              <el-button
                v-if="isFieldEditable('normal')"
                type="primary"
                class="action-btn"
                @click="handleSubmit"
              >
                <el-icon><Upload /></el-icon>
                提交审核
              </el-button>
              <el-button v-if="isFieldEditable('normal')" class="action-btn" @click="handleClose">
                <el-icon><Close /></el-icon>
                取消
              </el-button>
              <el-button
                v-if="isFieldEditable('normal')"
                :loading="draftLoading"
                class="action-btn draft-btn"
                @click="handleSaveDraft"
              >
                <el-icon><Document /></el-icon>
                保存草稿
              </el-button>
              <!-- 审核员操作按钮组 -->

              <!-- 计算得分按钮 -->
              <el-button
                v-if="isFieldEditable('reviewScore')"
                type="success"
                class="action-btn"
                @click="calculateScore"
              >
                <el-icon><Histogram /></el-icon>
                计算全部申请记录得分
              </el-button>

              <!-- 审核员操作按钮 -->
              <el-button
                v-if="isFieldEditable('reviewScore')"
                type="primary"
                class="action-btn"
                @click="openReviewDialog"
              >
                <el-icon><Check /></el-icon>
                提交审核结果
              </el-button>
            </div>
          </el-form>
        </el-card>
      </div>

      <!-- 右侧评分细则和评分结果区域（细分单项分和合计分） -->
      <div class="score-container">
        <el-card class="score-card">
          <template #header>
            <div class="card-header">
              <el-icon class="blue-icon"><Trophy /></el-icon>
              <span class="card-title">选调生考试资格量化考核评价表（本科生）</span>
            </div>
          </template>

          <!-- 评分结果表格（细分为单项分） -->
          <div class="score-table-container">
            <el-table :data="scoreTableData" border style="width: 100%" size="small">
              <el-table-column prop="item" label="考核项目" width="100" />
              <el-table-column label="自评分" width="140">
                <template #header>
                  <div class="score-header">
                    <div>自评分</div>
                  </div>
                </template>
                <template #default="{ row }">
                  <el-input-number
                    v-model="row.selfScore"
                    :min="0"
                    :max="row.maxScore"
                    size="small"
                    :disabled="!isFieldEditable('normal')"
                    @change="updateFormScores"
                  />
                </template>
              </el-table-column>
              <el-table-column label="学院审核分" width="140">
                <template #header>
                  <div class="score-header">
                    <div>学院审核分</div>
                  </div>
                </template>
                <template #default="{ row }">
                  <el-input-number
                    v-model="row.collegeScore"
                    :min="0"
                    :max="row.maxScore"
                    size="small"
                    :disabled="!isFieldEditable('reviewScore')"
                    @change="updateFormScores"
                  />
                </template>
              </el-table-column>
              <el-table-column label="满分值" width="80">
                <template #default="{ row }">
                  <span class="max-score">{{ row.maxScore }}</span>
                </template>
              </el-table-column>
            </el-table>

            <!-- 合计分行 -->
            <el-table
              :data="totalScoreRow"
              border
              style="width: 100%; margin-top: -1px"
              size="small"
              :show-header="false"
            >
              <el-table-column prop="item" width="100">
                <template #default="{ row }">
                  <span class="total-label">{{ row.item }}</span>
                </template>
              </el-table-column>
              <el-table-column width="120">
                <template #default="{ row }">
                  <div class="score-header total-score">
                    <div>{{ row.selfTotal }}</div>
                    <div class="score-subheader">（合计分）</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="140">
                <template #default="{ row }">
                  <div class="score-header total-score">
                    <div>{{ row.collegeTotal }}</div>
                    <div class="score-subheader">（合计分）</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="80">
                <template #default="{ row }">
                  <span class="max-score total-max">{{ row.maxTotal }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 总分汇总 -->
          <div class="score-summary">
            <div class="summary-item">
              <span class="summary-label">自评分合计：</span>
              <span class="summary-value">{{ selfTotalScore }}分</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">学院审核分合计：</span>
              <span class="summary-value">{{ collegeTotalScore }}分</span>
            </div>
            <div class="summary-item total">
              <span class="summary-label">最终总分：</span>
              <span class="summary-value">{{ finalTotalScore }}分</span>
            </div>
          </div>

          <div class="rules-divider"></div>

          <div class="rules-content">
            <!-- 学业成绩 -->
            <div class="rules-section">
              <div class="rules-header">
                <el-icon class="rules-icon blue-icon"><Reading /></el-icon>
                <span class="rules-title">学业成绩（20分）</span>
              </div>
              <div class="rules-detail">
                <p>学业平均学分绩：100分（满分20分）</p>
              </div>
            </div>

            <!-- 学业奖励 -->
            <div class="rules-section">
              <div class="rules-header">
                <el-icon class="rules-icon blue-icon"><Trophy /></el-icon>
                <span class="rules-title">学业奖励（10分）</span>
              </div>
              <div class="rules-detail">
                <p>综合奖学金一等：40分（满分10分）</p>
                <p>综合奖学金二等：30分</p>
                <p>综合奖学金三等：20分</p>
                <p>综合奖学金四等：10分</p>
                <p>
                  <strong>多选规则：</strong>
                  按最高等级计算得分，需上传所有选中奖项证明
                </p>
              </div>
            </div>

            <!-- 能力素质 -->
            <div class="rules-section">
              <div class="rules-header">
                <el-icon class="rules-icon blue-icon"><User /></el-icon>
                <span class="rules-title">能力素质（40分）</span>
              </div>
              <div class="rules-detail">
                <p>公务员知识考察（行政职业能力测验+申论）：200分（满分40分）</p>
              </div>
            </div>

            <!-- 面试答辩 -->
            <div class="rules-section">
              <div class="rules-header">
                <el-icon class="rules-icon blue-icon"><ChatDotRound /></el-icon>
                <span class="rules-title">面试答辩（5分）</span>
              </div>
              <div class="rules-detail">
                <p>现场面试答辩：100分（满分5分）</p>
                <p>
                  学院评价委员会根据学生面试回答报考选调生宗旨、个人思想陈述、语言表达、思维逻辑、工作设想等方面给予综合评分
                </p>
              </div>
            </div>

            <!-- 身份经历 -->
            <div class="rules-section">
              <div class="rules-header">
                <el-icon class="rules-icon blue-icon"><Flag /></el-icon>
                <span class="rules-title">身份经历（5分）</span>
              </div>
              <div class="rules-detail">
                <p>党员：40分（满分5分）</p>
                <p>入伍经历：30分</p>
                <p>普通学生：10分</p>
              </div>
            </div>

            <!-- 服务方面 -->
            <div class="rules-section">
              <div class="rules-header">
                <el-icon class="rules-icon blue-icon"><Medal /></el-icon>
                <span class="rules-title">服务方面（15分）</span>
              </div>
              <div class="rules-detail">
                <p>黑龙江省"青马工程"学员：35分</p>
                <p>学生组织管理层：30分</p>
                <p>学生组织副部长、班长、团支书、学习委员：20分</p>
                <p>学生社团负责人：15分</p>
                <p>学生组织志愿者、其他班委：5分</p>
                <p>参加志愿服务情况：5分（不分次数）</p>
                <p>
                  <strong>多选规则：</strong>
                  学生骨干/服务获奖按最高等级计算，志愿服务有则得分，需上传所有选中项证明
                </p>
              </div>
            </div>

            <!-- 个人技能 -->
            <div class="rules-section">
              <div class="rules-header">
                <el-icon class="rules-icon blue-icon"><StarFilled /></el-icon>
                <span class="rules-title">个人技能（5分）</span>
              </div>
              <div class="rules-detail">
                <p>各类赛事（经学院认定）</p>
                <p>国家级一等奖：40分、二等奖：30分、三等奖以下：20分</p>
                <p>区省级一等奖：30分、二等奖：20分、三等奖以下：10分</p>
                <p>市校级一等奖：20分、二等奖：15分、三等奖以下：8分</p>
                <p>院级一等奖：10分、二等奖：8分、三等奖以下：6分</p>
                <p>
                  <strong>多选规则：</strong>
                  按最高等级计算得分，需上传所有选中赛事证明
                </p>
              </div>
            </div>

            <div class="rules-note">
              <el-icon class="note-icon"><InfoFilled /></el-icon>
              <p>
                注：量化考核按考核内容二级指标取代表作制，即取单项分数最高值（参与各类赛事可国家、省市、校、院级分别取值。集体赛项目参赛位次第一位次满分，其他参赛人员按位次逐一减1.5分）。党员与入伍经历双重取值。
              </p>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 审核弹窗 -->
    <ElDialog
      v-model="reviewDialogVisible"
      title="审核选调生资格申请"
      :width="isMobile ? '90%' : '600px'"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="reviewFormRef"
        :model="reviewFormData"
        :rules="reviewRules"
        label-width="120px"
        class="review-form"
      >
        <el-form-item label="符合申报条件" prop="qualify">
          <Dict v-model="reviewFormData.qualify" code="yesno" class="mobile-input">
            <template #prefix>
              <el-icon class="input-icon"><Check /></el-icon>
            </template>
          </Dict>
        </el-form-item>

        <el-form-item label="审核备注" prop="reviewRemark">
          <el-input
            v-model="reviewFormData.reviewRemark"
            type="textarea"
            rows="4"
            placeholder="请输入审核意见或备注信息（必填）"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="submitReviewResult">确认提交</el-button>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox, ElDialog } from "element-plus";
import {
  Document,
  User,
  InfoFilled,
  Star,
  Trophy,
  Medal,
  Calendar,
  Key,
  UserFilled,
  School,
  Reading,
  Warning,
  Histogram,
  Picture,
  Upload,
  Close,
  Check,
  Flag,
  WarningFilled,
  ChatDotRound,
  Service,
  StarFilled,
} from "@element-plus/icons-vue";
import { useDebounceFn } from "@vueuse/core";
import MaterialAPI, { MaterialForm } from "@/api/system/material.api";
import Dict from "@/components/Dict/index.vue";
import SingleFileUpload from "@/components/Upload/SingleImageUpload.vue";
import MultipleFileUpload from "@/components/Upload/MultiImageUpload.vue";
import { checkPerm } from "@/directive/permission"; // 导入 checkPerm

const route = useRoute();
const router = useRouter();
const formRef = ref();
const reviewFormRef = ref();

// 判断是否为移动设备
const isMobile = ref(window.innerWidth < 768);
window.addEventListener("resize", () => {
  isMobile.value = window.innerWidth < 768;
});

// 步骤导航相关
const activeStep = ref(0);
const stepStatus = ref<string[]>(Array(8).fill("wait")); // wait, process, finish, error
const sectionIds = [
  "basic-info",
  "academic-info",
  "reward-info",
  "ability-info",
  "interview-info",
  "identity-info",
  "service-info",
  "skill-info",
];

// 审核弹窗相关
const reviewDialogVisible = ref(false);
const reviewFormData = reactive({
  qualify: "", // 符合申报条件
  reviewRemark: "", // 审核备注
});

const reviewRules = reactive({
  qualify: [{ required: true, message: "请选择是否符合申报条件", trigger: "change" }],
  reviewRemark: [{ required: true, message: "请输入审核备注", trigger: "blur" }],
});

// 从URL中提取文件名
const getFileNameFromUrl = (url: string): string => {
  if (!url) return "";
  return url.split("/").pop() || url;
};

// 手动删除文件
const removeManualFile = (field: string, index: number) => {
  if (formData[field] && Array.isArray(formData[field])) {
    formData[field].splice(index, 1);
  }
};

// 预览文件
const previewFile = (url: string) => {
  window.open(url, "_blank");
};

// 监听滚动事件，更新当前步骤
const handleScroll = () => {
  const scrollPosition = window.scrollY + 100; // 添加偏移量，使步骤切换更自然

  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const section = document.getElementById(sectionIds[i]);
    if (section && section.offsetTop <= scrollPosition) {
      activeStep.value = i;
      break;
    }
  }
};

// 滚动到指定部分
const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 80, // 减去步骤导航条的高度
      behavior: "smooth",
    });

    // 更新当前步骤
    const index = sectionIds.indexOf(sectionId);
    if (index !== -1) {
      activeStep.value = index;
    }
  }
};

// 权限控制相关 - 结合checkPerm实现
const globalState = reactive({
  formStatus: "DRAFT", // 表单状态：draft（草稿）/ submitted（待审核）/ reviewing（审核中）/ completed（审核完成）
});

/**
 * 检查字段是否可编辑
 * @param fieldType 字段类型：reviewScore（审核分字段）/ normal（普通字段）
 * @returns 是否可编辑
 */
const isFieldEditable = (fieldType: "reviewScore" | "normal") => {
  const { formStatus } = globalState;

  // 审核分字段：仅拥有审核权限的用户在特定状态下可编辑
  if (fieldType === "reviewScore") {
    // 审核员权限：material:approve
    // 可编辑状态：待审核、审核中
    return checkPerm("material:approve") && ["SUBMITTED", "APPROVED"].includes(formStatus);
  }

  // 普通字段：仅拥有编辑权限的用户在特定状态下可编辑
  if (fieldType === "normal") {
    // 学生权限：material:edit
    // 可编辑状态：草稿、待审核（未最终提交）
    return checkPerm("material:edit") && ["DRAFT", "RETURNED"].includes(formStatus);
  }

  return false;
};

/**
 * 检查操作按钮是否可点击
 * @param action 操作类型：submit（提交）/ saveDraft（保存草稿）/ approve（审核）/ reject（驳回）
 * @returns 是否可操作
 */
const isActionAllowed = (action: "SUBMITTED" | "DRAFT" | "APPROVED" | "reject") => {
  const { formStatus } = globalState;

  switch (action) {
    case "DRAFT":
      // 保存草稿：仅学生在草稿状态可操作
      return checkPerm("material:edit") && formStatus === "DRAFT";
    case "SUBMITTED":
      // 提交表单：仅学生在草稿状态可操作
      return checkPerm("material:edit") && formStatus === "DRAFT";
    case "APPROVED":
      // 审核通过：仅审核员在待审核/审核中状态可操作
      return checkPerm("material:approve") && ["SUBMITTED", "reviewing"].includes(formStatus);
    case "RETURNED":
      // 驳回：仅审核员在待审核/审核中状态可操作
      return checkPerm("material:approve") && ["SUBMITTED", "reviewing"].includes(formStatus);
    default:
      return false;
  }
};

// 检查步骤完成状态
const checkStepCompletion = (stepIndex: number) => {
  let isCompleted = false;

  switch (stepIndex) {
    case 0: // 基本信息
      isCompleted = formData.studentId && formData.studentName && formData.majorClass;
      break;
    case 1: // 学业成绩
      isCompleted = formData.gpaScore !== null && formData.transcriptFileUrls.length > 0;
      break;
    case 2: // 学业奖励
      isCompleted = true; // 学业奖励不是必填项
      if (formData.scholarship && formData.scholarship.length > 0) {
        isCompleted = formData.scholarshipFileUrls.length > 0;
      }
      break;
    case 3: // 能力素质
      isCompleted = true; // 能力素质不是必填项
      if (formData.civilExam !== null) {
        isCompleted = formData.civilExamFileUrls.length > 0;
      }
      break;
    case 4: // 面试答辩
      isCompleted = true; // 面试答辩不是必填项
      if (formData.interviewScore !== null) {
        isCompleted = formData.interviewProofFileUrls.length > 0;
      }
      break;
    case 5: // 身份经历
      isCompleted = true; // 身份经历不是必填项
      if (formData.party && formData.party !== "none") {
        isCompleted = formData.partyProofFileUrls.length > 0;
      }
      if (formData.military && formData.military !== "none") {
        isCompleted = formData.militaryProofFileUrls.length > 0;
      }
      break;
    case 6: // 服务方面（多选）
      isCompleted = true; // 服务方面不是必填项
      if (formData.cadre && formData.cadre.length > 0) {
        isCompleted = formData.cadreProofFileUrls.length > 0;
      }
      if (formData.serviceAward && formData.serviceAward.length > 0) {
        isCompleted = formData.serviceAwardFileUrls.length > 0;
      }
      if (formData.volunteer && formData.volunteer.length > 0) {
        isCompleted = formData.volunteerFileUrls.length > 0;
      }
      break;
    case 7: // 个人技能（多选）
      isCompleted = true; // 个人技能不是必填项
      if (formData.competition && formData.competition.length > 0) {
        isCompleted = formData.competitionFileUrls.length > 0;
      }
      break;
  }

  // 更新步骤状态
  if (isCompleted) {
    stepStatus.value[stepIndex] = "success";
  } else {
    stepStatus.value[stepIndex] = "process";
  }
};

// 表单数据
const formData = reactive<MaterialForm>({
  // 个人基本信息
  studentId: "",
  studentName: "",
  school: "",
  major: "",
  education: "",
  graduationDate: "",
  majorClass: "",
  qualify: "", // 符合申报条件，在审核弹窗中设置

  // 学业成绩
  gpaScore: null,
  transcriptFileUrls: [], // 前端数组：存储URL列表

  selfScoreAcademic: 0,
  collegeScoreAcademic: 0,

  // 学业奖励
  scholarship: [], // 前端数组：存储奖项编码（如[38,39]）
  scholarshipFileUrls: [], // 前端数组：存储证明URL
  selfScoreScholarship: 0,
  collegeScoreScholarship: 0,

  // 能力素质
  civilExam: null,
  civilExamFileUrls: [],
  selfScoreAbility: 0,
  collegeScoreAbility: 0,

  // 面试答辩
  interviewScore: null,
  interviewProofFileUrls: [],
  selfScoreInterview: 0,
  collegeScoreInterview: 0,

  // 身份经历
  party: "",
  partyProofFileUrls: [],
  military: "",
  militaryProofFileUrls: [],
  selfScoreIdentity: 0,
  collegeScoreIdentity: 0,

  // 服务方面（多选）
  cadre: [], // 前端数组：存储骨干编码
  cadreProofFileUrls: [],
  serviceAward: [], // 前端数组：存储服务获奖编码
  serviceAwardFileUrls: [],
  volunteer: [], // 前端数组：存储志愿服务编码
  volunteerFileUrls: [],
  selfScoreService: 0,
  collegeScoreService: 0,

  // 个人技能（多选）
  competition: [], // 前端数组：存储赛事编码
  competitionFileUrls: [],
  selfScoreSkill: 0,
  collegeScoreSkill: 0,

  // 身份信息
  idCardFileUrls: [],
  otherFileUrls: [],

  // 总体声明
  overallValid: "",
  status: "0",
  isDeleted: 0,
  submitTime: "",

  // 新增审核相关字段
  reviewRemark: "", // 审核备注
});

// 评分表格数据（细分为单项分）
const scoreTableData = reactive([
  { item: "学业成绩", selfScore: 0, collegeScore: 0, maxScore: 20 },
  { item: "学业奖励", selfScore: 0, collegeScore: 0, maxScore: 10 },
  { item: "能力素质", selfScore: 0, collegeScore: 0, maxScore: 40 },
  { item: "面试答辩", selfScore: 0, collegeScore: 0, maxScore: 5 },
  { item: "身份经历", selfScore: 0, collegeScore: 0, maxScore: 5 },
  { item: "服务方面", selfScore: 0, collegeScore: 0, maxScore: 15 },
  { item: "个人技能", selfScore: 0, collegeScore: 0, maxScore: 5 },
]);

// 合计分行数据
const totalScoreRow = computed(() => [
  {
    item: "合 计",
    selfTotal: selfTotalScore.value,
    collegeTotal: collegeTotalScore.value,
    maxTotal: 100, // 总分满分值
  },
]);

// 表单验证规则
const rules = reactive({
  studentName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  studentId: [{ required: true, message: "请输入学号", trigger: "blur" }],
  majorClass: [{ required: true, message: "请输入专业班级", trigger: "blur" }],

  overallValid: [{ required: true, message: "请确认声明确认", trigger: "change" }],

  // 分数验证规则
  selfScoreAcademic: [{ type: "number", max: 20, message: "不能超过20分", trigger: "change" }],
  collegeScoreAcademic: [{ type: "number", max: 20, message: "不能超过20分", trigger: "change" }],
  selfScoreScholarship: [{ type: "number", max: 10, message: "不能超过10分", trigger: "change" }],
  collegeScoreScholarship: [
    { type: "number", max: 10, message: "不能超过10分", trigger: "change" },
  ],
  selfScoreAbility: [{ type: "number", max: 40, message: "不能超过40分", trigger: "change" }],
  collegeScoreAbility: [{ type: "number", max: 40, message: "不能超过40分", trigger: "change" }],
  selfScoreInterview: [{ type: "number", max: 5, message: "不能超过5分", trigger: "change" }],
  collegeScoreInterview: [{ type: "number", max: 5, message: "不能超过5分", trigger: "change" }],
  selfScoreIdentity: [{ type: "number", max: 5, message: "不能超过5分", trigger: "change" }],
  collegeScoreIdentity: [{ type: "number", max: 5, message: "不能超过5分", trigger: "change" }],
  selfScoreService: [{ type: "number", max: 15, message: "不能超过15分", trigger: "change" }],
  collegeScoreService: [{ type: "number", max: 15, message: "不能超过15分", trigger: "change" }],
  selfScoreSkill: [{ type: "number", max: 5, message: "不能超过5分", trigger: "change" }],
  collegeScoreSkill: [{ type: "number", max: 5, message: "不能超过5分", trigger: "change" }],
});

// 计算总分（合计分）
const selfTotalScore = computed(() => {
  return scoreTableData.reduce((sum, item) => sum + item.selfScore, 0);
});

const collegeTotalScore = computed(() => {
  return scoreTableData.reduce((sum, item) => sum + item.collegeScore, 0);
});

const finalTotalScore = computed(() => {
  // 最终总分取学院审核分
  return collegeTotalScore.value;
});

// 从表格更新表单分数
const updateFormScores = () => {
  formData.selfScoreAcademic = scoreTableData[0].selfScore;
  formData.collegeScoreAcademic = scoreTableData[0].collegeScore;

  formData.selfScoreScholarship = scoreTableData[1].selfScore;
  formData.collegeScoreScholarship = scoreTableData[1].collegeScore;

  formData.selfScoreAbility = scoreTableData[2].selfScore;
  formData.collegeScoreAbility = scoreTableData[2].collegeScore;

  formData.selfScoreInterview = scoreTableData[3].selfScore;
  formData.collegeScoreInterview = scoreTableData[3].collegeScore;

  formData.selfScoreIdentity = scoreTableData[4].selfScore;
  formData.collegeScoreIdentity = scoreTableData[4].collegeScore;

  formData.selfScoreService = scoreTableData[5].selfScore;
  formData.collegeScoreService = scoreTableData[5].collegeScore;

  formData.selfScoreSkill = scoreTableData[6].selfScore;
  formData.collegeScoreSkill = scoreTableData[6].collegeScore;
};

// 从表单更新表格分数
const updateScoreTable = () => {
  scoreTableData[0].selfScore = formData.selfScoreAcademic;
  scoreTableData[0].collegeScore = formData.collegeScoreAcademic;

  scoreTableData[1].selfScore = formData.selfScoreScholarship;
  scoreTableData[1].collegeScore = formData.collegeScoreScholarship;

  scoreTableData[2].selfScore = formData.selfScoreAbility;
  scoreTableData[2].collegeScore = formData.collegeScoreAbility;

  scoreTableData[3].selfScore = formData.selfScoreInterview;
  scoreTableData[3].collegeScore = formData.collegeScoreInterview;

  scoreTableData[4].selfScore = formData.selfScoreIdentity;
  scoreTableData[4].collegeScore = formData.collegeScoreIdentity;

  scoreTableData[5].selfScore = formData.selfScoreService;
  scoreTableData[5].collegeScore = formData.collegeScoreService;

  scoreTableData[6].selfScore = formData.selfScoreSkill;
  scoreTableData[6].collegeScore = formData.collegeScoreSkill;
};

// ================ 通用数组解析函数（支持数字转字符串、带引号JSON解析） ================
/**
 * 解析后端返回的数组数据（处理数字转字符串、带引号JSON）
 * @param jsonStr 后端返回的JSON数组字符串（如 "[38,39]" 或 "[\"url1.pdf\",\"url2.jpg\"]"）
 * @param readyArray 后端返回的现成数组（如 [38,39]）
 * @param isString 需要转为字符串数组（true：多选框用；false：保持原类型）
 * @returns 解析后的数组
 */
const parseBackendArray = (
  jsonStr: string | undefined,
  readyArray: any[] | undefined,
  isString: boolean = true
): (string | number)[] => {
  // 1. 优先使用后端返回的现成数组（如 scholarshipArray）
  if (readyArray && Array.isArray(readyArray)) {
    return isString
      ? readyArray.map((item) => item?.toString().trim()) // 数字转字符串（适配多选框）
      : readyArray.map((item) => item);
  }

  // 2. 解析JSON数组字符串（处理带引号的情况，如 "[\"url1.pdf\"]"）
  if (jsonStr && typeof jsonStr === "string" && jsonStr.startsWith("[") && jsonStr.endsWith("]")) {
    try {
      // 先替换转义符（\" → "），再解析JSON
      const formattedStr = jsonStr.replace(/\\"/g, '"');
      const parsed = JSON.parse(formattedStr);
      if (Array.isArray(parsed)) {
        return isString
          ? parsed.map((item) => item?.toString().trim()).filter(Boolean)
          : parsed.filter(Boolean);
      }
    } catch (e) {
      console.error("解析数组失败：", e, "原始数据：", jsonStr);
      return [];
    }
  }

  // 3. 无有效数据，返回空数组
  return [];
};

/**
 * 解析文件URL数组（直接返回字符串数组，无需对象包装）
 * @param jsonStr 后端返回的文件URL JSON字符串
 * @param readyArray 后端返回的现成文件URL数组
 * @returns URL字符串数组（如 ["http://xxx.pdf", "http://xxx.jpg"]）
 */
const parseFileUrlArray = (
  jsonStr: string | undefined,
  readyArray: any[] | undefined
): string[] => {
  // 1. 优先使用后端返回的现成数组
  if (readyArray && Array.isArray(readyArray)) {
    return readyArray.map((item) => item?.toString().trim()).filter(Boolean);
  }
  // 2. 解析JSON数组字符串（处理带转义符的情况）
  if (jsonStr && typeof jsonStr === "string" && jsonStr.startsWith("[") && jsonStr.endsWith("]")) {
    try {
      const formattedStr = jsonStr.replace(/\\"/g, '"'); // 替换转义符 \" → "
      const parsed = JSON.parse(formattedStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => item?.toString().trim()).filter(Boolean);
      }
    } catch (e) {
      console.error("文件URL数组解析失败：", e, "原始数据：", jsonStr);
    }
  }
  // 3. 无有效数据返回空数组
  return [];
};

// 保存草稿
const draftLoading = ref(false);
const handleSaveDraft = async () => {
  draftLoading.value = true;
  try {
    // 获取转换后的提交数据
    const submitData = getSubmitData();
    submitData.status = "DRAFT"; // 草稿状态

    console.log("保存草稿数据:", submitData);
    const response = await MaterialAPI.saveDraft(submitData);

    console.log("API MaterialAPI.saveDraft 响应:", response);
    ElMessage.success("草稿保存成功");
  } catch (error) {
    console.log("草稿保存失败：", error);
    ElMessage.error("草稿保存失败");
  } finally {
    draftLoading.value = false;
  }
};

// 计算得分
// 计算得分
const scoreLoading = ref(false);
const calculateScore = async () => {
  scoreLoading.value = true;
  try {
    // 获取转换后的提交数据
    const submitData = getSubmitData();
    console.log("计算得分数据:", submitData.studentId);
    const data = await MaterialAPI.calculateScore(submitData.studentId);
    console.log("API MaterialAPI.calculateScore 响应:", data);
    // 计算得分成功后重新获取表单数据
    if (data) {
      // 更新表单数据
      Object.assign(formData, data);

      // 设置表单状态
      if (data.status) {
        globalState.formStatus = data.status;
        console.log("globalState.formStatus:", globalState.formStatus);
      }

      // 编码类数组解析
      formData.scholarship = parseBackendArray(
        data.scholarship,
        data.scholarshipArray,
        false
      ) as number[];
      formData.cadre = parseBackendArray(data.cadre, data.cadreArray, false) as number[];
      formData.serviceAward = parseBackendArray(
        data.serviceAward,
        data.serviceAwardArray,
        false
      ) as number[];
      formData.volunteer = parseBackendArray(
        data.volunteer,
        data.volunteerArray,
        false
      ) as number[];
      formData.competition = parseBackendArray(
        data.competition,
        data.competitionArray,
        false
      ) as number[];

      // 文件URL类数组解析
      formData.transcriptFileUrls = parseFileUrlArray(
        data.transcriptFileUrls,
        data.transcriptFileUrlsArray
      );
      formData.scholarshipFileUrls = parseFileUrlArray(
        data.scholarshipFileUrls,
        data.scholarshipFileUrlsArray
      );
      formData.civilExamFileUrls = parseFileUrlArray(
        data.civilExamFileUrls,
        data.civilExamFileUrlsArray
      );
      formData.interviewProofFileUrls = parseFileUrlArray(
        data.interviewProofFileUrls,
        data.interviewProofFileUrlsArray
      );
      formData.partyProofFileUrls = parseFileUrlArray(
        data.partyProofFileUrls,
        data.partyProofFileUrlsArray
      );
      formData.militaryProofFileUrls = parseFileUrlArray(
        data.militaryProofFileUrls,
        data.militaryProofFileUrlsArray
      );
      formData.cadreProofFileUrls = parseFileUrlArray(
        data.cadreProofFileUrls,
        data.cadreProofFileUrlsArray
      );
      formData.serviceAwardFileUrls = parseFileUrlArray(
        data.serviceAwardFileUrls,
        data.serviceAwardFileUrlsArray
      );
      formData.volunteerFileUrls = parseFileUrlArray(
        data.volunteerFileUrls,
        data.volunteerFileUrlsArray
      );
      formData.competitionFileUrls = parseFileUrlArray(
        data.competitionFileUrls,
        data.competitionFileUrlsArray
      );
      formData.idCardFileUrls = parseFileUrlArray(data.idCardFileUrls, data.idCardFileUrlsArray);
      formData.otherFileUrls = parseFileUrlArray(data.otherFileUrls, data.otherFileUrlsArray);

      // 确保所有数组字段都是数组类型
      const arrayFields = [
        "scholarship",
        "cadre",
        "serviceAward",
        "volunteer",
        "competition",
        "transcriptFileUrls",
        "scholarshipFileUrls",
        "civilExamFileUrls",
        "interviewProofFileUrls",
        "partyProofFileUrls",
        "militaryProofFileUrls",
        "cadreProofFileUrls",
        "serviceAwardFileUrls",
        "volunteerFileUrls",
        "competitionFileUrls",
        "idCardFileUrls",
        "otherFileUrls",
      ];

      arrayFields.forEach((field) => {
        if (!Array.isArray(formData[field])) {
          formData[field] = [];
        }
      });

      updateScoreTable();

      // 重新检查步骤完成状态
      for (let i = 0; i < 8; i++) {
        checkStepCompletion(i);
      }
      ElMessage.success("计算得分成功，数据已更新");
    } else {
      ElMessage.error("计算得分成功，但未获取到更新数据");
    }
  } catch (error) {
    console.log("计算得分失败：", error);
    ElMessage.error("计算得分失败");
  } finally {
    scoreLoading.value = false;
  }
};
// 提交表单（学生）
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    ElMessageBox.confirm("确认提交表单进行审核吗？提交后将无法修改。", "提交确认", {
      confirmButtonText: "确认提交",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async () => {
      const submitData = getSubmitData(); // 获取转换后的提交数据
      submitData.status = "SUBMITTED"; // 已提交状态
      submitData.submitTime = new Date().toISOString();

      const response = await MaterialAPI.add(submitData); // 提交副本
      console.log("API MaterialAPI.add 响应:", response);
      ElMessage.success("表单提交成功");
      router.push("/materials/cg");
    });
  } catch (error) {
    return;
  }
};

// 打开审核弹窗
const openReviewDialog = () => {
  // 初始化审核表单数据
  reviewFormData.qualify = formData.qualify || "";
  reviewFormData.reviewRemark = formData.reviewRemark || "";
  reviewDialogVisible.value = true;
};

// 关闭审核弹窗
const handleDialogClose = () => {
  reviewDialogVisible.value = false;
};

// 提交审核结果
const submitReviewResult = async () => {
  if (!reviewFormRef.value) return;

  try {
    await reviewFormRef.value.validate();

    ElMessageBox.confirm("确认提交审核结果吗？提交后将无法修改。", "审核确认", {
      confirmButtonText: "确认提交",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async () => {
      // 更新表单数据
      formData.qualify = reviewFormData.qualify;
      formData.reviewRemark = reviewFormData.reviewRemark;

      // 准备提交数据
      const submitData = getSubmitData();
      submitData.status = "APPROVED"; // 审核完成状态

      // 调用审核API
      const response = await MaterialAPI.approve(submitData);
      console.log("API MaterialAPI.approve 响应:", response);
      ElMessage.success("审核结果提交成功");
      reviewDialogVisible.value = false;
      router.push("/materials/cg");
      /*
      const response = await MaterialAPI.updatestatus(
        formData.id,
        "APPROVED",
        reviewFormData.reviewRemark,
        reviewFormData.qualify
      ).then(() => {
        //console.log("API MaterialAPI.updatestatus 响应:", response);
        ElMessage.success("审核成功");
        reviewDialogVisible.value = false;
        //fetchData();
        router.push("/materials/cg");
      });*/
    });
  } catch (error) {
    return;
  }
};

// 关闭表单
const handleClose = () => {
  router.push("/materials/welcome");
};

// 创建提交专用数据（数组转JSON字符串，不修改原formData）
const getSubmitData = (): MaterialForm => {
  // 深拷贝原formData，避免修改原数据
  const submitData = JSON.parse(JSON.stringify(formData)) as MaterialForm;

  // 1. 编码类数组（scholarship、cadre等）：转为JSON字符串
  const codeFields = ["scholarship", "cadre", "serviceAward", "volunteer", "competition"];
  codeFields.forEach((field) => {
    submitData[field] = Array.isArray(submitData[field])
      ? JSON.stringify(submitData[field].filter(Boolean))
      : "[]";
  });

  // 2. 文件URL类数组：转为JSON字符串
  const fileFields = [
    "transcriptFileUrls",
    "scholarshipFileUrls",
    "civilExamFileUrls",
    "interviewProofFileUrls",
    "partyProofFileUrls",
    "militaryProofFileUrls",
    "cadreProofFileUrls",
    "serviceAwardFileUrls",
    "volunteerFileUrls",
    "competitionFileUrls",
    "idCardFileUrls",
    "otherFileUrls",
  ];
  fileFields.forEach((field) => {
    submitData[field] = Array.isArray(submitData[field])
      ? JSON.stringify(submitData[field].filter(Boolean))
      : "[]";
  });

  return submitData;
};

// 页面挂载时初始化
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  const { id } = route.params;

  console.log("=== 页面初始化开始 ===");
  console.log("路由ID:", id);

  // 从路由参数获取用户角色（实际项目中应从后端获取）
  if (route.query.role === "reviewer") {
    globalState.userRole = "reviewer";
  }

  if (id && typeof id === "string") {
    MaterialAPI.getDetail(id).then((data) => {
      console.log("=== API返回数据 ===");
      console.log("完整数据:", data);

      Object.assign(formData, data);

      // 设置表单状态
      if (data.status) {
        globalState.formStatus = data.status;
        console.log("globalState.formStatus:", globalState.formStatus);
      }

      // 编码类数组解析
      formData.scholarship = parseBackendArray(
        data.scholarship,
        data.scholarshipArray,
        false
      ) as number[];
      formData.cadre = parseBackendArray(data.cadre, data.cadreArray, false) as number[];
      formData.serviceAward = parseBackendArray(
        data.serviceAward,
        data.serviceAwardArray,
        false
      ) as number[];
      formData.volunteer = parseBackendArray(
        data.volunteer,
        data.volunteerArray,
        false
      ) as number[];
      formData.competition = parseBackendArray(
        data.competition,
        data.competitionArray,
        false
      ) as number[];

      // 文件URL类数组解析
      formData.transcriptFileUrls = parseFileUrlArray(
        data.transcriptFileUrls,
        data.transcriptFileUrlsArray
      );
      formData.scholarshipFileUrls = parseFileUrlArray(
        data.scholarshipFileUrls,
        data.scholarshipFileUrlsArray
      );
      formData.civilExamFileUrls = parseFileUrlArray(
        data.civilExamFileUrls,
        data.civilExamFileUrlsArray
      );
      formData.interviewProofFileUrls = parseFileUrlArray(
        data.interviewProofFileUrls,
        data.interviewProofFileUrlsArray
      );
      formData.partyProofFileUrls = parseFileUrlArray(
        data.partyProofFileUrls,
        data.partyProofFileUrlsArray
      );
      formData.militaryProofFileUrls = parseFileUrlArray(
        data.militaryProofFileUrls,
        data.militaryProofFileUrlsArray
      );
      formData.cadreProofFileUrls = parseFileUrlArray(
        data.cadreProofFileUrls,
        data.cadreProofFileUrlsArray
      );
      formData.serviceAwardFileUrls = parseFileUrlArray(
        data.serviceAwardFileUrls,
        data.serviceAwardFileUrlsArray
      );
      formData.volunteerFileUrls = parseFileUrlArray(
        data.volunteerFileUrls,
        data.volunteerFileUrlsArray
      );
      formData.competitionFileUrls = parseFileUrlArray(
        data.competitionFileUrls,
        data.competitionFileUrlsArray
      );
      formData.idCardFileUrls = parseFileUrlArray(data.idCardFileUrls, data.idCardFileUrlsArray);
      formData.otherFileUrls = parseFileUrlArray(data.otherFileUrls, data.otherFileUrlsArray);

      // 确保所有数组字段都是数组类型
      const arrayFields = [
        "scholarship",
        "cadre",
        "serviceAward",
        "volunteer",
        "competition",
        "transcriptFileUrls",
        "scholarshipFileUrls",
        "civilExamFileUrls",
        "interviewProofFileUrls",
        "partyProofFileUrls",
        "militaryProofFileUrls",
        "cadreProofFileUrls",
        "serviceAwardFileUrls",
        "volunteerFileUrls",
        "competitionFileUrls",
        "idCardFileUrls",
        "otherFileUrls",
      ];

      arrayFields.forEach((field) => {
        if (!Array.isArray(formData[field])) {
          formData[field] = [];
        }
      });

      updateScoreTable();
      for (let i = 0; i < 8; i++) {
        checkStepCompletion(i);
      }

      console.log("=== 页面初始化完成 ===");
    });
  } else {
    // 新增表单逻辑 - 确保所有数组字段都初始化为空数组
    console.log("新增表单模式");
    const arrayFields = [
      "scholarship",
      "cadre",
      "serviceAward",
      "volunteer",
      "competition",
      "transcriptFileUrls",
      "scholarshipFileUrls",
      "civilExamFileUrls",
      "interviewProofFileUrls",
      "partyProofFileUrls",
      "militaryProofFileUrls",
      "cadreProofFileUrls",
      "serviceAwardFileUrls",
      "volunteerFileUrls",
      "competitionFileUrls",
      "idCardFileUrls",
      "otherFileUrls",
    ];

    arrayFields.forEach((field) => {
      if (!Array.isArray(formData[field])) {
        formData[field] = [];
      }
    });
  }
});

// 页面卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.steps-nav {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.main-layout {
  display: flex;
  gap: 20px;
}

.form-container {
  flex: 2;
}

.score-container {
  flex: 1;
}

.form-card,
.score-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.blue-icon {
  color: #165dff;
}

.section-header {
  display: flex;
  align-items: center;
  margin: 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

.form-section {
  margin-bottom: 25px;
  padding: 10px;
  border-radius: 4px;
  background-color: #f9fafb;
}

.upload-section {
  margin-top: 15px;
}

/* 父组件：确保上传触发块完全填充背后的容器 */
.upload-trigger {
  /* 核心：100% 填充父容器（Element Plus 生成的上传容器） */
  width: 100%;
  height: 100%;
  /* 内容居中：确保图标和文字在容器内居中 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 消除默认间距：避免触发块与容器边缘有缝隙 */
  margin: 0;
  padding: 0;
  /* 视觉样式：保持原有的虚线边框和圆角 */
  border: none; /* 移除自定义边框（避免与容器边框重叠） */
  background: transparent; /* 背景透明，继承容器背景 */
  cursor: pointer;
}

/* 上传图标和文字样式：保持原视觉效果 */
.upload-icon {
  font-size: 24px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.upload-trigger span {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}
.upload-trigger:hover {
  border-color: #165dff;
  background-color: #f0f7ff;
}

.upload-tip {
  font-size: 12px;
  color: #9ca3af;
  display: block;
  margin-top: 5px;
}

.file-list {
  margin-top: 10px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-radius: 4px;
  margin-bottom: 8px;
}

.file-name {
  flex: 1;
  margin: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tip-icon {
  font-size: 14px;
  color: #9ca3af;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  margin-bottom: 20px;
}

.action-btn {
  min-width: 120px;
}

.draft-btn {
  background-color: #f5f7fa;
  color: #4b5563;
}

.draft-btn:hover {
  background-color: #e5e7eb;
}

.score-btn {
  background-color: #e0f2fe;
  color: #0369a1;
}

.score-btn:hover {
  background-color: #bae6fd;
}

.score-display {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.score-hint {
  margin-left: 10px;
  font-size: 12px;
  color: #6b7280;
}

.readonly-hint {
  margin-left: 10px;
  font-size: 12px;
  color: #9ca3af;
}

.declaration-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 4px;
  border-left: 3px solid #38bdf8;
}

.declaration-text {
  flex: 1;
  font-size: 13px;
  color: #1e40af;
  line-height: 1.5;
}

.radio-icon {
  margin-right: 5px;
}

.score-table-container {
  margin-bottom: 20px;
}

.max-score {
  color: #6b7280;
  font-weight: 500;
}

.score-header {
  text-align: center;
}

.score-subheader {
  font-size: 11px;
  color: #9ca3af;
}

.total-label {
  font-weight: bold;
  color: #1f2937;
}

.total-score .summary-value {
  font-weight: bold;
}

.total-max {
  font-weight: bold;
  color: #1f2937;
}

.score-summary {
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 4px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.summary-item.total {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
}

.summary-label {
  color: #4b5563;
}

.summary-value {
  font-weight: 500;
  color: #165dff;
}

.summary-item.total .summary-value {
  color: #dc2626;
  font-size: 16px;
}

.rules-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 15px 0;
}

.rules-content {
  max-height: 1200px;
  overflow-y: auto;
  padding-right: 10px;
}

.rules-section {
  margin-bottom: 15px;
}

.rules-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1f2937;
}

.rules-detail {
  padding-left: 24px;
  font-size: 13px;
  color: #4b5563;
}

.rules-detail p {
  margin: 5px 0;
}

.rules-note {
  margin-top: 15px;
  padding: 10px;
  background-color: #fff3cd;
  border-radius: 4px;
  font-size: 13px;
  color: #92400e;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.note-icon {
  color: #fbbf24;
  margin-top: 2px;
}

.score-cell {
  font-weight: 500;
}

/* 审核表单样式 */
.review-form {
  margin-top: 15px;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }

  .score-container {
    order: 1;
  }
}

@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }

  .steps-nav {
    padding: 10px 5px;
  }

  .form-actions {
    flex-wrap: wrap;
  }

  .score-display {
    flex-direction: column;
    gap: 10px;
  }
}

.manual-file-list {
  margin-top: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 10px;
  background-color: #f9fafb;
}

.file-list-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #374151;
}

.manual-file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  margin-bottom: 6px;
  border: 1px solid #f3f4f6;
}

.manual-file-item .file-name {
  flex: 1;
  margin: 0 10px;
  font-size: 13px;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 只读字段样式 */
:deep(.el-input.is-disabled .el-input__inner),
:deep(.el-input-number.is-disabled .el-input__inner),
:deep(.el-select.is-disabled .el-select__input) {
  background-color: #f5f7fa;
  opacity: 0.8;
}
</style>
