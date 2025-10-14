<template>
  <el-dialog
    v-model="visible"
    title="申请审核"
    width="95%"
    :fullscreen="fullscreen"
    :close-on-click-modal="false"
    destroy-on-close
    class="audit-dialog"
    :top="dialogTop"
    @open="handleOpen"
  >
    <template #header>
      <div class="dialog-header">
        <div class="header-left">
          <span class="dialog-title">状态</span>
          <el-tag :type="getStatusType(formData.status)" class="status-tag">
            {{ getStatusText(formData.status) }}
          </el-tag>
        </div>
        <div class="header-right">
          <el-button circle title="全屏" @click="toggleFullscreen">
            <el-icon><FullScreen /></el-icon>
          </el-button>
          <el-button circle title="关闭" @click="visible = false">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </div>
    </template>

    <div v-loading="loading" class="dialog-content">
      <el-tabs v-model="activeTab" class="custom-tabs">
        <!-- 申请表页签 - 与学生申请表单保持一致，审核分可编辑 -->
        <el-tab-pane label="申请表" name="application">
          <div class="application-layout">
            <!-- 左侧申请表 -->
            <div class="application-form-container">
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
                  label-width="120px"
                  class="compact-form readonly-form"
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
                            readonly
                            placeholder="请输入姓名"
                            class="mobile-input"
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
                            readonly
                            placeholder="请输入学号"
                            class="mobile-input"
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
                            readonly
                            placeholder="请输入专业班级"
                            class="mobile-input"
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
                        readonly
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
                          readonly
                        />
                      </el-form-item>
                      <el-form-item label="学院审核分" prop="collegeScoreAcademic">
                        <el-input-number
                          v-model="formData.collegeScoreAcademic"
                          :min="0"
                          :max="20"
                          controls-position="right"
                          class="mobile-input"
                          :disabled="!canEdit"
                          @change="handleScoreChange('academic')"
                        />
                      </el-form-item>
                    </div>
                    <div class="upload-section">
                      <el-form-item label="成绩单证明材料" prop="transcriptFileUrls">
                        <MultipleFileUpload
                          v-model="formData.transcriptFileUrls"
                          :limit="10"
                          :max-file-size="10"
                          accept=".pdf,.jpg,.png"
                          readonly
                        />
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
                        readonly
                      />
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
                          readonly
                        />
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
                          readonly
                        />
                      </el-form-item>
                      <el-form-item label="学院审核分" prop="collegeScoreScholarship">
                        <el-input-number
                          v-model="formData.collegeScoreScholarship"
                          :min="0"
                          :max="10"
                          controls-position="right"
                          class="mobile-input"
                          :disabled="!canEdit"
                          @change="handleScoreChange('scholarship')"
                        />
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
                        readonly
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
                          readonly
                        />
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
                          readonly
                        />
                      </el-form-item>
                      <el-form-item label="学院审核分" prop="collegeScoreAbility">
                        <el-input-number
                          v-model="formData.collegeScoreAbility"
                          :min="0"
                          :max="40"
                          controls-position="right"
                          class="mobile-input"
                          :disabled="!canEdit"
                          @change="handleScoreChange('ability')"
                        />
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
                        readonly
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
                          readonly
                        />
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
                          readonly
                        />
                      </el-form-item>
                      <el-form-item label="学院审核分" prop="collegeScoreInterview">
                        <el-input-number
                          v-model="formData.collegeScoreInterview"
                          :min="0"
                          :max="5"
                          controls-position="right"
                          class="mobile-input"
                          :disabled="!canEdit"
                          @change="handleScoreChange('interview')"
                        />
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
                        readonly
                      />
                    </el-form-item>
                    <div
                      v-if="formData.party == '12' || formData.party == '13'"
                      class="upload-section"
                    >
                      <el-form-item label="政治面貌证明" prop="partyProofFileUrls">
                        <MultipleFileUpload
                          v-model="formData.partyProofFileUrls"
                          :limit="10"
                          :max-file-size="10"
                          accept=".pdf,.jpg,.png"
                          readonly
                        />
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
                        readonly
                      />
                    </el-form-item>
                    <div v-if="formData.military == '20'" class="upload-section">
                      <el-form-item label="入伍证明材料" prop="militaryProofFileUrls">
                        <MultipleFileUpload
                          v-model="formData.militaryProofFileUrls"
                          :limit="10"
                          :max-file-size="10"
                          accept=".pdf,.jpg,.png"
                          readonly
                        />
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
                          readonly
                        />
                      </el-form-item>
                      <el-form-item label="学院审核分" prop="collegeScoreIdentity">
                        <el-input-number
                          v-model="formData.collegeScoreIdentity"
                          :min="0"
                          :max="5"
                          controls-position="right"
                          class="mobile-input"
                          :disabled="!canEdit"
                          @change="handleScoreChange('identity')"
                        />
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
                        readonly
                      />
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
                          readonly
                        />
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
                        readonly
                      />
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
                          readonly
                        />
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
                        readonly
                      />
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
                          readonly
                        />
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
                          readonly
                        />
                      </el-form-item>
                      <el-form-item label="学院审核分" prop="collegeScoreService">
                        <el-input-number
                          v-model="formData.collegeScoreService"
                          :min="0"
                          :max="15"
                          controls-position="right"
                          class="mobile-input"
                          :disabled="!canEdit"
                          @change="handleScoreChange('service')"
                        />
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
                        readonly
                      />
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
                          readonly
                        />
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
                          readonly
                        />
                      </el-form-item>
                      <el-form-item label="学院审核分" prop="collegeScoreSkill">
                        <el-input-number
                          v-model="formData.collegeScoreSkill"
                          :min="0"
                          :max="5"
                          controls-position="right"
                          class="mobile-input"
                          :disabled="!canEdit"
                          @change="handleScoreChange('skill')"
                        />
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
                          readonly
                        />
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
                          readonly
                        />
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
                    <el-form-item label="声明确认">
                      <div class="declaration-content">
                        <el-icon class="declaration-icon"><InfoFilled /></el-icon>
                        <div class="declaration-text">
                          本人郑重声明：所提交的全部材料及填写的信息均真实、准确、完整，如有虚假，愿承担一切责任，包括取消选调生申请资格。量化考核按考核内容二级指标取代表作制，即取单项分数最高值（参与各类赛事可国家、省市、校、院级分别取值。集体赛项目参赛位次第一位次满分，其他参赛人员按位次逐一减1.5分）。党员与入伍经历双重取值。
                        </div>
                      </div>
                      <el-radio-group v-model="formData.overallValid" disabled>
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
                </el-form>
              </el-card>
            </div>

            <!-- 右侧评分汇总 -->
            <div class="score-summary-container">
              <el-card class="score-card">
                <template #header>
                  <div class="card-header">
                    <el-icon class="blue-icon"><Trophy /></el-icon>
                    <span class="card-title">评分汇总</span>
                  </div>
                </template>

                <!-- 评分结果表格 -->
                <div class="score-table-container">
                  <el-table :data="scoreTableData" border style="width: 100%" size="small">
                    <el-table-column prop="item" label="考核项目" width="100" />
                    <el-table-column label="自评分" width="80">
                      <template #default="{ row }">
                        <span class="self-score">{{ row.selfScore }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="审核分" width="100">
                      <template #default="{ row }">
                        <span class="college-score">{{ row.collegeScore }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="满分" width="60">
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
                    <el-table-column width="80">
                      <template #default="{ row }">
                        <span class="self-score total">{{ row.selfTotal }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="100">
                      <template #default="{ row }">
                        <span class="college-score total">{{ row.collegeTotal }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="60">
                      <template #default="{ row }">
                        <span class="max-score total">{{ row.maxTotal }}</span>
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
                    <span class="summary-label">审核分合计：</span>
                    <span class="summary-value">{{ collegeTotalScore }}分</span>
                  </div>
                  <div class="summary-item total">
                    <span class="summary-label">最终总分：</span>
                    <span class="summary-value">{{ finalTotalScore }}分</span>
                  </div>
                </div>

                <!-- 审核备注 -->
                <div v-if="canEdit" class="audit-remark">
                  <el-form-item label="审核备注">
                    <el-input
                      v-model="auditRemark"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入审核备注"
                    />
                  </el-form-item>
                </div>

                <!-- 保存按钮 -->
                <div v-if="canEdit" class="audit-actions">
                  <el-button type="primary" :loading="isSaving" @click="saveAllScores">
                    <el-icon><Check /></el-icon>
                    保存评分
                  </el-button>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>

        <!-- 审批流程页签 -->
        <el-tab-pane label="审批流程" name="process">
          <div class="steps-container">
            <el-steps :active="getActiveStep()" finish-status="success" align-center>
              <el-step
                title="提交"
                :status="getStepStatus(0)"
                @click="scrollToSection('basic-info')"
              />
              <el-step
                title="院领导审批"
                :status="getStepStatus(1)"
                @click="scrollToSection('director-audit')"
              />
              <el-step title="完成" :status="getStepStatus(2)" />
            </el-steps>
            <div class="process-details">
              <el-card class="process-card">
                <template #header>
                  <div class="card-header">
                    <el-icon class="blue-icon"><Document /></el-icon>
                    <span class="card-title">审批详情</span>
                  </div>
                </template>
                <div class="process-content">
                  <div class="process-section">
                    <h4>当前状态</h4>
                    <el-tag :type="getStatusType(formData.status)" class="status-tag">
                      <el-icon
                        v-if="formData.status === 'APPROVED'"
                        class="status-icon success-icon"
                      >
                        <Check />
                      </el-icon>
                      <el-icon
                        v-else-if="formData.status === 'SUBMITTED'"
                        class="status-icon primary-icon"
                      >
                        <Loading />
                      </el-icon>
                      <el-icon
                        v-else-if="formData.status === 'RETURNED'"
                        class="status-icon warning-icon"
                      >
                        <Warning />
                      </el-icon>
                      <el-icon v-else class="status-icon info-icon">
                        <Document />
                      </el-icon>
                      {{ getStatusText(formData.status) }}
                    </el-tag>
                  </div>
                  <div class="process-section">
                    <h4>审批进度</h4>
                    <div class="progress-list">
                      <div class="progress-item" :class="{ active: formData.status !== 'DRAFT' }">
                        <div class="progress-icon">
                          <el-icon><Check /></el-icon>
                        </div>
                        <div class="progress-text">提交申请</div>
                        <div class="progress-time">
                          <el-date-picker
                            v-if="
                              formData.status === 'SUBMITTED' ||
                              formData.status === 'APPROVED' ||
                              formData.status === 'RETURNED'
                            "
                            v-model="formData.submitTime"
                            type="datetime"
                            readonly
                            format="YYYY-MM-DD HH:mm:ss"
                            :disabled="true"
                            class="time-value"
                          />
                        </div>
                      </div>
                      <div
                        class="progress-item"
                        :class="{
                          active: formData.status === 'APPROVED' || formData.status === 'RETURNED',
                        }"
                      >
                        <div class="progress-icon">
                          <el-icon><User /></el-icon>
                        </div>
                        <div class="progress-text">院领导审批</div>
                        <div class="progress-time">
                          <el-date-picker
                            v-if="formData.status === 'APPROVED' || formData.status === 'RETURNED'"
                            v-model="formData.updateTime"
                            type="datetime"
                            readonly
                            format="YYYY-MM-DD HH:mm:ss"
                            :disabled="true"
                            class="time-value"
                          />
                          <span v-else>-</span>
                        </div>
                      </div>
                      <div
                        class="progress-item"
                        :class="{ active: formData.status === 'APPROVED' }"
                      >
                        <div class="progress-icon">
                          <el-icon><Check /></el-icon>
                        </div>
                        <div class="progress-text">完成审批</div>
                        <div class="progress-time">
                          <el-date-picker
                            v-if="formData.status === 'APPROVED'"
                            v-model="formData.updateTime"
                            type="datetime"
                            readonly
                            format="YYYY-MM-DD HH:mm:ss"
                            :disabled="true"
                            class="time-value"
                          />
                          <span v-else>-</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="process-section">
                    <h4>审批意见</h4>
                    <div class="opinion-list">
                      <div v-if="formData.reviewRemark" class="opinion-item">
                        <div class="opinion-header">
                          <el-icon class="blue-icon"><User /></el-icon>
                          <span>院领导意见</span>
                          <span class="opinion-time">
                            <el-date-picker
                              v-if="formData.reviewRemark"
                              v-model="formData.updateTime"
                              type="datetime"
                              readonly
                              format="YYYY-MM-DD HH:mm:ss"
                              :disabled="true"
                              class="time-value"
                            />
                          </span>
                        </div>
                        <div class="opinion-content">{{ formData.reviewRemark }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>

        <!-- 审批日志页签 -->
        <el-tab-pane label="审批日志" name="logs">
          <div class="logs-container">
            <el-card class="log-card">
              <template #header>
                <div class="card-header">
                  <el-icon class="blue-icon"><Document /></el-icon>
                  <span class="card-title">流转日志</span>
                </div>
              </template>
              <div class="log-content">
                <el-timeline v-if="flowLogs.length > 0">
                  <el-timeline-item
                    v-for="(log, index) in flowLogs"
                    :key="index"
                    :type="getLogType(log.content)"
                    :color="getLogColor(log.content)"
                    :timestamp="formatTime(log.create_time)"
                  >
                    <div class="log-item">
                      <div class="log-title">{{ log.content }}</div>
                      <div class="log-user">操作人：{{ log.username }}</div>
                      <div v-if="log.remark" class="log-remark">备注：{{ log.remark }}</div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
                <div v-else class="empty-log">暂无流转记录</div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>

        <!-- 评分细则页签 -->
        <el-tab-pane label="评分细则" name="rules">
          <div class="rules-container">
            <el-card class="rules-card">
              <template #header>
                <div class="card-header">
                  <el-icon class="blue-icon"><Trophy /></el-icon>
                  <span class="card-title">
                    信息与电气工程学院申报2026年选调生考试资格量化考核评价表（本科生 试行）
                  </span>
                </div>
              </template>
              <div class="rules-content">
                <!-- 基本信息 -->

                <!-- 考核表格 -->

                <!-- 详细评分规则 -->
                <div class="detailed-rules">
                  <!-- 学业成绩 -->
                  <div class="rules-section">
                    <div class="rules-header">
                      <el-icon class="rules-icon blue-icon"><Reading /></el-icon>
                      <span class="rules-title">学业成绩（20分）</span>
                    </div>
                    <div class="rules-detail">
                      <p>
                        <strong>学业平均学分绩：</strong>
                        100分制，按比例折算为20分
                      </p>
                    </div>
                  </div>

                  <!-- 学业奖励 -->
                  <div class="rules-section">
                    <div class="rules-header">
                      <el-icon class="rules-icon blue-icon"><Medal /></el-icon>
                      <span class="rules-title">学业奖励（10分）</span>
                    </div>
                    <div class="rules-detail">
                      <p>
                        <strong>综合奖学金：</strong>
                        一等：40分 | 二等：30分 | 三等：20分 | 四等：10分
                      </p>
                      <p class="rules-note">注：按最高奖项计分</p>
                    </div>
                  </div>

                  <!-- 能力素质 -->
                  <div class="rules-section">
                    <div class="rules-header">
                      <el-icon class="rules-icon blue-icon"><Flag /></el-icon>
                      <span class="rules-title">能力素质（40分）</span>
                    </div>
                    <div class="rules-detail">
                      <p>
                        <strong>公务员知识考察：</strong>
                        行政职业能力测验+申论：200分制，按比例折算为40分
                      </p>
                    </div>
                  </div>

                  <!-- 面试答辩 -->
                  <div class="rules-section">
                    <div class="rules-header">
                      <el-icon class="rules-icon blue-icon"><ChatDotRound /></el-icon>
                      <span class="rules-title">面试答辩（5分）</span>
                    </div>
                    <div class="rules-detail">
                      <p>
                        <strong>现场面试答辩：</strong>
                        学院评价委员会根据学生面试回答报考选调生宗旨、个人思想陈述、语言表达、思维逻辑、工作设想等方面给予综合评分：100分制，按比例折算为5分
                      </p>
                    </div>
                  </div>

                  <!-- 身份经历 -->
                  <div class="rules-section">
                    <div class="rules-header">
                      <el-icon class="rules-icon blue-icon"><User /></el-icon>
                      <span class="rules-title">身份经历（5分）</span>
                    </div>
                    <div class="rules-detail">
                      <p>
                        <strong>党员：</strong>
                        40分 |
                        <strong>入伍经历：</strong>
                        30分 |
                        <strong>普通学生：</strong>
                        10分
                      </p>
                      <p class="rules-note">注：党员与入伍经历双重取值</p>
                    </div>
                  </div>

                  <!-- 服务方面 -->
                  <div class="rules-section">
                    <div class="rules-header">
                      <el-icon class="rules-icon blue-icon"><Service /></el-icon>
                      <span class="rules-title">服务方面（15分）</span>
                    </div>
                    <div class="rules-detail">
                      <div class="sub-section">
                        <p><strong>校院学生骨干：</strong></p>
                        <p>• 黑龙江省"青马工程"学员：35分</p>
                        <p>• 学生组织管理层：30分</p>
                        <p>• 学生组织副部长、班长、团支书、学习委员：20分</p>
                        <p>• 学生社团负责人：15分</p>
                        <p>• 学生组织志愿者、其他班委：5分</p>
                      </div>
                      <div class="sub-section">
                        <p><strong>服务获奖：</strong></p>
                        <p>• 国家级先优：40分</p>
                        <p>• 省级先优：35分</p>
                        <p>• 市级先优：30分</p>
                        <p>• 校级十佳大学生：25分，提名：23分</p>
                        <p>• 校级三好学生、优秀学生干部、优秀共青团干部、县级先优：20分</p>
                        <p>
                          •
                          校级优秀共青团员、优秀志愿者、社会实践优秀个人、社团先进个人、新媒体先进个人等：10分
                        </p>
                        <p>• 参加志愿服务情况：5分（不分次数）</p>
                      </div>
                    </div>
                  </div>

                  <!-- 个人技能 -->
                  <div class="rules-section">
                    <div class="rules-header">
                      <el-icon class="rules-icon blue-icon"><StarFilled /></el-icon>
                      <span class="rules-title">个人技能（5分）</span>
                    </div>
                    <div class="rules-detail">
                      <div class="sub-section">
                        <p><strong>各类赛事（经学院认定）：</strong></p>
                        <p>• 国家级一等奖：40分 | 二等奖：30分 | 三等奖以下：20分</p>
                        <p>• 区省级一等奖：30分 | 二等奖：20分 | 三等奖以下：10分</p>
                        <p>• 市校级一等奖：20分 | 二等奖：15分 | 三等奖以下：8分</p>
                        <p>• 院级一等奖：10分 | 二等奖：8分 | 三等奖以下：6分</p>
                      </div>
                      <p class="rules-note">
                        注：集体赛项目参赛位次第一位次满分，其他参赛人员按位次逐一减1.5分
                      </p>
                    </div>
                  </div>

                  <!-- 其他 -->
                  <div class="rules-section">
                    <div class="rules-header">
                      <el-icon class="rules-icon blue-icon"><MoreFilled /></el-icon>
                      <span class="rules-title">其他</span>
                    </div>
                    <div class="rules-detail">
                      <p>其他未列事项参考同类已列项加分（由评审小组认定）</p>
                    </div>
                  </div>
                </div>

                <!-- 注意事项 -->
                <div class="rules-notes">
                  <el-alert type="info" :closable="false">
                    <template #title>
                      <div class="notes-content">
                        <p><strong>注意事项：</strong></p>
                        <p>
                          1、量化考核按考核内容二级指标取代表作制，即取单项分数最高值（参与各类赛事可国家、省市、校、院级分别取值。集体赛项目参赛位次第一位次满分，其他参赛人员按位次逐一减1.5分）。党员与入伍经历双重取值。
                        </p>
                        <p>2、表格中所有得分项需提供佐证材料的复印件或相关证明。</p>
                        <p>3、学业成绩以前六学期为基准。</p>
                        <p>
                          4、量化分数相同时，以能力素质分数高低排序，若排序再相同，则以学业成绩分数排序。
                        </p>
                      </div>
                    </template>
                  </el-alert>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 底部操作栏 -->
    <template #footer>
      <div class="dialog-footer">
        <div class="footer-left">
          <span>当前状态：</span>
          <el-tag :type="getStatusType(formData.status)">
            {{ getStatusText(formData.status) }}
          </el-tag>
        </div>
        <div class="footer-right">
          <el-button @click="visible = false">关闭</el-button>
        </div>
      </div>
    </template>
  </el-dialog>

  <!-- 回退对话框 -->
  <el-dialog v-model="showReturnDialog" title="退回申请" width="500px" append-to-body>
    <el-form ref="returnFormRef" :model="returnForm" label-width="80px">
      <el-form-item label="退回原因" prop="remark">
        <el-input
          v-model="returnForm.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入退回原因"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showReturnDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitReturn">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Document,
  User,
  InfoFilled,
  Trophy,
  Medal,
  Key,
  UserFilled,
  Reading,
  Close,
  Check,
  Flag,
  FullScreen,
  WarningFilled,
  ChatDotRound,
  StarFilled,
  Loading, // 添加Loading图标
  Warning, // 添加Warning图标
} from "@element-plus/icons-vue";
import MaterialAPI, { MaterialForm, FlowLog } from "@/api/system/material.api";
import Dict from "@/components/Dict/index.vue";
import MultipleFileUpload from "@/components/Upload/MultiImageUpload.vue";
import { useUserStore } from "@/store";
import dayjs from "dayjs";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  id: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "success"]);

// 弹窗状态
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// 修复：确保activeTab指向存在的页签
const activeTab = ref("application");
const formRef = ref();
const loading = ref(false);
const fullscreen = ref(false);
const dialogTop = ref("5vh");

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
  qualify: "",

  // 学业成绩
  gpaScore: null,
  transcriptFileUrls: [],
  selfScoreAcademic: 0,
  collegeScoreAcademic: 0,

  // 学业奖励
  scholarship: [],
  scholarshipFileUrls: [],
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
  cadre: [],
  cadreProofFileUrls: [],
  serviceAward: [],
  serviceAwardFileUrls: [],
  volunteer: [],
  volunteerFileUrls: [],
  selfScoreService: 0,
  collegeScoreService: 0,

  // 个人技能（多选）
  competition: [],
  competitionFileUrls: [],
  selfScoreSkill: 0,
  collegeScoreSkill: 0,

  // 身份信息
  idCardFileUrls: [],
  otherFileUrls: [],

  // 总体声明
  overallValid: "",
  status: "",
  isDeleted: 0,
  submitTime: "",
  reviewRemark: "",
});

