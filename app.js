const TIME_ZONE = "Asia/Shanghai";
const MS_PER_HOUR = 60 * 60 * 1000;
const INVESTMENT_HISTORY_YEARS = 10;
const DAYS_PER_YEAR = 365;

const state = {
  view: "today",
  sort: "hot",
  domain: "all",
  investmentFilter: "all",
  query: "",
  now: new Date()
};

const sourceProfiles = [
  {
    id: "openai",
    name: "OpenAI",
    type: "company",
    domain: "AI",
    platform: "YouTube",
    priority: "P0",
    cadence: "30 min",
    language: "EN",
    official: true,
    weight: 98,
    median24h: 620000,
    trackedPeople: ["Sam Altman", "Mira Murati"],
    trackedTopics: ["frontier models", "agents", "safety"],
    trackedAssets: ["OpenAI"]
  },
  {
    id: "dwarkesh",
    name: "Dwarkesh Podcast",
    type: "podcast",
    domain: "AI",
    platform: "YouTube",
    priority: "P0",
    cadence: "30 min",
    language: "EN",
    official: false,
    weight: 88,
    median24h: 185000,
    trackedPeople: ["AI founders", "research leads"],
    trackedTopics: ["scaling laws", "AGI", "inference"],
    trackedAssets: ["OpenAI", "Anthropic", "Google"]
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    type: "company",
    domain: "AI",
    platform: "YouTube",
    priority: "P0",
    cadence: "30 min",
    language: "EN",
    official: true,
    weight: 94,
    median24h: 380000,
    trackedPeople: ["Jensen Huang"],
    trackedTopics: ["GPU", "data center", "robotics"],
    trackedAssets: ["NVDA", "Blackwell"]
  },
  {
    id: "eth-foundation",
    name: "Ethereum Foundation",
    type: "protocol",
    domain: "Crypto",
    platform: "YouTube",
    priority: "P0",
    cadence: "30 min",
    language: "EN",
    official: true,
    weight: 96,
    median24h: 145000,
    trackedPeople: ["Vitalik Buterin"],
    trackedTopics: ["L2", "staking", "roadmap"],
    trackedAssets: ["ETH"]
  },
  {
    id: "bankless",
    name: "Bankless",
    type: "media",
    domain: "Crypto",
    platform: "YouTube",
    priority: "P0",
    cadence: "30 min",
    language: "EN",
    official: false,
    weight: 84,
    median24h: 108000,
    trackedPeople: ["crypto founders", "protocol researchers"],
    trackedTopics: ["ETH", "stablecoin", "regulation"],
    trackedAssets: ["ETH", "BTC", "SOL"]
  },
  {
    id: "a16z-crypto",
    name: "a16z crypto",
    type: "fund",
    domain: "Crypto",
    platform: "YouTube",
    priority: "P1",
    cadence: "2 h",
    language: "EN",
    official: true,
    weight: 82,
    median24h: 72000,
    trackedPeople: ["Chris Dixon", "research partners"],
    trackedTopics: ["consumer crypto", "policy", "infrastructure"],
    trackedAssets: ["ETH", "SOL"]
  },
  {
    id: "x-ai-list",
    name: "X AI watchlist",
    type: "social",
    domain: "AI",
    platform: "X",
    priority: "P1",
    cadence: "2 h",
    language: "EN",
    official: false,
    weight: 78,
    median24h: 90000,
    trackedPeople: ["Sam Altman", "Andrej Karpathy", "AI researchers"],
    trackedTopics: ["launch", "agents", "reasoning"],
    trackedAssets: ["OpenAI", "Anthropic", "xAI"]
  },
  {
    id: "x-crypto-list",
    name: "X Crypto watchlist",
    type: "social",
    domain: "Crypto",
    platform: "X",
    priority: "P1",
    cadence: "2 h",
    language: "EN",
    official: false,
    weight: 76,
    median24h: 76000,
    trackedPeople: ["Vitalik Buterin", "Anatoly Yakovenko", "exchange founders"],
    trackedTopics: ["ETF", "L2", "stablecoin"],
    trackedAssets: ["BTC", "ETH", "SOL"]
  },
  {
    id: "ark-invest",
    name: "ARK Invest",
    type: "investor",
    domain: "Investing",
    platform: "YouTube",
    priority: "P0",
    cadence: "30 min",
    language: "EN",
    official: true,
    weight: 88,
    median24h: 92000,
    trackedPeople: ["Cathie Wood", "ARK analysts"],
    trackedTopics: ["AI applications", "robotics", "autonomous driving"],
    trackedAssets: ["TSLA", "NVDA", "COIN"]
  },
  {
    id: "altimeter",
    name: "Altimeter Capital",
    type: "investor",
    domain: "Investing",
    platform: "YouTube",
    priority: "P1",
    cadence: "2 h",
    language: "EN",
    official: false,
    weight: 84,
    median24h: 76000,
    trackedPeople: ["Brad Gerstner"],
    trackedTopics: ["AI infrastructure", "cloud", "software"],
    trackedAssets: ["MSFT", "GOOGL", "NVDA"]
  },
  {
    id: "investor-tv",
    name: "Investor Masters Archive",
    type: "curated-library",
    domain: "Investing",
    platform: "YouTube",
    priority: "P0",
    cadence: "manual verify",
    language: "EN",
    official: false,
    weight: 92,
    median24h: 150000,
    trackedPeople: ["Warren Buffett", "Charlie Munger", "George Soros", "Jim Simons", "John Bogle"],
    trackedTopics: ["value investing", "quality growth", "macro", "quant", "indexing"],
    trackedAssets: ["philosophy", "capital allocation", "market cycles"]
  }
];

const imagePool = {
  AI: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  Crypto: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?auto=format&fit=crop&w=900&q=80",
  Both: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=900&q=80",
  Compute: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
  Studio: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80",
  Investing: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=900&q=80"
};

const portraitPageByName = {
  "Sam Altman": "Sam Altman",
  "Vitalik Buterin": "Vitalik Buterin",
  "Jensen Huang": "Jensen Huang",
  "Anatoly Yakovenko": "Anatoly Yakovenko",
  "Andrej Karpathy": "Andrej Karpathy",
  "Cathie Wood": "Cathie Wood",
  "Stanley Druckenmiller": "Stanley Druckenmiller",
  "Brad Gerstner": "Brad Gerstner",
  "Howard Marks": "Howard Marks (investor)",
  "Chris Dixon": "Chris Dixon (businessman)",
  "Warren Buffett": "Warren Buffett",
  "Charlie Munger": "Charlie Munger",
  "Naval Ravikant": "Naval Ravikant",
  "Ray Dalio": "Ray Dalio",
  "Peter Lynch": "Peter Lynch",
  "Benjamin Graham": "Benjamin Graham",
  "Philip Fisher": "Philip Arthur Fisher",
  "John Bogle": "John C. Bogle",
  "Seth Klarman": "Seth Klarman",
  "Mohnish Pabrai": "Mohnish Pabrai",
  "Li Lu": "Li Lu (investor)",
  "Joel Greenblatt": "Joel Greenblatt",
  "Michael Mauboussin": "Michael Mauboussin",
  "Aswath Damodaran": "Aswath Damodaran",
  "Bill Ackman": "Bill Ackman",
  "George Soros": "George Soros",
  "Carl Icahn": "Carl Icahn",
  "Henry Kravis": "Henry Kravis",
  "David Swensen": "David F. Swensen",
  "John Templeton": "John Templeton",
  "Jeremy Grantham": "Jeremy Grantham",
  "Michael Burry": "Michael Burry",
  "Jim Simons": "Jim Simons",
  "Ed Thorp": "Edward O. Thorp",
  "Cliff Asness": "Cliff Asness"
};

const sourcePortraitPageById = {
  "a16z-crypto": "Chris Dixon (businessman)",
  altimeter: "Brad Gerstner",
  "ark-invest": "Cathie Wood"
};

const portraitImageCache = new Map();

function hoursAgo(hours) {
  return new Date(state.now.getTime() - hours * MS_PER_HOUR).toISOString();
}

function snapshot(hours, views, likes, comments, xReposts, xQuotes, xBookmarks, xImpressions) {
  return {
    at: hoursAgo(hours),
    views,
    likes,
    comments,
    xReposts,
    xQuotes,
    xBookmarks,
    xImpressions
  };
}

