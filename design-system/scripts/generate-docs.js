#!/usr/bin/env node
/**
 * FS Design System — Contract → Docs Sync Generator
 *
 * 治理背景见 docs/component-contribution-guide.md 「修改已有规则：唯一入口是契约 JSON」章节。
 * 规则曾经同时活在 fs-design-system.md（散文）、契约 JSON（结构化数据）、verify.js（硬编码判断）
 * 三处，各自独立维护出现过真实漂移事故。现在契约 JSON 是唯一可编辑入口，本脚本负责把契约里的
 * 规则字段，重写进 fs-design-system.md 里对应的 AUTO-GENERATED 标记区块。
 *
 * 工作方式：
 *   1. 在 fs-design-system.md 里找 <!-- AUTO-GENERATED:<KEY>:START --> ... END --> 标记区块
 *   2. 每个 KEY 对应一个 generator 函数，读取相应契约 JSON 的字段，生成新的区块内容
 *   3. 用新内容替换标记之间的旧内容，标记本身保留
 *
 * 新增一条自动生成规则时：
 *   1. 在 fs-design-system.md 里手动加一对 START/END 标记（写清楚源头字段）
 *   2. 在下方 GENERATORS 里加一个同名 KEY 的生成函数
 *   3. 跑 node scripts/generate-docs.js 验证输出符合预期
 *
 * Usage: node scripts/generate-docs.js [--check]
 *   --check  只检查文档内容是否和契约一致，不写文件；不一致则报错退出（用于 CI / npm run health）
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DOCS_PATH = path.join(__dirname, '..', 'docs', 'fs-design-system.md');
const CONTRACTS_DIR = path.join(__dirname, '..', 'components', 'contracts');

function loadContract(name) {
  const file = path.join(CONTRACTS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`契约文件不存在: ${file}`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// ─────────────────────────────────────────────
// GENERATORS：每个 key 对应 fs-design-system.md 里的一个标记区块
// 返回值是要写入标记之间的纯文本（不含标记本身），每行前不加缩进，脚本会保持原样写入。
// ─────────────────────────────────────────────
const GENERATORS = {
  CARD_BORDER_RULES() {
    const card = loadContract('card');
    const ctx = card.relations && card.relations.parentContext;
    if (!ctx) throw new Error('card.json 缺少 relations.parentContext，无法生成边框规则');

    const white = ctx['page-section--white'];
    const gray = ctx['page-section--gray'];
    if (!white || !gray) throw new Error('card.json 的 parentContext 缺少 page-section--white 或 page-section--gray');

    const lines = [];
    // gray 先写还是 white 先写，跟随契约里两者的 resultingClass 语义，保持和原文档一致的顺序（gray 在前）
    lines.push(`- On gray sections: white card, ${grayDesc(gray.resultingClass)} (\`${gray.resultingClass}\`).`);
    lines.push(`- On white sections: use \`${white.resultingClass}\` for a full 4-side border.`);
    return lines.join('\n');
  },

  CARD_VARIANT_RULES() {
    const card = loadContract('card');
    const rules = card.relations && card.relations.variantSelectionRules;
    if (!rules || !rules.length) throw new Error('card.json 缺少 relations.variantSelectionRules，无法生成变体决策表');

    const lines = [];
    lines.push('| 源页面特征 | 选择变体 | Class |');
    lines.push('|-----------|---------|-------|');
    for (const r of rules) {
      lines.push(`| ${r.condition} | ${r.variant} | \`${r.cssClass}\` |`);
    }

    const edgeCases = card.relations && card.relations.variantSelectionEdgeCases;
    if (edgeCases && edgeCases.length) {
      lines.push('');
      lines.push('**边界情况（决策表专项核对，见 `docs/component-contribution-guide.md` 步骤2）：**');
      for (const e of edgeCases) {
        lines.push(`- ${e.scenario} → ${e.resolution}`);
      }
    }
    return lines.join('\n');
  },
};

function grayDesc(cls) {
  if (cls === 'ds-card--no-border') return 'NO border';
  return `use \`${cls}\``;
}

// ─────────────────────────────────────────────
// 标记区块的查找与替换
// ─────────────────────────────────────────────
function findBlocks(content) {
  const blocks = [];
  const re = /<!-- AUTO-GENERATED:([A-Z_]+):START[^>]*-->([\s\S]*?)<!-- AUTO-GENERATED:\1:END -->/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    blocks.push({ key: m[1], fullMatch: m[0], inner: m[2], index: m.index });
  }
  return blocks;
}

function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');

  if (!fs.existsSync(DOCS_PATH)) {
    console.error(`ERROR: 文档不存在: ${DOCS_PATH}`);
    process.exit(1);
  }

  const content = fs.readFileSync(DOCS_PATH, 'utf8');
  const blocks = findBlocks(content);

  if (blocks.length === 0) {
    console.log('未发现任何 AUTO-GENERATED 标记区块，无需同步。');
    process.exit(0);
  }

  let newContent = content;
  let mismatches = 0;
  let missing = 0;

  for (const block of blocks) {
    const generator = GENERATORS[block.key];
    if (!generator) {
      console.log(`⚠ WARN  标记 "${block.key}" 没有对应的生成函数，跳过（可能是新加的标记还没写 generator）`);
      missing++;
      continue;
    }

    let generated;
    try {
      generated = generator();
    } catch (e) {
      console.error(`✗ ERROR  生成 "${block.key}" 失败: ${e.message}`);
      process.exit(1);
    }

    const startTag = block.fullMatch.match(/<!-- AUTO-GENERATED:[A-Z_]+:START[^>]*-->/)[0];
    const endTag = `<!-- AUTO-GENERATED:${block.key}:END -->`;
    const newBlock = `${startTag}\n${generated}\n${endTag}`;

    const currentInner = block.inner.trim();
    const generatedTrimmed = generated.trim();

    if (currentInner !== generatedTrimmed) {
      mismatches++;
      console.log(`\n"${block.key}" 内容不一致：`);
      console.log('  文档当前内容:');
      currentInner.split('\n').forEach((l) => console.log(`    ${l}`));
      console.log('  契约应生成内容:');
      generatedTrimmed.split('\n').forEach((l) => console.log(`    ${l}`));
    }

    newContent = newContent.replace(block.fullMatch, newBlock);
  }

  if (checkOnly) {
    if (mismatches > 0) {
      console.log(`\n✗ ${mismatches} 处规则与契约不一致。跑 \`node scripts/generate-docs.js\`（不带 --check）重新生成文档。`);
      process.exit(1);
    }
    console.log(`\n✓ 全部 ${blocks.length - missing} 处 AUTO-GENERATED 区块与契约一致，0 处不一致。`);
    process.exit(0);
  }

  if (newContent !== content) {
    fs.writeFileSync(DOCS_PATH, newContent, 'utf8');
    console.log(`\n✓ 已重新生成 ${mismatches} 处不一致的区块，写入 ${path.relative(path.join(__dirname, '..'), DOCS_PATH)}`);
  } else {
    console.log('\n✓ 所有区块已是最新，无需改动。');
  }
}

main();
