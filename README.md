<div align="center">
  <img alt="vue3-element-admin" width="80" height="80" src="./src/assets/logo.png">
  <h1>micrai-cms-admin</h1>



</div>

![](https://foruda.gitee.com/images/1708618984641188532/a7cca095_716974.png "rainbow.png")





## 项目简介

[micrai-cms-admin](https://gitee.com/hebwkznkjyxgs_admin/micrai-cms-admin.git) 基于 Vue3、Vite7、TypeScript 和 Element-Plus 搭建的极简AI后台管理前端模板，可用于网站后台、智能体后台、协同办公前端。 配套 Java 后端   和 python  智能体后端  。

## 项目特色

- **AI功能：**   同时与多个大模型对话中下指令，创作生成文本内容、视频，并分发到头条、抖音、小红书等。
- **数据交互**： [线上接口文档](http://micrai.com:8045/swagger-ui/index.html)，并提供配套的 [Java]  和 [python]  后端源码。
- **简洁易用**： Vue3版本的后台管理系统，可用于网站后台，协同办公、智能体后台。
- **系统功能：** 提供用户管理、角色管理、菜单管理、部门管理、字典管理、系统配置、文章管理 、栏目管理、日志管理等功能模块。
- **权限管理：** 支持动态路由、按钮权限、角色权限和数据权限等多种权限管理方式。
- **基础设施：** 提供国际化、多布局、暗黑模式、全屏、水印、接口文档等功能。
- **持续更新**：项目持续开源更新，实时更新工具和依赖。


## 项目截图

🖥️ **控制台**

  <img src="./src/assets/1.png"/>
  <img src="./src/assets/2.png"/>
  <img src="./src/assets/3.png"/>
  <img src="./src/assets/ai.png"/>




## 项目启动

- **环境准备**

| 环境类型       | 名称                     |     备注          |
|----------------|---------------|----------- |
| **开发工具**   | [Visual Studio Code](https://code.visualstudio.com/Download) |
| **运行环境**   | ^20.19.0 || >=22.12.0  |    20.19.0+ 或 22.12.0 及以上版本   |


- **快速开始**

```bash
# 克隆代码
git clone https://gitee.com/hebwkznkjyxgs_admin/micrai-cms-admin.git

# 切换目录
cd vue3-element-admin

# 安装 pnpm
npm install pnpm -g

# 设置镜像源(可忽略)
pnpm config set registry https://registry.npmmirror.com

# 安装依赖
pnpm install

# 启动运行
pnpm run dev
```


## 项目部署

执行 `pnpm run build` 命令后，项目将被打包并生成 `dist` 目录。接下来，将 `dist` 目录下的文件上传到服务器 `/usr/share/nginx/html` 目录下，并配置 Nginx 进行反向代理。

```bash
pnpm run build
```

以下是 Nginx 的配置示例：

```nginx
server {
    listen      80;
    server_name localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    # 反向代理配置
    location /prod-api/ {
        # 请将  端口 8045 替换为您的后端 端口 地址，并注意保留后面的斜杠 /
        proxy_pass http://localhost:8045/;
    }
}
```


## 后端接口

> Java后台，按照以下步骤将在线接口转为本地后端接口，创建企业级前后端分离开发环境，助您走向全栈之路。

1. 获取基于 `Java` 和 `SpringBoot` 开发的后端  源码。
2. 根据后端工程的说明文档 [README.md]  完成本地启动。
3. # 线上  .env.production 中的  VITE_APP_API_URL = ''  # 关键修改：留空后，请求会自动使用当前页面的域名（如 demo.micrai.com）
4.json 示例：
{
    "chatMessages": [],
    "tools": [
        "read_first_chunk",
        "read_next_chunk",
        "read_previous_chunk",
        "ask_user",
        "finish_with_summary",
        "plan",
        "replace_document",
        "apply_diff"
    ],
    "modelName": "gpt-4.1",
    "schemaAwarenessData": {
        "extensionNames": [
            "link",
            "paragraph",
            "editable",
            "clipboardTextSerializer",
            "commands",
            "focusEvents",
            "keymap",
            "tabindex",
            "drop",
            "paste",
            "delete",
            "starterKit",
            "bold",
            "blockquote",
            "bulletList",
            "code",
            "codeBlock",
            "doc",
            "dropCursor",
            "gapCursor",
            "hardBreak",
            "heading",
            "undoRedo",
            "horizontalRule",
            "italic",
            "listItem",
            "listKeymap",
            "orderedList",
            "strike",
            "text",
            "underline",
            "trailingNode",
            "aiAgent",
            "tiptapAiAgentInlineSelection",
            "tiptapAiAgentBlockSelection"
        ],
        "customNodes": []
    }
}

Thanks to all the contributors!
感谢所有的贡献者！




## 特别感谢

- 感谢 [GitCode](https://gitcode.com/) 官方的 [G-Star](https://gitcode.com/g-star) 认证

## 演示网址

-  [演示网址](http://demo.micrai.com/) http://demo.micrai.com/   管理员帐号：test1  密码：111111




## 加群交流
[] <img alt="微智能体全栈交流群" width="280"  src="./src/assets/wx.jpg">

② 直接添加微信 **`cwebcrm`** 备注「前端/后端/全栈」。









{
    "model": "ai",
    "messages": [
        {
            "id": "b3a6376a-f069-406f-869c-59e90a80dad5",
            "role": "user",
            "content": "学校有多少人",
            "timestamp": 1757214457
        },
        {
            "id": "77993904-2cbc-4e8b-9469-6842a9e89c8f",
            "role": "assistant",
            "content": "根据最新数据，黑龙江八一农垦大学全日制在校本科生约18400余人，各类在校研究生近2900人[1]。八一农大人始终保持着艰苦奋斗的精神，欢迎你加入这个大家庭！😊 需要了解其他信息可以随时问我~",
            "timestamp": 1757214457,
            "usage": {
                "completion_tokens": 53,
                "prompt_tokens": 592,
                "total_tokens": 645
            },
            "sources": [
                {
                    "source": {
                        "id": "60586595-6b66-4ed1-838a-dbc249ca438f",
                        "user_id": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                        "name": "学校简介",
                        "description": "学校简介",
                        "meta": null,
                        "access_control": {
                            "read": {
                                "group_ids": [
                                    "b6c656ae-4cca-4786-b0c9-bba9a2453cae",
                                    "56fa3880-ea49-4888-ba25-20794303b441"
                                ],
                                "user_ids": []
                            },
                            "write": {
                                "group_ids": [],
                                "user_ids": []
                            }
                        },
                        "created_at": 1757212211,
                        "updated_at": 1757212294,
                        "user": {
                            "id": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "name": "micrai",
                            "email": "22104416@qq.com",
                            "Student_ID": null,
                            "Mobile": "15663822501",
                            "className": null,
                            "role": "admin",
                            "profile_image_url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAABPFJREFUeF7tnW+IFHUcxp8ZZ26360wtqHdedpaa0KsKTgkyMMo6+ktgvQhLkiDoRX9fFfTGtII4Kkik6EVCUVSU/bHI/HthofiPUlJJ08s/peR1uzOzMxMz2647u3O3s5PGEz0L9+Zu5zcPz2efZ76/3TnWOL3ywhB60DhgCAgNi1iIgHDxEBAyHgIiIGwOkOnRNURAyBwgk6OECAiZA2RylBABIXOATI4SIiBkDpDJUUIEhMwBMjlKiICQOUAmRwkREDIHyOQoIQJC5gCZHCVEQMgcIJOjhAgImQNkcpQQASFzgEyOEiIgZA6QyVFCBITMATI5dAnpvmszzMkzkjYFLtztg3C3Ls1ln2H34LxbPoZ50VWJ44NTezD6/pxca56rg/4bQAD4R9aj9NkduXyw+u5GoX8ZjMJkAenUwdSEAAhHh1Fe9zD8Ixs6XRKFuS/CnnE/YJgC0ql7YwFBztoaq64iXaqsDHQSQMIAiH5MKz4yT23Zly9EV/9SGPbE6lqGEf3jWLyegHQIJPT+RFg+AXNib3xkntoqXDcI+4p7Ywhh6Rhg98CwugUkA4v4KY0JCb0R+Ie/gdW7oNr/vgN323K421/OtFxcVwNfwJwyM8IJ//A6mBdfjej3SkgmC1uBeDtfhT17SX1Cqhxag/KahZlWa6yr0DsNb/eK6loCksm/1IS4Q0/Dnv1QfQ8RjhxCee1i+Me+b7toY10FJ3+Et/MVdPU/LyBtnWt4QnNlOZufwIRLrj0ztmasLXNSH4rzV8GcND2uK2/vKvjDG1GY84KA/FMg0XTUuLHLUlv2rAfRdc2zMOzzETqn4Aw9FV+HBKQTGikX9Sgh/s+fJt76yFJbxetXwOq7M56ugt92oLR6ABN6FwhIhzxapqwISOWnd5O77Ta1lairMIC35y04mx6HNf0eATlbQJrfjxqvttLqqrLvPQHpFEbaPqSWkPhvt6+tT1vByEGUv34AwfFtLadJq6toT6OE5CCSNmVFlRU9Cv3LYc9a9PcmsQx36zK4OwYTZ4nr6sZ3YF4wLX6rxPvhTThDT8bPEZCzDMSadhsKc1+CUZgSr1w5+DnKX96XOIt95eLqdGV1I3ROwtn0GCoHPhKQHCxSN4aNlZWltorzVsK6rPq5STRdjX44ry5FCclBZbzKaldbiboKKvB2vw5nyzMCkoND/ZB2QMarrURdlU7A2fhoXGu1hxKSg0w7IOPVVnH+27Cm3hSf1T+6BaVPbk4oEJBzBCRt2qoMb0Dxhjdg9kwFUupKU1YOGPGrv+Guk2jv0HxRj41tnrb2fwD/6LdnpqvScZTXPwL/l6+UkJwcMl9Dak9MbBL/OIDg912wLh2o1tWvQyitvrVFiiorB50sCWmZtiolhL5T/RAr8ODueg3ud88JSA7/Ww7JCqS5tmoLhWPUla4hOelkBdI8bdVON1ZdCci/ACQxbUXna3Pvlq4hOaB0kpDm2mp3m5CA5ADyfz+E7mZrAdHXVVC9BpQQKhz6ugoyHAIiIHQOkAnSNURAyBwgk6OECAiZA2RylBABIXOATI4SIiBkDpDJUUIEhMwBMjlKiICQOUAmRwkREDIHyOQoIQJC5gCZHCVEQMgcIJOjhAgImQNkcpQQASFzgEyOEiIgZA6QyVFCBITMATI5SoiAkDlAJkcJERAyB8jkKCECQuYAmZy/AKgE6hLFM5iHAAAAAElFTkSuQmCC"
                        },
                        "files": [
                            {
                                "id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                                "meta": {
                                    "name": "学校简介.txt",
                                    "content_type": "text/plain",
                                    "size": 7839,
                                    "data": {},
                                    "collection_name": "60586595-6b66-4ed1-838a-dbc249ca438f"
                                },
                                "created_at": 1757212294,
                                "updated_at": 1757212294
                            }
                        ],
                        "type": "collection"
                    },
                    "document": [
                        "黑龙江八一农垦大学(简称\"八一农大\")始建于1958年,由时任国家农垦部部长王震将军主持创办并任首任校长。学校原隶属于国家农垦部,1973年划归黑龙江省人民政府。经过67年的发展建设,现已成为一所具有鲜明现代化大农业特色、以农为主、多学科协调发展的农业大学。\n\n学校诞生于十万复转官兵开发建设北大荒的历史大潮中,原校址位于密山市裴德镇。边疆农村办学45年,师生发扬解放军优良传统和\"抗大校风\",传承北大荒精神,走出了一条自强不息、砥砺奋进的发展之路。2003年学校迁入大庆市,进入提速升级、跨越发展的新时期。在长期的办学实践中,凝练形成了\"艰苦奋斗、无私奉献、务实求真、负重致远\"的办学精神,并因优良校风和办学实绩赢得了社会的广泛赞誉。\n\n学校现址位于大庆市高新技术产业开发区,总占地132.52万平方米(含密山实习用地),建筑面积41.89万平方米,固定资产总值15.48亿元,教学科研仪器设备3.75亿元,图书235.85万册,其中纸质图书130.252万册。\n\n学校现有教职工1445人,其中专任教师985人,教授200人、副教授292人,具有博士学位教师440人,占比44.7%;海外经历累计1年以上教师132人,占比13.4%。学校拥有国家级人才项目入选者4人、\"龙江学者\"特聘教授1人、\"龙江学者\"青年学者4人、省杰青2人、全国优秀教师2人、省级教学名师9人、农业农村部产业技术体系岗位科学家2人;现有95名省级高层次人才。建有1个科技部重点领域创新团队、1个黑龙江省杂粮绿色生产及食品深加工技术研发\"头雁\"团队,2个省级专业技术领军人才梯队;先后聘用\"双聘院士\"2人,\"王震讲座教授\"22人,享受国务院和省政府特殊津贴41人。\n\n学校建有12个本科学院以及马克思主义学院、体育教研部、继续教育学院等教学机构,学科专业涉及农学、工学、管理学、理学、法学、文学、经济学7个学科门类,建有4个博士后科研流动站及1个博士后科研工作站;拥有4个一级学科博士点,12个一级学科硕士点,7个硕士专业学位类别,\"杂粮生产与加工\"\"玉鹅种养生态农业\"2个省\"双一流\"特色学科,植物与动物科学、农业科学学科连续两年进入ESI全球排名前1%;本科招生专业50个,其中国家级特色专业3个、省级重点专业9个,国家级一流专业建设点8个、省级一流专业16个。",
                        "学校始终把北大荒精神作为最可宝贵的精神财富,自觉将北大荒精神融入办学育人的全过程。建有教育部高校思想政治工作队伍培训研修合作研学基地、教育部红色文化弘扬基地、黑龙江省北大荒精神学术交流基地、黑龙江省学校思想政治理论课教师社会实践研修基地、黑龙江省社会科学普及基地(北大荒精神展示馆)和北大荒精神与文化研究所,充分发挥地缘、人才和科研资源优势,坚持把红色资源利用好、把红色传统发扬好、把红色基因传承好,产出了《黑土上的中国》《淬荒集》等一批较有影响力的文化成果,培养了一大批具有北大荒精神烙印的知农爱农新型人才。\n\n学校坚持\"育人为本、质量立校、崇尚学术、特色发展\"的办学理念,以立德树人为根本任务,以强农兴农为己任,以服务龙江高质量发展可持续振兴、服务国家农业现代化为办学使命,以产教融合发展为导向,以质量提升为核心,着力提高学校内涵发展水平和办学综合实力,固本拓新,奋楫图强,为奋力谱写特色高水平研究应用型农业大学建设新篇章而努力奋斗。\n\n (截至2025年5月)",
                        "学校科研工作以应用研究和技术开发为主要方向,建有国家杂粮工程技术中心、新农村发展学院,教育部粮食副产物加工与利用工程技术研究中心、农业农村部农产品及加工品质量监督检验测试中心(大庆)等30个国家、省部级科研平台,以及7个省高校重点实验室、工程技术研发中心。学校注重科技成果转化运用,深化与北大荒农垦集团等企业、大庆市等地方政府合作,共建了10个北大荒农垦集团创新研究院、4个校地产教融合基地和15个省级产业技术研究院,服务地方经济社会发展。\"十三五\"以来,学校承担国家、省部项目共计537项,各级部门科研经费共计5.65亿元。建校以来,学校共取得科研成果1950余项,获得国家科技进步奖7项、省部级奖励188项,以\"大豆三垄栽培技术\"\"农作物种衣剂\"\"大豆、水稻生产加工全程安全控制关键技术\"\"牛重要疫病防控关键技术研究与应用\"\"'狮白鹅'选育及'玉鹅'生态种养模式\"\"黑龙江水稻大面积均衡高产优质栽培综合配套技术\"\"现代化农机关键技术及装备\"等为代表的一批重大科研成果在生产实践中得到有效转化,创造了巨大的经济效益和社会效益。先后3次获得\"黑龙江省省长特别奖\",2次获得\"黑龙江省大专院校和科研单位振兴经济奖\",10次获得黑龙江省科学技术奖一等奖。\n\n学校坚持开放办学,与美国、英国、加拿大、俄罗斯、法国、韩国、日本、印度、乌克兰、波兰、马来西亚等国家和地区近31所高校和科研院所开展交流与合作。现为\"中俄寒地农业大学联盟\"\"中国东北地区与俄罗斯远东及西伯利亚地区大学联盟\"\"一带一路南南合作农业教育科技创新联盟\"和\"丝绸之路农业教育科技创新联盟\"成员。目前,学校与俄罗斯符拉迪沃斯托克国立经济服务大学实施本科生中外合作办学项目,与韩国国立江陵原州大学、济州大学、日本山形大学等国外高校实施交换生项目,与加拿大阿尔伯塔大学实施\"中加合作食品研究发展中心\"项目,与印度UAS大学实施中印杂粮工程技术研究中心项目。与近30所高校和科研院所开展中外导师联合培养研究生项目,累计培养博士、硕士研究生36人。"
                    ],
                    "metadata": [
                        {
                            "content_type": "text/plain",
                            "created_by": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "data": "{}",
                            "embedding_config": "{'engine': '', 'model': 'sentence-transformers/all-MiniLM-L6-v2'}",
                            "file_id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                            "hash": "6d109f4df2645f93454c7e415cb8c146349edd3d37864247ba84a2caa118cd85",
                            "name": "学校简介.txt",
                            "size": 7839,
                            "source": "学校简介.txt",
                            "start_index": 0
                        },
                        {
                            "content_type": "text/plain",
                            "created_by": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "data": "{}",
                            "embedding_config": "{'engine': '', 'model': 'sentence-transformers/all-MiniLM-L6-v2'}",
                            "file_id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                            "hash": "6d109f4df2645f93454c7e415cb8c146349edd3d37864247ba84a2caa118cd85",
                            "name": "学校简介.txt",
                            "size": 7839,
                            "source": "学校简介.txt",
                            "start_index": 2320
                        },
                        {
                            "content_type": "text/plain",
                            "created_by": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "data": "{}",
                            "embedding_config": "{'engine': '', 'model': 'sentence-transformers/all-MiniLM-L6-v2'}",
                            "file_id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                            "hash": "6d109f4df2645f93454c7e415cb8c146349edd3d37864247ba84a2caa118cd85",
                            "name": "学校简介.txt",
                            "size": 7839,
                            "source": "学校简介.txt",
                            "start_index": 1468
                        }
                    ],
                    "distances": [
                        0.6436462879656595,
                        0.6287162434418825,
                        0.6240660336057893
                    ]
                }
            ]
        }
    ],
    "chat_id": "6214c52e-65b4-42c1-b158-3cf714aadec4",
    "session_id": "_i6Cv6hghan_w36IAAAl",
    "id": "77993904-2cbc-4e8b-9469-6842a9e89c8f"
}



{
    "model": "qwen3-06b",
    "messages": [
        {
            "id": "0824eea2-d01c-444c-9835-39995c99c70b",
            "role": "user",
            "content": "一共多少人，学生和老师",
            "timestamp": 1757217673
        },
        {
            "id": "bfccf838-b0f3-491f-957c-522b451d42b6",
            "role": "assistant",
            "content": "<details type=\"reasoning\" done=\"true\" duration=\"2\">\n<summary>Thought for 2 seconds</summary>\n> 好的，我现在需要回答用户的问题：“一共多少人，学生和老师”。根据提供的检索信息，我需要仔细查看相关的内容，确保答案准确。\n> \n> 首先，我注意到用户提供的检索信息中没有明确提到总人数，只有一条信息：“{context}”。这可能意味着用户的问题与这个部分无关，或者可能需要更多的上下文。不过，根据用户的要求，必须严格依据提供的检索信息来回答，因此我需要假设用户的问题可能与该部分的信息有关，或者可能该部分的信息不足以回答问题。\n> \n> 在这种情况下，可能需要检查是否有其他信息被遗漏。但根据当前的信息，似乎没有直接提到总人数以及学生和老师的数量。因此，可能需要指出信息不足，或者根据现有信息进行合理推测，但必须确保不编造信息。\n> \n> 另外，用户可能希望得到一个具体的数字，但如果没有明确的数据，回答可能无法完成。因此，我需要确认是否有其他线索，或者是否可能该问题的答案在其他部分有提及，但根据当前的检索，似乎没有。在这种情况下，可能需要回复信息不足，或者询问用户是否有其他问题。\n> \n> 最后，确保回答符合要求，使用中文，逻辑清晰，不编造信息，不泄露隐私。因此，最终的回答可能需要指出信息不足，或者询问更多细节，但根据用户的问题，可能直接无法回答，因此可能需要回复无法确定。\n</details>\n根据提供的检索信息，无法确定学生和老师的总数。若需获取具体数字，可能需要补充更多相关数据或信息。",
            "timestamp": 1757217673,
            "usage": {
                "prompt_tokens": 107,
                "total_tokens": 422,
                "completion_tokens": 315
            },
            "sources": [
                {
                    "source": {
                        "id": "60586595-6b66-4ed1-838a-dbc249ca438f",
                        "user_id": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                        "name": "学校简介",
                        "description": "学校简介",
                        "meta": null,
                        "access_control": {
                            "read": {
                                "group_ids": [
                                    "b6c656ae-4cca-4786-b0c9-bba9a2453cae",
                                    "56fa3880-ea49-4888-ba25-20794303b441"
                                ],
                                "user_ids": []
                            },
                            "write": {
                                "group_ids": [],
                                "user_ids": []
                            }
                        },
                        "created_at": 1757212211,
                        "updated_at": 1757212294,
                        "user": {
                            "id": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "name": "micrai",
                            "email": "22104416@qq.com",
                            "Student_ID": null,
                            "Mobile": "15663822501",
                            "className": null,
                            "role": "admin",
                            "profile_image_url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAABPFJREFUeF7tnW+IFHUcxp8ZZ26360wtqHdedpaa0KsKTgkyMMo6+ktgvQhLkiDoRX9fFfTGtII4Kkik6EVCUVSU/bHI/HthofiPUlJJ08s/peR1uzOzMxMz2647u3O3s5PGEz0L9+Zu5zcPz2efZ76/3TnWOL3ywhB60DhgCAgNi1iIgHDxEBAyHgIiIGwOkOnRNURAyBwgk6OECAiZA2RylBABIXOATI4SIiBkDpDJUUIEhMwBMjlKiICQOUAmRwkREDIHyOQoIQJC5gCZHCVEQMgcIJOjhAgImQNkcpQQASFzgEyOEiIgZA6QyVFCBITMATI5dAnpvmszzMkzkjYFLtztg3C3Ls1ln2H34LxbPoZ50VWJ44NTezD6/pxca56rg/4bQAD4R9aj9NkduXyw+u5GoX8ZjMJkAenUwdSEAAhHh1Fe9zD8Ixs6XRKFuS/CnnE/YJgC0ql7YwFBztoaq64iXaqsDHQSQMIAiH5MKz4yT23Zly9EV/9SGPbE6lqGEf3jWLyegHQIJPT+RFg+AXNib3xkntoqXDcI+4p7Ywhh6Rhg98CwugUkA4v4KY0JCb0R+Ie/gdW7oNr/vgN323K421/OtFxcVwNfwJwyM8IJ//A6mBdfjej3SkgmC1uBeDtfhT17SX1Cqhxag/KahZlWa6yr0DsNb/eK6loCksm/1IS4Q0/Dnv1QfQ8RjhxCee1i+Me+b7toY10FJ3+Et/MVdPU/LyBtnWt4QnNlOZufwIRLrj0ztmasLXNSH4rzV8GcND2uK2/vKvjDG1GY84KA/FMg0XTUuLHLUlv2rAfRdc2zMOzzETqn4Aw9FV+HBKQTGikX9Sgh/s+fJt76yFJbxetXwOq7M56ugt92oLR6ABN6FwhIhzxapqwISOWnd5O77Ta1lairMIC35y04mx6HNf0eATlbQJrfjxqvttLqqrLvPQHpFEbaPqSWkPhvt6+tT1vByEGUv34AwfFtLadJq6toT6OE5CCSNmVFlRU9Cv3LYc9a9PcmsQx36zK4OwYTZ4nr6sZ3YF4wLX6rxPvhTThDT8bPEZCzDMSadhsKc1+CUZgSr1w5+DnKX96XOIt95eLqdGV1I3ROwtn0GCoHPhKQHCxSN4aNlZWltorzVsK6rPq5STRdjX44ry5FCclBZbzKaldbiboKKvB2vw5nyzMCkoND/ZB2QMarrURdlU7A2fhoXGu1hxKSg0w7IOPVVnH+27Cm3hSf1T+6BaVPbk4oEJBzBCRt2qoMb0Dxhjdg9kwFUupKU1YOGPGrv+Guk2jv0HxRj41tnrb2fwD/6LdnpqvScZTXPwL/l6+UkJwcMl9Dak9MbBL/OIDg912wLh2o1tWvQyitvrVFiiorB50sCWmZtiolhL5T/RAr8ODueg3ud88JSA7/Ww7JCqS5tmoLhWPUla4hOelkBdI8bdVON1ZdCci/ACQxbUXna3Pvlq4hOaB0kpDm2mp3m5CA5ADyfz+E7mZrAdHXVVC9BpQQKhz6ugoyHAIiIHQOkAnSNURAyBwgk6OECAiZA2RylBABIXOATI4SIiBkDpDJUUIEhMwBMjlKiICQOUAmRwkREDIHyOQoIQJC5gCZHCVEQMgcIJOjhAgImQNkcpQQASFzgEyOEiIgZA6QyVFCBITMATI5SoiAkDlAJkcJERAyB8jkKCECQuYAmZy/AKgE6hLFM5iHAAAAAElFTkSuQmCC"
                        },
                        "files": [
                            {
                                "id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                                "meta": {
                                    "name": "学校简介.txt",
                                    "content_type": "text/plain",
                                    "size": 7839,
                                    "data": {},
                                    "collection_name": "60586595-6b66-4ed1-838a-dbc249ca438f"
                                },
                                "created_at": 1757212294,
                                "updated_at": 1757212294
                            }
                        ],
                        "type": "collection"
                    },
                    "document": [
                        "黑龙江八一农垦大学(简称\"八一农大\")始建于1958年,由时任国家农垦部部长王震将军主持创办并任首任校长。学校原隶属于国家农垦部,1973年划归黑龙江省人民政府。经过67年的发展建设,现已成为一所具有鲜明现代化大农业特色、以农为主、多学科协调发展的农业大学。\n\n学校诞生于十万复转官兵开发建设北大荒的历史大潮中,原校址位于密山市裴德镇。边疆农村办学45年,师生发扬解放军优良传统和\"抗大校风\",传承北大荒精神,走出了一条自强不息、砥砺奋进的发展之路。2003年学校迁入大庆市,进入提速升级、跨越发展的新时期。在长期的办学实践中,凝练形成了\"艰苦奋斗、无私奉献、务实求真、负重致远\"的办学精神,并因优良校风和办学实绩赢得了社会的广泛赞誉。\n\n学校现址位于大庆市高新技术产业开发区,总占地132.52万平方米(含密山实习用地),建筑面积41.89万平方米,固定资产总值15.48亿元,教学科研仪器设备3.75亿元,图书235.85万册,其中纸质图书130.252万册。\n\n学校现有教职工1445人,其中专任教师985人,教授200人、副教授292人,具有博士学位教师440人,占比44.7%;海外经历累计1年以上教师132人,占比13.4%。学校拥有国家级人才项目入选者4人、\"龙江学者\"特聘教授1人、\"龙江学者\"青年学者4人、省杰青2人、全国优秀教师2人、省级教学名师9人、农业农村部产业技术体系岗位科学家2人;现有95名省级高层次人才。建有1个科技部重点领域创新团队、1个黑龙江省杂粮绿色生产及食品深加工技术研发\"头雁\"团队,2个省级专业技术领军人才梯队;先后聘用\"双聘院士\"2人,\"王震讲座教授\"22人,享受国务院和省政府特殊津贴41人。\n\n学校建有12个本科学院以及马克思主义学院、体育教研部、继续教育学院等教学机构,学科专业涉及农学、工学、管理学、理学、法学、文学、经济学7个学科门类,建有4个博士后科研流动站及1个博士后科研工作站;拥有4个一级学科博士点,12个一级学科硕士点,7个硕士专业学位类别,\"杂粮生产与加工\"\"玉鹅种养生态农业\"2个省\"双一流\"特色学科,植物与动物科学、农业科学学科连续两年进入ESI全球排名前1%;本科招生专业50个,其中国家级特色专业3个、省级重点专业9个,国家级一流专业建设点8个、省级一流专业16个。",
                        "学校主动融入黑龙江省产业转型升级和创新驱动发展,创新人才培养模式,促进产教深度融合,努力培养社会责任感强、专业基础扎实、具有创新创业精神和实践能力的应用型人才。获批\"黑龙江省特色应用型本科示范高校\"\"黑龙江省课程思政建设示范高校\"\"黑龙江省深化创新创业教育改革示范高校\"\"黑龙江省高校毕业生就业创业工作示范校\"\"黑龙江省首批依法治校示范校\";\"北大荒农产品加工现代产业学院\"获批教育部首批现代产业学院;获评国家级一流课程5门、省级一流课程40门,获批省级研究生课程思政建设项目20项、省级研究生精品课程8项。学校面向24个省(自治区、直辖市)招生,全日制在校本科生18400余人,各类在校研究生近2900人。建校以来,学校累计向社会输送本硕博毕业生16余万人,高等学历继续教育3.5余万人,毕业生连续两年获得全国\"高校毕业生基层就业卓越奖\"。以强农兴农为主线,平均每年开展培训班20余个,培训1000余人。推动科技走向田间地头,以\"三区人才\"\"科技特派员\"\"基地\"为依托,科技服务历年累计培训15余万人。学校已成为农垦现代化大农业创新人才培养基地和科技研发基地,享有\"垦区黄埔\"之盛誉。",
                        "学校始终把北大荒精神作为最可宝贵的精神财富,自觉将北大荒精神融入办学育人的全过程。建有教育部高校思想政治工作队伍培训研修合作研学基地、教育部红色文化弘扬基地、黑龙江省北大荒精神学术交流基地、黑龙江省学校思想政治理论课教师社会实践研修基地、黑龙江省社会科学普及基地(北大荒精神展示馆)和北大荒精神与文化研究所,充分发挥地缘、人才和科研资源优势,坚持把红色资源利用好、把红色传统发扬好、把红色基因传承好,产出了《黑土上的中国》《淬荒集》等一批较有影响力的文化成果,培养了一大批具有北大荒精神烙印的知农爱农新型人才。\n\n学校坚持\"育人为本、质量立校、崇尚学术、特色发展\"的办学理念,以立德树人为根本任务,以强农兴农为己任,以服务龙江高质量发展可持续振兴、服务国家农业现代化为办学使命,以产教融合发展为导向,以质量提升为核心,着力提高学校内涵发展水平和办学综合实力,固本拓新,奋楫图强,为奋力谱写特色高水平研究应用型农业大学建设新篇章而努力奋斗。\n\n (截至2025年5月)",
                        "学校科研工作以应用研究和技术开发为主要方向,建有国家杂粮工程技术中心、新农村发展学院,教育部粮食副产物加工与利用工程技术研究中心、农业农村部农产品及加工品质量监督检验测试中心(大庆)等30个国家、省部级科研平台,以及7个省高校重点实验室、工程技术研发中心。学校注重科技成果转化运用,深化与北大荒农垦集团等企业、大庆市等地方政府合作,共建了10个北大荒农垦集团创新研究院、4个校地产教融合基地和15个省级产业技术研究院,服务地方经济社会发展。\"十三五\"以来,学校承担国家、省部项目共计537项,各级部门科研经费共计5.65亿元。建校以来,学校共取得科研成果1950余项,获得国家科技进步奖7项、省部级奖励188项,以\"大豆三垄栽培技术\"\"农作物种衣剂\"\"大豆、水稻生产加工全程安全控制关键技术\"\"牛重要疫病防控关键技术研究与应用\"\"'狮白鹅'选育及'玉鹅'生态种养模式\"\"黑龙江水稻大面积均衡高产优质栽培综合配套技术\"\"现代化农机关键技术及装备\"等为代表的一批重大科研成果在生产实践中得到有效转化,创造了巨大的经济效益和社会效益。先后3次获得\"黑龙江省省长特别奖\",2次获得\"黑龙江省大专院校和科研单位振兴经济奖\",10次获得黑龙江省科学技术奖一等奖。\n\n学校坚持开放办学,与美国、英国、加拿大、俄罗斯、法国、韩国、日本、印度、乌克兰、波兰、马来西亚等国家和地区近31所高校和科研院所开展交流与合作。现为\"中俄寒地农业大学联盟\"\"中国东北地区与俄罗斯远东及西伯利亚地区大学联盟\"\"一带一路南南合作农业教育科技创新联盟\"和\"丝绸之路农业教育科技创新联盟\"成员。目前,学校与俄罗斯符拉迪沃斯托克国立经济服务大学实施本科生中外合作办学项目,与韩国国立江陵原州大学、济州大学、日本山形大学等国外高校实施交换生项目,与加拿大阿尔伯塔大学实施\"中加合作食品研究发展中心\"项目,与印度UAS大学实施中印杂粮工程技术研究中心项目。与近30所高校和科研院所开展中外导师联合培养研究生项目,累计培养博士、硕士研究生36人。"
                    ],
                    "metadata": [
                        {
                            "content_type": "text/plain",
                            "created_by": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "data": "{}",
                            "embedding_config": "{'engine': '', 'model': 'sentence-transformers/all-MiniLM-L6-v2'}",
                            "file_id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                            "hash": "6d109f4df2645f93454c7e415cb8c146349edd3d37864247ba84a2caa118cd85",
                            "name": "学校简介.txt",
                            "size": 7839,
                            "source": "学校简介.txt",
                            "start_index": 0
                        },
                        {
                            "content_type": "text/plain",
                            "created_by": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "data": "{}",
                            "embedding_config": "{'engine': '', 'model': 'sentence-transformers/all-MiniLM-L6-v2'}",
                            "file_id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                            "hash": "6d109f4df2645f93454c7e415cb8c146349edd3d37864247ba84a2caa118cd85",
                            "name": "学校简介.txt",
                            "size": 7839,
                            "source": "学校简介.txt",
                            "start_index": 973
                        },
                        {
                            "content_type": "text/plain",
                            "created_by": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "data": "{}",
                            "embedding_config": "{'engine': '', 'model': 'sentence-transformers/all-MiniLM-L6-v2'}",
                            "file_id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                            "hash": "6d109f4df2645f93454c7e415cb8c146349edd3d37864247ba84a2caa118cd85",
                            "name": "学校简介.txt",
                            "size": 7839,
                            "source": "学校简介.txt",
                            "start_index": 2320
                        },
                        {
                            "content_type": "text/plain",
                            "created_by": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "data": "{}",
                            "embedding_config": "{'engine': '', 'model': 'sentence-transformers/all-MiniLM-L6-v2'}",
                            "file_id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                            "hash": "6d109f4df2645f93454c7e415cb8c146349edd3d37864247ba84a2caa118cd85",
                            "name": "学校简介.txt",
                            "size": 7839,
                            "source": "学校简介.txt",
                            "start_index": 1468
                        }
                    ],
                    "distances": [
                        0.6571581273448582,
                        0.6377944358036974,
                        0.6353297729844222,
                        0.623508325976676
                    ]
                }
            ]
        },
        {
            "id": "eb17e9b8-2676-4314-9a4b-07da61e0aaf0",
            "role": "user",
            "content": "都不对，本科生 18400人，知识库中有啊",
            "timestamp": 1757217864
        },
        {
            "id": "f738ed27-c204-44d1-b65a-6a996751fb50",
            "role": "assistant",
            "content": "<details type=\"reasoning\" done=\"true\" duration=\"0\">\n<summary>Thought for 0 seconds</summary>\n> 好的，用户之前问的是学生和老师的总数，但根据检索到的信息，无法确定具体数字。用户可能在之前的对话中提到过本科生人数，但可能没有正确引用。现在用户再次提到“本科生 18400人，知识库中有啊”，这里可能存在信息混淆或引用错误。需要确认用户是否指的是本科生人数还是其他数据，同时指出无法确定总数的原因。可能需要进一步澄清，但根据当前信息，只能回答无法确定，并指出相关数据可能需要补充。\n</details>\n根据提供的信息，无法确定学生和老师的总数。若需获取具体数字，可能需要补充更多相关数据或信息。",
            "timestamp": 1757217864,
            "usage": {
                "prompt_tokens": 160,
                "total_tokens": 297,
                "completion_tokens": 137
            },
            "sources": [
                {
                    "source": {
                        "id": "60586595-6b66-4ed1-838a-dbc249ca438f",
                        "user_id": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                        "name": "学校简介",
                        "description": "学校简介",
                        "meta": null,
                        "access_control": {
                            "read": {
                                "group_ids": [
                                    "b6c656ae-4cca-4786-b0c9-bba9a2453cae",
                                    "56fa3880-ea49-4888-ba25-20794303b441"
                                ],
                                "user_ids": []
                            },
                            "write": {
                                "group_ids": [],
                                "user_ids": []
                            }
                        },
                        "created_at": 1757212211,
                        "updated_at": 1757212294,
                        "user": {
                            "id": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "name": "micrai",
                            "email": "22104416@qq.com",
                            "Student_ID": null,
                            "Mobile": "15663822501",
                            "className": null,
                            "role": "admin",
                            "profile_image_url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAABPFJREFUeF7tnW+IFHUcxp8ZZ26360wtqHdedpaa0KsKTgkyMMo6+ktgvQhLkiDoRX9fFfTGtII4Kkik6EVCUVSU/bHI/HthofiPUlJJ08s/peR1uzOzMxMz2647u3O3s5PGEz0L9+Zu5zcPz2efZ76/3TnWOL3ywhB60DhgCAgNi1iIgHDxEBAyHgIiIGwOkOnRNURAyBwgk6OECAiZA2RylBABIXOATI4SIiBkDpDJUUIEhMwBMjlKiICQOUAmRwkREDIHyOQoIQJC5gCZHCVEQMgcIJOjhAgImQNkcpQQASFzgEyOEiIgZA6QyVFCBITMATI5dAnpvmszzMkzkjYFLtztg3C3Ls1ln2H34LxbPoZ50VWJ44NTezD6/pxca56rg/4bQAD4R9aj9NkduXyw+u5GoX8ZjMJkAenUwdSEAAhHh1Fe9zD8Ixs6XRKFuS/CnnE/YJgC0ql7YwFBztoaq64iXaqsDHQSQMIAiH5MKz4yT23Zly9EV/9SGPbE6lqGEf3jWLyegHQIJPT+RFg+AXNib3xkntoqXDcI+4p7Ywhh6Rhg98CwugUkA4v4KY0JCb0R+Ie/gdW7oNr/vgN323K421/OtFxcVwNfwJwyM8IJ//A6mBdfjej3SkgmC1uBeDtfhT17SX1Cqhxag/KahZlWa6yr0DsNb/eK6loCksm/1IS4Q0/Dnv1QfQ8RjhxCee1i+Me+b7toY10FJ3+Et/MVdPU/LyBtnWt4QnNlOZufwIRLrj0ztmasLXNSH4rzV8GcND2uK2/vKvjDG1GY84KA/FMg0XTUuLHLUlv2rAfRdc2zMOzzETqn4Aw9FV+HBKQTGikX9Sgh/s+fJt76yFJbxetXwOq7M56ugt92oLR6ABN6FwhIhzxapqwISOWnd5O77Ta1lairMIC35y04mx6HNf0eATlbQJrfjxqvttLqqrLvPQHpFEbaPqSWkPhvt6+tT1vByEGUv34AwfFtLadJq6toT6OE5CCSNmVFlRU9Cv3LYc9a9PcmsQx36zK4OwYTZ4nr6sZ3YF4wLX6rxPvhTThDT8bPEZCzDMSadhsKc1+CUZgSr1w5+DnKX96XOIt95eLqdGV1I3ROwtn0GCoHPhKQHCxSN4aNlZWltorzVsK6rPq5STRdjX44ry5FCclBZbzKaldbiboKKvB2vw5nyzMCkoND/ZB2QMarrURdlU7A2fhoXGu1hxKSg0w7IOPVVnH+27Cm3hSf1T+6BaVPbk4oEJBzBCRt2qoMb0Dxhjdg9kwFUupKU1YOGPGrv+Guk2jv0HxRj41tnrb2fwD/6LdnpqvScZTXPwL/l6+UkJwcMl9Dak9MbBL/OIDg912wLh2o1tWvQyitvrVFiiorB50sCWmZtiolhL5T/RAr8ODueg3ud88JSA7/Ww7JCqS5tmoLhWPUla4hOelkBdI8bdVON1ZdCci/ACQxbUXna3Pvlq4hOaB0kpDm2mp3m5CA5ADyfz+E7mZrAdHXVVC9BpQQKhz6ugoyHAIiIHQOkAnSNURAyBwgk6OECAiZA2RylBABIXOATI4SIiBkDpDJUUIEhMwBMjlKiICQOUAmRwkREDIHyOQoIQJC5gCZHCVEQMgcIJOjhAgImQNkcpQQASFzgEyOEiIgZA6QyVFCBITMATI5SoiAkDlAJkcJERAyB8jkKCECQuYAmZy/AKgE6hLFM5iHAAAAAElFTkSuQmCC"
                        },
                        "files": [
                            {
                                "id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                                "meta": {
                                    "name": "学校简介.txt",
                                    "content_type": "text/plain",
                                    "size": 7839,
                                    "data": {},
                                    "collection_name": "60586595-6b66-4ed1-838a-dbc249ca438f"
                                },
                                "created_at": 1757212294,
                                "updated_at": 1757212294
                            }
                        ],
                        "type": "collection"
                    },
                    "document": [
                        "黑龙江八一农垦大学(简称\"八一农大\")始建于1958年,由时任国家农垦部部长王震将军主持创办并任首任校长。学校原隶属于国家农垦部,1973年划归黑龙江省人民政府。经过67年的发展建设,现已成为一所具有鲜明现代化大农业特色、以农为主、多学科协调发展的农业大学。\n\n学校诞生于十万复转官兵开发建设北大荒的历史大潮中,原校址位于密山市裴德镇。边疆农村办学45年,师生发扬解放军优良传统和\"抗大校风\",传承北大荒精神,走出了一条自强不息、砥砺奋进的发展之路。2003年学校迁入大庆市,进入提速升级、跨越发展的新时期。在长期的办学实践中,凝练形成了\"艰苦奋斗、无私奉献、务实求真、负重致远\"的办学精神,并因优良校风和办学实绩赢得了社会的广泛赞誉。\n\n学校现址位于大庆市高新技术产业开发区,总占地132.52万平方米(含密山实习用地),建筑面积41.89万平方米,固定资产总值15.48亿元,教学科研仪器设备3.75亿元,图书235.85万册,其中纸质图书130.252万册。\n\n学校现有教职工1445人,其中专任教师985人,教授200人、副教授292人,具有博士学位教师440人,占比44.7%;海外经历累计1年以上教师132人,占比13.4%。学校拥有国家级人才项目入选者4人、\"龙江学者\"特聘教授1人、\"龙江学者\"青年学者4人、省杰青2人、全国优秀教师2人、省级教学名师9人、农业农村部产业技术体系岗位科学家2人;现有95名省级高层次人才。建有1个科技部重点领域创新团队、1个黑龙江省杂粮绿色生产及食品深加工技术研发\"头雁\"团队,2个省级专业技术领军人才梯队;先后聘用\"双聘院士\"2人,\"王震讲座教授\"22人,享受国务院和省政府特殊津贴41人。\n\n学校建有12个本科学院以及马克思主义学院、体育教研部、继续教育学院等教学机构,学科专业涉及农学、工学、管理学、理学、法学、文学、经济学7个学科门类,建有4个博士后科研流动站及1个博士后科研工作站;拥有4个一级学科博士点,12个一级学科硕士点,7个硕士专业学位类别,\"杂粮生产与加工\"\"玉鹅种养生态农业\"2个省\"双一流\"特色学科,植物与动物科学、农业科学学科连续两年进入ESI全球排名前1%;本科招生专业50个,其中国家级特色专业3个、省级重点专业9个,国家级一流专业建设点8个、省级一流专业16个。",
                        "学校科研工作以应用研究和技术开发为主要方向,建有国家杂粮工程技术中心、新农村发展学院,教育部粮食副产物加工与利用工程技术研究中心、农业农村部农产品及加工品质量监督检验测试中心(大庆)等30个国家、省部级科研平台,以及7个省高校重点实验室、工程技术研发中心。学校注重科技成果转化运用,深化与北大荒农垦集团等企业、大庆市等地方政府合作,共建了10个北大荒农垦集团创新研究院、4个校地产教融合基地和15个省级产业技术研究院,服务地方经济社会发展。\"十三五\"以来,学校承担国家、省部项目共计537项,各级部门科研经费共计5.65亿元。建校以来,学校共取得科研成果1950余项,获得国家科技进步奖7项、省部级奖励188项,以\"大豆三垄栽培技术\"\"农作物种衣剂\"\"大豆、水稻生产加工全程安全控制关键技术\"\"牛重要疫病防控关键技术研究与应用\"\"'狮白鹅'选育及'玉鹅'生态种养模式\"\"黑龙江水稻大面积均衡高产优质栽培综合配套技术\"\"现代化农机关键技术及装备\"等为代表的一批重大科研成果在生产实践中得到有效转化,创造了巨大的经济效益和社会效益。先后3次获得\"黑龙江省省长特别奖\",2次获得\"黑龙江省大专院校和科研单位振兴经济奖\",10次获得黑龙江省科学技术奖一等奖。\n\n学校坚持开放办学,与美国、英国、加拿大、俄罗斯、法国、韩国、日本、印度、乌克兰、波兰、马来西亚等国家和地区近31所高校和科研院所开展交流与合作。现为\"中俄寒地农业大学联盟\"\"中国东北地区与俄罗斯远东及西伯利亚地区大学联盟\"\"一带一路南南合作农业教育科技创新联盟\"和\"丝绸之路农业教育科技创新联盟\"成员。目前,学校与俄罗斯符拉迪沃斯托克国立经济服务大学实施本科生中外合作办学项目,与韩国国立江陵原州大学、济州大学、日本山形大学等国外高校实施交换生项目,与加拿大阿尔伯塔大学实施\"中加合作食品研究发展中心\"项目,与印度UAS大学实施中印杂粮工程技术研究中心项目。与近30所高校和科研院所开展中外导师联合培养研究生项目,累计培养博士、硕士研究生36人。",
                        "学校主动融入黑龙江省产业转型升级和创新驱动发展,创新人才培养模式,促进产教深度融合,努力培养社会责任感强、专业基础扎实、具有创新创业精神和实践能力的应用型人才。获批\"黑龙江省特色应用型本科示范高校\"\"黑龙江省课程思政建设示范高校\"\"黑龙江省深化创新创业教育改革示范高校\"\"黑龙江省高校毕业生就业创业工作示范校\"\"黑龙江省首批依法治校示范校\";\"北大荒农产品加工现代产业学院\"获批教育部首批现代产业学院;获评国家级一流课程5门、省级一流课程40门,获批省级研究生课程思政建设项目20项、省级研究生精品课程8项。学校面向24个省(自治区、直辖市)招生,全日制在校本科生18400余人,各类在校研究生近2900人。建校以来,学校累计向社会输送本硕博毕业生16余万人,高等学历继续教育3.5余万人,毕业生连续两年获得全国\"高校毕业生基层就业卓越奖\"。以强农兴农为主线,平均每年开展培训班20余个,培训1000余人。推动科技走向田间地头,以\"三区人才\"\"科技特派员\"\"基地\"为依托,科技服务历年累计培训15余万人。学校已成为农垦现代化大农业创新人才培养基地和科技研发基地,享有\"垦区黄埔\"之盛誉。",
                        "学校始终把北大荒精神作为最可宝贵的精神财富,自觉将北大荒精神融入办学育人的全过程。建有教育部高校思想政治工作队伍培训研修合作研学基地、教育部红色文化弘扬基地、黑龙江省北大荒精神学术交流基地、黑龙江省学校思想政治理论课教师社会实践研修基地、黑龙江省社会科学普及基地(北大荒精神展示馆)和北大荒精神与文化研究所,充分发挥地缘、人才和科研资源优势,坚持把红色资源利用好、把红色传统发扬好、把红色基因传承好,产出了《黑土上的中国》《淬荒集》等一批较有影响力的文化成果,培养了一大批具有北大荒精神烙印的知农爱农新型人才。\n\n学校坚持\"育人为本、质量立校、崇尚学术、特色发展\"的办学理念,以立德树人为根本任务,以强农兴农为己任,以服务龙江高质量发展可持续振兴、服务国家农业现代化为办学使命,以产教融合发展为导向,以质量提升为核心,着力提高学校内涵发展水平和办学综合实力,固本拓新,奋楫图强,为奋力谱写特色高水平研究应用型农业大学建设新篇章而努力奋斗。\n\n (截至2025年5月)"
                    ],
                    "metadata": [
                        {
                            "content_type": "text/plain",
                            "created_by": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "data": "{}",
                            "embedding_config": "{'engine': '', 'model': 'sentence-transformers/all-MiniLM-L6-v2'}",
                            "file_id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                            "hash": "6d109f4df2645f93454c7e415cb8c146349edd3d37864247ba84a2caa118cd85",
                            "name": "学校简介.txt",
                            "size": 7839,
                            "source": "学校简介.txt",
                            "start_index": 0
                        },
                        {
                            "content_type": "text/plain",
                            "created_by": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "data": "{}",
                            "embedding_config": "{'engine': '', 'model': 'sentence-transformers/all-MiniLM-L6-v2'}",
                            "file_id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                            "hash": "6d109f4df2645f93454c7e415cb8c146349edd3d37864247ba84a2caa118cd85",
                            "name": "学校简介.txt",
                            "size": 7839,
                            "source": "学校简介.txt",
                            "start_index": 1468
                        },
                        {
                            "content_type": "text/plain",
                            "created_by": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "data": "{}",
                            "embedding_config": "{'engine': '', 'model': 'sentence-transformers/all-MiniLM-L6-v2'}",
                            "file_id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                            "hash": "6d109f4df2645f93454c7e415cb8c146349edd3d37864247ba84a2caa118cd85",
                            "name": "学校简介.txt",
                            "size": 7839,
                            "source": "学校简介.txt",
                            "start_index": 973
                        },
                        {
                            "content_type": "text/plain",
                            "created_by": "70ced502-d430-4022-a4ae-80ddb7c2ab26",
                            "data": "{}",
                            "embedding_config": "{'engine': '', 'model': 'sentence-transformers/all-MiniLM-L6-v2'}",
                            "file_id": "e8efd7c4-b0ce-4a4d-b4de-ea28aa75316a",
                            "hash": "6d109f4df2645f93454c7e415cb8c146349edd3d37864247ba84a2caa118cd85",
                            "name": "学校简介.txt",
                            "size": 7839,
                            "source": "学校简介.txt",
                            "start_index": 2320
                        }
                    ],
                    "distances": [
                        0.798429909070609,
                        0.7636834081673828,
                        0.7610651002716573,
                        0.728495961044044
                    ]
                }
            ]
        }
    ],
    "chat_id": "55b376d2-2a77-49de-b58b-f9f856bddfa4",
    "session_id": "_i6Cv6hghan_w36IAAAl",
    "id": "f738ed27-c204-44d1-b65a-6a996751fb50"
}原因 是不是 RAG 提示词模板设置的不对

<context>

【检索到的相关信息如下】：
{context}

【指令】：
请严格根据上述【检索到的相关信息】部分的内容来回答问题。该部分是唯一可信来源。
</context>

### 用户问题：
{question}

### 助理回答：




关于“AI辅导员”项目
一、 作品创意阐述
“AI辅导员”是一款深度融合了人工智能技术的智慧教育平台。其核心创意在于将传统的学生信息管理系统与前沿的大语言模型（LLM）能力相结合，打造一个不仅限于信息记录，更具备“思考”和“辅导”能力的数字助手。

核心创意点如下：

从“记录”到“赋能”的转变：

传统系统：仅作为学生数据（班级、学号、成绩）的“档案库”，功能是静态和被动的。

AI辅导员：在数据基础之上，内置一个AI大脑。它不仅能存储信息，更能分析、理解并主动生成内容。例如，自动生成学生学习报告、识别学习困难群体、为教师提供个性化教学建议等。

个性化交互与支持：

通过自然语言处理（NLP）技术，系统可以提供7x24小时的智能问答支持。学生可以像与真人辅导员一样，用自然语言询问关于课程、作业、校园政策等问题，获得即时、准确的回答，极大减轻了人工辅导员重复性咨询的压力。

数据驱动的精准洞察：

系统不再是数据的坟墓，而是数据的“金矿”。通过分析学生的学习行为、成绩趋势、互动数据等，AI可以提前预警潜在学业风险的学生，并帮助教育管理者发现教学过程中的共性问题和优化点，实现从“经验驱动”到“数据驱动”的决策转变。

智能化工作流自动化：

将AI能力嵌入到具体工作流程中，如智能批改客观题、自动生成班级通知、辅助完成教务报告等，将教师和行政人员从繁琐的事务性工作中解放出来，使其能更专注于教学本身和与学生的深度交流。

简而言之，我们的创意不是做一个更好的“管理系统”，而是创造一个能够参与教学管理过程、提供智能支持的“AI同事”。

二、 面向的目标用户
我们的产品主要服务于教育生态中的三类核心用户：

核心用户：学生

需求：便捷的课程查询、成绩查看、即时的问题解答、个性化的学习反馈、与同学和老师的互动。

痛点：遇到问题时找不到老师；不清楚自己的学习状况；对冰冷的系统界面无感。

价值：获得一个随时随地、有问必答、且了解自己学习历史的“个人学业助手”，学习体验更流畅、更贴心。

关键用户：教师与辅导员

需求：高效管理班级和学生信息；轻松发布通知和作业；快速了解班级整体学情；与学生有效沟通。

痛点：大量时间被琐碎的行政事务和重复性问题占用；难以全面掌握每个学生的动态；缺乏高效的数据分析工具。

价值：AI成为其“教学助理”，自动化处理常规事务，并提供数据洞察，让其能更专注于教学设计、科研和与学生的深度辅导。

重要客户：学校及教育机构管理者

需求：掌控整体教学运行质量；优化资源配置；提升管理效率和现代化水平；做出科学决策。

痛点：数据分散，形成信息孤岛；决策依赖主观经验，缺乏数据支撑；难以量化评估教学效果。

价值：获得一个智慧教育决策支持系统，通过数据驾驶舱一目了然地看清全局，发现规律，预测趋势，从而实现更科学、精准的管理。

三、 市场的简单分析
市场趋势与机遇：

政策东风：“人工智能+教育”等政策，为教育数字化转型提供了强大的支持和明确的方向。

技术成熟：大语言模型技术的普及和API成本的下降，使得AI能力可以低成本、高效率地集成到传统应用中，技术门槛显著降低。

需求旺盛：线上线下融合（OMO）教学模式成为常态，学校对数字化工具的需求从“有”到“优”，从“工具”到“智慧”转变，市场存在巨大的升级替换空间。

竞争格局：

传统巨头：它们优势在于深耕多年，客户关系稳固，产品线齐全。但其产品往往传统、笨重、创新缓慢，AI能力通常是外挂而非内核。

新兴AI公司：一些初创公司提供纯AI解题、虚拟人等工具，技术新颖，但缺乏与校园实际管理和工作流深度结合的场景，容易沦为“玩具”。

我们的定位：我们恰好处于两者的结合点——既懂教育业务场景，又具备现代AI产品能力。做一个轻量化、AI原生、体验极致的智慧辅导平台，专注于解决“管理”和“辅导”中的核心痛点。

市场挑战：

用户习惯：改变教师和行政人员长期形成的使用习惯需要时间和有效的培训。

数据安全与隐私：教育数据极其敏感，必须建立最高等级的安全防护和隐私保护机制，符合《网络安全法》、《数据安全法》等要求。

销售周期：教育行业，特别是高校的采购决策流程长，需要深厚的渠道资源和耐心。
