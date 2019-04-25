var seqalign=function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=1)}([function(t,e,n){"use strict";var i;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t[t.Begin=0]="Begin",t[t.Insert=1]="Insert",t[t.Substitute=2]="Substitute",t[t.Match=3]="Match",t[t.Delete=4]="Delete"}(i||(i={}));e.Alignment=class{constructor(t,e,n,i){this.a=t,this.distance=e,this.insertionPenalty=n,this.deletionPenalty=i}countOperations(t){const e=[0,0,0,0,0];for(let n=0;n<t.length;n++)e[t[n]]++;return e}match(t,e,n){const r=[],s=[];this.b=t;const o=this.a.slice(e,n);for(let e=0;e<=t.length;e++)r[e]=[],s[e]=[];r[0][0]=0;for(let t=1;t<=o.length;t++)r[0][t]=r[0][t-1]+this.insertionPenalty(o[t-1]),s[0][t]=i.Begin;for(let t=1;t<=this.b.length;t++)r[t][0]=r[t-1][0]+this.deletionPenalty(this.b[t-1]),s[t][0]=i.Delete;for(let e=1;e<=t.length;e++)for(let n=1;n<=o.length;n++){const u=this.distance(t[e-1],o[n-1]);var l=r[e-1][n-1]+u,a=r[e][n-1]+this.insertionPenalty(o[n-1]),h=r[e-1][n]+this.deletionPenalty(this.b[e-1]);l<a&&l<h?(r[e][n]=l,s[e][n]=0===u?i.Match:i.Substitute):a<h?(r[e][n]=a,s[e][n]=i.Insert):(r[e][n]=h,s[e][n]=i.Delete)}let u=this.b.length,c=o.length,g=s[u][c];const d=new Array(this.b.length).fill(0);let f=[];for(var p=0;;p++){if(console.log([u,c]),u<=0||c<=0){console.log("sumting vird :-S");break}if(g===i.Begin)break;g===i.Substitute?(u-=1,c-=1):g===i.Delete?(u-=1,c=c):g===i.Insert?(u=u,c-=1):g===i.Match&&(u-=1,c-=1),g=s[u][c],f.push(g),d[u]=e+c}const y=this.countOperations(f);return console.log(y),{distance:r[this.b.length][o.length],matchIndices:d}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const i=n(0);class r{constructor(t,e,n,r,s){this.wordInsertionPenalty=(t=>this.insertionPenalty*t.length),this.wordDeletionPenalty=(t=>this.deletionPenalty*t.length),this.prefixDistance=((t,e)=>{let n;for(t=t.toLowerCase(),e=e.toLowerCase(),n=0;n<Math.min(t.length,e.length)&&t[n]===e[n];n++);return this.substitutionPenalty*(Math.max(t.length,e.length)-n)}),this.targetSequence=t,this.aligner=new i.Alignment(this.targetSequence,this.prefixDistance,this.wordInsertionPenalty,this.wordDeletionPenalty),this.targetTimestamps=e,this.deletionPenalty=r,this.substitutionPenalty=s,this.insertionPenalty=n}static string2array(t){return t.split(/(?=[\s\S])/u)}static string2words(t){return t.split(/[ ]/u)}distortWords(t,e){let n;n=[];for(var i=0;i<t.length;i++)Math.random()<e/3?n.push(t[Math.floor(Math.random()*t.length)]):n.push(t[i]),Math.random()<e/3&&n.pop(),Math.random()<e/3&&n.push(t[Math.floor(Math.random()*t.length)]);return n}timeToIndex(t){return this.targetTimestamps.findIndex(e=>e[0]>=t)}compareSequence(t,e,n){console.log("aligning...");const{distance:i,matchIndices:r}=this.aligner.match(t,this.timeToIndex(e),this.timeToIndex(n));return console.log(i/t.length),r}}r.exactMatchDistance=((t,e)=>t===e?1:0),e.StringAligner=r,t.exports={StringAligner:r,Alignment:i.Alignment}}]);
//# sourceMappingURL=stringaligner.bundle.js.map