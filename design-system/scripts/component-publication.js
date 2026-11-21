'use strict';
// One source for the existing A2/A3/A4/A5 publication boundary. Historical
// references remain inspectable; inspectability is not new-page admission.
const fs = require('node:fs'), path = require('node:path');
const slug = value => String(value || '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
function publication(root, component, variant, required = true) {
  const policy = JSON.parse(fs.readFileSync(path.join(root, 'components/reference-policy.json'), 'utf8'));
  const baseline = policy.deliveryBaseline;
  if (!baseline) {
    if (required) throw Error('缺少调用交付基线，禁止新页面调用');
    return null;
  }
  if (baseline.schemaVersion !== 'fs-call-delivery-baseline/1.0.0') throw Error('无效调用交付基线');
  const key = slug(component) + '/' + variant, entry = baseline.calls?.[key];
  if (!entry) return { key, disposition: 'withheld', newPages: false, reason: '未登记在本阶段精确调用基线中', constraints: [] };
  if (!['retain', 'restricted', 'withheld'].includes(entry.disposition)
    || !Array.isArray(entry.constraints) || !entry.constraints.length
    || typeof entry.newPages !== 'boolean' || !entry.reason
    || (entry.disposition === 'withheld' && entry.newPages)) throw Error('无效调用分流：' + key);
  const releaseBlockers=entry.releaseBlockers||[];
  if(!Array.isArray(releaseBlockers)||releaseBlockers.some(b=>!b.id||!b.reason||!b.evidence))throw Error('无效发布阻塞：'+key);
  return { key, ...entry, newPages:entry.newPages && releaseBlockers.length===0,
    reason:entry.reason+(releaseBlockers.length?'；'+releaseBlockers.map(b=>b.reason).join('；'):'') };
}
function assertPublication(root, component, variant) {
  const decision = publication(root, component, variant);
  if (!decision.newPages) throw Error(`调用暂不向新页面开放：${decision.key}；${decision.reason}`);
  return decision;
}
function assertUsePublication(root, use) {
  const decision=assertPublication(root,use.component,use.variant);
  if(decision.hostComponent && use.configuration?.hostComponent!==decision.hostComponent)
    throw Error(`调用仅允许在${decision.hostComponent}宿主中装配：${decision.key}；configuration.hostComponent必须明确登记，实际祖先还须A5验证`);
  return decision;
}
function validateBaseline(root) {
  const policy = JSON.parse(fs.readFileSync(path.join(root, 'components/reference-policy.json'), 'utf8'));
  const baseline = policy.deliveryBaseline;
  if (!baseline || baseline.schemaVersion !== 'fs-call-delivery-baseline/1.0.0') throw Error('缺少或无效调用交付基线');
  const expected = fs.readdirSync(path.join(root, 'components/contracts')).filter(f => f.endsWith('.json')).flatMap(file => {
    const c = JSON.parse(fs.readFileSync(path.join(root, 'components/contracts', file), 'utf8'));
    return (c.aiContract?.supported || []).map(v => file.slice(0, -5) + '/' + v);
  }).sort();
  const actual = Object.keys(baseline.calls || {}).sort();
  if (JSON.stringify(expected) !== JSON.stringify(actual)) throw Error('调用分流与精确声明不一致，必须逐条登记，禁止静默新增');
  const counts = { retain: 0, restricted: 0, withheld: 0, newPages: 0 };
  for (const key of actual) {
    const split = key.indexOf('/'), d = publication(root, key.slice(0, split), key.slice(split + 1));
    counts[d.disposition]++; if (d.newPages) counts.newPages++;
  }
  return counts;
}
module.exports = { publication, assertPublication, assertUsePublication, validateBaseline };
