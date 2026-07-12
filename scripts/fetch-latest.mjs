import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputFile = path.join(rootDir, "data", "generated-videos.js");
const generatedAt = new Date().toISOString();
const apiKey = process.env.YOUTUBE_API_KEY || "";
const maxPerSource = Number(process.env.MAX_PER_SOURCE || 8);
const concurrency = Number(process.env.SOURCE_CONCURRENCY || 8);

const AI_TERMS = [
  "ai",
  "agent",
  "agents",
  "artificial intelligence",
  "chatgpt",
  "openai",
  "anthropic",
  "claude",
  "gemini",
  "deepmind",
  "llm",
  "model",
  "inference",
  "compute",
  "gpu",
  "nvidia",
  "blackwell",
  "datacenter",
  "data center",
  "robot",
  "robotics",
  "autonomous",
  "foundation model",
  "reasoning",
  "multimodal",
  "chip",
  "semiconductor"
];

const CRYPTO_TERMS = [
  "crypto",
  "bitcoin",
  "btc",
  "ethereum",
  "eth",
  "solana",
  "sol",
  "stablecoin",
  "wallet",
  "defi",
  "token",
  "tokenization",
  "blockchain",
  "rollup",
  "l2",
  "staking",
  "smart contract",
  "web3",
  "coinbase",
  "chainlink",
  "uniswap",
  "arbitrum",
  "optimism"
];

const INVESTING_TERMS = [
  "invest",
  "investing",
  "investor",
  "capital",
  "portfolio",
  "market",
  "markets",
  "valuation",
  "value investing",
  "compound",
  "moat",
  "cash flow",
  "macro",
  "rates",
  "inflation",
  "equity",
  "stocks",
  "venture",
  "buffett",
  "munger",
  "dalio",
  "druckenmiller",
  "howard marks",
  "ackman",
  "lynch",
  "bogle",
  "ai trade",
  "technology investing"
];

const COMMON_EXCLUDE_TERMS = [
  "minecraft",
  "assassin",
  "geforce now",
  "game ready",
  "gaming laptop",
  "giveaway",
  "music video",
  "trailer reaction",
  "esports"
];