const videos = [
  {
    id: "sam-agents-compute",
    title: "Sam Altman 谈下一代 AI agents、算力瓶颈与模型发布节奏",
    person: "Sam Altman",
    sourceId: "openai",
    domain: "AI",
    platform: "YouTube",
    originalUrl: "https://www.youtube.com/@OpenAI",
    publishedAt: hoursAgo(2.4),
    discoveredAt: hoursAgo(2.1),
    processedAt: hoursAgo(1.7),
    durationMin: 58,
    contentType: "officialLaunch",
    novelty: 96,
    editorBoost: 8,
    thumbnail: imagePool.Compute,
    summary: "重点在 agents 产品化、推理成本下降和企业部署节奏。提到下一阶段竞争焦点会从模型参数转向任务完成率与算力调度。",
    topics: ["AI Agents", "Inference", "Compute"],
    assets: ["OpenAI", "NVDA"],
    metrics: [
      snapshot(2.0, 148000, 7100, 840, 520, 180, 980, 920000),
      snapshot(0.4, 392000, 19800, 2300, 1850, 640, 3600, 2600000)
    ]
  },
  {
    id: "vitalik-l2-roadmap",
    title: "Vitalik 更新以太坊 L2 路线图：费用、互操作与账户抽象",
    person: "Vitalik Buterin",
    sourceId: "eth-foundation",
    domain: "Crypto",
    platform: "YouTube",
    originalUrl: "https://www.youtube.com/@EthereumFoundation",
    publishedAt: hoursAgo(5.8),
    discoveredAt: hoursAgo(5.1),
    processedAt: hoursAgo(4.6),
    durationMin: 42,
    contentType: "keynote",
    novelty: 91,
    editorBoost: 6,
    thumbnail: imagePool.Crypto,
    summary: "核心信号是 L2 互操作会成为下一阶段体验优化重点，同时强调低费率不等于最终用户体验完成。",
    topics: ["Ethereum L2", "Account Abstraction", "Interoperability"],
    assets: ["ETH"],
    metrics: [
      snapshot(5.2, 64000, 3400, 490, 720, 260, 1400, 610000),
      snapshot(0.8, 186000, 10200, 1600, 2800, 1080, 5400, 2100000)
    ]
  },
  {
    id: "jensen-blackwell-demand",
    title: "Jensen Huang 解释 Blackwell 需求、数据中心约束和机器人机会",
    person: "Jensen Huang",
    sourceId: "nvidia",
    domain: "AI",
    platform: "YouTube",
    originalUrl: "https://www.youtube.com/@NVIDIA",
    publishedAt: hoursAgo(9.5),
    discoveredAt: hoursAgo(8.8),
    processedAt: hoursAgo(8.2),
    durationMin: 36,
    contentType: "keynote",
    novelty: 86,
    editorBoost: 5,
    thumbnail: imagePool.AI,
    summary: "视频强化了 GPU 供给链、推理负载和机器人作为下一条增长曲线的叙事，适合跟踪 NVDA 与算力供应链。",
    topics: ["GPU", "Data Center", "Robotics"],
    assets: ["NVDA", "Blackwell"],
    metrics: [
      snapshot(8.5, 202000, 8800, 710, 360, 120, 820, 1240000),
      snapshot(1.2, 318000, 14300, 1120, 880, 310, 1740, 1900000)
    ]
  },
  {
    id: "bankless-stablecoins",
    title: "Bankless 圆桌：稳定币、监管窗口和链上支付的新分水岭",
    person: "Bankless hosts",
    sourceId: "bankless",
    domain: "Crypto",
    platform: "YouTube",
    originalUrl: "https://www.youtube.com/@Bankless",
    publishedAt: hoursAgo(13.2),
    discoveredAt: hoursAgo(12.4),
    processedAt: hoursAgo(11.7),
    durationMin: 72,
    contentType: "marketRoundtable",
    novelty: 78,
    editorBoost: 3,
    thumbnail: imagePool.Studio,
    summary: "讨论集中在稳定币发行、支付场景和政策窗口。观点分歧主要在银行体系会吸收稳定币还是被稳定币重塑。",
    topics: ["Stablecoin", "Regulation", "Payments"],
    assets: ["USDC", "ETH", "SOL"],
    metrics: [
      snapshot(12.0, 72000, 2600, 380, 410, 130, 760, 480000),
      snapshot(1.4, 116000, 4700, 710, 920, 340, 1900, 950000)
    ]
  },
  {
    id: "dwarkesh-scaling-inference",
    title: "研究员长访谈：推理扩展、合成数据与开源模型边界",
    person: "Frontier AI researcher",
    sourceId: "dwarkesh",
    domain: "AI",
    platform: "YouTube",
    originalUrl: "https://www.youtube.com/@DwarkeshPatel",
    publishedAt: hoursAgo(19.5),
    discoveredAt: hoursAgo(18.1),
    processedAt: hoursAgo(17.3),
    durationMin: 118,
    contentType: "founderInterview",
    novelty: 88,
    editorBoost: 5,
    thumbnail: imagePool.AI,
    summary: "内容密度高，适合做历史引用。重点解释推理时计算、数据瓶颈和开源模型在企业侧的可替代性。",
    topics: ["Scaling Laws", "Open Models", "Synthetic Data"],
    assets: ["Anthropic", "Google"],
    metrics: [
      snapshot(18.0, 88000, 5100, 640, 260, 90, 720, 530000),
      snapshot(2.3, 154000, 9400, 1180, 760, 260, 2100, 1120000)
    ]
  },
  {
    id: "x-solana-ai-agents",
    title: "X 热帖视频：Solana 创始人谈 AI agents 与链上结算接口",
    person: "Anatoly Yakovenko",
    sourceId: "x-crypto-list",
    domain: "Both",
    platform: "X",
    originalUrl: "https://x.com/aeyakovenko",
    publishedAt: hoursAgo(3.1),
    discoveredAt: hoursAgo(2.9),
    processedAt: hoursAgo(2.5),
    durationMin: 6,
    contentType: "clip",
    novelty: 83,
    editorBoost: 4,
    thumbnail: imagePool.Both,
    summary: "短视频传播很快，核心观点是 agents 如果需要高频小额结算，链上结算层可能重新获得产品入口。",
    topics: ["AI Agents", "Onchain Payments", "Solana"],
    assets: ["SOL"],
    metrics: [
      snapshot(2.8, 41000, 1900, 260, 980, 520, 2100, 640000),
      snapshot(0.3, 128000, 6800, 870, 4100, 1900, 9600, 2500000)
    ]
  },
  {
    id: "a16z-consumer-crypto",
    title: "a16z crypto：消费者应用、钱包抽象和监管后的新周期",
    person: "a16z crypto partners",
    sourceId: "a16z-crypto",
    domain: "Crypto",
    platform: "YouTube",
    originalUrl: "https://www.youtube.com/@a16zcrypto",
    publishedAt: hoursAgo(27.5),
    discoveredAt: hoursAgo(25.9),
    processedAt: hoursAgo(24.8),
    durationMin: 51,
    contentType: "podcast",
    novelty: 72,
    editorBoost: 2,
    thumbnail: imagePool.Crypto,
    summary: "更像中期框架讨论，适合归档。强调钱包抽象和合规入口会决定下一批消费者应用的启动成本。",
    topics: ["Consumer Crypto", "Wallets", "Policy"],
    assets: ["ETH", "SOL"],
    metrics: [
      snapshot(24.0, 42000, 1200, 160, 110, 40, 260, 210000),
      snapshot(3.2, 64000, 2100, 270, 240, 82, 590, 330000)
    ]
  },
  {
    id: "x-karpathy-small-models",
    title: "Andrej Karpathy 视频片段：小模型、个人算力与教育产品",
    person: "Andrej Karpathy",
    sourceId: "x-ai-list",
    domain: "AI",
    platform: "X",
    originalUrl: "https://x.com/karpathy",
    publishedAt: hoursAgo(34.0),
    discoveredAt: hoursAgo(33.2),
    processedAt: hoursAgo(32.6),
    durationMin: 9,
    contentType: "clip",
    novelty: 75,
    editorBoost: 1,
    thumbnail: imagePool.Compute,
    summary: "传播不算爆，但收藏率高。更适合放入长期主题库，用来跟踪小模型和教育工具方向。",
    topics: ["Small Models", "Education", "Personal AI"],
    assets: ["Open Models"],
    metrics: [
      snapshot(30.0, 56000, 2700, 190, 420, 140, 1800, 510000),
      snapshot(5.0, 81000, 4300, 310, 760, 260, 3700, 780000)
    ]
  },
  {
    id: "cathie-ai-autonomy",
    title: "Cathie Wood 谈 AI、自动驾驶和机器人平台型机会",
    person: "Cathie Wood",
    investor: "Cathie Wood",
    sourceId: "ark-invest",
    domain: "Investing",
    platform: "YouTube",
    originalUrl: "https://www.youtube.com/@ARKInvest2015",
    publishedAt: hoursAgo(4.4),
    discoveredAt: hoursAgo(4.0),
    processedAt: hoursAgo(3.5),
    durationMin: 31,
    contentType: "investorInterview",
    novelty: 86,
    editorBoost: 5,
    thumbnail: imagePool.Investing,
    summary: "观点偏长期乐观，核心判断是 AI 会压低软件生产成本，同时把自动驾驶、机器人和个性化医疗推向平台化扩张。",
    topics: ["AI 基建", "应用层", "Robotics", "Autonomous Driving"],
    assets: ["TSLA", "NVDA", "COIN"],
    investment: {
      direction: "应用层",
      stance: "看多",
      horizon: "3-5 年",
      conviction: 91,
      riskTone: "估值波动高",
      thesis: ["AI 降低软件和研发边际成本", "自动驾驶与机器人具备平台属性", "高估值需要用收入兑现验证"]
    },
    metrics: [
      snapshot(4.0, 52000, 1800, 240, 180, 70, 420, 310000),
      snapshot(0.7, 122000, 5200, 760, 640, 260, 1600, 980000)
    ]
  },
  {
    id: "druckenmiller-ai-capex",
    title: "Stanley Druckenmiller 讨论 AI 资本开支、芯片周期和估值纪律",
    person: "Stanley Druckenmiller",
    investor: "Stanley Druckenmiller",
    sourceId: "investor-tv",
    domain: "Investing",
    platform: "YouTube",
    originalUrl: "",
    publishedAt: hoursAgo(8.2),
    discoveredAt: hoursAgo(7.7),
    processedAt: hoursAgo(7.1),
    durationMin: 24,
    contentType: "investorInterview",
    novelty: 82,
    editorBoost: 4,
    thumbnail: imagePool.Compute,
    summary: "观点不是简单看多，而是强调 AI 资本开支可能是真周期，但仓位和估值要动态管理，避免把好公司买成坏价格。",
    topics: ["半导体", "AI 基建", "Valuation"],
    assets: ["NVDA", "MSFT", "GOOGL"],
    investment: {
      direction: "半导体",
      stance: "谨慎看多",
      horizon: "12-24 月",
      conviction: 84,
      riskTone: "重视估值",
      thesis: ["AI capex 可能延续，但市场会提前透支", "芯片龙头仍是核心观察窗口", "价格纪律比叙事更重要"]
    },
    metrics: [
      snapshot(7.5, 88000, 2600, 360, 240, 100, 620, 520000),
      snapshot(1.0, 214000, 7600, 980, 1120, 420, 2600, 1600000)
    ]
  },
  {
    id: "gerstner-cloud-ai-stack",
    title: "Brad Gerstner 拆解云厂商、AI 基建和企业软件再定价",
    person: "Brad Gerstner",
    investor: "Brad Gerstner",
    sourceId: "altimeter",
    domain: "Investing",
    platform: "YouTube",
    originalUrl: "https://www.youtube.com/@AltimeterCapital",
    publishedAt: hoursAgo(16.6),
    discoveredAt: hoursAgo(15.9),
    processedAt: hoursAgo(15.2),
    durationMin: 46,
    contentType: "investorInterview",
    novelty: 79,
    editorBoost: 3,
    thumbnail: imagePool.AI,
    summary: "关注云厂商在 AI 时代的议价能力，认为基础设施、数据层和分发入口会比单点应用更先捕获利润。",
    topics: ["AI 基建", "Cloud", "Enterprise Software"],
    assets: ["MSFT", "GOOGL", "META", "AMZN"],
    investment: {
      direction: "AI 基建",
      stance: "看多",
      horizon: "2-3 年",
      conviction: 87,
      riskTone: "竞争加剧",
      thesis: ["云平台可能重新获得增长溢价", "企业 AI 预算先流向基础设施", "应用层需要证明留存和毛利"]
    },
    metrics: [
      snapshot(15.0, 61000, 1800, 210, 150, 52, 360, 300000),
      snapshot(2.0, 98000, 3400, 390, 380, 130, 920, 610000)
    ]
  },
  {
    id: "marks-tech-cycle-risk",
    title: "Howard Marks 谈科技周期：AI 叙事、利率和安全边际",
    person: "Howard Marks",
    investor: "Howard Marks",
    sourceId: "investor-tv",
    domain: "Investing",
    platform: "YouTube",
    originalUrl: "",
    publishedAt: hoursAgo(29.0),
    discoveredAt: hoursAgo(28.2),
    processedAt: hoursAgo(27.5),
    durationMin: 39,
    contentType: "investorInterview",
    novelty: 70,
    editorBoost: 2,
    thumbnail: imagePool.Studio,
    summary: "偏风险框架，提醒科技变革是真的也不代表所有资产都便宜。重点是把长期叙事和周期性定价分开。",
    topics: ["Valuation", "Risk Management", "应用层"],
    assets: ["QQQ", "NVDA", "META"],
    investment: {
      direction: "应用层",
      stance: "谨慎",
      horizon: "周期观察",
      conviction: 76,
      riskTone: "安全边际优先",
      thesis: ["技术变革和投资回报不是同一件事", "利率会影响长久期科技资产定价", "高质量资产也需要安全边际"]
    },
    metrics: [
      snapshot(26.0, 46000, 1100, 140, 90, 35, 230, 180000),
      snapshot(4.0, 71000, 2100, 270, 190, 70, 620, 330000)
    ]
  },
  {
    id: "dixon-ai-crypto-infra",
    title: "Chris Dixon 谈 AI 与加密基建：去中心化算力、身份和支付网络",
    person: "Chris Dixon",
    investor: "Chris Dixon",
    sourceId: "a16z-crypto",
    domain: "Investing",
    platform: "YouTube",
    originalUrl: "https://www.youtube.com/@a16zcrypto",
    publishedAt: hoursAgo(21.3),
    discoveredAt: hoursAgo(20.7),
    processedAt: hoursAgo(20.0),
    durationMin: 44,
    contentType: "investorInterview",
    novelty: 81,
    editorBoost: 4,
    thumbnail: imagePool.Both,
    summary: "把 AI 与 crypto 的交集放在基础设施层：身份、支付、算力市场和数据所有权，而不是短期叙事交易。",
    topics: ["加密基建", "AI Agents", "Onchain Payments"],
    assets: ["ETH", "SOL", "COIN"],
    investment: {
      direction: "加密基建",
      stance: "看多",
      horizon: "3-5 年",
      conviction: 83,
      riskTone: "落地节奏不确定",
      thesis: ["AI agents 可能需要机器间支付和身份层", "去中心化算力要证明成本与可靠性", "投资重点在基础设施而不是概念币"]
    },
    metrics: [
      snapshot(20.0, 39000, 1200, 180, 210, 80, 420, 240000),
      snapshot(2.5, 87000, 3100, 430, 720, 260, 1600, 760000)
    ]
  }
];

