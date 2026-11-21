// One-time evidence reconciliation. Does not change runtime assets, contracts or target page.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const base = 'components/sources/maintenance/j4858d-required-source-read-1016';
const shots = `${base}/screenshots`;
const native = '/Users/rick.xu/.mgmcp/resources/screenshots/143880409387753';
for (const [dir, id, name] of [
  ['69473-095884', '69473-095884', 'iconfont-reference-1019.png'],
  ['64805-78847', '68268-63477', 'outlined-left-download-1019.png'],
  ['67934-110777', '50384-012216', 'message-bell-22-1019.png'],
]) {
  const file = fs.readdirSync(path.join(native, dir)).find(f => f.endsWith(`_${id}.png`));
  fs.copyFileSync(path.join(native, dir, file), `${shots}/${name}`);
}
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
const rows = [
  ['69561:096279', '通用Icon', 'general-visual-1019.png', '逐个图形查看；Save是磁盘，未见收藏爱心'],
  ['56182:028019', '交互Icon', 'interaction-visual-1019.png', '逐个图形查看；Like是拇指点赞，未见收藏爱心'],
  ['68996:074874', '系统Icon', 'system-visual-1019.png', '逐个图形查看；Message是铃铛，未见收藏爱心'],
  ['56182:028207', '定制Icon', 'custom-visual-1019.png', '1600×3198原图按连续重叠面板阅读；未见独立收藏爱心'],
  ['69473:095884', '需上传Iconfnt', 'iconfont-reference-1019.png', '逐个图形查看；系统、通用、交互参考中未见收藏爱心'],
  ['56279:012691', '图标按钮', 'icon-button-visual-1019.png', '逐个原始按钮状态查看；未见收藏爱心宿主'],
  ['64880:83689', '形状/描边按钮', 'shape-visual-1019.png', '60状态的可见展示没有Cart或询价图文组合；另查隐藏槽，不以可见文本证明槽不存在'],
  ['68908:013501', '产品选购卡片', 'card-purchase-visual-1019.png', '六个卡片变体查看；真实Cart+Add在小卡Hover内，不是42px主按钮，也未见爱心'],
  ['68268:63477', '已显示左图标的42px描边实例', 'outlined-left-download-1019.png', '156×42原件：左边是Download。16px图标、4px有效间距、文本、左右24px；快照仅返回宿主引用，不冒称已取得完整嵌套源'],
];
write(`${base}/source-visual-search-1019.json`, {
  schemaVersion: 'fs-required-source-visual-review/1', readAt: new Date().toISOString(),
  fileId: '143880409387753', fileTitle: '英文站组件库 v2.27.2609B', remoteRevision: null,
  purpose: '继续查爱心及主按钮图文组合；不修改MasterGo画布或目标页面',
  observations: rows.map(([node, name, file, finding]) => ({ node, name, screenshot: `${shots}/${file}`, sha256: hash(`${shots}/${file}`), finding })),
  conclusions: {
    heart: '在上述实际图形及宿主范围内未找到；不等同整个文件不存在',
    mainCartQuote: '已确认真实左图标槽、可见Download实例和小Cart+Add宿主。原件支持图标组合；本地AI契约和严格文字骨架检查未接入。不能因没有预先拼好Cart/询价的整例就判原件缺失；具体FS图标仍核语义、尺寸、颜色和状态',
    bell: '50384:012216是22×22真实组件，官方SVG片段及PNG已导出；画布与内部绘制框分别记录，不把片段直接拉伸成22px',
    bodyAndComponent: '普通按钮真实左槽和类型正文相互支持；4px有效间距与2px组内padding+2px外gap分别记录。68268:63989位于播放按钮分节，不独自用作所有功能图标的通用授权',
  },
  nextRequiredEvidence: ['收藏爱心真实原件节点与状态', '基于已有真实槽位补本地契约和FS图标绑定；核尺寸、颜色、语义、状态，不要求预先拼好业务成品'],
  pageAdmission: 'blocked at A2; no whole-page generation, A5 or A6',
});
write(`${base}/bell-source-contract-1019.json`, {
  schemaVersion: 'fs-source-candidate-contract/1', status: 'source-obtained; host-call-not-admitted',
  source: { fileId: '143880409387753', pageId: '3752:3996', componentNode: '50384:012216', exampleNode: '69473:096215', name: 'Icon/系统Icon/Message-站内信', frame: { width: 22, height: 22 }, internalNode: '56224:017050', internalInsetsPercent: { left: 8.32, right: 8.32, top: 9.36, bottom: 9.36 } },
  officialSvg: { file: `${base}/exports/asset/icons/svg_983360f8.svg`, sha256: hash(`${base}/exports/asset/icons/svg_983360f8.svg`), intrinsicWidth: 18.33, intrinsicHeight: 17.87, viewBox: '0 0 18.3333740234375 18.791717529296875', boundary: '官方SVG字节未改；内在尺寸与viewBox比例不同，按导出原件保留，不修形状或强制拉伸' },
  sourceScreenshot: { file: `${shots}/message-bell-22-1019.png`, sha256: hash(`${shots}/message-bell-22-1019.png`) },
  exportWrapper: { file: `${base}/exports/Icon-系统Icon-Message-站内信.html`, normalization: '保留22px画布、原始内距和SVG内在尺寸；绝对定位转正常flex流，内联样式抽为类', visualReferenceRead: true, actualBrowserReview: 'pending; source-export directory is outside preview CLI entry scope; no allowlist changed' },
  boundaries: ['仅证明铃铛图形和默认原件，不建立价格提醒按钮宿主或Hover状态', '不加入有效组件Preview或运行资源注册表，待真实宿主装配契约补齐'],
});
const batchFile = `${base}/batch.json`;
const batch = JSON.parse(fs.readFileSync(batchFile));
batch.sourceSearch1019 = { record: `${base}/source-visual-search-1019.json`, bellContract: `${base}/bell-source-contract-1019.json`, scope: '9个实际原图或宿主范围；未找到不冒称全文件没有', status: 'heart and main Cart/quote source evidence unresolved' };
batch.remainingOutsideThisBatch[0] = 'Bell official export obtained at 50384:012216; source frame contract recorded; host call and browser proof pending';
write(batchFile, batch);
const report = 'page-reviews/router-switch-j4858d-1016/index.html';
let html = fs.readFileSync(report, 'utf8');
html = html.replace('当前仅取得候选，尚未完成官方导出和调用契约。', '现已核实母组件50384:012216并导出官方SVG及22×22原件PNG，画布/内部绘制框契约已记录；宿主调用和浏览器验证仍待完成。');
let article = '<article id="source-visual-search-1019"><h3>2026-10-19 原件逐图回查：爱心与主按钮组合</h3><p>实际查看通用、交互、系统、定制、Iconfont参考、图标按钮、形状/描边按钮、产品选购卡片及42px左图标实例。未在这些范围中找到收藏爱心；不是对全文件不存在的断言。</p><p>42px按钮存在真实左图标开关；已显示的描边示例为Download（156×42），不是询价。产品卡片的Cart+Add为32px，不能冒充42px主按钮。正文的通用组合描述不能替代具体原件引用。</p><p>铃铛官方SVG及PNG已保存；22px画布、原始内距和内部SVG片段分别记录。导出包装按原件整理为flex和样式类，SVG字节未改；实际浏览器复核及宿主调用准入仍待完成。</p><p><b>仍在A2：</b>爱心及主Cart／询价组合对应来源待补。目标页面未改，没有使用磁盘／点赞／下载图标代替，没有放宽闸门。</p><p><a href="../../' + base + '/source-visual-search-1019.json">逐项原图、节点与指纹</a> · <a href="../../' + base + '/bell-source-contract-1019.json">铃铛来源与待准入契约</a> · <a href="https://mastergo.com/file/143880409387753?page_id=3752%3A3993&amp;layer_id=68268%3A63477">MasterGo：真实左图标示例</a></p><details><summary>查看本轮原件图</summary>';
article += rows.map(([node, name, file, finding]) => `<p><a href="../../${shots}/${file}">${name} · ${node}</a>：${finding}</p>`).join('');
article += '</details></article>';
if (!html.includes('id="source-visual-search-1019"')) html = html.replace('<section id="regeneration">', '<section id="regeneration">' + article);
fs.writeFileSync(report, html);
const baseline = JSON.parse(fs.readFileSync('page-reviews/router-switch-j4858d-1016/audit/regeneration-1016/baseline.json'));
const changed = Object.entries(baseline.files).filter(([file, expected]) => hash(file) !== expected).map(([file]) => file);
console.log(JSON.stringify({ sourceVisualsSaved: rows.length, baselineFiles: Object.keys(baseline.files).length, changedBaselineFiles: changed }));
if (changed.length) process.exitCode = 1;