// 评分表格数据
const scoreTableData = reactive([
  { item: "学业成绩", selfScore: 0, collegeScore: 0, maxScore: 20 },
  { item: "学业奖励", selfScore: 0, collegeScore: 0, maxScore: 10 },
  { item: "能力素质", selfScore: 0, collegeScore: 0, maxScore: 40 },
  { item: "面试答辩", selfScore: 0, collegeScore: 0, maxScore: 5 },
  { item: "身份经历", selfScore: 0, collegeScore: 0, maxScore: 5 },
  { item: "服务方面", selfScore: 0, collegeScore: 0, maxScore: 15 },
  { item: "个人技能", selfScore: 0, collegeScore: 0, maxScore: 5 },
]);

// 审核备注
const auditRemark = ref("");

// 权限控制
const canEdit = ref(false);
const isSaving = ref(false);

// 回退表单
const returnForm = reactive({
  remark: "",
});

// 弹窗状态
const showReturnDialog = ref(false);

// 流转日志
const flowLogs = ref<FlowLog[]>([]);

// 计算总分
const selfTotalScore = computed(() => {
  return scoreTableData.reduce((sum, item) => sum + item.selfScore, 0);
});

const collegeTotalScore = computed(() => {
  return scoreTableData.reduce((sum, item) => sum + item.collegeScore, 0);
});

