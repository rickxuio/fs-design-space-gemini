"use strict";
// Existing local entry; no component publication or imported page workflow.
const fs=require('node:fs'),path=require('node:path'),C=require('./check-context.cjs'),V=require('../validate.js'),G=require('../verify.js');
const LROOT=()=>require('./local-component-library.cjs').ROOT;
async function run(args=process.argv.slice(2)){
 const context=C.createContext(),files=G.collectTargets(args),strict=args.includes('--strict');let failures=0;const started=Date.now();
 for(const file of files){let issues;try{issues=V.validateFile(file,{context});context.static.set(C.staticKey(file,LROOT(),context),issues);}catch(e){issues=[{level:'error',code:'FILE',msg:e.message}];}for(const i of issues)console.log(`${i.level.toUpperCase()} ${path.basename(file)} [${i.code}] ${i.msg}`);if(issues.some(i=>i.level==='error'||strict&&i.level==='warn'))failures++;}
 if(failures)return{exitCode:1,stats:context.stats,totalMs:Date.now()-started};
 const staticMs=Date.now()-started,browserStart=Date.now();
 const results=await G.run(files,{context,artifactsDir:path.join(require('os').tmpdir(),'fs-page-check-failures')});const exitCode=G.printResults(results);const report={exitCode,staticMs,browserMs:Date.now()-browserStart,totalMs:Date.now()-started,stats:context.stats,results};console.log('静态 '+report.staticMs+'ms；渲染与交互 '+report.browserMs+'ms；本地检查耗时 '+report.totalMs+'ms；新版片段校验执行 '+context.stats.staticRuns+'；复用 '+context.stats.staticHits);return report;
}
if(require.main===module)run().then(r=>process.exitCode=r.exitCode).catch(e=>{console.error(e);process.exitCode=2;});
module.exports={run};
