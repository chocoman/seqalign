!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("seqalign",[],t):"object"==typeof exports?exports.seqalign=t():e.seqalign=t()}(window,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";var o;Object.defineProperty(t,"__esModule",{value:!0}),function(e){e[e.Begin=0]="Begin",e[e.Insert=1]="Insert",e[e.Substitute=2]="Substitute",e[e.Match=3]="Match",e[e.Delete=4]="Delete"}(o||(o={}));t.Alignment=class{constructor(e,t,n,o){this.a=e,this.distance=t,this.insertionPenalty=n,this.deletionPenalty=o}countOperations(e){const t=[0,0,0,0,0];for(let n=0;n<e.length;n++)t[e[n]]++;return t}match(e,t,n){const r=[],i=[];this.b=e;const l=this.a.slice(t,n);for(let t=0;t<=e.length;t++)r[t]=[],i[t]=[];r[0][0]=0;for(let e=1;e<=l.length;e++)r[0][e]=r[0][e-1]+this.insertionPenalty(l[e-1]),i[0][e]=o.Begin;for(let e=1;e<=this.b.length;e++)r[e][0]=r[e-1][0]+this.deletionPenalty(this.b[e-1]),i[e][0]=o.Delete;for(let t=1;t<=e.length;t++)for(let n=1;n<=l.length;n++){const a=this.distance(e[t-1],l[n-1]);var s=r[t-1][n-1]+a,u=r[t][n-1]+this.insertionPenalty(l[n-1]),c=r[t-1][n]+this.deletionPenalty(this.b[t-1]);s<u&&s<c?(r[t][n]=s,i[t][n]=0===a?o.Match:o.Substitute):u<c?(r[t][n]=u,i[t][n]=o.Insert):(r[t][n]=c,i[t][n]=o.Delete)}let a=this.b.length,f=l.length,h=i[a][f];const d=new Array(this.b.length).fill(0);let b=[];for(var g=0;;g++){if(console.log([a,f]),a<=0||f<=0){console.log("sumting vird :-S");break}if(h===o.Begin)break;h===o.Substitute?(a-=1,f-=1):h===o.Delete?(a-=1,f=f):h===o.Insert?(a=a,f-=1):h===o.Match&&(a-=1,f-=1),h=i[a][f],b.push(h),d[a]=t+f}const p=this.countOperations(b);return console.log(p),{distance:r[this.b.length][l.length],matchIndices:d}}}}])});
//# sourceMappingURL=alignment.bundle.js.map