const finalTotalScore = computed(() => {
  return collegeTotalScore.value;
});

// 合计分行数据
const totalScoreRow = computed(() => [
  {
    item: "合计",
    selfTotal: selfTotalScore.value,
    collegeTotal: collegeTotalScore.value,
    maxTotal: 100,
  },
]);

// 监听弹窗状态，打开时重置页签
watch(visible, (newVal) => {
  if (newVal) {
    // 弹窗打开时重置到第一个页签
    activeTab.value = "application";
  }
});

// 处理分数变化
function handleScoreChange(type: string) {
  console.log(
    `${type}分数变化:`,
    formData[`collegeScore${type.charAt(0).toUpperCase() + type.slice(1)}`]
  );

  // 更新评分表格数据
  const scoreMap = {
    academic: 0,
    scholarship: 1,
    ability: 2,
    interview: 3,
    identity: 4,
    service: 5,
    skill: 6,
  };

  const index = scoreMap[type];
  if (index !== undefined) {
    scoreTableData[index].collegeScore =
      formData[`collegeScore${type.charAt(0).toUpperCase() + type.slice(1)}`] || 0;
  }
}

// 保存所有分数
async function saveAllScores() {
  if (!canEdit.value) return;

  isSaving.value = true;
  try {
    // 构建保存数据
    const scoreDetails = [
      { type: "academic", field: "Academic" },
      { type: "scholarship", field: "Scholarship" },
      { type: "ability", field: "Ability" },
      { type: "interview", field: "Interview" },
      { type: "identity", field: "Identity" },
      { type: "service", field: "Service" },
      { type: "skill", field: "Skill" },
    ].map((item) => ({
      materialId: Number(props.id),
      scoreType: item.type,
      scoreValue: formData[`collegeScore${item.field}`] || 0,
      maxScore:
        scoreTableData.find((s) => s.item.includes(getScoreTypeName(item.type)))?.maxScore || 0,
      scorePercent:
        ((formData[`collegeScore${item.field}`] || 0) /
          (scoreTableData.find((s) => s.item.includes(getScoreTypeName(item.type)))?.maxScore ||
            1)) *
        100,
      remark: auditRemark.value,
      auditorId: useUserStore().userInfo?.id,
    }));

    // 调用API保存
    await MaterialAPI.batchUpdateScoreDetails(Number(props.id), scoreDetails);

    ElMessage.success("评分保存成功");
  } catch (error) {
    console.error("保存评分失败:", error);
    ElMessage.error("保存评分失败");
  } finally {
    isSaving.value = false;
  }
}

