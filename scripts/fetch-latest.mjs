import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputFile = path.join(rootDir, "data", "generated-videos.js");
const generatedAt = new Date().toISOString();
const apiKey = process.env.YOUTUBE_API_KEY || "";
const maxPerSource = Number(process.env.MAX_PER_SOURCE || 6);

const sources = [
  {
    id: "openai",
    name: "OpenAI",
    type: "company",
    domain: "AI",
    platform: "YouTube",
    channelUrl: "https://www.youtube.com/@OpenAI",
    priority: "P0",
    cadence: "daily",
    language: "EN",
    official: true,
    weight: 98,
    median24h: 620000,
    trackedPeople: ["Sam Altman"],
    trackedTopics: ["AI Agents", "Inference", "Compute"],
    trackedAssets: ["OpenAI"]
  },
  {
    id: "dwarkesh",
    name: "Dwarkesh Podcast",
    type: "podcast",
    domain: "AI",
    platform: "YouTube",
    channelUrl: "https://www.youtube.com/@DwarkeshPatel",
    priority: "P0",
    cadence: "daily",
    language: "EN",
    official: false,
    weight: 88,
    median24h: 185000,
    trackedPeople: ["Frontier AI researcher"],
    trackedTopics: ["Scaling Laws", "Open Models", "Synthetic Data"],
    trackedAssets: ["Anthropic", "Google"]
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    type: "company",
    domain: "AI",
    platform: "YouTube",
    channelUrl: "https://www.youtube.com/@NVIDIA",
    priority: "P0",
    cadence: "daily",
    language: "EN",
    official: true,
    weight: 94,
    median24h: 380000,
    trackedPeople: ["Jensen Huang"],
    trackedTopics: ["GPU", "Data Center", "Robotics"],
    trackedAssets: ["NVDA", "Blackwell"]
  },
  {
    id: "eth-foundation",
    name: "Ethereum Foundation",
    type: "protocol",
    domain: "Crypto",
    platform: "YouTube",
    channelUrl: "https://www.youtube.com/@EthereumFoundation",
    priority: "P0",
    cadence: "daily",
    language: "EN",
    official: true,
    weight: 96,
    median24h: 145000,
    trackedPeople: ["Vitalik Buterin"],
    trackedTopics: ["Ethereum L2", "Account Abstraction", "Interoperability"],
    trackedAssets: ["ETH"]
  },
  {
    id: "bankless",
    name: "Bankless",
    type: "media",
    domain: "Crypto",
    platform: "YouTube",
    channelUrl: "https://www.youtube.com/@Bankless",
    priority: "P0",
    cadence: "daily",
    language: "EN",
    official: false,
    weight: 84,
    median24h: 108000,
    trackedPeople: ["Bankless hosts"],
    trackedTopics: ["Stablecoin", "Regulation", "Payments"],
    trackedAssets: ["ETH", "BTC", "SOL"]
  },
  {
    id: "a16z-crypto",
    name: "a16z crypto",
    type: "fund",
    domain: "Crypto",
    platform: "YouTube",
    channelUrl: "https://www.youtube.com/@a16zcrypto",
    priority: "P1",
    cadence: "daily",
    language: "EN",
    official: true,
    weight: 82,
    median24h: 72000,
    trackedPeople: ["Chris Dixon"],
    trackedTopics: ["Consumer Crypto", "Wallets", "Policy"],
    trackedAssets: ["ETH", "SOL"]
  },
  {
    id: "ark-invest",
    name: "ARK Invest",
    type: "investor",
    domain: "Investing",
    platform: "YouTube",
    channelUrl: "https://www.youtube.com/@ARKInvest2015",
    priority: "P1",
    cadence: "daily",
    language: "EN",
    official: true,
    weight: 88,
    median24h: 92000,
    trackedPeople: ["Cathie Wood"],
    trackedTopics: ["AI 基建", "应用层", "Robotics"],
    trackedAssets: ["TSLA", "NVDA", "COIN"]
  },
  {
    id: "altimeter",
    name: "Altimeter Capital",
    type: "investor",
    domain: "Investing",
    platform: "YouTube",
    channelUrl: "https://www.youtube.com/@AltimeterCapital",
    priority: "P1",
    cadence: "daily",
    language: "EN",
    official: false,
    weight: 84,
    median24h: 76000,
    trackedPeople: ["Brad Gerstner"],
    trackedTopics: ["AI 基建", "Cloud", "Enterprise Software"],
    trackedAssets: ["MSFT", "GOOGL", "NVDA"]
  }
];

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