const investmentMasterLibrary = [
  {
    id: "buffett-quality-value",
    investor: "Warren Buffett",
    title: "Warren Buffett：安全边际、护城河与长期复利",
    originalUrl: "https://www.youtube.com/watch?v=8nbQhh7PPYk",
    direction: "价值投资派",
    stance: "长期主义",
    horizon: "10 年+",
    conviction: 99,
    riskTone: "只买懂的生意",
    summary: "用合理价格买入长期优秀企业，核心是能力圈、护城河、管理层和长期现金流。",
    thesis: ["价格要低于长期价值", "好公司比短期行情更重要", "复利来自商业质量和时间"],
    topics: ["价值投资派", "优质成长派", "护城河"],
    assets: ["BRK", "Quality"]
  },
  {
    id: "graham-margin-safety",
    investor: "Benjamin Graham",
    title: "Benjamin Graham：安全边际与市场先生",
    originalUrl: "",
    direction: "价值投资派",
    stance: "安全边际",
    horizon: "长期纪律",
    conviction: 98,
    riskTone: "先防永久亏损",
    summary: "现代价值投资的源头，把股票视为企业权益，用安全边际抵御估值和情绪误差。",
    thesis: ["市场先生提供报价而不是答案", "投资和投机必须分开", "安全边际是风险控制核心"],
    topics: ["价值投资派", "安全边际", "内在价值"],
    assets: ["Intrinsic Value"]
  },
  {
    id: "klarman-absolute-return",
    investor: "Seth Klarman",
    title: "Seth Klarman：安全边际、现金与机会成本",
    originalUrl: "",
    direction: "价值投资派",
    stance: "绝对收益",
    horizon: "周期等待",
    conviction: 94,
    riskTone: "宁可错过不要亏大",
    summary: "强调等待错误定价和避免永久亏损，现金是机会权利而不只是拖累。",
    thesis: ["现金能保留出手机会", "安全边际来自价格和结构", "纪律比覆盖更多机会更重要"],
    topics: ["价值投资派", "安全边际", "绝对收益"],
    assets: ["Cash", "Special Situations"]
  },
  {
    id: "greenblatt-magic-formula",
    investor: "Joel Greenblatt",
    title: "Joel Greenblatt：好公司、好价格与魔法公式",
    originalUrl: "",
    direction: "价值投资派",
    stance: "质量+估值",
    horizon: "3-5 年",
    conviction: 89,
    riskTone: "模型需要耐心",
    summary: "把资本回报率和盈利收益率结合，用简单规则筛选高质量且便宜的公司。",
    thesis: ["高资本回报率代表商业质量", "好公司必须配合合理价格", "简单规则长期有效但短期会失灵"],
    topics: ["价值投资派", "质量投资", "因子"],
    assets: ["ROIC", "Earnings Yield"]
  },
  {
    id: "munger-mental-models",
    investor: "Charlie Munger",
    title: "Charlie Munger：多元思维模型与优秀企业",
    originalUrl: "",
    direction: "优质成长派",
    stance: "理性克制",
    horizon: "终身框架",
    conviction: 97,
    riskTone: "防止愚蠢错误",
    summary: "用跨学科模型理解商业、激励和人性，寻找能够长期创造价值的优秀公司。",
    thesis: ["避免重大错误比追逐聪明更重要", "好生意需要长期可持续优势", "激励和心理偏误会毁掉判断"],
    topics: ["优质成长派", "多元思维", "长期复利"],
    assets: ["Mental Models", "Quality"]
  },
  {
    id: "fisher-common-stocks",
    investor: "Philip Fisher",
    title: "Philip Fisher：成长股、管理层与长期持有",
    originalUrl: "",
    direction: "优质成长派",
    stance: "长期成长",
    horizon: "5-10 年",
    conviction: 91,
    riskTone: "成长必须兑现",
    summary: "强调调研公司质量、管理层和长期成长空间，是优质成长投资的重要源头。",
    thesis: ["管理层质量决定长期上限", "成长来自产品、研发和销售能力", "长期持有需要持续验证竞争力"],
    topics: ["优质成长派", "成长股", "管理层"],
    assets: ["Growth", "Quality"]
  },
  {
    id: "lynch-know-what-you-own",
    investor: "Peter Lynch",
    title: "Peter Lynch：买你真正理解的公司",
    originalUrl: "",
    direction: "优质成长派",
    stance: "自下而上",
    horizon: "3-5 年",
    conviction: 91,
    riskTone: "警惕故事股",
    summary: "从生活和行业观察中发现机会，但必须回到盈利、估值和长期增长验证。",
    thesis: ["熟悉行业能形成早期洞察", "故事必须由利润和增长兑现", "分类理解公司比笼统看多更可靠"],
    topics: ["优质成长派", "成长股", "研究方法"],
    assets: ["Equities", "Growth"]
  },
  {
    id: "soros-reflexivity",
    investor: "George Soros",
    title: "George Soros：反身性与宏观趋势",
    originalUrl: "",
    direction: "全球宏观派",
    stance: "反身性",
    horizon: "周期交易",
    conviction: 93,
    riskTone: "泡沫可自我强化",
    summary: "把市场认知、价格和基本面之间的反馈循环作为核心，适合理解泡沫和拐点。",
    thesis: ["价格会反过来影响基本面", "错误认知可以长期自我强化", "拐点来自反馈循环断裂"],
    topics: ["全球宏观派", "反身性", "泡沫"],
    assets: ["Currencies", "Macro"]
  },
  {
    id: "druckenmiller-asymmetry",
    investor: "Stanley Druckenmiller",
    title: "Stanley Druckenmiller：非对称下注与宏观趋势",
    originalUrl: "",
    direction: "全球宏观派",
    stance: "非对称机会",
    horizon: "6-24 月",
    conviction: 92,
    riskTone: "快速纠错",
    summary: "在强逻辑和强趋势共振时重仓，同时用严格止损和灵活性保护资本。",
    thesis: ["大钱来自少数强趋势机会", "错了要快速承认", "宏观、流动性和盈利周期要一起看"],
    topics: ["全球宏观派", "非对称", "趋势"],
    assets: ["Macro", "Equities"]
  },
  {
    id: "dalio-economic-machine",
    investor: "Ray Dalio",
    title: "Ray Dalio：经济机器如何运转",
    originalUrl: "https://www.youtube.com/watch?v=PHe0bXAIuk0",
    direction: "全球宏观派",
    stance: "周期框架",
    horizon: "周期观察",
    conviction: 95,
    riskTone: "债务周期优先",
    summary: "用交易、信贷、债务周期和生产率解释宏观环境，是理解资产价格周期的经典入门。",
    thesis: ["信贷扩张和收缩驱动短中期周期", "长期增长取决于生产率", "去杠杆过程决定资产配置环境"],
    topics: ["全球宏观派", "债务周期", "资产配置"],
    assets: ["Rates", "Credit"]
  },
  {
    id: "simons-quant-system",
    investor: "Jim Simons",
    title: "Jim Simons：量化投资、数据和模型纪律",
    originalUrl: "",
    direction: "量化投资",
    stance: "数据驱动",
    horizon: "系统长期",
    conviction: 94,
    riskTone: "模型失效和过拟合",
    summary: "用数学、统计和团队化研究构建可重复系统，寻找市场错误定价。",
    thesis: ["可重复系统比主观判断更稳定", "模型必须防止过拟合", "人才密度和研究流程是护城河"],
    topics: ["量化投资", "模型", "统计套利"],
    assets: ["Quant"]
  },
  {
    id: "bogle-indexing",
    investor: "John Bogle",
    title: "John Bogle：低成本指数与长期持有",
    originalUrl: "",
    direction: "指数投资派",
    stance: "长期低成本",
    horizon: "10 年+",
    conviction: 96,
    riskTone: "成本就是负复利",
    summary: "普通人很难长期战胜市场，低成本持有市场整体往往更优。",
    thesis: ["费用会显著侵蚀长期回报", "多数投资者不需要频繁择时", "拥有整个市场比猜赢家更稳"],
    topics: ["指数投资派", "低成本", "长期持有"],
    assets: ["Index Funds"]
  },
  {
    id: "icahn-activism",
    investor: "Carl Icahn",
    title: "Carl Icahn：主动主义、治理和股东价值",
    originalUrl: "",
    direction: "激进投资派",
    stance: "治理改善",
    horizon: "1-5 年",
    conviction: 86,
    riskTone: "冲突成本高",
    summary: "通过治理、资产出售、分拆、回购或更换管理层推动公司释放价值。",
    thesis: ["治理结构会影响公司价值", "资本配置错误提供改善空间", "公开对抗带来执行和声誉风险"],
    topics: ["激进投资派", "公司治理", "主动主义"],
    assets: ["Activism"]
  },
  {
    id: "ackman-activism-quality",
    investor: "Bill Ackman",
    title: "Bill Ackman：集中持仓、商业质量与主动主义",
    originalUrl: "",
    direction: "激进投资派",
    stance: "高质量集中",
    horizon: "3-7 年",
    conviction: 87,
    riskTone: "公开争议和执行风险",
    summary: "集中买入高质量公司，并通过治理改善、资本配置和战略调整释放价值。",
    thesis: ["少数高质量公司可以构成组合核心", "治理和资本配置能释放价值", "集中持仓需要强风险承受力"],
    topics: ["激进投资派", "主动主义", "集中投资"],
    assets: ["Quality", "Activism"]
  },
  {
    id: "kravis-private-equity",
    investor: "Henry Kravis",
    title: "Henry Kravis：杠杆收购、私募股权与长期价值创造",
    originalUrl: "",
    direction: "另类资产派",
    stance: "运营改善",
    horizon: "5-10 年",
    conviction: 86,
    riskTone: "杠杆和退出周期",
    summary: "代表私募股权和杠杆收购路径，通过非公开市场、治理和运营改善获取超额收益。",
    thesis: ["控制权可以改变企业价值", "杠杆放大收益也放大风险", "退出窗口和现金流质量很关键"],
    topics: ["另类资产派", "PE", "杠杆收购"],
    assets: ["Private Equity", "LBO"]
  },
  {
    id: "swensen-endowment",
    investor: "David Swensen",
    title: "David Swensen：耶鲁模式与长期资产配置",
    originalUrl: "",
    direction: "另类资产派",
    stance: "多资产长期配置",
    horizon: "10 年+",
    conviction: 91,
    riskTone: "流动性和管理人选择",
    summary: "机构资产配置经典框架，强调长期资本、另类资产、分散和管理人选择。",
    thesis: ["长期资金可以承受流动性折价", "资产配置比择时更重要", "管理人选择决定另类资产结果"],
    topics: ["另类资产派", "资产配置", "另类资产"],
    assets: ["Endowment Model"]
  },
  {
    id: "marks-market-cycles",
    investor: "Howard Marks",
    title: "Howard Marks：周期、风险与第二层思维",
    originalUrl: "",
    direction: "周期逆向派",
    stance: "逆向风险控制",
    horizon: "周期观察",
    conviction: 94,
    riskTone: "风险来自价格和共识",
    summary: "强调风险不是波动率，而是永久损失和过度乐观；适合做市场温度计。",
    thesis: ["二阶思维要求理解市场定价", "周期不会消失，只会改变表现形式", "便宜和安全不是同义词"],
    topics: ["周期逆向派", "周期", "逆向投资"],
    assets: ["Credit", "Distressed"]
  },
  {
    id: "templeton-global-bargains",
    investor: "John Templeton",
    title: "John Templeton：全球低估、极端悲观与长期逆向",
    originalUrl: "",
    direction: "周期逆向派",
    stance: "全球逆向",
    horizon: "5-10 年",
    conviction: 90,
    riskTone: "价值陷阱和国家风险",
    summary: "在全球范围寻找被极端悲观压低的资产，用长期视角等待价值修复。",
    thesis: ["最悲观处常有长期机会", "全球比较能扩大机会集", "低估需要基本面修复路径"],
    topics: ["周期逆向派", "全球配置", "低估"],
    assets: ["Global Equities"]
  },
  {
    id: "grantham-bubbles",
    investor: "Jeremy Grantham",
    title: "Jeremy Grantham：泡沫、均值回归与长期资产回报",
    originalUrl: "",
    direction: "周期逆向派",
    stance: "均值回归",
    horizon: "7-10 年",
    conviction: 88,
    riskTone: "泡沫持续时间不确定",
    summary: "关注估值极端、资产泡沫和长期回报均值回归，适合判断市场大周期位置。",
    thesis: ["估值极端会压低未来回报", "泡沫可能持续但不会永久", "长期资产配置要尊重均值回归"],
    topics: ["周期逆向派", "均值回归", "泡沫"],
    assets: ["Asset Allocation"]
  },
  {
    id: "burry-big-short",
    investor: "Michael Burry",
    title: "Michael Burry：深度研究、逆向下注与泡沫识别",
    originalUrl: "",
    direction: "周期逆向派",
    stance: "深度逆向",
    horizon: "1-5 年",
    conviction: 87,
    riskTone: "时点和流动性压力",
    summary: "通过深度基本面和结构研究识别泡沫或错价，关键难点是时点、仓位和承压能力。",
    thesis: ["极端共识里可能隐藏错价", "结构性研究能发现非显性风险", "逆向正确也要熬过时间压力"],
    topics: ["周期逆向派", "泡沫", "深度研究"],
    assets: ["Shorts", "Special Situations"]
  }
];

