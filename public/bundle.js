var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function r(t){t.forEach(e)}function a(t){return"function"==typeof t}function o(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function u(t,e){t.appendChild(e)}function c(t,e,n){t.insertBefore(e,n||null)}function i(t){t.parentNode.removeChild(t)}function d(t){return document.createElement(t)}function l(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function s(t){return document.createTextNode(t)}function f(){return s(" ")}function m(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function g(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function v(t,e){e=""+e,t.data!==e&&(t.data=e)}function p(t,e,n,r){t.style.setProperty(e,n,r?"important":"")}let h;function b(t){h=t}const y=[],_=[],$=[],x=[],w=Promise.resolve();let j=!1;function k(t){$.push(t)}function D(t){x.push(t)}function M(){const t=new Set;do{for(;y.length;){const t=y.shift();b(t),S(t.$$)}for(;_.length;)_.pop()();for(let e=0;e<$.length;e+=1){const n=$[e];t.has(n)||(n(),t.add(n))}$.length=0}while(y.length);for(;x.length;)x.pop()();j=!1}function S(t){t.fragment&&(t.update(t.dirty),r(t.before_update),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_update.forEach(k))}const A=new Set;let O;function N(t,e){t&&t.i&&(A.delete(t),t.i(e))}function U(t,e,n,r){if(t&&t.o){if(A.has(t))return;A.add(t),O.c.push(()=>{A.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}const I="undefined"!=typeof window?window:global;function E(t,e,n){-1!==t.$$.props.indexOf(e)&&(t.$$.bound[e]=n,n(t.$$.ctx[e]))}function L(t,n,o){const{fragment:u,on_mount:c,on_destroy:i,after_update:d}=t.$$;u.m(n,o),k(()=>{const n=c.map(e).filter(a);i?i.push(...n):r(n),t.$$.on_mount=[]}),d.forEach(k)}function F(t,e){t.$$.fragment&&(r(t.$$.on_destroy),t.$$.fragment.d(e),t.$$.on_destroy=t.$$.fragment=null,t.$$.ctx={})}function V(t,e){t.$$.dirty||(y.push(t),j||(j=!0,w.then(M)),t.$$.dirty=n()),t.$$.dirty[e]=!0}function B(e,a,o,u,c,i){const d=h;b(e);const l=a.props||{},s=e.$$={fragment:null,ctx:null,props:i,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:[]),callbacks:n(),dirty:null};let f=!1;var m;s.ctx=o?o(e,l,(t,n,r=n)=>(s.ctx&&c(s.ctx[t],s.ctx[t]=r)&&(s.bound[t]&&s.bound[t](r),f&&V(e,t)),n)):l,s.update(),f=!0,r(s.before_update),s.fragment=u(s.ctx),a.target&&(a.hydrate?s.fragment.l((m=a.target,Array.from(m.childNodes))):s.fragment.c(),a.intro&&N(e.$$.fragment),L(e,a.target,a.anchor),M()),b(d)}class q{$destroy(){F(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}function P(t){var e,n,a,o,l,f,g=t.curr.a+"",p=t.curr.b+"";return{c(){e=d("span"),n=s(g),a=s("\r\n\t\tto \r\n\t\t"),o=d("span"),l=s(p),f=[m(e,"mousemove",t.mousemove_handler_1),m(o,"mousemove",t.mousemove_handler_2)]},m(t,r){c(t,e,r),u(e,n),c(t,a,r),c(t,o,r),u(o,l)},p(t,e){t.curr&&g!==(g=e.curr.a+"")&&v(n,g),t.curr&&p!==(p=e.curr.b+"")&&v(l,p)},d(t){t&&(i(e),i(a),i(o)),r(f)}}}function z(e){var n,r,a;return{c(){n=s(e.origa),r=s(" to "),a=s(e.origb)},m(t,e){c(t,n,e),c(t,r,e),c(t,a,e)},p:t,d(t){t&&(i(n),i(r),i(a))}}}function K(e){var n,a,o,l,v,p,h,b,y,_,$,x;function w(t,e){return e.curr.a==e.curr.b?z:P}var j=w(0,e),k=j(e);return{c(){n=d("div"),a=d("button"),o=s("prev"),v=f(),p=d("div"),k.c(),h=f(),b=d("div"),y=d("button"),_=s("next"),g(a,"class","br svelte-1q5rvlm"),a.disabled=l=0==e.index,g(n,"class","col s3 fs left-align svelte-1q5rvlm"),g(p,"class","col s6 fs center-align svelte-1q5rvlm"),g(y,"class","br svelte-1q5rvlm"),y.disabled=$=e.index==e.data.N-1,g(b,"class","col s3 fs right-align svelte-1q5rvlm"),x=[m(a,"mousemove",e.mousemove_handler),m(a,"click",e.click_handler),m(y,"mousemove",e.mousemove_handler_3),m(y,"click",e.click_handler_1)]},m(t,e){c(t,n,e),u(n,a),u(a,o),c(t,v,e),c(t,p,e),k.m(p,null),c(t,h,e),c(t,b,e),u(b,y),u(y,_)},p(t,e){t.index&&l!==(l=0==e.index)&&(a.disabled=l),j===(j=w(0,e))&&k?k.p(t,e):(k.d(1),(k=j(e))&&(k.c(),k.m(p,null))),(t.index||t.data)&&$!==($=e.index==e.data.N-1)&&(y.disabled=$)},i:t,o:t,d(t){t&&(i(n),i(v),i(p)),k.d(),t&&(i(h),i(b)),r(x)}}}function R(t,e,n){let{data:r,curr:a,index:o}=e,u=a.a,c=a.b;return t.$set=(t=>{"data"in t&&n("data",r=t.data),"curr"in t&&n("curr",a=t.curr),"index"in t&&n("index",o=t.index)}),{data:r,curr:a,index:o,origa:u,origb:c,mousemove_handler:()=>r.mm("prev"),click_handler:()=>r.incr(-1),mousemove_handler_1:()=>r.mm("left"),mousemove_handler_2:()=>r.mm("right"),mousemove_handler_3:()=>r.mm("next"),click_handler_1:()=>r.incr(1)}}class H extends q{constructor(t){super(),B(this,t,R,K,o,["data","curr","index"])}}function T(t){var e,n,a,o,l,v,p,h,b,y,_,$,x=0!=t.data.ADD&&C(t),w=0!=t.data.SUB&&G(t),j=1!=t.data.MUL&&W(t),k=1!=t.data.DIV&&J(t);return{c(){e=d("div"),n=f(),a=d("div"),x&&x.c(),o=f(),w&&w.c(),l=f(),j&&j.c(),v=f(),k&&k.c(),p=f(),h=d("div"),b=d("button"),y=s("Undo"),g(e,"class","left col s3 fs marg center-align svelte-cghug5"),g(a,"class","left col s6 fs marg center-align svelte-cghug5"),g(b,"class","br svelte-cghug5"),b.disabled=_=0==t.curr.hist.length,g(h,"class","left col s3 fs marg right-align svelte-cghug5"),$=[m(b,"mousemove",t.mousemove_handler_4),m(b,"click",t.data.undo)]},m(t,r){c(t,e,r),c(t,n,r),c(t,a,r),x&&x.m(a,null),u(a,o),w&&w.m(a,null),u(a,l),j&&j.m(a,null),u(a,v),k&&k.m(a,null),c(t,p,r),c(t,h,r),u(h,b),u(b,y)},p(t,e){0!=e.data.ADD?x?x.p(t,e):((x=C(e)).c(),x.m(a,o)):x&&(x.d(1),x=null),0!=e.data.SUB?w?w.p(t,e):((w=G(e)).c(),w.m(a,l)):w&&(w.d(1),w=null),1!=e.data.MUL?j?j.p(t,e):((j=W(e)).c(),j.m(a,v)):j&&(j.d(1),j=null),1!=e.data.DIV?k?k.p(t,e):((k=J(e)).c(),k.m(a,null)):k&&(k.d(1),k=null),t.curr&&_!==(_=0==e.curr.hist.length)&&(b.disabled=_)},d(t){t&&(i(e),i(n),i(a)),x&&x.d(),w&&w.d(),j&&j.d(),k&&k.d(),t&&(i(p),i(h)),r($)}}}function X(t){var e,n,r,a=t.curr.hist.length+"";return{c(){e=d("div"),n=s(a),r=s(" steps"),g(e,"class","left col s12 fs marg center-align svelte-cghug5")},m(t,a){c(t,e,a),u(e,n),u(e,r)},p(t,e){t.curr&&a!==(a=e.curr.hist.length+"")&&v(n,a)},d(t){t&&i(e)}}}function C(t){var e,n,a,o,l=t.data.ADD+"";return{c(){e=d("button"),n=s("add "),a=s(l),g(e,"class","br svelte-cghug5"),e.disabled=t.done,o=[m(e,"mousemove",t.mousemove_handler),m(e,"click",t.click_handler)]},m(t,r){c(t,e,r),u(e,n),u(e,a)},p(t,n){t.data&&l!==(l=n.data.ADD+"")&&v(a,l),t.done&&(e.disabled=n.done)},d(t){t&&i(e),r(o)}}}function G(t){var e,n,a,o,l=t.data.SUB+"";return{c(){e=d("button"),n=s("sub "),a=s(l),g(e,"class","br svelte-cghug5"),e.disabled=t.done,o=[m(e,"mousemove",t.mousemove_handler_1),m(e,"click",t.click_handler_1)]},m(t,r){c(t,e,r),u(e,n),u(e,a)},p(t,n){t.data&&l!==(l=n.data.SUB+"")&&v(a,l),t.done&&(e.disabled=n.done)},d(t){t&&i(e),r(o)}}}function W(t){var e,n,a,o,l=t.data.MUL+"";return{c(){e=d("button"),n=s("mul "),a=s(l),g(e,"class","br svelte-cghug5"),e.disabled=t.done,o=[m(e,"mousemove",t.mousemove_handler_2),m(e,"click",t.click_handler_2)]},m(t,r){c(t,e,r),u(e,n),u(e,a)},p(t,n){t.data&&l!==(l=n.data.MUL+"")&&v(a,l),t.done&&(e.disabled=n.done)},d(t){t&&i(e),r(o)}}}function J(t){var e,n,a,o,l,f=t.data.DIV+"";return{c(){e=d("button"),n=s("div "),a=s(f),g(e,"class","br svelte-cghug5"),e.disabled=o=t.done||t.curr.a%t.data.DIV!=0,l=[m(e,"mousemove",t.mousemove_handler_3),m(e,"click",t.click_handler_3)]},m(t,r){c(t,e,r),u(e,n),u(e,a)},p(t,n){t.data&&f!==(f=n.data.DIV+"")&&v(a,f),(t.done||t.curr||t.data)&&o!==(o=n.done||n.curr.a%n.data.DIV!=0)&&(e.disabled=o)},d(t){t&&i(e),r(l)}}}function Q(e){var n;function r(t,e){return e.done?X:T}var a=r(0,e),o=a(e);return{c(){n=d("div"),o.c(),g(n,"class","row")},m(t,e){c(t,n,e),o.m(n,null)},p(t,e){a===(a=r(0,e))&&o?o.p(t,e):(o.d(1),(o=a(e))&&(o.c(),o.m(n,null)))},i:t,o:t,d(t){t&&i(n),o.d()}}}function Y(t,e,n){let{data:r,curr:a}=e;let o;return t.$set=(t=>{"data"in t&&n("data",r=t.data),"curr"in t&&n("curr",a=t.curr)}),t.$$.update=((t={curr:1})=>{t.curr&&n("done",o=a.a==a.b)}),{data:r,curr:a,done:o,mousemove_handler:t=>r.mm("add"),click_handler:()=>r.op(a.a+r.ADD),mousemove_handler_1:t=>r.mm("sub"),click_handler_1:()=>r.op(a.a-r.SUB),mousemove_handler_2:t=>r.mm("mul"),click_handler_2:()=>r.op(a.a*r.MUL),mousemove_handler_3:t=>r.mm("div"),click_handler_3:()=>r.op(a.a/r.DIV),mousemove_handler_4:t=>r.mm("undo")}}class Z extends q{constructor(t){super(),B(this,t,Y,Q,o,["data","curr"])}}function tt(e){var n,a,o,l,p,h,b,y,_,$,x,w,j,k,D=e.data.score+"",M=e.data.undos+"",S=e.data.optimum+"",A=(e.data.stopp-e.data.start)/1e3+"";return{c(){n=d("div"),a=d("div"),o=s(D),l=f(),p=d("div"),h=s(M),b=s(" undos"),y=f(),_=d("div"),$=s(S),x=f(),w=d("div"),j=s(A),g(a,"class","left col s6 fs marg green yellow-text left-align svelte-1uqam3d"),g(p,"class","left col s6 fs marg green right-align svelte-1uqam3d"),g(_,"class","left col s6 fs marg green left-align svelte-1uqam3d"),g(w,"class","left col s6 fs marg green right-align svelte-1uqam3d"),g(n,"class","row s12"),k=[m(a,"mousemove",e.mousemove_handler),m(p,"mousemove",e.mousemove_handler_1),m(_,"mousemove",e.mousemove_handler_2),m(w,"mousemove",e.mousemove_handler_3)]},m(t,e){c(t,n,e),u(n,a),u(a,o),u(n,l),u(n,p),u(p,h),u(p,b),u(n,y),u(n,_),u(_,$),u(n,x),u(n,w),u(w,j)},p(t,e){t.data&&D!==(D=e.data.score+"")&&v(o,D),t.data&&M!==(M=e.data.undos+"")&&v(h,M),t.data&&S!==(S=e.data.optimum+"")&&v($,S),t.data&&A!==(A=(e.data.stopp-e.data.start)/1e3+"")&&v(j,A)},i:t,o:t,d(t){t&&i(n),r(k)}}}function et(t,e,n){let{data:r}=e;return t.$set=(t=>{"data"in t&&n("data",r=t.data)}),{data:r,mousemove_handler:()=>r.mm("score"),mousemove_handler_1:()=>r.mm("undos"),mousemove_handler_2:()=>r.mm("optimum"),mousemove_handler_3:()=>r.mm("time")}}class nt extends q{constructor(t){super(),B(this,t,et,tt,o,["data"])}}var rt=1/0,at=9007199254740991,ot=1.7976931348623157e308,ut=NaN,ct="[object Function]",it="[object GeneratorFunction]",dt="[object Symbol]",lt=/^\s+|\s+$/g,st=/^[-+]0x[0-9a-f]+$/i,ft=/^0b[01]+$/i,mt=/^0o[0-7]+$/i,gt=/^(?:0|[1-9]\d*)$/,vt=parseInt,pt=Object.prototype.toString,ht=Math.ceil,bt=Math.max;function yt(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function _t(t){return t?(t=function(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&pt.call(t)==dt}(t))return ut;if(yt(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=yt(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(lt,"");var n=ft.test(t);return n||mt.test(t)?vt(t.slice(2),n?2:8):st.test(t)?ut:+t}(t))===rt||t===-rt?(t<0?-1:1)*ot:t==t?t:0:0===t?t:0}var $t,xt=function(t,e,n){return n&&"number"!=typeof n&&function(t,e,n){if(!yt(n))return!1;var r=typeof e;return!!("number"==r?function(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=at}(t.length)&&!function(t){var e=yt(t)?pt.call(t):"";return e==ct||e==it}(t)}(n)&&function(t,e){return!!(e=null==e?at:e)&&("number"==typeof t||gt.test(t))&&t>-1&&t%1==0&&t<e}(e,n.length):"string"==r&&e in n)&&function(t,e){return t===e||t!=t&&e!=e}(n[e],t)}(t,e,n)&&(e=n=void 0),t=_t(t),void 0===e?(e=t,t=0):e=_t(e),function(t,e,n,r){for(var a=-1,o=bt(ht((e-t)/(n||1)),0),u=Array(o);o--;)u[r?o:++a]=t,t+=n;return u}(t,e,n=void 0===n?t<e?1:-1:_t(n),$t)};function wt(t,e,n){const r=Object.create(t);return r.i=e[n],r}function jt(t){var e,n,a,o;function u(...e){return t.mousemove_handler(t,...e)}function d(){return t.click_handler(t)}return{c(){g(e=l("circle"),"cx",n=100/t.data.N*(t.i-t.data.N/2+.5)),g(e,"cy","0"),g(e,"r","1.5"),g(e,"fill",a=t.i==t.index?"white":t.data.cand[t.i].a==t.data.cand[t.i].b?"green":"black"),o=[m(e,"mousemove",u),m(e,"click",d)]},m(t,n){c(t,e,n)},p(r,o){t=o,r.data&&n!==(n=100/t.data.N*(t.i-t.data.N/2+.5))&&g(e,"cx",n),(r.data||r.index)&&a!==(a=t.i==t.index?"white":t.data.cand[t.i].a==t.data.cand[t.i].b?"green":"black")&&g(e,"fill",a)},d(t){t&&i(e),r(o)}}}function kt(e){var n;let r=xt(e.data.N),a=[];for(let t=0;t<r.length;t+=1)a[t]=jt(wt(e,r,t));return{c(){n=l("svg");for(let t=0;t<a.length;t+=1)a[t].c();g(n,"viewBox","-50 -2 100 4"),p(n,"width","100%"),p(n,"height","100%")},m(t,e){c(t,n,e);for(let t=0;t<a.length;t+=1)a[t].m(n,null)},p(t,e){if(t.data||t.range||t.index){let o;for(r=xt(e.data.N),o=0;o<r.length;o+=1){const u=wt(e,r,o);a[o]?a[o].p(t,u):(a[o]=jt(u),a[o].c(),a[o].m(n,null))}for(;o<a.length;o+=1)a[o].d(1);a.length=r.length}},i:t,o:t,d(t){t&&i(n),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(a,t)}}}function Dt(t,e,n){let{data:r,index:a}=e;return t.$set=(t=>{"data"in t&&n("data",r=t.data),"index"in t&&n("index",a=t.index)}),{data:r,index:a,mousemove_handler:({i:t},e)=>r.mm("circle",t),click_handler:({i:t})=>r.click(t)}}class Mt extends q{constructor(t){super(),B(this,t,Dt,kt,o,["data","index"])}}function St(t){var e,n,r,a,o,l,s,m,v,p,h,b,y,$;function x(e){t.navigation_data_binding.call(null,e),n=!0,D(()=>n=!1)}function w(e){t.navigation_curr_binding.call(null,e),r=!0,D(()=>r=!1)}function j(e){t.navigation_index_binding.call(null,e),a=!0,D(()=>a=!1)}let k={};void 0!==t.data&&(k.data=t.data),void 0!==t.curr&&(k.curr=t.curr),void 0!==t.index&&(k.index=t.index);var M=new H({props:k});function S(e){t.commands_data_binding.call(null,e),l=!0,D(()=>l=!1)}function A(e){t.commands_curr_binding.call(null,e),s=!0,D(()=>s=!1)}_.push(()=>E(M,"data",x)),_.push(()=>E(M,"curr",w)),_.push(()=>E(M,"index",j));let O={};void 0!==t.data&&(O.data=t.data),void 0!==t.curr&&(O.curr=t.curr);var I=new Z({props:O});function V(e){t.statistics_data_binding.call(null,e),v=!0,D(()=>v=!1)}_.push(()=>E(I,"data",S)),_.push(()=>E(I,"curr",A));let B={};void 0!==t.data&&(B.data=t.data);var q=new nt({props:B});function P(e){t.indicator_data_binding.call(null,e),h=!0,D(()=>h=!1)}function z(e){t.indicator_index_binding.call(null,e),b=!0,D(()=>b=!1)}_.push(()=>E(q,"data",V));let K={};void 0!==t.data&&(K.data=t.data),void 0!==t.index&&(K.index=t.index);var R=new Mt({props:K});return _.push(()=>E(R,"data",P)),_.push(()=>E(R,"index",z)),{c(){e=d("div"),M.$$.fragment.c(),o=f(),I.$$.fragment.c(),m=f(),q.$$.fragment.c(),p=f(),R.$$.fragment.c(),g(e,"class",y="w row s12 br fs marg "+t.bgcolor+" lighten-1 black-text center-align svelte-1xgzk34")},m(t,n){c(t,e,n),L(M,e,null),u(e,o),L(I,e,null),u(e,m),L(q,e,null),u(e,p),L(R,e,null),$=!0},p(t,o){var u={};!n&&t.data&&(u.data=o.data),!r&&t.curr&&(u.curr=o.curr),!a&&t.index&&(u.index=o.index),M.$set(u);var c={};!l&&t.data&&(c.data=o.data),!s&&t.curr&&(c.curr=o.curr),I.$set(c);var i={};!v&&t.data&&(i.data=o.data),q.$set(i);var d={};!h&&t.data&&(d.data=o.data),!b&&t.index&&(d.index=o.index),R.$set(d),$&&!t.bgcolor||y===(y="w row s12 br fs marg "+o.bgcolor+" lighten-1 black-text center-align svelte-1xgzk34")||g(e,"class",y)},i(t){$||(N(M.$$.fragment,t),N(I.$$.fragment,t),N(q.$$.fragment,t),N(R.$$.fragment,t),$=!0)},o(t){U(M.$$.fragment,t),U(I.$$.fragment,t),U(q.$$.fragment,t),U(R.$$.fragment,t),$=!1},d(t){t&&i(e),F(M),F(I),F(q),F(R)}}}function At(t,e,n){let r,{data:a,curr:o,index:u}=e;return t.$set=(t=>{"data"in t&&n("data",a=t.data),"curr"in t&&n("curr",o=t.curr),"index"in t&&n("index",u=t.index)}),t.$$.update=((t={curr:1})=>{t.curr&&n("bgcolor",r=o.a==o.b?"green":"grey")}),{data:a,curr:o,index:u,bgcolor:r,navigation_data_binding:function(t){n("data",a=t)},navigation_curr_binding:function(t){n("curr",o=t)},navigation_index_binding:function(t){n("index",u=t)},commands_data_binding:function(t){n("data",a=t)},commands_curr_binding:function(t){n("curr",o=t)},statistics_data_binding:function(t){n("data",a=t)},indicator_data_binding:function(t){n("data",a=t)},indicator_index_binding:function(t){n("index",u=t)}}}class Ot extends q{constructor(t){super(),B(this,t,At,St,o,["data","curr","index"])}}var Nt=1/0,Ut=9007199254740991,It=1.7976931348623157e308,Et=NaN,Lt="[object Function]",Ft="[object GeneratorFunction]",Vt="[object Symbol]",Bt=/^\s+|\s+$/g,qt=/^[-+]0x[0-9a-f]+$/i,Pt=/^0b[01]+$/i,zt=/^0o[0-7]+$/i,Kt=/^(?:0|[1-9]\d*)$/,Rt=parseFloat,Ht=parseInt,Tt=Object.prototype.toString,Xt=Math.floor,Ct=Math.min,Gt=Math.random;function Wt(t,e,n){if(!Jt(n))return!1;var r=typeof e;return!!("number"==r?function(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=Ut}(t.length)&&!function(t){var e=Jt(t)?Tt.call(t):"";return e==Lt||e==Ft}(t)}(n)&&function(t,e){return!!(e=null==e?Ut:e)&&("number"==typeof t||Kt.test(t))&&t>-1&&t%1==0&&t<e}(e,n.length):"string"==r&&e in n)&&function(t,e){return t===e||t!=t&&e!=e}(n[e],t)}function Jt(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function Qt(t){return t?(t=function(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&Tt.call(t)==Vt}(t))return Et;if(Jt(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=Jt(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(Bt,"");var n=Pt.test(t);return n||zt.test(t)?Ht(t.slice(2),n?2:8):qt.test(t)?Et:+t}(t))===Nt||t===-Nt?(t<0?-1:1)*It:t==t?t:0:0===t?t:0}var Yt=function(t,e,n){if(n&&"boolean"!=typeof n&&Wt(t,e,n)&&(e=n=void 0),void 0===n&&("boolean"==typeof e?(n=e,e=void 0):"boolean"==typeof t&&(n=t,t=void 0)),void 0===t&&void 0===e?(t=0,e=1):(t=Qt(t),void 0===e?(e=t,t=0):e=Qt(e)),t>e){var r=t;t=e,e=r}if(n||t%1||e%1){var a=Gt();return Ct(t+a*(e-t+Rt("1e-"+((a+"").length-1))),e)}return function(t,e){return t+Xt(Gt()*(e-t+1))}(t,e)},Zt=9007199254740991,te="[object Arguments]",ee="[object Function]",ne="[object GeneratorFunction]",re=/^(?:0|[1-9]\d*)$/;function ae(t,e){return function(t,e){for(var n=-1,r=t?t.length:0,a=Array(r);++n<r;)a[n]=e(t[n],n,t);return a}(e,function(e){return t[e]})}var oe,ue,ce=Object.prototype,ie=ce.hasOwnProperty,de=ce.toString,le=ce.propertyIsEnumerable,se=Math.floor,fe=(oe=Object.keys,ue=Object,function(t){return oe(ue(t))}),me=Math.random;function ge(t,e){var n=he(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&be(t)}(t)&&ie.call(t,"callee")&&(!le.call(t,"callee")||de.call(t)==te)}(t)?function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}(t.length,String):[],r=n.length,a=!!r;for(var o in t)!e&&!ie.call(t,o)||a&&("length"==o||pe(o,r))||n.push(o);return n}function ve(t){if(n=(e=t)&&e.constructor,r="function"==typeof n&&n.prototype||ce,e!==r)return fe(t);var e,n,r,a=[];for(var o in Object(t))ie.call(t,o)&&"constructor"!=o&&a.push(o);return a}function pe(t,e){return!!(e=null==e?Zt:e)&&("number"==typeof t||re.test(t))&&t>-1&&t%1==0&&t<e}var he=Array.isArray;function be(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=Zt}(t.length)&&!function(t){var e=function(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}(t)?de.call(t):"";return e==ee||e==ne}(t)}var ye=function(t){var e,n,r,a=be(t)?t:(e=t)?ae(e,function(t){return be(t)?ge(t):ve(t)}(e)):[],o=a.length;return o>0?a[(n=0,r=o-1,n+se(me()*(r-n+1)))]:void 0},_e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},$e=1/0,xe=9007199254740991,we=1.7976931348623157e308,je=NaN,ke=4294967295,De="[object Arguments]",Me="[object Function]",Se="[object GeneratorFunction]",Ae="[object Map]",Oe="[object Set]",Ne="[object String]",Ue="[object Symbol]",Ie=/^\s+|\s+$/g,Ee=/^[-+]0x[0-9a-f]+$/i,Le=/^0b[01]+$/i,Fe=/^\[object .+?Constructor\]$/,Ve=/^0o[0-7]+$/i,Be=/^(?:0|[1-9]\d*)$/,qe="[\\ud800-\\udfff]",Pe="[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]",ze="\\ud83c[\\udffb-\\udfff]",Ke="[^\\ud800-\\udfff]",Re="(?:\\ud83c[\\udde6-\\uddff]){2}",He="[\\ud800-\\udbff][\\udc00-\\udfff]",Te="(?:"+Pe+"|"+ze+")"+"?",Xe="[\\ufe0e\\ufe0f]?"+Te+("(?:\\u200d(?:"+[Ke,Re,He].join("|")+")[\\ufe0e\\ufe0f]?"+Te+")*"),Ce="(?:"+[Ke+Pe+"?",Pe,Re,He,qe].join("|")+")",Ge=RegExp(ze+"(?="+ze+")|"+Ce+Xe,"g"),We=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0\\ufe0e\\ufe0f]"),Je=parseInt,Qe="object"==typeof _e&&_e&&_e.Object===Object&&_e,Ye="object"==typeof self&&self&&self.Object===Object&&self,Ze=Qe||Ye||Function("return this")();function tn(t,e){return function(t,e){for(var n=-1,r=t?t.length:0,a=Array(r);++n<r;)a[n]=e(t[n],n,t);return a}(e,function(e){return t[e]})}function en(t){var e=-1,n=Array(t.size);return t.forEach(function(t,r){n[++e]=[r,t]}),n}function nn(t){var e=-1,n=Array(t.size);return t.forEach(function(t){n[++e]=t}),n}function rn(t){return function(t){return We.test(t)}(t)?function(t){return t.match(Ge)||[]}(t):function(t){return t.split("")}(t)}var an,on=Function.prototype,un=Object.prototype,cn=Ze["__core-js_shared__"],dn=(an=/[^.]+$/.exec(cn&&cn.keys&&cn.keys.IE_PROTO||""))?"Symbol(src)_1."+an:"",ln=on.toString,sn=un.hasOwnProperty,fn=un.toString,mn=RegExp("^"+ln.call(sn).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),gn=Ze.Symbol,vn=gn?gn.iterator:void 0,pn=un.propertyIsEnumerable,hn=Math.floor,bn=function(t,e){return function(n){return t(e(n))}}(Object.keys,Object),yn=Math.random,_n=En(Ze,"DataView"),$n=En(Ze,"Map"),xn=En(Ze,"Promise"),wn=En(Ze,"Set"),jn=En(Ze,"WeakMap"),kn=Vn(_n),Dn=Vn($n),Mn=Vn(xn),Sn=Vn(wn),An=Vn(jn);function On(t,e){var n=qn(t)||function(t){return function(t){return Rn(t)&&Pn(t)}(t)&&sn.call(t,"callee")&&(!pn.call(t,"callee")||fn.call(t)==De)}(t)?function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}(t.length,String):[],r=n.length,a=!!r;for(var o in t)!e&&!sn.call(t,o)||a&&("length"==o||Fn(o,r))||n.push(o);return n}function Nn(t){return!(!Kn(t)||(e=t,dn&&dn in e))&&(zn(t)||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t)?mn:Fe).test(Vn(t));var e}function Un(t){if(n=(e=t)&&e.constructor,r="function"==typeof n&&n.prototype||un,e!==r)return bn(t);var e,n,r,a=[];for(var o in Object(t))sn.call(t,o)&&"constructor"!=o&&a.push(o);return a}function In(t,e){return t+hn(yn()*(e-t+1))}function En(t,e){var n=function(t,e){return null==t?void 0:t[e]}(t,e);return Nn(n)?n:void 0}var Ln=function(t){return fn.call(t)};function Fn(t,e){return!!(e=null==e?xe:e)&&("number"==typeof t||Be.test(t))&&t>-1&&t%1==0&&t<e}function Vn(t){if(null!=t){try{return ln.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function Bn(t,e,n){var r,a,o,u=-1,c=function(t){if(!t)return[];if(Pn(t))return function(t){return"string"==typeof t||!qn(t)&&Rn(t)&&fn.call(t)==Ne}(t)?rn(t):function(t,e){var n=-1,r=t.length;for(e||(e=Array(r));++n<r;)e[n]=t[n];return e}(t);if(vn&&t[vn])return function(t){for(var e,n=[];!(e=t.next()).done;)n.push(e.value);return n}(t[vn]());var e=Ln(t);return(e==Ae?en:e==Oe?nn:Hn)(t)}(t),i=c.length,d=i-1;for((n?function(t,e,n){if(!Kn(n))return!1;var r=typeof e;return!!("number"==r?Pn(n)&&Fn(e,n.length):"string"==r&&e in n)&&function(t,e){return t===e||t!=t&&e!=e}(n[e],t)}(t,e,n):void 0===e)?e=1:(r=function(t){var e=function(t){if(!t)return 0===t?t:0;if((t=function(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||Rn(t)&&fn.call(t)==Ue}(t))return je;if(Kn(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=Kn(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(Ie,"");var n=Le.test(t);return n||Ve.test(t)?Je(t.slice(2),n?2:8):Ee.test(t)?je:+t}(t))===$e||t===-$e){var e=t<0?-1:1;return e*we}return t==t?t:0}(t),n=e%1;return e==e?n?e-n:e:0}(e),a=0,o=i,r==r&&(void 0!==o&&(r=r<=o?r:o),void 0!==a&&(r=r>=a?r:a)),e=r);++u<e;){var l=In(u,d),s=c[l];c[l]=c[u],c[u]=s}return c.length=e,c}(_n&&"[object DataView]"!=Ln(new _n(new ArrayBuffer(1)))||$n&&Ln(new $n)!=Ae||xn&&"[object Promise]"!=Ln(xn.resolve())||wn&&Ln(new wn)!=Oe||jn&&"[object WeakMap]"!=Ln(new jn))&&(Ln=function(t){var e=fn.call(t),n="[object Object]"==e?t.constructor:void 0,r=n?Vn(n):void 0;if(r)switch(r){case kn:return"[object DataView]";case Dn:return Ae;case Mn:return"[object Promise]";case Sn:return Oe;case An:return"[object WeakMap]"}return e});var qn=Array.isArray;function Pn(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=xe}(t.length)&&!zn(t)}function zn(t){var e=Kn(t)?fn.call(t):"";return e==Me||e==Se}function Kn(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function Rn(t){return!!t&&"object"==typeof t}function Hn(t){return t?tn(t,function(t){return Pn(t)?On(t):Un(t)}(t)):[]}var Tn=function(t){return Bn(t,ke)};const{window:Xn}=I;function Cn(t){var e,n,a,o,l,h,b,y,_=new Ot({props:{data:t.data,index:t.index,curr:t.curr}});return{c(){(e=d("a")).innerHTML="<h1>Shortcut</h1>",n=f(),a=d("div"),_.$$.fragment.c(),o=f(),l=d("div"),h=s(t.message),g(e,"href","https://github.com/ChristerNilsson/svelte-projects/wiki/Shortcut"),g(e,"class","center-align svelte-8kbajt"),g(e,"target","_blank"),p(a,"width","90%"),p(a,"margin","auto"),g(l,"class","w fs center-align svelte-8kbajt"),y=[m(Xn,"keydown",t.handleKeyDown),m(e,"mousemove",t.mousemove_handler)]},m(t,r){c(t,e,r),c(t,n,r),c(t,a,r),L(_,a,null),c(t,o,r),c(t,l,r),u(l,h),b=!0},p(t,e){var n={};t.data&&(n.data=e.data),t.index&&(n.index=e.index),t.curr&&(n.curr=e.curr),_.$set(n),b&&!t.message||v(h,e.message)},i(t){b||(N(_.$$.fragment,t),b=!0)},o(t){U(_.$$.fragment,t),b=!1},d(t){t&&(i(e),i(n),i(a)),F(_),t&&(i(o),i(l)),r(y)}}}function Gn(t,e,n){const r=new URL(window.location.href),a=(t,e)=>parseInt(r.searchParams.get(t)||e);let o={},u=0,c=null;n("data",o.M=a("M",3),o),n("data",o.N=a("N",24),o),n("data",o.MAX=a("MAX",20),o),n("data",o.SHUFFLE=a("SHUFFLE",0),o),n("data",o.ADD=a("ADD",2),o),n("data",o.MUL=a("MUL",2),o),n("data",o.DIV=a("DIV",2),o),n("data",o.SUB=a("SUB",0),o),n("data",o.score=0,o),n("data",o.undos=0,o),n("data",o.start=new Date,o),n("data",o.stopp=new Date,o),n("data",o.optimum=0,o);const i=t=>{let e=Yt(1,o.MAX),r=[e];const a={},u={};a[e.toString()]=0,u[e.toString()]=e;for(const e of xt(t)){const t=[],n=n=>{if(-o.MUL*o.MAX<=n&&n<=o.MUL*o.MAX){const r=n.toString();r in u||(t.push(n),a[r]=e+1,u[r]=n)}};for(const t of r)n(t+o.ADD),n(t-o.SUB),n(t*o.MUL),t%o.DIV==0&&n(t/o.DIV);r=t}if(r.length>0){const t=ye(r),u=t.toString();return n("data",o.optimum+=a[u],o),{a:e,b:t,hist:[],orig:e}}{const t=ye(Object.keys(a));return n("data",o.optimum+=a[t],o),{a:e,b:u[t],hist:[],orig:e}}};let d=[];for(const t of xt(o.M))for(const e of xt(o.N/o.M))d.push(i(t+1));n("data",o.cand=1==o.SHUFFLE?Tn(d):d,o),n("data",o.op=(t=>{c.a!=t&&(c.hist.push(c.a),n("curr",c.a=t,c),n("data",o.score++,o),n("data",o.stopp=new Date,o))}),o),n("data",o.undo=(()=>{n("data",o.score--,o),n("data",o.undos++,o),n("curr",c.a=c.hist.pop(),c)}),o),n("data",o.reset=(()=>{n("data",o.start=new Date,o),n("data",o.stopp=new Date,o),n("data",o.score=0,o),n("data",o.undos=0,o),n("index",u=0);for(const t of o.cand)t.a=t.orig,t.hist=[]}),o),n("data",o.click=(t=>n("index",u=t)),o),n("data",o.incr=(t=>n("index",u+=t)),o);let l="";n("data",o.mm=((t,e="")=>{"info"==t&&n("message",l="click title for info about how to use and customize Shortcut"),"score"==t&&n("message",l="number of steps you have used"),"optimum"==t&&n("message",l="minimum number of steps needed"),"undos"==t&&n("message",l="number of undos. Minimize"),"time"==t&&n("message",l="number of seconds you have used. Minimize"),"left"==t&&n("message",l="make this number equal to the target number"),"right"==t&&n("message",l="this is the target number"),"prev"==t&&n("message",l="goto previous exercise. Key=leftArrow"),"next"==t&&n("message",l="goto next exercise. Key=rightArrow or space"),"add"==t&&n("message",l="add to left number. Key=a"),"mul"==t&&n("message",l="multiply left number. Key=w or m"),"sub"==t&&n("message",l="subtract from left number. Key=s"),"div"==t&&n("message",l="divide left number. Key=d"),"undo"==t&&n("message",l="undo last operation. Key=z"),"circle"==t&&n("message",l="jump to exercise #"+e)}),o);return t.$$.update=((t={data:1,index:1})=>{(t.data||t.index)&&n("curr",c=o.cand[u])}),{data:o,index:u,curr:c,handleKeyDown:t=>{t.preventDefault(),"ArrowLeft"==t.key&&u>0&&n("index",u--,u),"ArrowRight"==t.key&&u<o.N-1&&n("index",u++,u)," "==t.key&&n("index",u=(u+1)%o.N),"Home"==t.key&&n("index",u=0),"End"==t.key&&n("index",u=o.N-1),"a"==t.key&&c.a!=c.b&&o.op(c.a+o.ADD),"s"==t.key&&c.a!=c.b&&o.op(c.a-o.SUB),"m"!=t.key&&"w"!=t.key||c.a==c.b||o.op(c.a*o.MUL),"d"==t.key&&c.a!=c.b&&c.a%o.DIV==0&&o.op(c.a/o.DIV),"z"==t.key&&c.hist.length>0&&o.undo(),"r"==t.key&&o.reset()},message:l,mousemove_handler:()=>o.mm("info")}}return new class extends q{constructor(t){super(),B(this,t,Gn,Cn,o,[])}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
