#!/usr/bin/env node
'use strict';
// Component-only proof writer. No page plan, context, generation or registration.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const ROOT=path.resolve(__dirname,'..'),P=require('./component-proof-profile'),{buildReference}=require('./compile-component-reference');
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,file))).digest('hex');
try{
 const args=process.argv.slice(2);let id,log,acceptanceOnly=false;
 for(let i=0;i<args.length;i++){if(args[i]==='--component')id=args[++i];else if(args[i]==='--log')log=args[++i];else if(args[i]==='--acceptance-only')acceptanceOnly=true;else throw Error('Use --component <finite component id> [--log path] [--acceptance-only]');}
 if(!Object.hasOwn(P.SUITES,id||''))throw Error('Choose an existing finite component suite: '+Object.keys(P.SUITES).join(', '));
 const profile=P.profileFor(id,ROOT),toolsBefore=Object.fromEntries(profile.tools.map(f=>[f,hash(f)])),before=buildReference(ROOT,id).freshness,env={...process.env,FS_COMPONENT_UNDER_TEST:id};delete env.NODE_TEST_CONTEXT;
 const run=spawnSync(process.execPath,['--test','--test-reporter=tap','--test-concurrency=1',...profile.tests],{cwd:ROOT,env,encoding:'utf8',timeout:60000,maxBuffer:16*1024*1024});
 log=log||'components/quality/logs/'+id+'-'+Date.now()+'.log';const dest=path.resolve(ROOT,log);if(!dest.startsWith(path.join(ROOT,'components')+path.sep))throw Error('Component engineering logs must stay under components/');fs.mkdirSync(path.dirname(dest),{recursive:true});if(fs.existsSync(dest))throw Error('Do not overwrite an existing proof log');fs.writeFileSync(dest,(run.stdout||'')+(run.stderr||''));if(run.status!==0)throw Error('Actual engineering suite failed; acceptance unchanged: '+log);
 const after=buildReference(ROOT,id).freshness,toolsAfter=Object.fromEntries(profile.tools.map(f=>[f,hash(f)]));if(JSON.stringify(before)!==JSON.stringify(after)||JSON.stringify(toolsBefore)!==JSON.stringify(toolsAfter)||JSON.stringify(profile)!==JSON.stringify(P.profileFor(id,ROOT)))throw Error('Sources or engineering tools changed during execution; acceptance unchanged');
 const file=path.join(ROOT,'components/quality/acceptance.json'),a=JSON.parse(fs.readFileSync(file)),old=a.components[id]||{};
 const proof={dependencyPolicy:profile.policy,componentId:id,execution:{exitCode:0,logSha256:hash(log)},result:'passed',testedAt:new Date().toISOString(),scope:old.scope||'Existing finite source-bound component calls only; no new variants or visual approval',tests:profile.tests,log,visual:old.visual||'pending',freshness:after,toolFingerprints:toolsAfter};const issues=P.profileIssues(id,proof,ROOT);if(issues.length)throw Error(issues.join('; '));a.components[id]=proof;const temp=file+'.tmp';fs.writeFileSync(temp,JSON.stringify(a,null,2)+'\n');fs.renameSync(temp,file);if(!acceptanceOnly)require('./component-quality').compile(ROOT);console.log('Actual component-only engineering passed: '+id+'; '+log);
}catch(e){console.error(e.message);process.exitCode=1;}
