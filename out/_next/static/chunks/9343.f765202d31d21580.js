"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9343],{86879:function(e,t,s){s.d(t,{t0:function(){return O},zv:function(){return b},uA:function(){return v},uc:function(){return $},jb:function(){return B},zb:function(){return I},AV:function(){return m},Ic:function(){return Q},Vs:function(){return Y}});Symbol();const n=Symbol();const o=Object.getPrototypeOf,r=new WeakMap,a=e=>e&&(r.has(e)?r.get(e):o(e)===Object.prototype||o(e)===Array.prototype),i=(e,t=!0)=>{r.set(e,t)},l=e=>"object"===typeof e&&null!==e,c=new WeakMap,d=new WeakSet,u=(e=Object.is,t=((e,t)=>new Proxy(e,t)),s=(e=>l(e)&&!d.has(e)&&(Array.isArray(e)||!(Symbol.iterator in e))&&!(e instanceof WeakMap)&&!(e instanceof WeakSet)&&!(e instanceof Error)&&!(e instanceof Number)&&!(e instanceof Date)&&!(e instanceof String)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer)),o=(e=>e.configurable&&e.enumerable&&e.writable),r=(e=>{switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:throw e}}),u=new WeakMap,p=((e,t,s=r)=>{const n=u.get(e);if((null==n?void 0:n[0])===t)return n[1];const o=Array.isArray(e)?[]:Object.create(Object.getPrototypeOf(e));return i(o,!0),u.set(e,[t,o]),Reflect.ownKeys(e).forEach((t=>{if(Object.getOwnPropertyDescriptor(o,t))return;const n=Reflect.get(e,t),r={value:n,enumerable:!0,configurable:!0};if(d.has(n))i(n,!1);else if(n instanceof Promise)delete r.value,r.get=()=>s(n);else if(c.has(n)){const[e,t]=c.get(n);r.value=p(e,t(),s)}Object.defineProperty(o,t,r)})),Object.preventExtensions(o)}),f=new WeakMap,h=[1,1],g=(r=>{if(!l(r))throw new Error("object required");const i=f.get(r);if(i)return i;let u=h[0];const m=new Set,b=(e,t=++h[0])=>{u!==t&&(u=t,m.forEach((s=>s(e,t))))};let y=h[1];const v=e=>(t,s)=>{const n=[...t];n[1]=[e,...n[1]],b(n,s)},w=new Map,I=e=>{var t;const s=w.get(e);s&&(w.delete(e),null==(t=s[1])||t.call(s))},C=Array.isArray(r)?[]:Object.create(Object.getPrototypeOf(r)),O=(t,o,r,i,u)=>{if(t&&(e(o,i)||f.has(i)&&e(o,f.get(i))))return;I(r),l(i)&&(i=(e=>a(e)&&e[n]||null)(i)||i);let p=i;if(i instanceof Promise)i.then((e=>{i.status="fulfilled",i.value=e,b(["resolve",[r],e])})).catch((e=>{i.status="rejected",i.reason=e,b(["reject",[r],e])}));else{!c.has(i)&&s(i)&&(p=g(i));const e=!d.has(p)&&c.get(p);e&&((e,t)=>{if(w.has(e))throw new Error("prop listener already exists");if(m.size){const s=t[3](v(e));w.set(e,[t,s])}else w.set(e,[t])})(r,e)}u(p),b(["set",[r],i,o])},W=t(C,{deleteProperty(e,t){const s=Reflect.get(e,t);I(t);const n=Reflect.deleteProperty(e,t);return n&&b(["delete",[t],s]),n},set(e,t,s,n){const o=Reflect.has(e,t),r=Reflect.get(e,t,n);return O(o,r,t,s,(s=>{Reflect.set(e,t,s,n)})),!0},defineProperty(e,t,s){if(o(s)){const n=Reflect.getOwnPropertyDescriptor(e,t);if(!n||o(n))return O(!!n&&"value"in n,null==n?void 0:n.value,t,s.value,(n=>{Reflect.defineProperty(e,t,{...s,value:n})})),!0}return Reflect.defineProperty(e,t,s)}});f.set(r,W);const E=[C,(e=++h[1])=>(y===e||m.size||(y=e,w.forEach((([t])=>{const s=t[1](e);s>u&&(u=s)}))),u),p,e=>{m.add(e),1===m.size&&w.forEach((([e,t],s)=>{if(t)throw new Error("remove already exists");const n=e[3](v(s));w.set(s,[e,n])}));return()=>{m.delete(e),0===m.size&&w.forEach((([e,t],s)=>{t&&(t(),w.set(s,[e]))}))}}];return c.set(W,E),Reflect.ownKeys(r).forEach((e=>{const t=Object.getOwnPropertyDescriptor(r,e);"value"in t&&(W[e]=r[e],delete t.value,delete t.writable),Object.defineProperty(C,e,t)})),W}))=>[g,c,d,e,t,s,o,r,u,p,f,h],[p]=u();function f(e={}){return p(e)}function h(e,t,s){const n=c.get(e);let o;n||console.warn("Please use proxy object");const r=[],a=n[3];let i=!1;const l=a((e=>{r.push(e),s?t(r.splice(0)):o||(o=Promise.resolve().then((()=>{o=void 0,i&&t(r.splice(0))})))}));return i=!0,()=>{i=!1,l()}}const g=f({history:["ConnectWallet"],view:"ConnectWallet",data:void 0}),m={state:g,subscribe:e=>h(g,(()=>e(g))),push(e,t){e!==g.view&&(g.view=e,t&&(g.data=t),g.history.push(e))},reset(e){g.view=e,g.history=[e]},replace(e){g.history.length>1&&(g.history[g.history.length-1]=e,g.view=e)},goBack(){if(g.history.length>1){g.history.pop();const[e]=g.history.slice(-1);g.view=e}},setData(e){g.data=e}},b={WALLETCONNECT_DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",WCM_VERSION:"WCM_VERSION",RECOMMENDED_WALLET_AMOUNT:9,isMobile:()=>typeof window<"u"&&Boolean(window.matchMedia("(pointer:coarse)").matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)),isAndroid:()=>b.isMobile()&&navigator.userAgent.toLowerCase().includes("android"),isIos(){const e=navigator.userAgent.toLowerCase();return b.isMobile()&&(e.includes("iphone")||e.includes("ipad"))},isHttpUrl:e=>e.startsWith("http://")||e.startsWith("https://"),isArray:e=>Array.isArray(e)&&e.length>0,formatNativeUrl(e,t,s){if(b.isHttpUrl(e))return this.formatUniversalUrl(e,t,s);let n=e;n.includes("://")||(n=e.replaceAll("/","").replaceAll(":",""),n=`${n}://`),n.endsWith("/")||(n=`${n}/`),this.setWalletConnectDeepLink(n,s);return`${n}wc?uri=${encodeURIComponent(t)}`},formatUniversalUrl(e,t,s){if(!b.isHttpUrl(e))return this.formatNativeUrl(e,t,s);let n=e;n.endsWith("/")||(n=`${n}/`),this.setWalletConnectDeepLink(n,s);return`${n}wc?uri=${encodeURIComponent(t)}`},wait:async e=>new Promise((t=>{setTimeout(t,e)})),openHref(e,t){window.open(e,t,"noreferrer noopener")},setWalletConnectDeepLink(e,t){try{localStorage.setItem(b.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:e,name:t}))}catch{console.info("Unable to set WalletConnect deep link")}},setWalletConnectAndroidDeepLink(e){try{const[t]=e.split("?");localStorage.setItem(b.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:t,name:"Android"}))}catch{console.info("Unable to set WalletConnect android deep link")}},removeWalletConnectDeepLink(){try{localStorage.removeItem(b.WALLETCONNECT_DEEPLINK_CHOICE)}catch{console.info("Unable to remove WalletConnect deep link")}},setModalVersionInStorage(){try{typeof localStorage<"u"&&localStorage.setItem(b.WCM_VERSION,"2.6.1")}catch{console.info("Unable to set Web3Modal version in storage")}},getWalletRouterData(){var e;const t=null==(e=m.state.data)?void 0:e.Wallet;if(!t)throw new Error('Missing "Wallet" view data');return t}},y=f({enabled:typeof location<"u"&&(location.hostname.includes("localhost")||location.protocol.includes("https")),userSessionId:"",events:[],connectedWalletId:void 0}),v={state:y,subscribe:e=>h(y.events,(()=>e(function(e,t){const s=c.get(e);s||console.warn("Please use proxy object");const[n,o,r]=s;return r(n,o(),t)}(y.events[y.events.length-1])))),initialize(){y.enabled&&typeof(null==crypto?void 0:crypto.randomUUID)<"u"&&(y.userSessionId=crypto.randomUUID())},setConnectedWalletId(e){y.connectedWalletId=e},click(e){if(y.enabled){const t={type:"CLICK",name:e.name,userSessionId:y.userSessionId,timestamp:Date.now(),data:e};y.events.push(t)}},track(e){if(y.enabled){const t={type:"TRACK",name:e.name,userSessionId:y.userSessionId,timestamp:Date.now(),data:e};y.events.push(t)}},view(e){if(y.enabled){const t={type:"VIEW",name:e.name,userSessionId:y.userSessionId,timestamp:Date.now(),data:e};y.events.push(t)}}},w=f({chains:void 0,walletConnectUri:void 0,isAuth:!1,isCustomDesktop:!1,isCustomMobile:!1,isDataLoaded:!1,isUiLoaded:!1}),I={state:w,subscribe:e=>h(w,(()=>e(w))),setChains(e){w.chains=e},setWalletConnectUri(e){w.walletConnectUri=e},setIsCustomDesktop(e){w.isCustomDesktop=e},setIsCustomMobile(e){w.isCustomMobile=e},setIsDataLoaded(e){w.isDataLoaded=e},setIsUiLoaded(e){w.isUiLoaded=e},setIsAuth(e){w.isAuth=e}},C=f({projectId:"",mobileWallets:void 0,desktopWallets:void 0,walletImages:void 0,chains:void 0,enableAuthMode:!1,enableExplorer:!0,explorerExcludedWalletIds:void 0,explorerRecommendedWalletIds:void 0,termsOfServiceUrl:void 0,privacyPolicyUrl:void 0}),O={state:C,subscribe:e=>h(C,(()=>e(C))),setConfig(e){var t,s;v.initialize(),I.setChains(e.chains),I.setIsAuth(Boolean(e.enableAuthMode)),I.setIsCustomMobile(Boolean(null==(t=e.mobileWallets)?void 0:t.length)),I.setIsCustomDesktop(Boolean(null==(s=e.desktopWallets)?void 0:s.length)),b.setModalVersionInStorage(),Object.assign(C,e)}};var W=Object.defineProperty,E=Object.getOwnPropertySymbols,j=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable,A=(e,t,s)=>t in e?W(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;const k="https://explorer-api.walletconnect.com",M="wcm",U="js-2.6.1";async function P(e,t){const s=((e,t)=>{for(var s in t||(t={}))j.call(t,s)&&A(e,s,t[s]);if(E)for(var s of E(t))L.call(t,s)&&A(e,s,t[s]);return e})({sdkType:M,sdkVersion:U},t),n=new URL(e,k);return n.searchParams.append("projectId",O.state.projectId),Object.entries(s).forEach((([e,t])=>{t&&n.searchParams.append(e,String(t))})),(await fetch(n)).json()}const D={getDesktopListings:async e=>P("/w3m/v1/getDesktopListings",e),getMobileListings:async e=>P("/w3m/v1/getMobileListings",e),getInjectedListings:async e=>P("/w3m/v1/getInjectedListings",e),getAllListings:async e=>P("/w3m/v1/getAllListings",e),getWalletImageUrl:e=>`${k}/w3m/v1/getWalletImage/${e}?projectId=${O.state.projectId}&sdkType=wcm&sdkVersion=js-2.6.1`,getAssetImageUrl:e=>`${k}/w3m/v1/getAssetImage/${e}?projectId=${O.state.projectId}&sdkType=wcm&sdkVersion=js-2.6.1`};var S=Object.defineProperty,N=Object.getOwnPropertySymbols,R=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable,T=(e,t,s)=>t in e?S(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;const _=b.isMobile(),V=f({wallets:{listings:[],total:0,page:1},search:{listings:[],total:0,page:1},recomendedWallets:[]}),$={state:V,async getRecomendedWallets(){const{explorerRecommendedWalletIds:e,explorerExcludedWalletIds:t}=O.state;if("NONE"===e||"ALL"===t&&!e)return V.recomendedWallets;if(b.isArray(e)){const t={recommendedIds:e.join(",")},{listings:s}=await D.getAllListings(t),n=Object.values(s);n.sort(((t,s)=>e.indexOf(t.id)-e.indexOf(s.id))),V.recomendedWallets=n}else{const{chains:e,isAuth:s}=I.state,n=e?.join(","),o=b.isArray(t),r={page:1,sdks:s?"auth_v1":void 0,entries:b.RECOMMENDED_WALLET_AMOUNT,chains:n,version:2,excludedIds:o?t.join(","):void 0},{listings:a}=_?await D.getMobileListings(r):await D.getDesktopListings(r);V.recomendedWallets=Object.values(a)}return V.recomendedWallets},async getWallets(e){const t=((e,t)=>{for(var s in t||(t={}))R.call(t,s)&&T(e,s,t[s]);if(N)for(var s of N(t))x.call(t,s)&&T(e,s,t[s]);return e})({},e),{explorerRecommendedWalletIds:s,explorerExcludedWalletIds:n}=O.state,{recomendedWallets:o}=V;if("ALL"===n)return V.wallets;o.length?t.excludedIds=o.map((e=>e.id)).join(","):b.isArray(s)&&(t.excludedIds=s.join(",")),b.isArray(n)&&(t.excludedIds=[t.excludedIds,n].filter(Boolean).join(",")),I.state.isAuth&&(t.sdks="auth_v1");const{page:r,search:a}=e,{listings:i,total:l}=_?await D.getMobileListings(t):await D.getDesktopListings(t),c=Object.values(i),d=a?"search":"wallets";return V[d]={listings:[...V[d].listings,...c],total:l,page:r??1},{listings:c,total:l}},getWalletImageUrl:e=>D.getWalletImageUrl(e),getAssetImageUrl:e=>D.getAssetImageUrl(e),resetSearch(){V.search={listings:[],total:0,page:1}}},z=f({open:!1}),B={state:z,subscribe:e=>h(z,(()=>e(z))),open:async e=>new Promise((t=>{const{isUiLoaded:s,isDataLoaded:n}=I.state;if(b.removeWalletConnectDeepLink(),I.setWalletConnectUri(e?.uri),I.setChains(e?.chains),m.reset("ConnectWallet"),s&&n)z.open=!0,t();else{const e=setInterval((()=>{const s=I.state;s.isUiLoaded&&s.isDataLoaded&&(clearInterval(e),z.open=!0,t())}),200)}})),close(){z.open=!1}};var H=Object.defineProperty,K=Object.getOwnPropertySymbols,J=Object.prototype.hasOwnProperty,q=Object.prototype.propertyIsEnumerable,F=(e,t,s)=>t in e?H(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;const G=f({themeMode:typeof matchMedia<"u"&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}),Q={state:G,subscribe:e=>h(G,(()=>e(G))),setThemeConfig(e){const{themeMode:t,themeVariables:s}=e;t&&(G.themeMode=t),s&&(G.themeVariables=((e,t)=>{for(var s in t||(t={}))J.call(t,s)&&F(e,s,t[s]);if(K)for(var s of K(t))q.call(t,s)&&F(e,s,t[s]);return e})({},s))}},X=f({open:!1,message:"",variant:"success"}),Y={state:X,subscribe:e=>h(X,(()=>e(X))),openToast(e,t){X.open=!0,X.message=e,X.variant=t},closeToast(){X.open=!1}}},59343:function(e,t,s){s.r(t),s.d(t,{WalletConnectModal:function(){return o}});var n=s(86879);class o{constructor(e){this.openModal=n.jb.open,this.closeModal=n.jb.close,this.subscribeModal=n.jb.subscribe,this.setTheme=n.Ic.setThemeConfig,n.Ic.setThemeConfig(e),n.t0.setConfig(e),this.initUi()}async initUi(){if(typeof window<"u"){await s.e(5670).then(s.bind(s,85670));const e=document.createElement("wcm-modal");document.body.insertAdjacentElement("beforeend",e),n.zb.setIsUiLoaded(!0)}}}}}]);