
--
-- 表的结构 `material_form_bak`
--

CREATE TABLE IF NOT EXISTS `material_form_bak` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `student_id` varchar(50) NOT NULL COMMENT '学号',
  `student_name` varchar(100) NOT NULL COMMENT '姓名',
  `school` varchar(200) NOT NULL COMMENT '毕业院校',
  `major` varchar(200) NOT NULL COMMENT '专业',
  `education` varchar(50) DEFAULT NULL COMMENT '最高学历',
  `graduation_date` date DEFAULT NULL COMMENT '毕业日期',
  `political_status` varchar(50) DEFAULT NULL COMMENT '政治面貌',
  `party_proof_file_ids` text COMMENT '党员证明文件ID(逗号分隔)',
  `party_valid` varchar(10) DEFAULT NULL COMMENT '党员证明真实性确认',
  `cadre_experience` varchar(50) DEFAULT NULL COMMENT '学生干部级别',
  `cadre_position` varchar(200) DEFAULT NULL COMMENT '具体职务',
  `cadre_proof_file_id` varchar(200) DEFAULT NULL COMMENT '学生干部证明文件ID',
  `cadre_valid` varchar(10) DEFAULT NULL COMMENT '学生干部证明真实性确认',
  `military_experience` varchar(10) DEFAULT NULL COMMENT '参军入伍经历',
  `military_proof_file_id` varchar(200) DEFAULT NULL COMMENT '入伍证明文件ID',
  `military_valid` varchar(10) DEFAULT NULL COMMENT '入伍证明真实性确认',
  `award_level` varchar(50) DEFAULT NULL COMMENT '获奖级别',
  `award_name` varchar(200) DEFAULT NULL COMMENT '获奖名称',
  `awards_proof_file_ids` text COMMENT '获奖证书文件ID(逗号分隔)',
  `award_valid` varchar(10) DEFAULT NULL COMMENT '获奖证书真实性确认',
  `rank_number` int(11) DEFAULT NULL COMMENT '专业排名',
  `total_students` int(11) DEFAULT NULL COMMENT '专业总人数',
  `ranking_level` varchar(20) DEFAULT NULL COMMENT '专业排名区间(top5%, top6-10%, top11-20%, top21-30%, top31-50%, over50%)',
  `failed_courses` varchar(10) DEFAULT NULL COMMENT '不及格课程',
  `transcript_file_id` varchar(200) DEFAULT NULL COMMENT '成绩单文件ID',
  `transcript_valid` varchar(10) DEFAULT NULL COMMENT '成绩单真实性确认',
  `rank_proof_file_id` varchar(200) DEFAULT NULL COMMENT '专业排名证明文件ID',
  `rank_valid` varchar(10) DEFAULT NULL COMMENT '专业排名证明真实性确认',
  `id_card_file_id` bigint(20) DEFAULT NULL COMMENT '身份证文件ID',
  `id_valid` varchar(10) DEFAULT NULL COMMENT '身份证真实性确认',
  `overall_valid` varchar(10) DEFAULT NULL COMMENT '总体声明确认',
  `status` varchar(20) NOT NULL DEFAULT '0' COMMENT '状态(0:草稿,1:已提交)',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除(0:未删除,1:已删除)',
  `ip` varchar(50) DEFAULT NULL COMMENT '提交IP地址',
  `create_by` bigint(20) DEFAULT NULL COMMENT '创建人ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `score` float DEFAULT '0' COMMENT '得分',
  `update_by` bigint(20) DEFAULT NULL COMMENT '修改人id',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_student_id` (`student_id`),
  KEY `idx_status` (`status`),
  KEY `idx_is_deleted` (`is_deleted`),
  KEY `idx_ranking_level` (`ranking_level`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='选调生材料申请表' AUTO_INCREMENT=3 ;



CREATE table material_form (
  id bigint(20) not null auto_increment comment '主键ID',
  student_id varchar(50) not null comment '学号',
  student_name varchar(100) not null comment '姓名',
  major_class varchar(100) not null comment '专业班级',
  qualify varchar(2) not null comment '是否符合申报条件(是/否)',
  
  -- 学业成绩
  gpa_score decimal(5,2) default null comment '学业平均学分绩',
  transcript_file_urls text comment '成绩单证明材料URLs,逗号分隔',
  self_score_academic decimal(5,2) default 0 comment '学业成绩自评分',
  college_score_academic decimal(5,2) default 0 comment '学业成绩学院审核分',
  
  -- 学业奖励
  scholarship varchar(200) default null comment '综合奖学金等级,逗号分隔',
  scholarship_file_urls text comment '奖学金证明材料URLs,逗号分隔',
  self_score_scholarship decimal(5,2) default 0 comment '学业奖励自评分',
  college_score_scholarship decimal(5,2) default 0 comment '学业奖励学院审核分',
  
  -- 能力素质
  civil_exam decimal(5,2) default null comment '公务员知识考察分数',
  civil_exam_file_urls text comment '公务员考试证明材料URLs,逗号分隔',
  self_score_ability decimal(5,2) default 0 comment '能力素质自评分',
  college_score_ability decimal(5,2) default 0 comment '能力素质学院审核分',
  
  -- 面试答辩
  interview_score decimal(5,2) default null comment '现场面试成绩',
  interview_proof_file_urls text comment '面试证明材料URLs,逗号分隔',
  self_score_interview decimal(5,2) default 0 comment '面试答辩自评分',
  college_score_interview decimal(5,2) default 0 comment '面试答辩学院审核分',
  
  -- 身份经历
  party varchar(50) default null comment '政治面貌',
  party_proof_file_urls text comment '政治面貌证明URLs,逗号分隔',
  military varchar(2) default null comment '是否有入伍经历(是/否)',
  military_proof_file_urls text comment '入伍证明材料URLs,逗号分隔',
  self_score_identity decimal(5,2) default 0 comment '身份经历自评分',
  college_score_identity decimal(5,2) default 0 comment '身份经历学院审核分',
  
  -- 服务方面
  cadre varchar(200) default null comment '学生骨干经历,逗号分隔',
  cadre_proof_file_urls text comment '骨干证明材料URLs,逗号分隔',
  service_award varchar(200) default null comment '服务获奖情况,逗号分隔',
  service_award_file_urls text comment '获奖证明材料URLs,逗号分隔',
  volunteer varchar(200) default null comment '志愿服务情况,逗号分隔',
  volunteer_file_urls text comment '志愿服务证明材料URLs,逗号分隔',
  self_score_service decimal(5,2) default 0 comment '服务方面自评分',
  college_score_service decimal(5,2) default 0 comment '服务方面学院审核分',
  
  -- 个人技能
  competition varchar(200) default null comment '各类赛事获奖,逗号分隔',
  competition_file_urls text comment '获奖证明材料URLs,逗号分隔',
  self_score_skill decimal(5,2) default 0 comment '个人技能自评分',
  college_score_skill decimal(5,2) default 0 comment '个人技能学院审核分',
  
  -- 身份信息材料
  id_card_file_urls text comment '身份证件URLs,逗号分隔',
  other_file_urls text comment '其他补充材料URLs,逗号分隔',
  
  -- 总体声明
  overall_valid varchar(2) default null comment '声明确认(是/否)',
  
  -- 流程相关
  status varchar(2) not null default '0' comment '状态(0-未提交,1-草稿,2-已提交)',
  is_deleted tinyint(1) not null default 0 comment '是否删除(0-否,1-是)',
  submit_time datetime default null comment '提交时间',
  create_time datetime not null default current_timestamp comment '创建时间',
  update_time datetime not null default current_timestamp on update current_timestamp comment '更新时间',
  ip varchar(50) DEFAULT NULL COMMENT '提交IP地址',

  primary key (id),
  unique key uk_student_id (student_id) comment '学号唯一索引'
) engine=InnoDB default charset=utf8 comment '信息与电气工程学院选调生考试资格量化考核评价表';

ALTER TABLE material_form
ADD COLUMN create_by bigint DEFAULT NULL COMMENT '创建人ID';