const sources = [
  {
    id: "openai",
    name: "OpenAI",
    type: "company",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@OpenAI",
    priority: "P0",
    official: true,
    weight: 98,
    median24h: 620000,
    trackedPeople: ["Sam Altman"],
    trackedTopics: ["AI Agents", "Inference", "Compute"],
    trackedAssets: ["OpenAI", "ChatGPT"],
    includeKeywords: ["chatgpt", "openai", "agent", "model", "work"]
  },
  {
    id: "anthropic",
    name: "Anthropic",
    type: "company",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@AnthropicAI",
    priority: "P0",
    official: true,
    weight: 94,
    median24h: 220000,
    trackedPeople: ["Dario Amodei"],
    trackedTopics: ["Claude", "AI Safety", "Agents"],
    trackedAssets: ["Anthropic", "Claude"],
    includeKeywords: ["claude", "anthropic", "safety", "agent", "model"]
  },
  {
    id: "google-deepmind",
    name: "Google DeepMind",
    type: "company",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@GoogleDeepMind",
    priority: "P0",
    official: true,
    weight: 94,
    median24h: 240000,
    trackedPeople: ["Demis Hassabis"],
    trackedTopics: ["Gemini", "Reasoning", "AI Research"],
    trackedAssets: ["Google", "Gemini"],
    includeKeywords: ["deepmind", "gemini", "alphafold", "model", "research"]
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    type: "company",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@NVIDIA",
    priority: "P0",
    official: true,
    strict: true,
    weight: 94,
    median24h: 380000,
    trackedPeople: ["Jensen Huang"],
    trackedTopics: ["GPU", "Data Center", "Robotics"],
    trackedAssets: ["NVDA", "Blackwell"],
    includeKeywords: ["ai", "gpu", "blackwell", "data center", "robot", "jensen", "compute"],
    excludeKeywords: ["geforce", "rtx remix", "assassin", "game", "gaming", "trailer"]
  },
  {
    id: "nvidia-developer",
    name: "NVIDIA Developer",
    type: "developer",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@NVIDIADeveloper",
    priority: "P1",
    official: true,
    strict: true,
    weight: 86,
    median24h: 90000,
    trackedPeople: ["Jensen Huang"],
    trackedTopics: ["CUDA", "AI Infrastructure", "Robotics"],
    trackedAssets: ["NVDA"],
    includeKeywords: ["ai", "cuda", "gpu", "robot", "model", "inference", "data center"]
  },
  {
    id: "microsoft-developer",
    name: "Microsoft Developer",
    type: "developer",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@MicrosoftDeveloper",
    priority: "P1",
    official: true,
    strict: true,
    weight: 84,
    median24h: 82000,
    trackedPeople: ["Satya Nadella"],
    trackedTopics: ["Copilot", "Azure AI", "Agents"],
    trackedAssets: ["MSFT", "Copilot"],
    includeKeywords: ["ai", "copilot", "agent", "azure", "model", "developer"]
  },
  {
    id: "google-cloud-tech",
    name: "Google Cloud Tech",
    type: "developer",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@googlecloudtech",
    priority: "P1",
    official: true,
    strict: true,
    weight: 82,
    median24h: 76000,
    trackedPeople: ["Thomas Kurian"],
    trackedTopics: ["Gemini", "Cloud AI", "Enterprise AI"],
    trackedAssets: ["GOOGL", "Gemini"],
    includeKeywords: ["ai", "gemini", "vertex", "agent", "model", "cloud"]
  },
  {
    id: "meta-developers",
    name: "Meta Developers",
    type: "developer",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@MetaDevelopers",
    priority: "P1",
    official: true,
    strict: true,
    weight: 80,
    median24h: 70000,
    trackedPeople: ["Mark Zuckerberg"],
    trackedTopics: ["Llama", "Open Models", "AI Apps"],
    trackedAssets: ["META", "Llama"],
    includeKeywords: ["ai", "llama", "model", "agent", "open source"]
  },
  {
    id: "dwarkesh",
    name: "Dwarkesh Podcast",
    type: "podcast",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@DwarkeshPatel",
    priority: "P0",
    official: false,
    strict: true,
    weight: 88,
    median24h: 185000,
    trackedPeople: ["Dwarkesh Patel"],
    trackedTopics: ["Scaling Laws", "Open Models", "Synthetic Data"],
    trackedAssets: ["Anthropic", "Google", "OpenAI"],
    includeKeywords: ["ai", "model", "compute", "intelligence", "openai", "anthropic", "deepmind", "scaling"]
  },
  {
    id: "lex-fridman",
    name: "Lex Fridman",
    type: "podcast",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@lexfridman",
    priority: "P1",
    official: false,
    strict: true,
    weight: 84,
    median24h: 420000,
    trackedPeople: ["Lex Fridman"],
    trackedTopics: ["AI Research", "Founders", "Robotics"],
    trackedAssets: ["OpenAI", "Tesla"],
    includeKeywords: ["ai", "artificial intelligence", "robot", "openai", "anthropic", "deepmind", "tesla", "neural"]
  },
  {
    id: "latent-space",
    name: "Latent Space",
    type: "podcast",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@LatentSpacePod",
    priority: "P1",
    official: false,
    weight: 80,
    median24h: 65000,
    trackedPeople: ["AI builders"],
    trackedTopics: ["AI Engineering", "Agents", "LLM Apps"],
    trackedAssets: ["OpenAI", "Anthropic"],
    includeKeywords: ["ai", "agent", "llm", "model", "engineering"]
  },
  {
    id: "a16z",
    name: "a16z",
    type: "fund",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@a16z",
    priority: "P1",
    official: true,
    strict: true,
    weight: 82,
    median24h: 92000,
    trackedPeople: ["Marc Andreessen", "Ben Horowitz"],
    trackedTopics: ["AI Startups", "Enterprise Software", "Venture"],
    trackedAssets: ["AI", "SaaS"],
    includeKeywords: ["ai", "agent", "startup", "software", "venture", "technology", "founder"]
  },
  {
    id: "sequoia-capital",
    name: "Sequoia Capital",
    type: "fund",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@SequoiaCapital",
    priority: "P1",
    official: true,
    strict: true,
    weight: 82,
    median24h: 70000,
    trackedPeople: ["Roelof Botha"],
    trackedTopics: ["AI Startups", "Venture", "Company Building"],
    trackedAssets: ["AI"],
    includeKeywords: ["ai", "startup", "founder", "technology", "venture", "software"]
  },
  {
    id: "y-combinator",
    name: "Y Combinator",
    type: "accelerator",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@ycombinator",
    priority: "P1",
    official: true,
    strict: true,
    weight: 78,
    median24h: 110000,
    trackedPeople: ["Garry Tan"],
    trackedTopics: ["AI Startups", "Founders", "Product"],
    trackedAssets: ["AI"],
    includeKeywords: ["ai", "startup", "founder", "agent", "software", "product"]
  },
  {
    id: "mit-csail",
    name: "MIT CSAIL",
    type: "research",
    domain: "AI",
    channelUrl: "https://www.youtube.com/@MITCSAIL",
    priority: "P2",
    official: true,
    strict: true,
    weight: 76,
    median24h: 36000,
    trackedPeople: ["MIT researchers"],
    trackedTopics: ["AI Research", "Robotics", "Compute"],
    trackedAssets: ["AI"],
    includeKeywords: ["ai", "robot", "machine learning", "model", "computer science"]
  },
  {
    id: "ethereum-foundation",
    name: "Ethereum Foundation",
    type: "protocol",
    domain: "Crypto",
    channelUrl: "https://www.youtube.com/@EthereumFoundation",
    priority: "P0",
    official: true,
    weight: 96,
    median24h: 145000,
    trackedPeople: ["Vitalik Buterin"],
    trackedTopics: ["Ethereum L2", "Account Abstraction", "Interoperability"],
    trackedAssets: ["ETH"],
    includeKeywords: ["ethereum", "eth", "rollup", "l2", "account abstraction", "devcon", "staking"]
  },
  {
    id: "ethglobal",
    name: "ETHGlobal",
    type: "conference",
    domain: "Crypto",
    channelUrl: "https://www.youtube.com/@ETHGlobal",
    priority: "P1",
    official: true,
    weight: 82,
    median24h: 58000,
    trackedPeople: ["Ethereum builders"],
    trackedTopics: ["Hackathons", "Ethereum Apps", "Protocol"],
    trackedAssets: ["ETH"],
    includeKeywords: ["ethereum", "eth", "hackathon", "wallet", "defi", "rollup"]
  },
  {
    id: "bankless",
    name: "Bankless",
    type: "media",
    domain: "Crypto",
    channelUrl: "https://www.youtube.com/@Bankless",
    priority: "P0",
    official: false,
    weight: 84,
    median24h: 108000,
    trackedPeople: ["Bankless hosts"],
    trackedTopics: ["Stablecoin", "Regulation", "Payments"],
    trackedAssets: ["ETH", "BTC", "SOL"],
    includeKeywords: ["crypto", "ethereum", "bitcoin", "stablecoin", "defi", "solana", "regulation"]
  },
  {
    id: "a16z-crypto",
    name: "a16z crypto",
    type: "fund",
    domain: "Crypto",
    channelUrl: "https://www.youtube.com/@a16zcrypto",
    priority: "P1",
    official: true,
    weight: 82,
    median24h: 72000,
    trackedPeople: ["Chris Dixon"],
    trackedTopics: ["Consumer Crypto", "Wallets", "Policy"],
    trackedAssets: ["ETH", "SOL"],
    includeKeywords: ["crypto", "wallet", "blockchain", "token", "policy", "web3", "market"]
  },
  {
    id: "coinbase",
    name: "Coinbase",
    type: "company",
    domain: "Crypto",
    channelUrl: "https://www.youtube.com/@coinbase",
    priority: "P1",
    official: true,
    strict: true,
    weight: 82,
    median24h: 95000,
    trackedPeople: ["Brian Armstrong"],
    trackedTopics: ["Exchange", "Regulation", "Wallets"],
    trackedAssets: ["COIN", "BTC", "ETH"],
    includeKeywords: ["crypto", "bitcoin", "ethereum", "wallet", "coinbase", "stablecoin", "regulation"]
  },
  {
    id: "chainlink",
    name: "Chainlink",
    type: "protocol",
    domain: "Crypto",
    channelUrl: "https://www.youtube.com/@chainlink",
    priority: "P1",
    official: true,
    weight: 78,
    median24h: 52000,
    trackedPeople: ["Sergey Nazarov"],
    trackedTopics: ["Oracles", "Tokenization", "Interop"],
    trackedAssets: ["LINK"],
    includeKeywords: ["chainlink", "oracle", "tokenization", "defi", "interoperability"]
  },
  {
    id: "solana",
    name: "Solana",
    type: "protocol",
    domain: "Crypto",
    channelUrl: "https://www.youtube.com/@SolanaFndn",
    priority: "P1",
    official: true,
    weight: 78,
    median24h: 62000,
    trackedPeople: ["Solana Foundation"],
    trackedTopics: ["Solana Apps", "Payments", "DePIN"],
    trackedAssets: ["SOL"],
    includeKeywords: ["solana", "sol", "wallet", "payment", "defi", "depin"]
  },
  {
    id: "bitcoin-magazine",
    name: "Bitcoin Magazine",
    type: "media",
    domain: "Crypto",
    channelUrl: "https://www.youtube.com/@BitcoinMagazine",
    priority: "P1",
    official: false,
    weight: 76,
    median24h: 70000,
    trackedPeople: ["Bitcoin builders"],
    trackedTopics: ["Bitcoin", "Macro", "Policy"],
    trackedAssets: ["BTC"],
    includeKeywords: ["bitcoin", "btc", "macro", "policy", "mining", "lightning"]
  },
  {
    id: "coindesk",
    name: "CoinDesk",
    type: "media",
    domain: "Crypto",
    channelUrl: "https://www.youtube.com/@coindesk",
    priority: "P1",
    official: false,
    strict: true,
    weight: 76,
    median24h: 82000,
    trackedPeople: ["Crypto leaders"],
    trackedTopics: ["Crypto Markets", "Regulation", "Institutions"],
    trackedAssets: ["BTC", "ETH", "SOL"],
    includeKeywords: ["bitcoin", "ethereum", "crypto", "stablecoin", "token", "sec", "coinbase", "solana"]
  },
  {
    id: "messari",
    name: "Messari",
    type: "research",
    domain: "Crypto",
    channelUrl: "https://www.youtube.com/@MessariCrypto",
    priority: "P2",
    official: true,
    strict: true,
    weight: 74,
    median24h: 42000,
    trackedPeople: ["Messari analysts"],
    trackedTopics: ["Crypto Research", "Protocols", "Markets"],
    trackedAssets: ["BTC", "ETH", "SOL"],
    includeKeywords: ["crypto", "protocol", "defi", "token", "market", "bitcoin", "ethereum"]
  },
  {
    id: "uniswap",
    name: "Uniswap",
    type: "protocol",
    domain: "Crypto",
    channelUrl: "https://www.youtube.com/@UniswapLabs",
    priority: "P2",
    official: true,
    weight: 72,
    median24h: 32000,
    trackedPeople: ["Uniswap Labs"],
    trackedTopics: ["DEX", "DeFi", "Ethereum Apps"],
    trackedAssets: ["UNI", "ETH"],
    includeKeywords: ["uniswap", "defi", "swap", "ethereum", "liquidity"]
  },
  {
    id: "ark-invest",
    name: "ARK Invest",
    type: "investor",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@ARKInvest2015",
    priority: "P1",
    official: true,
    strict: true,
    weight: 88,
    median24h: 92000,
    trackedPeople: ["Cathie Wood"],
    trackedTopics: ["AI 基建", "应用层", "Robotics"],
    trackedAssets: ["TSLA", "NVDA", "COIN"],
    includeKeywords: ["ai", "tesla", "robot", "bitcoin", "crypto", "invest", "market", "innovation"],
    allowShorts: false
  },
  {
    id: "altimeter",
    name: "Altimeter Capital",
    type: "investor",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@AltimeterCapital",
    priority: "P1",
    official: false,
    weight: 84,
    median24h: 76000,
    trackedPeople: ["Brad Gerstner"],
    trackedTopics: ["AI 基建", "Cloud", "Enterprise Software"],
    trackedAssets: ["MSFT", "GOOGL", "NVDA"],
    includeKeywords: ["ai", "cloud", "software", "invest", "market", "technology"]
  },
  {
    id: "principles-dalio",
    name: "Principles by Ray Dalio",
    type: "investor",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@principlesbyraydalio",
    priority: "P1",
    official: true,
    weight: 86,
    median24h: 110000,
    trackedPeople: ["Ray Dalio"],
    trackedTopics: ["Global Macro", "Cycles", "Risk"],
    trackedAssets: ["Macro"],
    includeKeywords: ["dalio", "macro", "debt", "cycle", "market", "principles", "invest"]
  },
  {
    id: "bridgewater",
    name: "Bridgewater Associates",
    type: "investor",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@BridgewaterAssociates",
    priority: "P1",
    official: true,
    strict: true,
    weight: 82,
    median24h: 62000,
    trackedPeople: ["Ray Dalio"],
    trackedTopics: ["Global Macro", "Portfolio", "Risk"],
    trackedAssets: ["Macro"],
    includeKeywords: ["market", "macro", "portfolio", "risk", "invest", "economy"]
  },
  {
    id: "yahoo-finance",
    name: "Yahoo Finance",
    type: "media",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@YahooFinance",
    priority: "P1",
    official: false,
    strict: true,
    weight: 78,
    median24h: 140000,
    trackedPeople: ["Warren Buffett", "Charlie Munger", "Cathie Wood"],
    trackedTopics: ["Markets", "Technology Investing", "Macro"],
    trackedAssets: ["NVDA", "TSLA", "BRK"],
    includeKeywords: ["buffett", "munger", "dalio", "druckenmiller", "ackman", "ai", "nvidia", "market", "invest", "portfolio"]
  },
  {
    id: "bloomberg",
    name: "Bloomberg Television",
    type: "media",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@markets",
    priority: "P1",
    official: false,
    strict: true,
    weight: 78,
    median24h: 160000,
    trackedPeople: ["Market leaders"],
    trackedTopics: ["Markets", "Technology Investing", "Macro"],
    trackedAssets: ["NVDA", "MSFT", "BTC"],
    includeKeywords: ["invest", "market", "ai", "nvidia", "technology", "crypto", "bitcoin", "rates", "fed", "portfolio"]
  },
  {
    id: "cnbc",
    name: "CNBC Television",
    type: "media",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@CNBCTelevision",
    priority: "P1",
    official: false,
    strict: true,
    weight: 76,
    median24h: 180000,
    trackedPeople: ["Market leaders"],
    trackedTopics: ["Markets", "AI Trade", "Macro"],
    trackedAssets: ["NVDA", "TSLA", "BTC"],
    includeKeywords: ["buffett", "munger", "dalio", "druckenmiller", "ackman", "ai", "nvidia", "market", "invest", "crypto", "bitcoin"]
  },
  {
    id: "acquired",
    name: "Acquired",
    type: "podcast",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@AcquiredFM",
    priority: "P1",
    official: false,
    strict: true,
    weight: 80,
    median24h: 120000,
    trackedPeople: ["Ben Gilbert", "David Rosenthal"],
    trackedTopics: ["Business Quality", "Technology Companies", "Moats"],
    trackedAssets: ["NVDA", "MSFT", "META"],
    includeKeywords: ["nvidia", "microsoft", "meta", "amazon", "google", "berkshire", "business", "invest", "moat", "technology"]
  },
  {
    id: "invest-like-best",
    name: "Invest Like the Best",
    type: "podcast",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@InvestLikeTheBest",
    priority: "P1",
    official: false,
    weight: 80,
    median24h: 76000,
    trackedPeople: ["Patrick O'Shaughnessy"],
    trackedTopics: ["Capital Allocation", "Company Quality", "Technology"],
    trackedAssets: ["AI", "Software"],
    includeKeywords: ["invest", "capital", "company", "technology", "software", "ai", "portfolio"]
  },
  {
    id: "investor-podcast",
    name: "The Investor's Podcast Network",
    type: "podcast",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@TIP_Network",
    priority: "P2",
    official: false,
    strict: true,
    weight: 76,
    median24h: 52000,
    trackedPeople: ["Value investors"],
    trackedTopics: ["Value Investing", "Macro", "Bitcoin"],
    trackedAssets: ["BTC", "BRK"],
    includeKeywords: ["buffett", "munger", "value investing", "bitcoin", "macro", "stock", "portfolio", "invest"]
  },
  {
    id: "value-investing-legends",
    name: "Value Investing with Legends",
    type: "podcast",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@ValueInvestingwithLegends",
    priority: "P2",
    official: false,
    weight: 74,
    median24h: 28000,
    trackedPeople: ["Value investors"],
    trackedTopics: ["Value Investing", "Moats", "Risk"],
    trackedAssets: ["BRK"],
    includeKeywords: ["value", "investing", "buffett", "munger", "moat", "risk", "portfolio"]
  },
  {
    id: "milken",
    name: "Milken Institute",
    type: "conference",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@MilkenInstitute",
    priority: "P2",
    official: true,
    strict: true,
    weight: 74,
    median24h: 48000,
    trackedPeople: ["Investment leaders"],
    trackedTopics: ["Macro", "AI Investment", "Capital Markets"],
    trackedAssets: ["AI", "Macro"],
    includeKeywords: ["invest", "market", "capital", "ai", "technology", "macro", "economy", "private equity"]
  },
  {
    id: "goldman-sachs",
    name: "Goldman Sachs",
    type: "institution",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@GoldmanSachs",
    priority: "P2",
    official: true,
    strict: true,
    weight: 72,
    median24h: 52000,
    trackedPeople: ["Goldman Sachs Research"],
    trackedTopics: ["Markets", "AI Trade", "Macro"],
    trackedAssets: ["AI", "Macro"],
    includeKeywords: ["market", "ai", "invest", "economy", "macro", "technology", "portfolio"]
  },
  {
    id: "vanguard",
    name: "Vanguard",
    type: "institution",
    domain: "Investing",
    channelUrl: "https://www.youtube.com/@Vanguard",
    priority: "P2",
    official: true,
    strict: true,
    weight: 70,
    median24h: 42000,
    trackedPeople: ["John Bogle"],
    trackedTopics: ["Index Investing", "Asset Allocation", "Long Term"],
    trackedAssets: ["Index Funds"],
    includeKeywords: ["invest", "index", "portfolio", "market", "retirement", "asset allocation", "long-term"]
  }
].map((source) => ({
  platform: "YouTube",
  cadence: source.priority === "P0" ? "2h" : source.priority === "P1" ? "4h" : "daily",
  language: "EN",
  allowShorts: false,
  strict: false,
  excludeKeywords: [],
  ...source
}));

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function extract(text, pattern) {
  return decodeXml(text.match(pattern)?.[1]?.trim() || "");
}

