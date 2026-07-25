export const models = {
  blue: '/models/blue.glb',
  red: '/models/red.glb',
  green: '/models/green.glb',
  yellow: '/models/yellow.glb',
  face: '/models/face.glb',
  facialBottle: '/models/facial-bottle.glb',
  sunscreenTube: '/models/sunscreen-tube.glb',
  iron: '/models/iron.glb',
  hellokitty: '/models/hellokitty.glb',
} as const

export const site = {
  name: 'Wang Yudan',
  role: 'B 端 AI 产品经理 / SaaS 产品经理',
  tagline: 'SaaS+CRM 产品设计、B 端 AI 流程重构与提效、Vibe Coding 快速原型与全栈交付、复杂业务逻辑抽象',
  email: 'H18641889977@163.com',
  phone: '17200486924',
  wechat: 'imduan5748',
}

export const navLinks = [
  { href: '#tech', label: 'Tech Stack' },
  { href: '#education', label: 'Education' },
  { href: '#projects', label: 'Projects' },
  { href: '#work', label: 'Work Experience' },
  { href: '#contact', label: "Let's Work Together" },
]

export type TechItem = {
  name: string
  /** Local image logo (official brand mark) */
  image?: string
  /** Shown when no brand image — 1–3 letters */
  letter?: string
}

export const techStack: TechItem[] = [
  { name: 'Claude', image: '/icons/claude.svg' },
  { name: 'Gemini', image: '/icons/gemini.svg' },
  { name: 'ChatGPT', image: '/icons/chatgpt.svg' },
  { name: 'Cursor', image: '/icons/cursor.svg' },
  { name: 'Prompt Engineering', image: '/icons/prompt-pliers.svg' },
  { name: 'Vibe Coding', image: '/icons/vibe-bulb.svg' },
  { name: 'React', image: '/icons/react.svg' },
  { name: 'Vite', image: '/icons/vite.svg' },
  { name: 'Figma', image: '/icons/figma.png' },
  { name: 'CloudBase', image: '/icons/cloudbase.png' },
  { name: 'PRD', image: '/icons/prd-notebook.svg' },
  { name: 'SQL', image: '/icons/mysql.png' },
]

export type WorkExperienceItem = {
  title: string
  company: string
  period: string
  bullets: string[]
  tags: string[]
  /** Client/employer logos shown between title block and period */
  logos?: Array<{ src: string; alt: string }>
}

export const workExperiences: WorkExperienceItem[] = [
  {
    title: '项目实施工程师',
    company: '上海泛微网络有限公司（北京）',
    period: '2025.07 – 2026.05',
    logos: [
      { src: '/icons/gt-group.png', alt: '通用技术集团' },
      { src: '/icons/weaver-light.png', alt: '泛微' },
    ],
    bullets: [
      '主导央企复杂系统实施：负责英斯泰克（通用技术集团）全链路项目运营管理平台（POMS）建设，主导多家主体的流程设计，覆盖付款、发票、合同、项目、用印等 10+ 核心模块。',
      '复杂业务梳理与协同：深入 B 端业务场景，梳理多部门跨系统衔接规则，推动个性化需求产品化落地，系统上线后业务流转异常率下降 80%。',
    ],
    tags: ['B 端实施', '流程设计', '跨部门协同', 'POMS', '央企'],
  },
]

export const education = [
  {
    title: '辽宁大学（双一流 / 211）',
    company: '经济学 本科',
    period: '2021.06 – 2025.06',
    bullets: [
      '社会实践：剑桥大学暑期学术交流（2022.06 – 2022.07）。',
      '核心奖项：剑桥大学金融创新国际赛三等奖、美国数学建模大赛 H 奖、全国大学生统计建模大赛省一等奖。',
      '荣誉：优秀学生干部、连续 3 年二等奖学金、优秀志愿者。',
      '领导力：辽宁大学辩论队队长（2022.03 – 2025.03）、学生会新媒体部长。',
    ],
    tags: ['经济学', '211', '数据分析', '领导力'],
  },
]

export type ProjectChain = {
  pain: string
  action: string
  result: string
}

export const projects = [
  {
    id: 'diy-workshop',
    name: '手作工坊（DIY-workshop）体验店经营平台',
    period: '2026.07 – 至今',
    role: '独立产品设计与全栈落地',
    blurb: '设计「预约–开台–计费–库存–交班」全链路 SaaS 平台，支持单店试点与多业态扩展。',
    chains: [
      {
        pain: '色号库存对齐难',
        action:
          '事件驱动库存与手势交互：设计色卡陈列交互，通过领域事件总线实现「支付即扣减库存与积分」的实时一致性。',
        result: '库存误差率控制在 5% 以内，复购率提升 20%。',
      },
      {
        pain: '套餐与超时双轨计费复杂、易账实不符',
        action:
          '双轨计费引擎：采用 BillingEngine 纯函数引擎与状态机，设计「套餐 + 超时阶梯」规则，规避随意变更状态导致的账实偏差。',
        result: '人工统计与报价时间相比传统方式降低 50% 以上。',
      },
      {
        pain: '通用收银缺少座位 / 开台可视化',
        action:
          '高 Aesthetic UI 与 Web Coding：利用 AI 代码工具部署响应式 Web UI，高保真还原座位可视化与扫码预约链路。',
        result: '开台主路径缩短至 3 次主操作以内。',
      },
    ] satisfies ProjectChain[],
    showFace: false,
    link: 'http://81.70.56.30:3000/',
    linkLabel: '在线演示',
  },
  {
    id: 'beauty-saas',
    name: '美妆门店一体化管理系统',
    nameSuffix: '（SaaS+CRM + AI 赋能）',
    period: '2026.05 – 至今',
    role: '独立产品设计与全栈落地',
    blurb:
      '构建「预约–核销–库存–薪酬」全链路数字化闭环，并引入 AI 规则引擎与大模型能力实现自动化经营提效。',
    chains: [
      {
        pain: '套盒消耗难追踪、账实难对齐',
        action:
          '套盒规则产品化：抽象套盒拆解与聚合规则，结合 AI 异常检测与周/月报，保障库存、快照与账目一致。',
        result: '人工对账从每周 2 小时缩短至 6 分钟，提效 95%。',
      },
      {
        pain: '手工费及薪酬计算复杂',
        action:
          '可配置薪酬公式引擎：抽离 16 种薪酬模块，支持四则运算与分级配置，业务规则可产品化落地。',
        result: '已在 2 家门店稳定运行，可直接适配 10+ 项复杂业务规则。',
      },
      {
        pain: '顾客预订效率低、会员流失率高',
        action:
          'AI 流失预警与主动召回：会员多维加权评分 + 个性化召回策略与防骚扰冷却机制。',
        result: '沉睡会员月均召回率从 5% 提升至 18%。',
      },
    ] satisfies ProjectChain[],
    showFace: true,
    link: 'https://beauty-retail-demo.vercel.app',
    linkLabel: 'Vercel 部署演示',
  },
]
