var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function r(t){t.forEach(n)}function o(t){return"function"==typeof t}function u(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function i(t,n){t.appendChild(n)}function c(t,n,e){t.insertBefore(n,e||null)}function a(t){t.parentNode.removeChild(t)}function s(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function l(){return f(" ")}function d(t,n,e,r){return t.addEventListener(n,e,r),()=>t.removeEventListener(n,e,r)}function p(t,n,e){null==e?t.removeAttribute(n):t.setAttribute(n,e)}function h(t,n){n=""+n,t.data!==n&&(t.data=n)}let m;function b(t){m=t}const g=[],y=[],v=[],$=[],_=Promise.resolve();let j=!1;function w(t){v.push(t)}function x(t){$.push(t)}function O(){const t=new Set;do{for(;g.length;){const t=g.shift();b(t),k(t.$$)}for(;y.length;)y.pop()();for(let n=0;n<v.length;n+=1){const e=v[n];t.has(e)||(e(),t.add(e))}v.length=0}while(g.length);for(;$.length;)$.pop()();j=!1}function k(t){t.fragment&&(t.update(t.dirty),r(t.before_update),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_update.forEach(w))}const S=new Set;let A;function M(t,n){t&&t.i&&(S.delete(t),t.i(n))}function E(t,n,e,r){if(t&&t.o){if(S.has(t))return;S.add(t),A.c.push(()=>{S.delete(t),r&&(e&&t.d(1),r())}),t.o(n)}}const C="undefined"!=typeof window?window:global;function N(t,n,e){-1!==t.$$.props.indexOf(n)&&(t.$$.bound[n]=e,e(t.$$.ctx[n]))}function F(t,e,u){const{fragment:i,on_mount:c,on_destroy:a,after_update:s}=t.$$;i.m(e,u),w(()=>{const e=c.map(n).filter(o);a?a.push(...e):r(e),t.$$.on_mount=[]}),s.forEach(w)}function P(t,n){t.$$.fragment&&(r(t.$$.on_destroy),t.$$.fragment.d(n),t.$$.on_destroy=t.$$.fragment=null,t.$$.ctx={})}function D(t,n){t.$$.dirty||(g.push(t),j||(j=!0,_.then(O)),t.$$.dirty=e()),t.$$.dirty[n]=!0}function I(n,o,u,i,c,a){const s=m;b(n);const f=o.props||{},l=n.$$={fragment:null,ctx:null,props:a,update:t,not_equal:c,bound:e(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(s?s.$$.context:[]),callbacks:e(),dirty:null};let d=!1;var p;l.ctx=u?u(n,f,(t,e,r=e)=>(l.ctx&&c(l.ctx[t],l.ctx[t]=r)&&(l.bound[t]&&l.bound[t](r),d&&D(n,t)),e)):f,l.update(),d=!0,r(l.before_update),l.fragment=i(l.ctx),o.target&&(o.hydrate?l.fragment.l((p=o.target,Array.from(p.childNodes))):l.fragment.c(),o.intro&&M(n.$$.fragment),F(n,o.target,o.anchor),O()),b(s)}class R{$destroy(){P(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(){}}class T{constructor(t,n){this.re=t,this.im=n}toString(){let t=this.re,n=this.im,e="",r="";0!=t&&(e=t.toString()),n>1&&(r="+"+n.toString()+"i"),n<-1&&(r=n.toString()+"i"),1==n&&(r="+i"),-1==n&&(r="-i");let o=e+r;return"+"==o[0]&&(o=o.slice(1)),""==o&&(o="0"),o}add(){return new T(this.re+1,this.im)}mul(){return new T(2*this.re,2*this.im)}rot(){return new T(-this.im,this.re)}mirror(){return new T(this.im,this.re)}eq(t){return this.re==t.re&&this.im==t.im}}var q={Complex:T}.Complex;function B(t){var n,e,o,u,p,m,b,g,y,v,$,_,j,w,x,O,k,S,A,M,E,C;return{c(){n=s("div"),e=f(t.a),o=l(),u=s("div"),p=f(t.b),m=l(),b=s("button"),g=f("+1"),y=l(),v=s("button"),$=f("*2"),_=l(),j=s("button"),w=f("*i"),x=l(),O=s("button"),k=f("m"),S=l(),A=s("button"),M=f("Undo"),b.disabled=t.done,v.disabled=t.done,j.disabled=t.done,O.disabled=t.done,A.disabled=E=0==t.hist.length,C=[d(b,"click",t.click_handler),d(v,"click",t.click_handler_1),d(j,"click",t.click_handler_2),d(O,"click",t.click_handler_3),d(A,"click",t.undo)]},m(t,r){c(t,n,r),i(n,e),c(t,o,r),c(t,u,r),i(u,p),c(t,m,r),c(t,b,r),i(b,g),c(t,y,r),c(t,v,r),i(v,$),c(t,_,r),c(t,j,r),i(j,w),c(t,x,r),c(t,O,r),i(O,k),c(t,S,r),c(t,A,r),i(A,M)},p(t,n){t.a&&h(e,n.a),t.done&&(b.disabled=n.done,v.disabled=n.done,j.disabled=n.done,O.disabled=n.done),t.hist&&E!==(E=0==n.hist.length)&&(A.disabled=E)},d(t){t&&(a(n),a(o),a(u),a(m),a(b),a(y),a(v),a(_),a(j),a(x),a(O),a(S),a(A)),r(C)}}}function G(t){var n,e,r,o,u,d,p,m,b=t.hist.length+"";return{c(){n=s("div"),e=f(t.origa),r=l(),o=s("div"),u=f(t.origb),d=l(),p=f(b),m=f(" steps")},m(t,a){c(t,n,a),i(n,e),c(t,r,a),c(t,o,a),i(o,u),c(t,d,a),c(t,p,a),c(t,m,a)},p(t,n){t.hist&&b!==(b=n.hist.length+"")&&h(p,b)},d(t){t&&(a(n),a(r),a(o),a(d),a(p),a(m))}}}function V(n){var e,r;function o(t,n){return n.done?G:B}var u=o(0,n),i=u(n);return{c(){e=s("div"),i.c(),p(e,"class",r="w100 fs marg br row left "+n.bgcolor+" lighten-1 black-text center-align svelte-1uepsi7")},m(t,n){c(t,e,n),i.m(e,null)},p(t,n){u===(u=o(0,n))&&i?i.p(t,n):(i.d(1),(i=u(n))&&(i.c(),i.m(e,null))),t.bgcolor&&r!==(r="w100 fs marg br row left "+n.bgcolor+" lighten-1 black-text center-align svelte-1uepsi7")&&p(e,"class",r)},i:t,o:t,d(t){t&&a(e),i.d()}}}function W(t,n,e){let{score:r,undos:o,ready:u,stopp:i,pair:c}=n,a=c.a,s=c.b;const f=a.toString(),l=s.toString();let d=[];const p=t=>{d.push(a),e("hist",d),"+1"==t&&e("a",a=a.add()),"*2"==t&&e("a",a=a.mul()),"*i"==t&&e("a",a=a.rot()),"m"==t&&e("a",a=a.mirror()),e("score",r+=1),a.eq(s)&&e("ready",u+=1),e("stopp",i=new Date)};let h,m;return t.$set=(t=>{"score"in t&&e("score",r=t.score),"undos"in t&&e("undos",o=t.undos),"ready"in t&&e("ready",u=t.ready),"stopp"in t&&e("stopp",i=t.stopp),"pair"in t&&e("pair",c=t.pair)}),t.$$.update=((t={a:1,b:1,done:1})=>{(t.a||t.b)&&e("done",h=a.eq(s)),t.done&&e("bgcolor",m=h?"green":"grey")}),{score:r,undos:o,ready:u,stopp:i,pair:c,a:a,b:s,origa:f,origb:l,hist:d,op:p,undo:()=>{e("score",r-=1),e("undos",o+=1),e("a",a=d.pop()),e("hist",d)},done:h,bgcolor:m,click_handler:()=>p("+1"),click_handler_1:()=>p("*2"),click_handler_2:()=>p("*i"),click_handler_3:()=>p("m")}}class z extends R{constructor(t){super(),I(this,t,W,V,u,["score","undos","ready","stopp","pair"])}}function L(n){var e,r,o,u,d,m,b,g,y,v,$,_,j,w,x,O,k,S,A,M,E=(n.stopp-n.start)/1e3+"";return{c(){e=s("div"),r=s("div"),o=f("Score: "),u=f(n.score),d=l(),m=s("div"),b=f("Optimum: "),g=f(n.optimum),y=l(),v=s("div"),$=f("Ready: "),_=f(n.ready),j=l(),w=s("div"),x=f("Undos: "),O=f(n.undos),k=l(),S=s("div"),A=f("Time: "),M=f(E),p(e,"class","w100 fs marg br row left green center-align svelte-1uepsi7")},m(t,n){c(t,e,n),i(e,r),i(r,o),i(r,u),i(e,d),i(e,m),i(m,b),i(m,g),i(e,y),i(e,v),i(v,$),i(v,_),i(e,j),i(e,w),i(w,x),i(w,O),i(e,k),i(e,S),i(S,A),i(S,M)},p(t,n){t.score&&h(u,n.score),t.optimum&&h(g,n.optimum),t.ready&&h(_,n.ready),t.undos&&h(O,n.undos),(t.stopp||t.start)&&E!==(E=(n.stopp-n.start)/1e3+"")&&h(M,E)},i:t,o:t,d(t){t&&a(e)}}}function U(t,n,e){let{score:r=0,undos:o=0,ready:u=0,start:i=0,stopp:c=0,optimum:a=0}=n;return t.$set=(t=>{"score"in t&&e("score",r=t.score),"undos"in t&&e("undos",o=t.undos),"ready"in t&&e("ready",u=t.ready),"start"in t&&e("start",i=t.start),"stopp"in t&&e("stopp",c=t.stopp),"optimum"in t&&e("optimum",a=t.optimum)}),{score:r,undos:o,ready:u,start:i,stopp:c,optimum:a}}class H extends R{constructor(t){super(),I(this,t,U,L,u,["score","undos","ready","start","stopp","optimum"])}}function J(n){var e,r,o,u,d,h,m,b,g,y,v;return{c(){e=s("div"),(r=s("div")).textContent="p=x+iy info i*i=-1",o=l(),(u=s("div")).textContent="+1 p+1   translate",d=l(),(h=s("div")).textContent="*2 p*2       scale",m=l(),(b=s("div")).textContent="*i p*i      rotate",g=l(),y=s("div"),v=f("m x <=> y  mirror"),p(e,"class","w100 fs marg br ff row left yellow black-text svelte-16hmpv1")},m(t,n){c(t,e,n),i(e,r),i(e,o),i(e,u),i(e,d),i(e,h),i(e,m),i(e,b),i(e,g),i(e,y),i(y,v)},p:t,i:t,o:t,d(t){t&&a(e)}}}class K extends R{constructor(t){super(),I(this,t,null,J,u,[])}}var Q=1/0,X=9007199254740991,Y=1.7976931348623157e308,Z=NaN,tt="[object Function]",nt="[object GeneratorFunction]",et="[object Symbol]",rt=/^\s+|\s+$/g,ot=/^[-+]0x[0-9a-f]+$/i,ut=/^0b[01]+$/i,it=/^0o[0-7]+$/i,ct=/^(?:0|[1-9]\d*)$/,at=parseInt,st=Object.prototype.toString,ft=Math.ceil,lt=Math.max;function dt(t){var n=typeof t;return!!t&&("object"==n||"function"==n)}function pt(t){return t?(t=function(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&st.call(t)==et}(t))return Z;if(dt(t)){var n="function"==typeof t.valueOf?t.valueOf():t;t=dt(n)?n+"":n}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(rt,"");var e=ut.test(t);return e||it.test(t)?at(t.slice(2),e?2:8):ot.test(t)?Z:+t}(t))===Q||t===-Q?(t<0?-1:1)*Y:t==t?t:0:0===t?t:0}var ht,mt=function(t,n,e){return e&&"number"!=typeof e&&function(t,n,e){if(!dt(e))return!1;var r=typeof n;return!!("number"==r?function(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=X}(t.length)&&!function(t){var n=dt(t)?st.call(t):"";return n==tt||n==nt}(t)}(e)&&function(t,n){return!!(n=null==n?X:n)&&("number"==typeof t||ct.test(t))&&t>-1&&t%1==0&&t<n}(n,e.length):"string"==r&&n in e)&&function(t,n){return t===n||t!=t&&n!=n}(e[n],t)}(t,n,e)&&(n=e=void 0),t=pt(t),void 0===n?(n=t,t=0):n=pt(n),function(t,n,e,r){for(var o=-1,u=lt(ft((n-t)/(e||1)),0),i=Array(u);u--;)i[r?u:++o]=t,t+=e;return i}(t,n,e=void 0===e?t<n?1:-1:pt(e),ht)},bt="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},gt=1/0,yt=9007199254740991,vt=1.7976931348623157e308,$t=NaN,_t=4294967295,jt="[object Arguments]",wt="[object Function]",xt="[object GeneratorFunction]",Ot="[object Map]",kt="[object Set]",St="[object String]",At="[object Symbol]",Mt=/^\s+|\s+$/g,Et=/^[-+]0x[0-9a-f]+$/i,Ct=/^0b[01]+$/i,Nt=/^\[object .+?Constructor\]$/,Ft=/^0o[0-7]+$/i,Pt=/^(?:0|[1-9]\d*)$/,Dt="[\\ud800-\\udfff]",It="[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]",Rt="\\ud83c[\\udffb-\\udfff]",Tt="[^\\ud800-\\udfff]",qt="(?:\\ud83c[\\udde6-\\uddff]){2}",Bt="[\\ud800-\\udbff][\\udc00-\\udfff]",Gt="(?:"+It+"|"+Rt+")"+"?",Vt="[\\ufe0e\\ufe0f]?"+Gt+("(?:\\u200d(?:"+[Tt,qt,Bt].join("|")+")[\\ufe0e\\ufe0f]?"+Gt+")*"),Wt="(?:"+[Tt+It+"?",It,qt,Bt,Dt].join("|")+")",zt=RegExp(Rt+"(?="+Rt+")|"+Wt+Vt,"g"),Lt=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0\\ufe0e\\ufe0f]"),Ut=parseInt,Ht="object"==typeof bt&&bt&&bt.Object===Object&&bt,Jt="object"==typeof self&&self&&self.Object===Object&&self,Kt=Ht||Jt||Function("return this")();function Qt(t,n){return function(t,n){for(var e=-1,r=t?t.length:0,o=Array(r);++e<r;)o[e]=n(t[e],e,t);return o}(n,function(n){return t[n]})}function Xt(t){var n=-1,e=Array(t.size);return t.forEach(function(t,r){e[++n]=[r,t]}),e}function Yt(t){var n=-1,e=Array(t.size);return t.forEach(function(t){e[++n]=t}),e}function Zt(t){return function(t){return Lt.test(t)}(t)?function(t){return t.match(zt)||[]}(t):function(t){return t.split("")}(t)}var tn,nn,en,rn=Function.prototype,on=Object.prototype,un=Kt["__core-js_shared__"],cn=(tn=/[^.]+$/.exec(un&&un.keys&&un.keys.IE_PROTO||""))?"Symbol(src)_1."+tn:"",an=rn.toString,sn=on.hasOwnProperty,fn=on.toString,ln=RegExp("^"+an.call(sn).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),dn=Kt.Symbol,pn=dn?dn.iterator:void 0,hn=on.propertyIsEnumerable,mn=Math.floor,bn=(nn=Object.keys,en=Object,function(t){return nn(en(t))}),gn=Math.random,yn=Nn(Kt,"DataView"),vn=Nn(Kt,"Map"),$n=Nn(Kt,"Promise"),_n=Nn(Kt,"Set"),jn=Nn(Kt,"WeakMap"),wn=Dn(yn),xn=Dn(vn),On=Dn($n),kn=Dn(_n),Sn=Dn(jn);function An(t,n){var e=Rn(t)||function(t){return function(t){return Gn(t)&&Tn(t)}(t)&&sn.call(t,"callee")&&(!hn.call(t,"callee")||fn.call(t)==jt)}(t)?function(t,n){for(var e=-1,r=Array(t);++e<t;)r[e]=n(e);return r}(t.length,String):[],r=e.length,o=!!r;for(var u in t)!n&&!sn.call(t,u)||o&&("length"==u||Pn(u,r))||e.push(u);return e}function Mn(t){return!(!Bn(t)||(n=t,cn&&cn in n))&&(qn(t)||function(t){var n=!1;if(null!=t&&"function"!=typeof t.toString)try{n=!!(t+"")}catch(t){}return n}(t)?ln:Nt).test(Dn(t));var n}function En(t){if(e=(n=t)&&n.constructor,r="function"==typeof e&&e.prototype||on,n!==r)return bn(t);var n,e,r,o=[];for(var u in Object(t))sn.call(t,u)&&"constructor"!=u&&o.push(u);return o}function Cn(t,n){return t+mn(gn()*(n-t+1))}function Nn(t,n){var e=function(t,n){return null==t?void 0:t[n]}(t,n);return Mn(e)?e:void 0}var Fn=function(t){return fn.call(t)};function Pn(t,n){return!!(n=null==n?yt:n)&&("number"==typeof t||Pt.test(t))&&t>-1&&t%1==0&&t<n}function Dn(t){if(null!=t){try{return an.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function In(t,n,e){var r,o,u,i=-1,c=function(t){if(!t)return[];if(Tn(t))return function(t){return"string"==typeof t||!Rn(t)&&Gn(t)&&fn.call(t)==St}(t)?Zt(t):function(t,n){var e=-1,r=t.length;for(n||(n=Array(r));++e<r;)n[e]=t[e];return n}(t);if(pn&&t[pn])return function(t){for(var n,e=[];!(n=t.next()).done;)e.push(n.value);return e}(t[pn]());var n=Fn(t);return(n==Ot?Xt:n==kt?Yt:Vn)(t)}(t),a=c.length,s=a-1;for((e?function(t,n,e){if(!Bn(e))return!1;var r=typeof n;return!!("number"==r?Tn(e)&&Pn(n,e.length):"string"==r&&n in e)&&function(t,n){return t===n||t!=t&&n!=n}(e[n],t)}(t,n,e):void 0===n)?n=1:(r=function(t){var n=function(t){if(!t)return 0===t?t:0;if((t=function(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||Gn(t)&&fn.call(t)==At}(t))return $t;if(Bn(t)){var n="function"==typeof t.valueOf?t.valueOf():t;t=Bn(n)?n+"":n}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(Mt,"");var e=Ct.test(t);return e||Ft.test(t)?Ut(t.slice(2),e?2:8):Et.test(t)?$t:+t}(t))===gt||t===-gt){var n=t<0?-1:1;return n*vt}return t==t?t:0}(t),e=n%1;return n==n?e?n-e:n:0}(n),o=0,u=a,r==r&&(void 0!==u&&(r=r<=u?r:u),void 0!==o&&(r=r>=o?r:o)),n=r);++i<n;){var f=Cn(i,s),l=c[f];c[f]=c[i],c[i]=l}return c.length=n,c}(yn&&"[object DataView]"!=Fn(new yn(new ArrayBuffer(1)))||vn&&Fn(new vn)!=Ot||$n&&"[object Promise]"!=Fn($n.resolve())||_n&&Fn(new _n)!=kt||jn&&"[object WeakMap]"!=Fn(new jn))&&(Fn=function(t){var n=fn.call(t),e="[object Object]"==n?t.constructor:void 0,r=e?Dn(e):void 0;if(r)switch(r){case wn:return"[object DataView]";case xn:return Ot;case On:return"[object Promise]";case kn:return kt;case Sn:return"[object WeakMap]"}return n});var Rn=Array.isArray;function Tn(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=yt}(t.length)&&!qn(t)}function qn(t){var n=Bn(t)?fn.call(t):"";return n==wt||n==xt}function Bn(t){var n=typeof t;return!!t&&("object"==n||"function"==n)}function Gn(t){return!!t&&"object"==typeof t}function Vn(t){return t?Qt(t,function(t){return Tn(t)?An(t):En(t)}(t)):[]}var Wn=function(t){return In(t,_t)},zn=9007199254740991,Ln="[object Arguments]",Un="[object Function]",Hn="[object GeneratorFunction]",Jn=/^(?:0|[1-9]\d*)$/;function Kn(t,n){return function(t,n){for(var e=-1,r=t?t.length:0,o=Array(r);++e<r;)o[e]=n(t[e],e,t);return o}(n,function(n){return t[n]})}var Qn=Object.prototype,Xn=Qn.hasOwnProperty,Yn=Qn.toString,Zn=Qn.propertyIsEnumerable,te=Math.floor,ne=function(t,n){return function(e){return t(n(e))}}(Object.keys,Object),ee=Math.random;function re(t,n){var e=ie(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&ce(t)}(t)&&Xn.call(t,"callee")&&(!Zn.call(t,"callee")||Yn.call(t)==Ln)}(t)?function(t,n){for(var e=-1,r=Array(t);++e<t;)r[e]=n(e);return r}(t.length,String):[],r=e.length,o=!!r;for(var u in t)!n&&!Xn.call(t,u)||o&&("length"==u||ue(u,r))||e.push(u);return e}function oe(t){if(e=(n=t)&&n.constructor,r="function"==typeof e&&e.prototype||Qn,n!==r)return ne(t);var n,e,r,o=[];for(var u in Object(t))Xn.call(t,u)&&"constructor"!=u&&o.push(u);return o}function ue(t,n){return!!(n=null==n?zn:n)&&("number"==typeof t||Jn.test(t))&&t>-1&&t%1==0&&t<n}var ie=Array.isArray;function ce(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=zn}(t.length)&&!function(t){var n=function(t){var n=typeof t;return!!t&&("object"==n||"function"==n)}(t)?Yn.call(t):"";return n==Un||n==Hn}(t)}var ae=function(t){var n,e,r,o=ce(t)?t:(n=t)?Kn(n,function(t){return ce(t)?re(t):oe(t)}(n)):[],u=o.length;return u>0?o[(e=0,r=u-1,e+te(ee()*(r-e+1)))]:void 0};const{Object:se}=C;function fe(t,n,e){const r=se.create(t);return r.i=n[e],r}function le(t){var n,e,r,o,u;function i(e){t.shortcut_score_binding.call(null,e),n=!0,x(()=>n=!1)}function c(n){t.shortcut_undos_binding.call(null,n),e=!0,x(()=>e=!1)}function a(n){t.shortcut_ready_binding.call(null,n),r=!0,x(()=>r=!1)}function s(n){t.shortcut_stopp_binding.call(null,n),o=!0,x(()=>o=!1)}let f={pair:t.candidates[t.i]};void 0!==t.score&&(f.score=t.score),void 0!==t.undos&&(f.undos=t.undos),void 0!==t.ready&&(f.ready=t.ready),void 0!==t.stopp&&(f.stopp=t.stopp);var l=new z({props:f});return y.push(()=>N(l,"score",i)),y.push(()=>N(l,"undos",c)),y.push(()=>N(l,"ready",a)),y.push(()=>N(l,"stopp",s)),{c(){l.$$.fragment.c()},m(t,n){F(l,t,n),u=!0},p(t,u){var i={};t.candidates&&(i.pair=u.candidates[u.i]),!n&&t.score&&(i.score=u.score),!e&&t.undos&&(i.undos=u.undos),!r&&t.ready&&(i.ready=u.ready),!o&&t.stopp&&(i.stopp=u.stopp),l.$set(i)},i(t){u||(M(l.$$.fragment,t),u=!0)},o(t){E(l.$$.fragment,t),u=!1},d(t){P(l,t)}}}function de(t){var n,e,o;let u=mt(pe),i=[];for(let n=0;n<u.length;n+=1)i[n]=le(fe(t,u,n));const s=t=>E(i[t],1,1,()=>{i[t]=null});var f=new H({props:{score:t.score,undos:t.undos,ready:t.ready,start:t.start,stopp:t.stopp,optimum:t.optimum}}),d=new K({});return{c(){for(let t=0;t<i.length;t+=1)i[t].c();n=l(),f.$$.fragment.c(),e=l(),d.$$.fragment.c()},m(t,r){for(let n=0;n<i.length;n+=1)i[n].m(t,r);c(t,n,r),F(f,t,r),c(t,e,r),F(d,t,r),o=!0},p(t,e){if(t.candidates||t.range||t.N||t.score||t.undos||t.ready||t.stopp){let o;for(u=mt(pe),o=0;o<u.length;o+=1){const r=fe(e,u,o);i[o]?(i[o].p(t,r),M(i[o],1)):(i[o]=le(r),i[o].c(),M(i[o],1),i[o].m(n.parentNode,n))}for(A={r:0,c:[],p:A},o=u.length;o<i.length;o+=1)s(o);A.r||r(A.c),A=A.p}var o={};t.score&&(o.score=e.score),t.undos&&(o.undos=e.undos),t.ready&&(o.ready=e.ready),t.stopp&&(o.stopp=e.stopp),t.optimum&&(o.optimum=e.optimum),f.$set(o)},i(t){if(!o){for(let t=0;t<u.length;t+=1)M(i[t]);M(f.$$.fragment,t),M(d.$$.fragment,t),o=!0}},o(t){i=i.filter(Boolean);for(let t=0;t<i.length;t+=1)E(i[t]);E(f.$$.fragment,t),E(d.$$.fragment,t),o=!1},d(t){!function(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}(i,t),t&&a(n),P(f,t),t&&a(e),P(d,t)}}}const pe=24,he=3;function me(t,n,e){let r=0,o=0,u=0;const i=new Date;let c=new Date,a=0;const s=(t,n)=>{const e=Math.floor(t+(n-t+1)*Math.random());return-0==e?0:e},f=t=>{const n=s(-5,5),r=s(-5,5),o=new q(n,r);let u=[o];const i={},c={};i[o.toString()]=0,c[o.toString()]=o;for(const n of mt(t)){const t=[],e=e=>{if(Math.abs(e.re)<=10&&Math.abs(e.im)<=10){const r=e.toString();r in c||(t.push(e),i[r]=n+1,c[r]=e)}};for(const t of u)e(t.add()),e(t.mul()),e(t.rot()),e(t.mirror());u=t}if(u.length>0){const t=ae(u),n=t.toString();return e("optimum",a+=i[n]),{a:o,b:t}}{const t=ae(Object.keys(i));return e("optimum",a+=i[t]),{a:o,b:c[t]}}};let l=[];for(const t of mt(he))for(const n of mt(24/he))l.push(f(t+1));return e("candidates",l=Wn(l)),{score:r,undos:o,ready:u,start:i,stopp:c,optimum:a,candidates:l,shortcut_score_binding:function(t){e("score",r=t)},shortcut_undos_binding:function(t){e("undos",o=t)},shortcut_ready_binding:function(t){e("ready",u=t)},shortcut_stopp_binding:function(t){e("stopp",c=t)}}}return new class extends R{constructor(t){super(),I(this,t,me,de,u,[])}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