const liveData = window.__ALPHA_RADAR_LIVE_DATA__ || {};
const generatedVideos = Array.isArray(liveData.videos) ? liveData.videos : [];

function mergeSourceProfiles(baseSources, generatedSources) {
  const byId = new Map(baseSources.map((source) => [source.id, source]));
  generatedSources.forEach((source) => {
    if (!source?.id) return;
    byId.set(source.id, { ...(byId.get(source.id) || {}), ...source });
  });
  return [...byId.values()];
}

const activeSourceProfiles = mergeSourceProfiles(
  sourceProfiles,
  Array.isArray(liveData.sources) ? liveData.sources : []
);
const sourceById = new Map(activeSourceProfiles.map((source) => [source.id, source]));

function getSourceProfile(sourceId) {
  return (
    sourceById.get(sourceId) || {
      id: sourceId || "unknown",
      name: sourceId || "Unknown Source",
      type: "generated",
      domain: "AI",
      platform: "YouTube",
      priority: "P1",
      cadence: "daily",
      language: "EN",
      official: false,
      weight: 60,
      median24h: 50000,
      trackedPeople: [],
      trackedTopics: [],
      trackedAssets: []
    }
  );
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function ageHours(isoDate) {
  return Math.max(0, (state.now.getTime() - new Date(isoDate).getTime()) / MS_PER_HOUR);
}

function latestMetric(video) {
  if (!Array.isArray(video.metrics) || !video.metrics.length) return snapshot(0, 0, 0, 0, 0, 0, 0, 0);
  return video.metrics[video.metrics.length - 1];
}

function previousMetric(video) {
  if (!Array.isArray(video.metrics) || !video.metrics.length) return snapshot(1, 0, 0, 0, 0, 0, 0, 0);
  return video.metrics[Math.max(0, video.metrics.length - 2)];
}

function formatDateTime(isoDate) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: TIME_ZONE,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(isoDate));
}