// 获取得分类型名称
function getScoreTypeName(type: string) {
  const typeMap: { [key: string]: string } = {
    academic: "学业成绩",
    scholarship: "学业奖励",
    ability: "能力素质",
    interview: "面试答辩",
    identity: "身份经历",
    service: "服务方面",
    skill: "个人技能",
  };
  return typeMap[type] || type;
}

// 检查编辑权限
async function checkEditPermission() {
  try {
    const userStore = useUserStore();
    const userInfo = userStore.userInfo;
    const roles = userInfo?.role || userInfo?.roles || [];
    const rolesArray = Array.isArray(roles) ? roles : roles?.value ? [...roles.value] : [];
    const hasRootRole = rolesArray.includes("ROLE_ROOT");
    const canEdit = hasRootRole && ["SUBMITTED", "RETURNED"].includes(formData.status);
    return canEdit;
  } catch (error) {
    console.error("获取用户信息失败", error);
    return false;
  }
}

// 获取状态文本
function getStatusText(status: string) {
  switch (status) {
    case "DRAFT":
      return "草稿";
    case "SUBMITTED":
      return "已提交";
    case "RETURNED":
      return "已退回";
    case "APPROVED":
      return "已审核";
    default:
      return status;
  }
}

// 获取状态类型
function getStatusType(status: string) {
  switch (status) {
    case "DRAFT":
      return "info";
    case "SUBMITTED":
      return "primary";
    case "RETURNED":
      return "warning";
    case "APPROVED":
      return "success";
    default:
      return "info";
  }
}