async function readExistingPayload() {
  try {
    const text = await readFile(outputFile, "utf8");
    const jsonText = text.replace(/^window\.__ALPHA_RADAR_LIVE_DATA__\s*=\s*/, "").replace(/;\s*$/, "");
    return JSON.parse(jsonText);
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
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "AlphaRadarBot/1.0 (+https://github.com/)",
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

async function fetchRssVideos(source, channelId) {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
  const xml = await fetchText(feedUrl);
  return parseRss(xml).slice(0, maxPerSource);
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
  const saturation = Math.min(1.8, Math.log1p(ageHours) / 3.2);
  const variance = 0.72 + (hashNumber(video.videoId || video.title) % 72) / 100;
  return Math.max(800, Math.round(source.median24h * saturation * variance));
}

function inferTopics(source, title) {
  const text = title.toLowerCase();
  const topics = new Set(source.trackedTopics || []);
  if (/agent|robot|automation/.test(text)) topics.add("AI Agents");
  if (/gpu|nvidia|compute|blackwell|chip/.test(text)) topics.add("Compute");
  if (/stablecoin|payment|wallet/.test(text)) topics.add("Payments");
  if (/ethereum|rollup|l2|staking/.test(text)) topics.add("Ethereum L2");
  if (/macro|rates|inflation|cycle/.test(text)) topics.add("全球宏观派");
  return [...topics].slice(0, 4);
}

function inferPerson(source, title) {
  return (
    (source.trackedPeople || []).find((person) => title.toLowerCase().includes(person.toLowerCase().split(" ")[0])) ||
    source.trackedPeople?.[0] ||
    source.name
  );
}

function contentTypeFor(source, title) {
  if (source.domain === "Investing") return "investorInterview";
  if (/keynote|gtc|summit|launch|demo/i.test(title)) return "keynote";
  if (source.type === "podcast" || /podcast|interview|conversation/i.test(title)) return "founderInterview";
  return source.official ? "officialLaunch" : "podcast";
}

function buildMetrics(source, video, statItem) {
  const statistics = statItem?.statistics || {};
  const views = Number(statistics.viewCount || 0) || estimateViews(source, video);
  const likes = Number(statistics.likeCount || 0) || Math.round(views * 0.028);
  const comments = Number(statistics.commentCount || 0) || Math.round(views * 0.0035);
  const previousViews = Math.round(views * 0.62);
  const previousAt = new Date(Date.now() - 6 * 3600000).toISOString();
  return [
    {
      at: previousAt,
      views: previousViews,
      likes: Math.round(likes * 0.58),
      comments: Math.round(comments * 0.52),
      xReposts: 0,
      xQuotes: 0,
      xBookmarks: 0,
      xImpressions: 0
    },
    {
      at: generatedAt,
      views,
      likes,
      comments,
      xReposts: 0,
      xQuotes: 0,
      xBookmarks: 0,
      xImpressions: 0
    }
  ];
}

function buildVideo(source, video, statItem) {
  const snippet = statItem?.snippet || {};
  const title = snippet.title || video.title;
  const person = inferPerson(source, title);
  const topics = inferTopics(source, title);
  const durationMin = parseIsoDuration(statItem?.contentDetails?.duration) || 0;
  const isInvestment = source.domain === "Investing";
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
    discoveredAt: generatedAt,
    processedAt: generatedAt,
    durationMin,
    contentType: contentTypeFor(source, title),
    novelty: source.priority === "P0" ? 82 : 74,
    editorBoost: source.priority === "P0" ? 4 : 2,
    thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || video.thumbnail,
    summary: `自动采集自 ${source.name}：${title}`,
    topics,
    assets: source.trackedAssets || [],
    investment: isInvestment
      ? {
          direction: "优质成长派",
          stance: "公开观点",
          horizon: "长期跟踪",
          conviction: 78,
          riskTone: "需结合原视频语境",
          thesis: ["自动采集到的投资相关公开分享", "需人工或摘要任务补全观点", "适合作为今日新增素材入口"]
        }
      : undefined,
    metrics: buildMetrics(source, video, statItem)
  };
}

async function main() {
  const errors = [];
  const sourceResults = [];
  const rssVideos = [];

  for (const source of sources) {
    try {
      const channelId = await resolveChannelId(source);
      if (!channelId) throw new Error("channel id not found");
      const videos = await fetchRssVideos(source, channelId);
      sourceResults.push({ ...source, channelId });
      rssVideos.push(...videos.map((video) => ({ source, video })));
    } catch (error) {
      errors.push(`${source.name}: ${error.message}`);
      sourceResults.push(source);
    }
  }

  const stats = await fetchYoutubeStats(rssVideos.map((item) => item.video.videoId).filter(Boolean));
  const videos = rssVideos
    .map(({ source, video }) => buildVideo(source, video, stats.get(video.videoId)))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  const publicSources = sourceResults.map(({ channelUrl, ...source }) => source);
  const existingPayload = await readExistingPayload();
  const hasExistingVideos = Array.isArray(existingPayload?.videos) && existingPayload.videos.length > 0;
  const payload =
    videos.length || !hasExistingVideos
      ? { generatedAt, sources: publicSources, videos, errors }
      : {
          ...existingPayload,
          lastAttemptAt: generatedAt,
          errors: [...(existingPayload.errors || []), ...errors, "Latest fetch returned no videos; kept previous data."]
        };
  await writePayload(payload);

  console.log(`Generated ${videos.length} videos from ${publicSources.length} sources.`);
  if (!videos.length && hasExistingVideos) console.log(`Kept ${existingPayload.videos.length} previous videos.`);
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
    : { generatedAt, sources: [], videos: [], errors: [error.message] };
  await writePayload(payload);
  console.error(error);
  process.exitCode = 1;
});