function formatShortTime(isoDate) {
  const hours = ageHours(isoDate);
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} 分钟前`;
  if (hours < 24) return `${Math.round(hours)} 小时前`;
  return `${Math.round(hours / 24)} 天前`;
}

function formatHistoricalAge(isoDate) {
  const days = Math.max(1, Math.round(ageHours(isoDate) / 24));
  if (days < 365) return `约 ${Math.max(1, Math.round(days / 30))} 个月前`;
  return `约 ${Math.round(days / DAYS_PER_YEAR)} 年前`;
}

function formatCompactNumber(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return String(value);
}

function isDirectVideoUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") return parsed.pathname === "/watch" && parsed.searchParams.has("v");
    if (host === "youtu.be") return parsed.pathname.length > 1;
    if (host === "x.com" || host === "twitter.com") return /\/status\//.test(parsed.pathname);
    return false;
  } catch {
    return false;
  }
}

function isVerifiedPlayableUrl(video) {
  return isDirectVideoUrl(video.originalUrl) && video.linkStatus === "verified";
}

function getYouTubeVideoId(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return parsed.pathname.slice(1);
    if (host === "youtube.com" || host === "m.youtube.com") return parsed.searchParams.get("v") || "";
    return "";
  } catch {
    return "";
  }
}

function getVerifiedThumbnail(video) {
  if (!isVerifiedPlayableUrl(video)) return "";
  const youtubeId = getYouTubeVideoId(video.originalUrl);
  if (!youtubeId) return "";
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

function getPortraitPageTitle(video) {
  const names = [video.investor, video.person].filter(Boolean);
  for (const name of names) {
    if (portraitPageByName[name]) return portraitPageByName[name];
  }
  return sourcePortraitPageById[video.sourceId] || "";
}

function getWikipediaUrl(pageTitle) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle.replace(/\s+/g, "_"))}`;
}

function getInvestorWikipediaUrl(investor) {
  return getWikipediaUrl(portraitPageByName[investor] || investor);
}

function getMaterialImage(video) {
  return video.thumbnail || imagePool[video.domain] || imagePool.Investing;
}

function getPortraitCacheKey(pageTitle) {
  return `alpha-radar-portrait:${pageTitle}`;
}

function readStoredPortrait(pageTitle) {
  try {
    return window.localStorage.getItem(getPortraitCacheKey(pageTitle)) || "";
  } catch {
    return "";
  }
}

function writeStoredPortrait(pageTitle, imageUrl) {
  try {
    window.localStorage.setItem(getPortraitCacheKey(pageTitle), imageUrl);
  } catch {
    // localStorage may be unavailable on some file:// previews.
  }
}

function resolvePortraitImage(pageTitle) {
  if (!pageTitle) return Promise.resolve("");
  if (portraitImageCache.has(pageTitle)) return portraitImageCache.get(pageTitle);

  const stored = readStoredPortrait(pageTitle);
  if (stored) {
    const storedPromise = Promise.resolve(stored);
    portraitImageCache.set(pageTitle, storedPromise);
    return storedPromise;
  }

  const apiUrl = new URL("https://en.wikipedia.org/w/api.php");
  apiUrl.searchParams.set("action", "query");
  apiUrl.searchParams.set("format", "json");
  apiUrl.searchParams.set("origin", "*");
  apiUrl.searchParams.set("prop", "pageimages");
  apiUrl.searchParams.set("titles", pageTitle);
  apiUrl.searchParams.set("pithumbsize", "900");

  const request = fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("portrait request failed");
      return response.json();
    })
    .then((data) => {
      const pages = Object.values(data.query?.pages || {});
      const imageUrl = pages.find((page) => page.thumbnail?.source)?.thumbnail?.source || "";
      if (imageUrl) writeStoredPortrait(pageTitle, imageUrl);
      return imageUrl;
    })
    .catch(() => {
      portraitImageCache.delete(pageTitle);
      return "";
    });

  portraitImageCache.set(pageTitle, request);
  return request;
}