function formatTime(time: string) {
  if (!time) return "";
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
}

// 获取日志类型
function getLogType(operation: string) {
  if (operation.includes("提交")) return "primary";
  if (operation.includes("审核通过")) return "success";
  if (operation.includes("退回")) return "warning";
  return "info";
}

// 获取日志颜色
function getLogColor(operation: string) {
  if (operation.includes("提交")) return "#409eff";
  if (operation.includes("审核通过")) return "#67c23a";
  if (operation.includes("退回")) return "#e6a23c";
  return "#909399";
}

// 滚动到指定部分
function scrollToSection(sectionId: string) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// 切换全屏
function toggleFullscreen() {
  fullscreen.value = !fullscreen.value;
}

// 解析文件URL数组
const parseFileUrlArray = (
  jsonStr: string | undefined,
  readyArray: any[] | undefined
): string[] => {
  if (readyArray && Array.isArray(readyArray)) {
    return readyArray.map((item) => item?.toString().trim()).filter(Boolean);
  }
  if (jsonStr && typeof jsonStr === "string" && jsonStr.startsWith("[") && jsonStr.endsWith("]")) {
    try {
      const formattedStr = jsonStr.replace(/\\"/g, '"');
      const parsed = JSON.parse(formattedStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => item?.toString().trim()).filter(Boolean);
      }
    } catch (e) {
      console.error("文件URL数组解析失败：", e, "原始数据：", jsonStr);
    }
  }
  return [];
};

