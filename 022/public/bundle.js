var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function c(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}let u;function a(t){u=t}const f=[],s=[],i=[],l=[],d=Promise.resolve();let $=!1;function p(t){i.push(t)}function h(){const t=new Set;do{for(;f.length;){const t=f.shift();a(t),m(t.$$)}for(;s.length;)s.pop()();for(let n=0;n<i.length;n+=1){const e=i[n];t.has(e)||(e(),t.add(e))}i.length=0}while(f.length);for(;l.length;)l.pop()();$=!1}function m(t){t.fragment&&(t.update(t.dirty),o(t.before_update),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_update.forEach(p))}const g=new Set;function y(t,n){t.$$.dirty||(f.push(t),$||($=!0,d.then(h)),t.$$.dirty=e()),t.$$.dirty[n]=!0}function _(c,f,s,i,l,d){const $=u;a(c);const m=f.props||{},_=c.$$={fragment:null,ctx:null,props:d,update:t,not_equal:l,bound:e(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map($?$.$$.context:[]),callbacks:e(),dirty:null};let x=!1;var b,v,w;_.ctx=s?s(c,m,(t,n,e=n)=>(_.ctx&&l(_.ctx[t],_.ctx[t]=e)&&(_.bound[t]&&_.bound[t](e),x&&y(c,t)),n)):m,_.update(),x=!0,o(_.before_update),_.fragment=i(_.ctx),f.target&&(f.hydrate?_.fragment.l((w=f.target,Array.from(w.childNodes))):_.fragment.c(),f.intro&&((b=c.$$.fragment)&&b.i&&(g.delete(b),b.i(v))),function(t,e,c){const{fragment:u,on_mount:a,on_destroy:f,after_update:s}=t.$$;u.m(e,c),p(()=>{const e=a.map(n).filter(r);f?f.push(...e):o(e),t.$$.on_mount=[]}),s.forEach(p)}(c,f.target,f.anchor),h()),a($)}class x{$destroy(){var n,e;e=1,(n=this).$$.fragment&&(o(n.$$.on_destroy),n.$$.fragment.d(e),n.$$.on_destroy=n.$$.fragment=null,n.$$.ctx={}),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(){}}function b(n){var e;return{c(){var t;t="master",e=document.createTextNode(t)},m(t,n){!function(t,n,e){t.insertBefore(n,e||null)}(t,e,n)},p:t,i:t,o:t,d(t){var n;t&&(n=e).parentNode.removeChild(n)}}}return new class extends x{constructor(t){super(),_(this,t,null,b,c,[])}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