function getInitials(name) {
  const cleanName = (name || "AR").trim();
  if (/[\u4e00-\u9fff]/.test(cleanName)) return cleanName.slice(0, 2);
  return cleanName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function createArchiveThumbnail(video, statusText = "视频待核验") {
  const node = document.createElement("div");
  node.className = "archive-thumb-card";

  const status = document.createElement("span");
  status.className = "archive-thumb-status";
  status.textContent = statusText;

  const initials = document.createElement("strong");
  initials.textContent = getInitials(video.person || video.source?.name);

  const source = document.createElement("small");
  source.textContent = video.source?.name || video.platform || "Alpha Radar";

  node.append(status, initials, source);
  return node;
}

function renderMaterialThumbnail(card, video, label = "相关主题素材图") {
  const wrap = card.querySelector(".thumb-wrap");
  const image = wrap.querySelector("img");
  if (!image) return;

  wrap.classList.remove("has-placeholder", "is-loading-portrait");
  wrap.classList.add("has-material");
  image.src = getMaterialImage(video);
  image.alt = `${video.title} ${label}`;
  image.onerror = () => {
    wrap.classList.add("has-placeholder");
    image.replaceWith(createArchiveThumbnail(video, "封面暂无"));
  };
}

function renderPortraitThumbnail(card, video, pageTitle) {
  const wrap = card.querySelector(".thumb-wrap");
  const image = wrap.querySelector("img");
  if (!image) return;

  const personName = video.investor || video.person || pageTitle;
  wrap.classList.remove("has-placeholder");
  wrap.classList.add("has-portrait", "is-loading-portrait");
  image.src = getMaterialImage(video);
  image.alt = `${personName} 相关素材图`;
  image.onerror = () => {
    wrap.classList.add("has-placeholder");
    image.replaceWith(createArchiveThumbnail(video, "封面暂无"));
  };

  resolvePortraitImage(pageTitle).then((portraitUrl) => {
    if (!portraitUrl || !card.isConnected) return;
    const currentImage = wrap.querySelector("img");
    if (!currentImage) return;
    wrap.classList.remove("is-loading-portrait");
    wrap.classList.add("has-portrait");
    currentImage.src = portraitUrl;
    currentImage.alt = `${personName} 人物素材图`;
  });
}

function renderFallbackThumbnail(card, video) {
  const portraitPage = getPortraitPageTitle(video);
  if (portraitPage) {
    renderPortraitThumbnail(card, video, portraitPage);
    return;
  }
  renderMaterialThumbnail(card, video);
}

function renderCardThumbnail(card, video) {
  const wrap = card.querySelector(".thumb-wrap");
  const image = card.querySelector("img");
  const thumbnail = getVerifiedThumbnail(video);

  if (!thumbnail) {
    renderFallbackThumbnail(card, video);
    return;
  }

  wrap.classList.remove("has-placeholder");
  wrap.classList.add("has-video-thumb");
  image.src = thumbnail;
  image.alt = `${video.title} 真实视频封面`;
  image.onerror = () => {
    renderFallbackThumbnail(card, video);
  };
}

function renderInvestmentPortrait(card, video) {
  const wrap = card.querySelector(".investment-portrait");
  const image = wrap?.querySelector("img");
  if (!wrap || !image) return;

  const personName = video.investor || video.person || "Investor";
  wrap.dataset.name = personName;
  wrap.classList.add("is-fallback");
  image.removeAttribute("src");
  image.alt = "";
  image.onerror = () => {
    wrap.classList.remove("has-portrait", "is-loading-portrait");
    wrap.classList.add("is-fallback");
    image.removeAttribute("src");
    image.alt = "";
  };

  const portraitPage = getPortraitPageTitle(video);
  if (!portraitPage) return;

  wrap.classList.add("is-loading-portrait");
  resolvePortraitImage(portraitPage).then((portraitUrl) => {
    if (!portraitUrl || !card.isConnected) return;
    const currentImage = wrap.querySelector("img");
    if (!currentImage) return;
    wrap.classList.remove("is-loading-portrait");
    wrap.classList.add("has-portrait");
    wrap.classList.remove("is-fallback");
    currentImage.src = portraitUrl;
    currentImage.alt = `${personName} 人物素材图`;
  });
}

function getLocatorUrl(video) {
  const query = [video.investor || video.person, video.title, ...(video.topics || []).slice(0, 2)]
    .filter(Boolean)
    .join(" ");
  if (video.platform === "X") {
    return `https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=live`;
  }
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function openOriginalVideo(video) {
  if (!isVerifiedPlayableUrl(video)) return;
  window.open(video.originalUrl, "_blank", "noopener,noreferrer");
}

function todayKey(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function freshnessScore(video) {
  const hours = ageHours(video.publishedAt);
  if (hours <= 3) return 100;
  if (hours <= 12) return 85;
  if (hours <= 24) return 70;
  if (hours <= 72) return 45;
  if (hours <= 168) return 25;
  return 10;
}

function topicWeight(video) {
  const weights = {
    "AI Agents": 98,
    Inference: 90,
    Compute: 88,
    "Ethereum L2": 94,
    "Account Abstraction": 86,
    Interoperability: 84,
    GPU: 89,
    "Data Center": 84,
    Robotics: 78,
    Stablecoin: 90,
    Regulation: 82,
    Payments: 80,
    "Scaling Laws": 90,
    "Open Models": 82,
    "Synthetic Data": 76,
    "Onchain Payments": 88,
    Solana: 78,
    "Consumer Crypto": 74,
    Wallets: 72,
    Policy: 72,
    "Small Models": 70,
    Education: 62,
    "Personal AI": 70,
    "AI 基建": 92,
    "应用层": 82,
    "半导体": 90,
    Cloud: 84,
    "Enterprise Software": 78,
    Valuation: 80,
    "Risk Management": 78,
    "Autonomous Driving": 80,
    "加密基建": 82,
    "价值投资派": 96,
    "优质成长派": 94,
    "全球宏观派": 92,
    "指数投资派": 88,
    "激进投资派": 86,
    "另类资产派": 86,
    "周期逆向派": 90,
    "价值投资": 92,
    "行为与风险": 88,
    "宏观与对冲": 88,
    "指数与配置": 84,
    "估值与研究": 88,
    "创业与科技": 84,
    "量化投资": 86,
    "安全边际": 94,
    "长期复利": 92,
    "护城河": 90,
    "资产配置": 86,
    "风险控制": 88,
    "因子": 82,
    "凯利公式": 84
  };
  const topicScores = video.topics.map((topic) => weights[topic] || 65);
  const assetScores = video.assets.map((asset) => {
    if (["OpenAI", "ETH", "NVDA", "SOL", "BTC", "MSFT", "GOOGL"].includes(asset)) return 88;
    if (["Anthropic", "Google", "Blackwell", "USDC", "TSLA", "META", "AMZN", "COIN"].includes(asset)) return 82;
    return 68;
  });
  const allScores = [...topicScores, ...assetScores].sort((a, b) => b - a).slice(0, 4);
  return allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
}

function contentTypeScore(type) {
  const scores = {
    officialLaunch: 98,
    keynote: 92,
    founderInterview: 86,
    investorInterview: 84,
    podcast: 75,
    marketRoundtable: 68,
    clip: 58
  };
  return scores[type] || 65;
}

function importanceScore(video) {
  const source = getSourceProfile(video.sourceId);
  const official = source.official ? 95 : 64;
  return Math.round(
    source.weight * 0.35 +
      topicWeight(video) * 0.25 +
      contentTypeScore(video.contentType) * 0.15 +
      video.novelty * 0.15 +
      official * 0.10
  );
}

function velocityScore(video) {
  const source = getSourceProfile(video.sourceId);
  const latest = latestMetric(video);
  const previous = previousMetric(video);
  const deltaViews = Math.max(0, latest.views - previous.views);
  const deltaHours = Math.max(0.25, (new Date(latest.at) - new Date(previous.at)) / MS_PER_HOUR);
  const velocity = deltaViews / deltaHours;
  const baseline = Math.max(1, source.median24h / 24);
  return Math.round(clamp(Math.log1p(velocity / baseline) * 42));
}

function spreadScore(video) {
  const source = getSourceProfile(video.sourceId);
  const latest = latestMetric(video);
  const relativeViews = latest.views / Math.max(1, source.median24h);
  const relativeScore = clamp(Math.log1p(relativeViews) * 52);
  const interactions =
    latest.likes +
    latest.comments * 4 +
    latest.xReposts * 7 +
    latest.xQuotes * 8 +
    latest.xBookmarks * 5;
  const engagementScore = clamp((interactions / Math.max(1, latest.views)) * 1400);
  const crossPlatformScore = clamp(Math.log1p(latest.xReposts + latest.xQuotes) * 14);
  const commentQuality = clamp((latest.comments / Math.max(1, latest.views)) * 9000);
  return Math.round(
    relativeScore * 0.30 +
      engagementScore * 0.25 +
      velocityScore(video) * 0.25 +
      crossPlatformScore * 0.15 +
      commentQuality * 0.05
  );
}

function hotScore(video) {
  return Math.round(
    importanceScore(video) * 0.40 +
      spreadScore(video) * 0.35 +
      freshnessScore(video) * 0.20 +
      clamp(video.editorBoost * 10) * 0.05
  );
}

function enrichVideo(video) {
  return {
    ...video,
    source: getSourceProfile(video.sourceId),
    freshness: freshnessScore(video),
    importance: importanceScore(video),
    spread: spreadScore(video),
    velocity: velocityScore(video),
    hot: hotScore(video)
  };
}

function investmentHistoryAgeHours(index, total) {
  const maxDays = INVESTMENT_HISTORY_YEARS * DAYS_PER_YEAR;
  const minDays = DAYS_PER_YEAR;
  const span = Math.max(1, total - 1);
  const daysBack = Math.round(minDays + (index / span) * (maxDays - minDays));
  return daysBack * 24;
}

function createInvestmentMasterVideo(item, index, total = investmentMasterLibrary.length) {
  const age = investmentHistoryAgeHours(index, total);
  const views = 120000 + (30 - index) * 17000;
  const spreadLift = item.originalUrl ? 1.35 : 0.82;
  return {
    id: item.id,
    title: item.title,
    person: item.investor,
    investor: item.investor,
    sourceId: "investor-tv",
    domain: "Investing",
    platform: "YouTube",
    originalUrl: item.originalUrl,
    linkStatus: item.linkStatus || "candidate",
    publishedAt: hoursAgo(age),
    discoveredAt: hoursAgo(age - 1.2),
    processedAt: hoursAgo(age - 2.0),
    durationMin: 28 + (index % 8) * 7,
    contentType: "investorInterview",
    novelty: item.conviction,
    editorBoost: Math.round(item.conviction / 14),
    thumbnail: imagePool.Investing,
    summary: item.summary,
    topics: item.topics,
    assets: item.assets,
    investment: {
      direction: item.direction,
      stance: item.stance,
      horizon: item.horizon,
      conviction: item.conviction,
      riskTone: item.riskTone,
      thesis: item.thesis
    },
    metrics: [
      snapshot(age - 6, Math.round(views * 0.58 * spreadLift), 1800 + index * 40, 180 + index * 5, 120, 50, 360, 220000),
      snapshot(age - 1, Math.round(views * spreadLift), 3600 + index * 70, 340 + index * 8, 360, 120, 880, 520000)
    ]
  };
}

function normalizeGeneratedVideo(video) {
  const source = getSourceProfile(video.sourceId);
  return {
    id: video.id || `${video.sourceId || "generated"}-${getYouTubeVideoId(video.originalUrl) || video.title}`,
    title: video.title || "Untitled video",
    person: video.person || source.trackedPeople?.[0] || source.name,
    investor: video.investor || "",
    sourceId: video.sourceId || source.id,
    domain: video.domain || source.domain || "AI",
    platform: video.platform || source.platform || "YouTube",
    originalUrl: video.originalUrl || "",
    linkStatus: video.linkStatus || (isDirectVideoUrl(video.originalUrl) ? "verified" : "candidate"),
    publishedAt: video.publishedAt || new Date().toISOString(),
    discoveredAt: video.discoveredAt || liveData.generatedAt || new Date().toISOString(),
    processedAt: video.processedAt || liveData.generatedAt || new Date().toISOString(),
    durationMin: video.durationMin || 0,
    contentType: video.contentType || "podcast",
    novelty: video.novelty ?? 70,
    editorBoost: video.editorBoost ?? 2,
    thumbnail: video.thumbnail || imagePool[video.domain || source.domain] || imagePool.AI,
    summary: video.summary || "自动采集到的新公开视频，等待进一步摘要和主题核验。",
    topics: Array.isArray(video.topics) && video.topics.length ? video.topics : source.trackedTopics || [],
    assets: Array.isArray(video.assets) && video.assets.length ? video.assets : source.trackedAssets || [],
    investment: video.investment,
    metrics: Array.isArray(video.metrics) && video.metrics.length ? video.metrics : [snapshot(0, 0, 0, 0, 0, 0, 0, 0)]
  };
}

function mergeVideosByUrl(...groups) {
  const byKey = new Map();
  groups.flat().forEach((video) => {
    const key = video.originalUrl || video.id;
    if (!key || byKey.has(key)) return;
    byKey.set(key, video);
  });
  return [...byKey.values()];
}

function getScoredVideos() {
  const radarVideos = videos.filter((video) => video.domain !== "Investing");
  const investmentVideos = investmentMasterLibrary.map((item, index) =>
    createInvestmentMasterVideo(item, index, investmentMasterLibrary.length)
  );
  const liveVideos = generatedVideos.map(normalizeGeneratedVideo);
  return mergeVideosByUrl(liveVideos, radarVideos, investmentVideos).map(enrichVideo);
}

function matchesQuery(video) {
  if (!state.query) return true;
  const query = state.query.toLowerCase();
  const haystack = [
    video.title,
    video.person,
    video.source.name,
    video.domain,
    video.platform,
    video.summary,
    video.investor || "",
    video.investment?.direction || "",
    video.investment?.stance || "",
    video.investment?.horizon || "",
    video.investment?.riskTone || "",
    ...(video.investment?.thesis || []),
    ...video.topics,
    ...video.assets
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function matchesDomain(video) {
  return state.domain === "all" || video.domain === state.domain;
}

function sortVideos(list) {
  const sorted = [...list];
  const sorters = {
    hot: (a, b) => b.hot - a.hot || new Date(b.publishedAt) - new Date(a.publishedAt),
    latest: (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
    importance: (a, b) => b.importance - a.importance || b.hot - a.hot,
    rising: (a, b) => b.velocity - a.velocity || b.spread - a.spread
  };
  return sorted.sort(sorters[state.sort]);
}

function getVisibleVideos() {
  return sortVideos(
    getScoredVideos()
      .filter((video) => video.domain !== "Investing")
      .filter((video) => matchesDomain(video))
      .filter((video) => matchesQuery(video))
  );
}

function getArchiveVideos() {
  return sortVideos(getScoredVideos().filter((video) => matchesQuery(video)));
}

function renderMetrics() {
  const scored = getScoredVideos();
  const today = todayKey(state.now);
  const todayVideos = scored.filter((video) => todayKey(new Date(video.publishedAt)) === today);
  const highestHot = Math.max(...scored.map((video) => video.hot));
  const rising = scored.filter((video) => video.velocity >= 72).length;

  document.querySelector("#metric-new").textContent = todayVideos.length;
  document.querySelector("#metric-hot").textContent = highestHot;
  document.querySelector("#metric-rising").textContent = rising;
}

function renderDataStatus() {
  const node = document.querySelector("#data-status");
  if (!node) return;
  if (generatedVideos.length && liveData.generatedAt) {
    node.textContent = `实时 ${generatedVideos.length}条 · ${formatDateTime(liveData.generatedAt)}`;
    return;
  }
  node.textContent = "当前为样例数据";
}

function renderSourceCounts() {
  const p0 = activeSourceProfiles.filter((source) => source.priority === "P0").length;
  const p1 = activeSourceProfiles.filter((source) => source.priority === "P1").length;
  document.querySelector("#p0-count").textContent = p0;
  document.querySelector("#p1-count").textContent = p1;
}

function renderVideoFeed() {
  const container = document.querySelector("#video-feed");
  const template = document.querySelector("#video-card-template");
  const visible = getVisibleVideos();
  container.textContent = "";

  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "没有匹配的视频，试试换一个主题、人物或资产。";
    container.append(empty);
    return;
  }

  visible.forEach((video) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const hasDirectLink = isVerifiedPlayableUrl(video);
    card.tabIndex = hasDirectLink ? 0 : -1;
    if (hasDirectLink) {
      card.setAttribute("role", "link");
      card.setAttribute("aria-label", `打开原视频：${video.title}`);
    }
    card.classList.toggle("is-unverified", !hasDirectLink);
    card.addEventListener("click", () => openOriginalVideo(video));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter") openOriginalVideo(video);
    });

    renderCardThumbnail(card, video);

    card.querySelector(".domain-pill").textContent = video.domain;
    card.querySelector(".time").textContent = formatShortTime(video.publishedAt);
    card.querySelector(".source").textContent = `${video.source.name} · ${video.platform}`;
    card.querySelector(".duration").textContent = `${video.durationMin} min`;
    card.querySelector("h3").textContent = video.title;
    card.querySelector(".summary").textContent = video.summary;
    card.querySelector(".hot-score").textContent = video.hot;
    card.querySelector(".importance-score").textContent = video.importance;
    card.querySelector(".spread-score").textContent = video.spread;
    card.querySelector(".velocity-score").textContent = video.velocity;
    const sourceLink = card.querySelector(".source-link");
    if (hasDirectLink) {
      sourceLink.href = video.originalUrl;
      sourceLink.textContent = "看原视频";
      sourceLink.addEventListener("click", (event) => event.stopPropagation());
    } else {
      sourceLink.href = getLocatorUrl(video);
      sourceLink.textContent = "定位线索";
      sourceLink.className = "locator-link";
      sourceLink.addEventListener("click", (event) => event.stopPropagation());
    }

    const tagRow = card.querySelector(".tag-row");
    [...video.topics.slice(0, 3), ...video.assets.slice(0, 2)].forEach((tag) => {
      const node = document.createElement("span");
      node.className = "tag";
      node.textContent = tag;
      tagRow.append(node);
    });

    container.append(card);
  });
}

function renderTopics() {
  const container = document.querySelector("#topic-stack");
  const counts = new Map();
  getVisibleVideos().forEach((video) => {
    video.topics.forEach((topic) => counts.set(topic, (counts.get(topic) || 0) + video.hot));
  });
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = Math.max(...top.map((item) => item[1]), 1);
  container.textContent = "";

  top.forEach(([topic, value]) => {
    const row = document.createElement("div");
    row.className = "topic-line";
    row.innerHTML = `
      <span title="${topic}">${topic}</span>
      <div class="topic-bar"><i style="--bar: ${(value / max) * 100}%"></i></div>
      <strong>${Math.round(value)}</strong>
    `;
    container.append(row);
  });
}

function renderPlatformMix() {
  const container = document.querySelector("#platform-bars");
  const counts = new Map();
  getVisibleVideos().forEach((video) => counts.set(video.platform, (counts.get(video.platform) || 0) + 1));
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const max = Math.max(...rows.map((item) => item[1]), 1);
  container.textContent = "";

  rows.forEach(([platform, count]) => {
    const row = document.createElement("div");
    row.className = "platform-row";
    row.innerHTML = `
      <span>${platform}</span>
      <div class="platform-meter"><i style="--bar: ${(count / max) * 100}%"></i></div>
      <strong>${count}</strong>
    `;
    container.append(row);
  });
}

function getInvestmentVideos() {
  return sortVideos(
    getScoredVideos()
      .filter((video) => video.domain === "Investing")
      .filter((video) => state.investmentFilter === "all" || video.investment?.direction === state.investmentFilter)
      .filter((video) => matchesQuery(video))
  );
}

function stanceClass(stance) {
  if (stance === "看多") return "is-bullish";
  if (stance === "谨慎" || stance === "谨慎看多") return "is-cautious";
  return "is-debate";
}

function renderInvestmentFeed() {
  const container = document.querySelector("#investment-feed");
  const rows = getInvestmentVideos();
  container.textContent = "";

  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "没有匹配的投资观点视频，试试切换方向或清空搜索。";
    container.append(empty);
    return;
  }

  rows.forEach((video) => {
    const hasDirectLink = isVerifiedPlayableUrl(video);
    const card = document.createElement("article");
    card.className = "investment-card";
    card.classList.toggle("is-unverified", !hasDirectLink);
    card.tabIndex = hasDirectLink ? 0 : -1;
    if (hasDirectLink) {
      card.setAttribute("role", "link");
      card.setAttribute("aria-label", `打开原视频：${video.title}`);
    }
    card.addEventListener("click", () => openOriginalVideo(video));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter") openOriginalVideo(video);
    });

    card.innerHTML = `
      <div class="investment-portrait">
        <img alt="" loading="lazy" />
        <span class="portrait-initials">${getInitials(video.investor || video.person)}</span>
      </div>
      <div class="investment-content">
        <div class="investment-top">
          <div>
            <div class="investor-meta">
              <span>${formatHistoricalAge(video.publishedAt)}</span>
              <span>${video.investor}</span>
              <span>${video.source.name}</span>
              <span>${video.durationMin} min</span>
            </div>
            <h3>${video.title}</h3>
          </div>
          <span class="stance-badge ${stanceClass(video.investment.stance)}">${video.investment.stance}</span>
        </div>
        <p class="investment-summary">${video.summary}</p>
        <ul class="thesis-list">
          ${video.investment.thesis.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <div class="tag-row">
          ${[video.investment.direction, ...video.assets.slice(0, 4)].map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <div class="investment-score-grid">
          <div><span>观点信心</span><strong>${video.investment.conviction}</strong></div>
          <div><span>综合热度</span><strong>${video.hot}</strong></div>
          <div><span>传播度</span><strong>${video.spread}</strong></div>
          <div><span>时间周期</span><strong>${video.investment.horizon}</strong></div>
        </div>
        ${
          hasDirectLink
            ? `<a class="source-link" href="${video.originalUrl}" target="_blank" rel="noopener noreferrer">看原视频</a>`
            : `<div class="source-actions"><a class="locator-link" href="${getLocatorUrl(video)}" target="_blank" rel="noopener noreferrer">定位线索</a><span class="source-note">非原视频，待自动核验</span></div>`
        }
      </div>
    `;

    renderInvestmentPortrait(card, video);
    const sourceLink = card.querySelector(".source-link");
    if (hasDirectLink) sourceLink.addEventListener("click", (event) => event.stopPropagation());
    const locatorLink = card.querySelector(".locator-link");
    if (locatorLink) locatorLink.addEventListener("click", (event) => event.stopPropagation());
    container.append(card);
  });
}