// 解析后端数组
const parseBackendArray = (
  jsonStr: string | undefined,
  readyArray: any[] | undefined,
  isString: boolean = true
): (string | number)[] => {
  if (readyArray && Array.isArray(readyArray)) {
    return isString
      ? readyArray.map((item) => item?.toString().trim())
      : readyArray.map((item) => item);
  }
  if (jsonStr && typeof jsonStr === "string" && jsonStr.startsWith("[") && jsonStr.endsWith("]")) {
    try {
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
  return [];
};

// 页签验证函数
function validateTab(tabName: string): boolean {
  const validTabs = ["application", "process", "logs", "rules"];
  return validTabs.includes(tabName);
}

// 监听activeTab变化，确保有效性
watch(activeTab, (newTab) => {
  if (!validateTab(newTab)) {
    console.warn(`无效的页签: ${newTab}，重置为application`);
    activeTab.value = "application";
  }
});

// 打开弹窗时的处理
async function handleOpen() {
  loading.value = true;
  try {
    // 重置到第一个页签
    activeTab.value = "application";

    // 加载表单数据
    const data = await MaterialAPI.getDetail(props.id);
    Object.assign(formData, data);
    console.log(data);
    console.log(formData.reviewRemark);
    // 解析数组字段
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
    formData.volunteer = parseBackendArray(data.volunteer, data.volunteerArray, false) as number[];
    formData.competition = parseBackendArray(
      data.competition,
      data.competitionArray,
      false
    ) as number[];

    // 解析文件URL字段
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

    // 加载得分数据到评分表格
    scoreTableData[0].selfScore = formData.selfScoreAcademic || 0;
    scoreTableData[0].collegeScore = formData.collegeScoreAcademic || 0;

    scoreTableData[1].selfScore = formData.selfScoreScholarship || 0;
    scoreTableData[1].collegeScore = formData.collegeScoreScholarship || 0;

    scoreTableData[2].selfScore = formData.selfScoreAbility || 0;
    scoreTableData[2].collegeScore = formData.collegeScoreAbility || 0;

    scoreTableData[3].selfScore = formData.selfScoreInterview || 0;
    scoreTableData[3].collegeScore = formData.collegeScoreInterview || 0;

    scoreTableData[4].selfScore = formData.selfScoreIdentity || 0;
    scoreTableData[4].collegeScore = formData.collegeScoreIdentity || 0;

    scoreTableData[5].selfScore = formData.selfScoreService || 0;
    scoreTableData[5].collegeScore = formData.collegeScoreService || 0;

    scoreTableData[6].selfScore = formData.selfScoreSkill || 0;
    scoreTableData[6].collegeScore = formData.collegeScoreSkill || 0;

    // 检查编辑权限
    canEdit.value = await checkEditPermission();

    // 加载流转日志
    await loadFlowLogs();

    // 滚动到顶部
    await nextTick();
    document.querySelector(".dialog-content")?.scrollTo(0, 0);
  } catch (error) {
    ElMessage.error("加载数据失败");
    visible.value = false;
  } finally {
    loading.value = false;
  }
}

// 加载流转日志
async function loadFlowLogs() {
  try {
    const logs = await MaterialAPI.getFlowLogs(props.id);
    flowLogs.value = logs.scoreDetails || [];
  } catch (error) {
    console.error("加载流转日志失败", error);
  }
}

// 审核通过
function handleApprove() {
  ElMessageBox.confirm("确认审核通过该申请吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await MaterialAPI.return(props.id, "APPROVED", "审核通过");
      ElMessage.success("审核通过成功");
      emit("success");
      visible.value = false;
    } catch (error) {
      ElMessage.error("操作失败");
    }
  });
}

