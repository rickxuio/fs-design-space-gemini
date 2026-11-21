'use strict';
function splitSelectors(value){let out=[],start=0,depth=0,brackets=0,quote=null,escape=false;for(let i=0;i<value.length;i++){let c=value[i];if(escape){escape=false;continue;}if(c==='\\'){escape=true;continue;}if(quote){if(c===quote)quote=null;continue;}if(c==='"'||c==="'"){quote=c;continue;}if(c==='(')depth++;else if(c===')')depth--;else if(c==='[')brackets++;else if(c===']')brackets--;else if(c===','&&!depth&&!brackets){out.push(value.slice(start,i));start=i+1;}}out.push(value.slice(start));return out;}
module.exports={splitSelectors};