function renderConvictionStack() {
  const container = document.querySelector("#conviction-stack");
  const rows = getInvestmentVideos();
  const totals = new Map();
  rows.forEach((video) => {
    const current = totals.get(video.investment.direction) || { total: 0, count: 0 };
    totals.set(video.investment.direction, {
      total: current.total + video.investment.conviction,
      count: current.count + 1
    });
  });
  const scored = [...totals.entries()]
    .map(([direction, value]) => [direction, Math.round(value.total / value.count)])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const max = Math.max(...scored.map((item) => item[1]), 1);
  container.textContent = "";

  scored.forEach(([direction, value]) => {
    const row = document.createElement("div");
    row.className = "conviction-line";
    row.innerHTML = `
      <span title="${direction}">${direction}</span>
      <div class="conviction-meter"><i style="--bar: ${(value / max) * 100}%"></i></div>
      <strong>${value}</strong>
    `;
    container.append(row);
  });
}

function renderInvestorWatchlist() {
  const container = document.querySelector("#investor-watchlist");
  const rows = investmentMasterLibrary.slice(0, 20);
  container.textContent = "";

  rows.forEach((video, index) => {
    const item = document.createElement("a");
    item.className = "watchlist-item";
    item.href = getInvestorWikipediaUrl(video.investor);
    item.target = "_blank";
    item.rel = "noopener noreferrer";
    item.innerHTML = `
      <em>${String(index + 1).padStart(2, "0")}</em>
      <strong>${video.investor}</strong>
      <span>${video.direction}</span>
    `;
    container.append(item);
  });
}