// 提交回退
function submitReturn() {
  if (!returnForm.remark.trim()) {
    ElMessage.warning("请输入退回原因");
    return;
  }
  MaterialAPI.return(props.id, "RETURNED", returnForm.remark)
    .then(() => {
      ElMessage.success("退回成功");
      showReturnDialog.value = false;
      emit("success");
      visible.value = false;
    })
    .catch((error) => {
      ElMessage.error("操作失败");
    });
}

// 获取当前步骤
function getActiveStep() {
  if (formData.status === "APPROVED") {
    return 3; // 完成步骤
  } else if (formData.status === "RETURNED") {
    return 1; // 退回步骤
  } else if (formData.status === "SUBMITTED") {
    return 1; // 提交步骤
  }
  return 0; // 草稿步骤
}

// 获取步骤状态
function getStepStatus(stepIndex: number) {
  const activeStepIndex = getActiveStep();
  if (stepIndex < activeStepIndex) {
    return "finish"; // 已完成
  } else if (stepIndex === activeStepIndex) {
    return "process"; // 进行中
  } else {
    return "wait"; // 等待中
  }
}
</script>

<style scoped>
/* 原有的所有CSS样式保持不变 */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dialog-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.status-tag {
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 5px;
}

.dialog-content {
  height: 70vh;
  overflow: hidden;
}

.custom-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.custom-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.application-layout {
  display: flex;
  gap: 15px;
  height: 100%;
}

.application-form-container {
  flex: 1;
  overflow-y: auto;
}

.score-summary-container {
  width: 300px;
  flex-shrink: 0;
}

.form-section {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
  color: #303133;
}

.blue-icon {
  color: #409eff;
  font-size: 18px;
}