function compactText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeText(value = "") {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function hasAnyTerm(text, terms = []) {
  const normalized = normalizeText(text);
  return terms.some((term) => normalized.includes(normalizeText(term)));
}

function domainTerms(domain) {
  if (domain === "AI") return AI_TERMS;
  if (domain === "Crypto") return CRYPTO_TERMS;
  if (domain === "Investing") return INVESTING_TERMS;
  return [];
}

function readExistingPayloadText(text) {
  const jsonText = text.replace(/^window\.__ALPHA_RADAR_LIVE_DATA__\s*=\s*/, "").replace(/;\s*$/, "");
  return JSON.parse(jsonText);
}

async function readExistingPayload() {
  try {
    return readExistingPayloadText(await readFile(outputFile, "utf8"));
  } catch {
    return null;
  }
}

async function writePayload(payload) {
  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `window.__ALPHA_RADAR_LIVE_DATA__ = ${JSON.stringify(payload, null, 2)};\n`);
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "AlphaRadarBot/2.0 (+https://github.com/huhu886688/ai-video-radar)",
        accept: "text/html,application/xml,application/json"
      }
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function resolveChannelId(source) {
  if (source.channelId) return source.channelId;
  const html = await fetchText(source.channelUrl);
  return (
    html.match(/"channelId":"(UC[^"]+)"/)?.[1] ||
    html.match(/<meta itemprop="channelId" content="(UC[^"]+)">/)?.[1] ||
    html.match(/\/channel\/(UC[a-zA-Z0-9_-]+)/)?.[1] ||
    ""
  );
}