function renderArchive() {
  const body = document.querySelector("#archive-table-body");
  const rows = getArchiveVideos();
  body.textContent = "";
  document.querySelector("#archive-count").textContent = `${rows.length} 条`;

  rows.forEach((video) => {
    const metric = latestMetric(video);
    const titleCell = isVerifiedPlayableUrl(video)
      ? `<a class="table-link" href="${video.originalUrl}" target="_blank" rel="noopener noreferrer">${video.title}</a>`
      : `<span class="table-link is-disabled">${video.title}</span><br><a class="table-locator" href="${getLocatorUrl(video)}" target="_blank" rel="noopener noreferrer">定位线索</a>`;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatDateTime(video.publishedAt)}</td>
      <td>${titleCell}</td>
      <td>${video.person}<br><span>${video.source.name}</span></td>
      <td>${[...video.topics.slice(0, 2), ...video.assets.slice(0, 1)].join(" / ")}</td>
      <td>${video.hot}</td>
      <td>${video.spread}<br><span>${formatCompactNumber(metric.views)} views</span></td>
    `;
    body.append(row);
  });
}

function renderSources() {
  const container = document.querySelector("#source-grid");
  container.textContent = "";

  activeSourceProfiles.forEach((source) => {
    const card = document.createElement("article");
    card.className = "source-card";
    card.innerHTML = `
      <div class="source-top">
        <div>
          <h3>${source.name}</h3>
          <p class="panel-label">${source.type} · ${source.domain}</p>
        </div>
        <span class="priority-badge">${source.priority}</span>
      </div>
      <div class="source-meta">
        <div><span>平台</span><strong>${source.platform}</strong></div>
        <div><span>频率</span><strong>${source.cadence}</strong></div>
        <div><span>24h 基线</span><strong>${formatCompactNumber(source.median24h)}</strong></div>
        <div><span>权重</span><strong>${source.weight}</strong></div>
      </div>
      <div class="tag-row">
        ${source.trackedTopics.slice(0, 3).map((topic) => `<span class="tag">${topic}</span>`).join("")}
      </div>
    `;
    container.append(card);
  });
}

function renderWindowLabel() {
  const nowLabel = new Intl.DateTimeFormat("zh-CN", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(state.now);
  document.querySelector("#window-label").textContent = `${nowLabel} 00:00 - 23:59`;
}

function renderAll() {
  renderDataStatus();
  renderMetrics();
  renderSourceCounts();
  renderWindowLabel();
  renderVideoFeed();
  renderTopics();
  renderPlatformMix();
  renderInvestmentFeed();
  renderConvictionStack();
  renderInvestorWatchlist();
  renderArchive();
  renderSources();
}

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item === button));
      document.querySelectorAll(".view").forEach((view) => {
        view.classList.toggle("is-visible", view.id === `view-${state.view}`);
      });
    });
  });

  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => {
      state.sort = button.dataset.sort;
      document.querySelectorAll(".segment").forEach((item) => item.classList.toggle("is-active", item === button));
      renderVideoFeed();
      renderTopics();
      renderArchive();
    });
  });

  document.querySelectorAll(".investment-segment").forEach((button) => {
    button.addEventListener("click", () => {
      state.investmentFilter = button.dataset.investmentFilter;
      document
        .querySelectorAll(".investment-segment")
        .forEach((item) => item.classList.toggle("is-active", item === button));
      renderInvestmentFeed();
      renderConvictionStack();
      renderInvestorWatchlist();
    });
  });

  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      state.domain = button.dataset.domain;
      document.querySelectorAll(".filter-chip").forEach((item) => item.classList.toggle("is-active", item === button));
      renderVideoFeed();
      renderTopics();
      renderPlatformMix();
      renderArchive();
    });
  });

  document.querySelector("#search-input").addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    renderVideoFeed();
    renderTopics();
    renderPlatformMix();
    renderInvestmentFeed();
    renderConvictionStack();
    renderInvestorWatchlist();
    renderArchive();
  });

  document.querySelector("#refresh-button").addEventListener("click", () => {
    state.now = new Date();
    renderAll();
  });

  document.querySelector("#source-export").addEventListener("click", () => {
    const text = JSON.stringify(activeSourceProfiles, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "alpha-radar-sources.json";
    anchor.click();
    URL.revokeObjectURL(url);
    const button = document.querySelector("#source-export");
    button.textContent = "已导出";
    window.setTimeout(() => {
      button.textContent = "导出配置";
    }, 1200);
  });
}

bindEvents();
renderAll();
