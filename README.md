# Alpha Radar

AI、加密与投资大师公开视频情报台。

## 当前版本

这是一个静态站点，但已经具备“高频自动更新”的数据链路：

- 科技专区：读取自动生成的 YouTube 最新视频数据，并按综合热度、最新、重要性、暴涨排序。
- 投资专栏：以 20 位投资大师为核心学习库，覆盖价值投资、优质成长、全球宏观、量化、指数、激进、另类资产、周期逆向 8 类流派。
- 历史库：统一检索科技、加密、投资内容。
- 原视频跳转：只有单条 YouTube 视频 URL 且已核验，才显示“看原视频”。
- 数据状态：页面顶部会显示最近更新时间、成功源数和指标质量。

直接打开 `index.html` 可以看页面。若 `data/generated-videos.js` 里没有抓到内容，页面会自动退回样例数据。

## 本地更新数据

运行：

```bash
node scripts/fetch-latest.mjs
```

脚本会：

1. 读取白名单 YouTube 频道。
2. 解析频道 RSS 最新公开视频。
3. 生成 `data/generated-videos.js`。
4. 前端自动读取该文件。

不配置 API key 也能获取标题、发布时间、原视频链接和封面，但热度会使用频道基线估算。配置 `YOUTUBE_API_KEY` 后，会额外获取真实播放量、点赞、评论和时长。

```bash
YOUTUBE_API_KEY=你的_key node scripts/fetch-latest.mjs
```

## GitHub 自动更新

已添加 GitHub Actions：

```text
.github/workflows/update-videos.yml
```

默认每 2 小时运行一次，也可以在 GitHub Actions 页面手动点 `Run workflow`。

如果你要补充真实播放量指标，在 GitHub 仓库里添加：

```text
Settings -> Secrets and variables -> Actions -> New repository secret
Name: YOUTUBE_API_KEY
Value: 你的 YouTube Data API key
```

没有 key 也能跑，只是热度中的播放量会用估算值。

## 数据源

当前自动抓取 40+ 个 YouTube 白名单源，覆盖：

- AI 公司、研究和开发者频道：OpenAI、Anthropic、Google DeepMind、NVIDIA、Microsoft Developer、Google Cloud Tech 等。
- AI/科技投资和访谈：Dwarkesh、Lex Fridman、Latent Space、a16z、Sequoia、YC 等。
- 加密协议、媒体和研究：Ethereum Foundation、ETHGlobal、Bankless、a16z crypto、Coinbase、Chainlink、Solana、CoinDesk、Messari 等。
- 投资大师和机构观点：ARK、Altimeter、Ray Dalio、Bridgewater、Yahoo Finance、Bloomberg、CNBC、Acquired、Invest Like the Best、Goldman Sachs、Vanguard 等。

脚本会按标题、人物、主题和资产做相关性过滤，剔除游戏预告、纯娱乐短视频等低价值内容。后续要增加频道，编辑 `scripts/fetch-latest.mjs` 里的 `sources` 数组即可。

## 投资大师名单

投资专区当前覆盖用户指定的 20 位：

- Warren Buffett
- Benjamin Graham
- Seth Klarman
- Joel Greenblatt
- Charlie Munger
- Philip Fisher
- Peter Lynch
- George Soros
- Stanley Druckenmiller
- Ray Dalio
- Jim Simons
- John Bogle
- Carl Icahn
- Bill Ackman
- Henry Kravis
- David Swensen
- Howard Marks
- John Templeton
- Jeremy Grantham
- Michael Burry

右侧 Top 20 名单可点击跳转到对应 Wikipedia 页面。

## 时间和评分

- 前端默认展示 `Asia/Shanghai`。
- 今日窗口按北京时间 `00:00 - 23:59`。
- GitHub Actions 默认每 2 小时更新一次。GitHub 的定时任务可能有几分钟到几十分钟延迟。
- 综合热度公式：

```text
hot_score =
  40% importance_score +
  35% spread_score +
  20% freshness_score +
  5% editor_boost
```

## 注意

当前仍是静态站架构，没有数据库。它适合低成本部署到 GitHub Pages。若后续要做用户订阅、长期指标快照、字幕摘要队列和多平台 X/Podcast/RSS 聚合，再升级到后端数据库会更合适。