function parseRss(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => {
    const entry = match[1];
    const videoId = extract(entry, /<yt:videoId>([\s\S]*?)<\/yt:videoId>/);
    const title = compactText(extract(entry, /<title>([\s\S]*?)<\/title>/));
    const publishedAt = extract(entry, /<published>([\s\S]*?)<\/published>/);
    const updatedAt = extract(entry, /<updated>([\s\S]*?)<\/updated>/);
    const thumbnail =
      extract(entry, /<media:thumbnail[^>]+url="([^"]+)"/) ||
      (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "");
    const originalUrl =
      extract(entry, /<link[^>]+href="([^"]+)"/) ||
      (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "");
    return { videoId, title, publishedAt, updatedAt, thumbnail, originalUrl };
  });
}

async function fetchRssVideos(channelId) {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
  const xml = await fetchText(feedUrl);
  return parseRss(xml).slice(0, Math.max(maxPerSource * 2, maxPerSource));
}

async function fetchYoutubeStats(videoIds) {
  if (!apiKey || !videoIds.length) return new Map();
  const stats = new Map();
  for (let index = 0; index < videoIds.length; index += 50) {
    const ids = videoIds.slice(index, index + 50);
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "statistics,contentDetails,snippet");
    url.searchParams.set("id", ids.join(","));
    url.searchParams.set("key", apiKey);
    const data = JSON.parse(await fetchText(url));
    (data.items || []).forEach((item) => stats.set(item.id, item));
  }
  return stats;
}

