"use strict";
const path=require('node:path');
const builders=['maintenance/button-prototype-20261113/build-preview.cjs','maintenance/text-button-prototype-20261114/build-preview.cjs','maintenance/icon-button-prototype-20261114/build-preview.cjs'];
function build({root=path.resolve(__dirname,'..')}={}) {return [...builders.map(file=>require(path.join(root,file)).build({root})),...require(path.join(root,'scripts/build-foundation-docs.cjs')).build({root}),require(path.join(root,'scripts/build-reading-docs.cjs')).build({root})];}
if(require.main===module)console.log(JSON.stringify(build(),null,2));
module.exports={build};