.score-display {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.score-hint {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}

.form-tip {
  display: flex;
  align-items: center;
  margin-top: 6px;
  font-size: 12px;
  color: #909399;
}

.tip-icon {
  color: #409eff;
  margin-right: 5px;
}

.upload-section {
  margin-top: 10px;
}

.declaration-content {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  background-color: #f0f9ff;
  border-radius: 6px;
  margin-bottom: 15px;
}

.declaration-icon {
  color: #409eff;
  margin-right: 10px;
  margin-top: 2px;
}

.declaration-text {
  flex: 1;
  line-height: 1.6;
  color: #606266;
  font-size: 14px;
}

.score-table-container {
  margin-bottom: 15px;
}

.self-score {
  color: #67c23a;
  font-weight: bold;
}

.college-score {
  color: #409eff;
  font-weight: bold;
}

.max-score {
  color: #909399;
}

.total-label {
  font-weight: bold;
  color: #303133;
}

.self-score.total,
.college-score.total,
.max-score.total {
  font-size: 16px;
  font-weight: bold;
}

.score-summary {
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 6px;
  margin-bottom: 15px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary-item.total {
  border-top: 1px solid #dcdfe6;
  padding-top: 8px;
  margin-top: 8px;
  font-weight: bold;
  font-size: 16px;
}

.summary-label {
  color: #606266;
}

.summary-value {
  color: #409eff;
  font-weight: bold;
}

.audit-remark {
  margin-bottom: 15px;
}

.audit-actions {
  text-align: center;
}

.steps-container {
  padding: 10px;
}

.process-details {
  margin-top: 20px;
}

.process-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.process-section {
  margin-bottom: 20px;
}

.process-section h4 {
  margin-bottom: 10px;
  color: #303133;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.progress-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 6px;
  transition: all 0.3s;
}

.progress-item.active {
  background-color: #ecf5ff;
  border-left: 3px solid #409eff;
}

.progress-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  margin-right: 10px;
}

.progress-text {
  flex: 1;
  font-weight: 500;
}

.progress-time {
  font-size: 12px;
  color: #909399;
}

.opinion-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.opinion-item {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.opinion-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 500;
}

.opinion-header .blue-icon {
  margin-right: 6px;
  color: #409eff;
}

.opinion-time {
  margin-left: auto;
  font-size: 12px;
  color: #909399;
}

.opinion-content {
  color: #606266;
  line-height: 1.5;
}

.logs-container {
  padding: 10px;
}

.log-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.log-content {
  padding: 8px;
  max-height: 500px;
  overflow-y: auto;
}

.log-item {
  padding: 5px 0;
}

.log-title {
  font-weight: bold;
  margin-bottom: 3px;
}

.log-user,
.log-remark {
  font-size: 12px;
  color: #606266;
  margin-top: 2px;
}

.empty-log {
  text-align: center;
  color: #909399;
  padding: 15px 0;
}

.rules-container {
  padding: 10px;
}

.rules-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rules-content {
  padding: 8px;
}

.rules-section {
  margin-bottom: 12px;
  padding: 10px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.rules-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.rules-title {
  font-size: 14px;
  font-weight: bold;
  margin-left: 6px;
  color: #303133;
}

.rules-detail {
  padding-left: 20px;
}

.rules-detail p {
  margin: 4px 0;
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}

.rules-note {
  margin-top: 10px;
  padding: 8px;
  background-color: #f0f9ff;
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
}

.note-icon {
  color: #409eff;
  margin-right: 6px;
  margin-top: 2px;
}

.rules-note p {
  flex: 1;
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
  margin: 0;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-right {
  display: flex;
  gap: 10px;
}

/* 移动端自适应样式 */
@media screen and (max-width: 768px) {
  .application-layout {
    flex-direction: column;
  }

  .score-summary-container {
    width: 100%;
    margin-top: 15px;
  }

  .form-section {
    padding: 12px 10px !important;
    margin-bottom: 12px !important;
  }

  .section-header {
    margin-bottom: 10px !important;
  }

  .section-title {
    font-size: 15px !important;
  }

  .score-display {
    flex-direction: column;
    gap: 8px;
  }
}

/* 平板端样式 */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .application-layout {
    flex-direction: column;
  }

  .score-summary-container {
    width: 100%;
    margin-top: 15px;
  }
}
.rules-container {
  padding: 20px;
}

.rules-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.blue-icon {
  color: #409eff;
  margin-right: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}

.info-section {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.info-label {
  font-weight: bold;
  color: #606266;
}

.info-value {
  color: #303133;
  min-width: 80px;
}

.assessment-table {
  margin: 20px 0;
}

.detailed-rules {
  margin-top: 30px;
}

.rules-section {
  margin-bottom: 25px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.rules-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.rules-icon {
  margin-right: 8px;
}

.rules-title {
  font-weight: bold;
  font-size: 16px;
  color: #303133;
}

.rules-detail {
  padding-left: 24px;
}

.rules-detail p {
  margin: 5px 0;
  line-height: 1.6;
  color: #606266;
}

.sub-section {
  margin: 10px 0;
  padding-left: 10px;
}

.rules-note {
  color: #e6a23c;
  font-style: italic;
  margin-top: 8px;
}

.rules-notes {
  margin-top: 30px;
}

.notes-content p {
  margin: 5px 0;
  line-height: 1.6;
}
.status-tag {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}

.status-icon {
  margin-right: 5px;
}

.success-icon {
  color: #67c23a;
}

.primary-icon {
  color: #409eff;
  animation: rotating 2s linear infinite;
}

.warning-icon {
  color: #e6a23c;
}

.info-icon {
  color: #909399;
}

/* 添加旋转动画 */
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 大状态标签样式 */
.status-tag-large {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  padding: 8px 15px;
}

.status-tag-large .status-icon {
  margin-right: 8px;
  font-size: 18px;
}
</style>