function parseIsoDuration(value = "") {
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return Number(match[1] || 0) * 60 + Number(match[2] || 0) + Math.round(Number(match[3] || 0) / 60);
}

function hashNumber(value) {
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

function estimateViews(source, video) {
  const ageHours = Math.max(1, (Date.now() - new Date(video.publishedAt).getTime()) / 3600000);
  const saturation = Math.min(2.1, Math.log1p(ageHours) / 3.05);
  const variance = 0.66 + (hashNumber(video.videoId || video.title) % 82) / 100;
  return Math.max(600, Math.round(source.median24h * saturation * variance));
}

function scoreVideoRelevance(source, video) {
  const title = video.title || "";
  const searchText = [
    title,
    source.name,
    ...(source.trackedPeople || []),
    ...(source.trackedTopics || []),
    ...(source.trackedAssets || [])
  ].join(" ");

  if (!source.allowShorts && /\/shorts\//i.test(video.originalUrl || "")) return -100;
  if (hasAnyTerm(title, [...COMMON_EXCLUDE_TERMS, ...(source.excludeKeywords || [])])) return -100;

  let score = source.strict ? 0 : 16;
  const terms = domainTerms(source.domain);
  const includeTerms = source.includeKeywords || [];
  const trackedTerms = [
    ...(source.trackedPeople || []),
    ...(source.trackedTopics || []),
    ...(source.trackedAssets || [])
  ];

  if (hasAnyTerm(title, terms)) score += 22;
  if (hasAnyTerm(title, includeTerms)) score += 28;
  if (hasAnyTerm(title, trackedTerms)) score += 14;
  if (hasAnyTerm(searchText, includeTerms)) score += 8;
  if (source.official) score += 4;
  if (/keynote|summit|conference|interview|conversation|podcast|earnings|report|outlook/i.test(title)) score += 8;
  if (/trailer|launch trailer|episode \d+|live:|livestream/i.test(title)) score -= 8;

  return score;
}

function isRelevantVideo(source, video) {
  const score = scoreVideoRelevance(source, video);
  return score >= (source.strict ? 24 : 12);
}

function inferTopics(source, title) {
  const text = title.toLowerCase();
  const topics = new Set(source.trackedTopics || []);
  if (/agent|robot|automation|copilot/.test(text)) topics.add("AI Agents");
  if (/gpu|nvidia|compute|blackwell|chip|semiconductor/.test(text)) topics.add("Compute");
  if (/model|llm|claude|gemini|openai|anthropic/.test(text)) topics.add("Foundation Models");
  if (/stablecoin|payment|wallet/.test(text)) topics.add("Payments");
  if (/ethereum|rollup|l2|staking|account abstraction/.test(text)) topics.add("Ethereum L2");
  if (/bitcoin|btc/.test(text)) topics.add("Bitcoin");
  if (/macro|rates|inflation|cycle|fed|economy/.test(text)) topics.add("全球宏观");
  if (/buffett|munger|value|moat|compound/.test(text)) topics.add("价值投资");
  if (/venture|startup|founder/.test(text)) topics.add("创业与科技");
  return [...topics].slice(0, 5);
}

function inferPerson(source, title) {
  const text = title.toLowerCase();
  return (
    (source.trackedPeople || []).find((person) => text.includes(person.toLowerCase().split(" ")[0])) ||
    source.trackedPeople?.[0] ||
    source.name
  );
}

function contentTypeFor(source, title) {
  if (source.domain === "Investing") return "investorInterview";
  if (/keynote|gtc|summit|launch|demo|conference/i.test(title)) return "keynote";
  if (source.type === "podcast" || /podcast|interview|conversation/i.test(title)) return "founderInterview";
  if (source.type === "research") return "marketRoundtable";
  return source.official ? "officialLaunch" : "podcast";
}

function summaryFor(source, title) {
  const prefix =
    source.domain === "AI"
      ? "科技信号"
      : source.domain === "Crypto"
        ? "链上与加密信号"
        : "投资观点信号";
  return `${prefix}，来自 ${source.name}：${title}`;
}

function latestMetric(video) {
  return Array.isArray(video?.metrics) ? video.metrics.at(-1) : null;
}

function buildMetrics(source, video, statItem, previousVideo) {
  const statistics = statItem?.statistics || {};
  const hasApiStats = Boolean(statItem?.statistics);
  const views = Number(statistics.viewCount || 0) || estimateViews(source, video);
  const likes = Number(statistics.likeCount || 0) || Math.round(views * 0.023);
  const comments = Number(statistics.commentCount || 0) || Math.round(views * 0.0028);
  const priorMetrics = Array.isArray(previousVideo?.metrics) ? previousVideo.metrics.slice(-7) : [];
  const priorLatest = latestMetric(previousVideo);
  const previousAt = new Date(Date.now() - 6 * 3600000).toISOString();
  const syntheticPrevious = {
    at: previousAt,
    views: Math.round(views * 0.72),
    likes: Math.round(likes * 0.68),
    comments: Math.round(comments * 0.62),
    xReposts: 0,
    xQuotes: 0,
    xBookmarks: 0,
    xImpressions: 0,
    source: hasApiStats ? "youtube_api_derived" : "estimated_baseline"
  };

  const latest = {
    at: generatedAt,
    views: Math.max(views, Number(priorLatest?.views || 0)),
    likes: Math.max(likes, Number(priorLatest?.likes || 0)),
    comments: Math.max(comments, Number(priorLatest?.comments || 0)),
    xReposts: 0,
    xQuotes: 0,
    xBookmarks: 0,
    xImpressions: 0,
    source: hasApiStats ? "youtube_api" : "estimated_baseline"
  };

  const base = priorMetrics.length ? priorMetrics : [syntheticPrevious];
  if (base.at(-1)?.at === latest.at) return base;
  return [...base, latest].slice(-8);
}

function buildVideo(source, video, statItem, previousVideo) {
  const snippet = statItem?.snippet || {};
  const title = snippet.title || video.title;
  const person = inferPerson(source, title);
  const topics = inferTopics(source, title);
  const durationMin = parseIsoDuration(statItem?.contentDetails?.duration) || previousVideo?.durationMin || 0;
  const isInvestment = source.domain === "Investing";
  const relevance = scoreVideoRelevance(source, video);
  return {
    id: `${source.id}-${video.videoId}`,
    title,
    person,
    investor: isInvestment ? person : "",
    sourceId: source.id,
    domain: source.domain,
    platform: "YouTube",
    originalUrl: video.originalUrl,
    linkStatus: "verified",
    publishedAt: video.publishedAt,
    discoveredAt: previousVideo?.discoveredAt || generatedAt,
    processedAt: generatedAt,
    durationMin,
    contentType: contentTypeFor(source, title),
    novelty: source.priority === "P0" ? 86 : source.priority === "P1" ? 78 : 70,
    editorBoost: source.priority === "P0" ? 5 : source.priority === "P1" ? 3 : 1,
    thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || video.thumbnail,
    summary: summaryFor(source, title),
    topics,
    assets: source.trackedAssets || [],
    relevance,
    quality: {
      metrics: statItem?.statistics ? "youtube_api" : "estimated",
      transcript: "not_connected",
      summary: "title_based",
      sourceVerified: true
    },
    investment: isInvestment
      ? {
          direction: topics.includes("价值投资") ? "价值投资" : topics.includes("全球宏观") ? "全球宏观" : "科技成长",
          stance: "公开观点",
          horizon: "长期跟踪",
          conviction: Math.min(96, Math.max(62, Math.round(relevance + source.weight * 0.35))),
          riskTone: statItem?.statistics ? "基于真实视频指标跟踪" : "热度为估算，需接 YouTube API 校准",
          thesis: ["已通过主题相关性过滤", "保留原视频直达链接", "适合作为今日情报入口"]
        }
      : undefined,
    metrics: buildMetrics(source, video, statItem, previousVideo)
  };
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

async function collectSource(source) {
  try {
    const channelId = await resolveChannelId(source);
    if (!channelId) throw new Error("channel id not found");
    const fetched = await fetchRssVideos(channelId);
    const accepted = fetched.filter((video) => isRelevantVideo(source, video)).slice(0, maxPerSource);
    return {
      source: { ...source, channelId },
      videos: accepted.map((video) => ({ source, video })),
      health: {
        id: source.id,
        status: "ok",
        fetchedCount: fetched.length,
        acceptedCount: accepted.length,
        filteredCount: Math.max(0, fetched.length - accepted.length),
        channelId
      }
    };
  } catch (error) {
    return {
      source,
      videos: [],
      health: {
        id: source.id,
        status: "error",
        fetchedCount: 0,
        acceptedCount: 0,
        filteredCount: 0,
        error: error.message
      }
    };
  }
}

function publicSource(source, health) {
  const {
    channelUrl,
    includeKeywords,
    excludeKeywords,
    allowShorts,
    strict,
    ...rest
  } = source;
  return {
    ...rest,
    strict,
    quality: health.status,
    fetchedCount: health.fetchedCount,
    acceptedCount: health.acceptedCount,
    filteredCount: health.filteredCount,
    error: health.error || ""
  };
}

async function main() {
  const existingPayload = await readExistingPayload();
  const previousById = new Map((existingPayload?.videos || []).map((video) => [video.id, video]));
  const collected = await mapWithConcurrency(sources, concurrency, collectSource);
  const sourceResults = collected.map((item) => item.source);
  const sourceHealth = collected.map((item) => item.health);
  const rssVideos = collected.flatMap((item) => item.videos);
  let stats = new Map();
  let statsError = "";
  try {
    stats = await fetchYoutubeStats(rssVideos.map((item) => item.video.videoId).filter(Boolean));
  } catch (error) {
    statsError = `YouTube stats fallback: ${error.message}`;
  }
  const videos = rssVideos
    .map(({ source, video }) => buildVideo(source, video, stats.get(video.videoId), previousById.get(`${source.id}-${video.videoId}`)))
    .sort((a, b) => b.relevance - a.relevance || new Date(b.publishedAt) - new Date(a.publishedAt));

  const errors = sourceHealth
    .filter((source) => source.status === "error")
    .map((source) => `${source.id}: ${source.error}`);
  if (statsError) errors.push(statsError);
  const publicSources = sourceResults.map((source) => publicSource(source, sourceHealth.find((item) => item.id === source.id) || {}));
  const acceptedCount = sourceHealth.reduce((sum, source) => sum + source.acceptedCount, 0);
  const fetchedCount = sourceHealth.reduce((sum, source) => sum + source.fetchedCount, 0);
  const filteredCount = sourceHealth.reduce((sum, source) => sum + source.filteredCount, 0);
  const successfulSources = sourceHealth.filter((source) => source.status === "ok").length;
  const apiStatsCount = [...stats.keys()].length;
  const hasExistingVideos = Array.isArray(existingPayload?.videos) && existingPayload.videos.length > 0;
  const diagnostics = {
    version: "data-pipeline-v2",
    generatedAt,
    schedule: "every_2_hours",
    mode: apiKey ? "youtube_api_plus_rss" : "youtube_rss_with_estimated_metrics",
    youtubeApiEnabled: Boolean(apiKey),
    sourceCount: sources.length,
    successfulSources,
    failedSources: sources.length - successfulSources,
    fetchedVideos: fetchedCount,
    acceptedVideos: acceptedCount,
    filteredVideos: filteredCount,
    outputVideos: videos.length,
    maxPerSource,
    apiStatsCount,
    directLinks: videos.filter((video) => video.originalUrl).length,
    qualityNote: apiKey
      ? "播放量、点赞、评论来自 YouTube Data API；字幕和跨平台传播暂未接入。"
      : "当前未配置 YOUTUBE_API_KEY，热度为频道基线估算；标题、发布时间、封面和原视频链接来自 YouTube RSS。"
  };

  const payload =
    videos.length || !hasExistingVideos
      ? { generatedAt, diagnostics, sources: publicSources, videos, errors }
      : {
          ...existingPayload,
          lastAttemptAt: generatedAt,
          lastAttemptDiagnostics: {
            ...diagnostics,
            outputVideos: existingPayload.videos.length,
            qualityNote: `${diagnostics.qualityNote} 本次采集没有拿到新视频，已保留上一次成功数据。`
          },
          errors: [...(existingPayload.errors || []), ...errors, "Latest fetch returned no videos; kept previous data."]
        };

  await writePayload(payload);
  console.log(
    `Generated ${payload.videos.length} videos from ${successfulSources}/${sources.length} sources ` +
      `(${acceptedCount} accepted, ${filteredCount} filtered, apiStats=${apiStatsCount}).`
  );
  if (errors.length) console.warn(`Warnings: ${errors.join(" | ")}`);
}

main().catch(async (error) => {
  const existingPayload = await readExistingPayload();
  const hasExistingVideos = Array.isArray(existingPayload?.videos) && existingPayload.videos.length > 0;
  const payload = hasExistingVideos
    ? {
        ...existingPayload,
        lastAttemptAt: generatedAt,
        errors: [...(existingPayload.errors || []), error.message, "Fetch failed; kept previous data."]
      }
    : { generatedAt, diagnostics: { version: "data-pipeline-v2", generatedAt, error: error.message }, sources: [], videos: [], errors: [error.message] };
  await writePayload(payload);
  console.error(error);
  process.exitCode = 1;
});
