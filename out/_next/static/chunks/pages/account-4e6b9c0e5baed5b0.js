(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7966],{682:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/account",function(){return n(91290)}])},91290:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return F}});var i=n(34051),s=n.n(i),a=n(85893),r=n(67294),o=n(9008),c=n.n(o),l=n(56974),d=n(35133),u=n(64146),f=n(2593),x=n(27586),p=n(16441),m=n(38197),h=n(31886),g=n(84917),y=n(85518),j=n(56371),v=n(65721),S=n(2959),w=n(76322),N=n(68059),b=n(34464),C=n(48879),E=n(23513),I=n(454),R=n(83306),k=function(e){var t=e.onSearch,n=(0,r.useState)(""),i=n[0],s=n[1];return(0,a.jsx)("form",{style:{display:"flex",alignItems:"center",flexDirection:"column"},onSubmit:function(e){e.preventDefault(),t(i)},children:(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",flexDirection:"row"},children:[(0,a.jsx)("input",{type:"text",placeholder:"search .eth name".toLowerCase(),value:i.toLowerCase(),name:".eth search",id:"eth-search",onChange:function(e){s(e.target.value.toLowerCase())},onInvalid:function(e){e.target.setCustomValidity("Please enter a valid .eth name")},onInput:function(e){e.target.setCustomValidity("")},required:!0,pattern:".*\\.eth$",title:"\u2757 Input must end with '.eth'"}),(0,a.jsx)("button",{className:"button",style:{height:"38px",width:"50px",marginLeft:"15px"},type:"submit","data-tooltip":"Search",children:(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"search"})})]})})},D=n(33630),O=n(72035),L=n(3922),T=n(19745),W=n(24978),P=n(58619);function B(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function _(e,t,n,i,s,a,r){try{var o=e[a](r),c=o.value}catch(l){return void n(l)}o.done?t(c):Promise.resolve(c).then(i,s)}function A(e){return function(){var t=this,n=arguments;return new Promise((function(i,s){var a=e.apply(t,n);function r(e){_(a,i,s,r,o,"next",e)}function o(e){_(a,i,s,r,o,"throw",e)}r(void 0)}))}}function q(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function z(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),i.forEach((function(t){q(e,t,n[t])}))}return e}function M(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var i,s,a=[],r=!0,o=!1;try{for(n=n.call(e);!(r=(i=n.next()).done)&&(a.push(i.value),!t||a.length!==t);r=!0);}catch(c){o=!0,s=c}finally{try{r||null==n.return||n.return()}finally{if(o)throw s}}return a}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return B(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return B(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var F=function(){var e=function(e){var t=document.getElementById(e);t.select(),t.setSelectionRange(0,99999),navigator.clipboard.writeText(t.value).then((function(){})).catch((function(e){console.error("ERROR:",e)}))},t=(0,d.LN)().chain,n=(0,d.mA)(),i=n.address,o=n.isConnected,B=M(r.useState([]),2),_=B[0],q=B[1],F=M(r.useState(!1),2),H=F[0],Z=F[1],K=M(r.useState(!1),2),U=K[0],Y=K[1],V=M(r.useState(!1),2),X=V[0],G=V[1],$=M(r.useState(!1),2),J=$[0],Q=$[1],ee=M(r.useState(""),2),te=ee[0],ne=ee[1],ie=M(r.useState(!1),2),se=ie[0],ae=ie[1],re=M(r.useState(""),2),oe=re[0],ce=re[1],le=M(r.useState(!0),2),de=le[0],ue=le[1],fe=M(r.useState(!1),2),xe=fe[0],pe=fe[1],me=M(r.useState(!1),2),he=me[0],ge=me[1],ye=M(r.useState("OWNER"),2),je=ye[0],ve=ye[1],Se=M(r.useState(""),2),we=Se[0],Ne=Se[1],be=M(r.useState(""),2),Ce=be[0],Ee=be[1],Ie=M(r.useState(""),2),Re=Ie[0],ke=Ie[1],De=M(r.useState(""),2),Oe=De[0],Le=De[1],Te=M(r.useState(""),2),We=Te[0],Pe=Te[1],Be=M(r.useState(""),2),_e=Be[0],Ae=Be[1],qe=M(r.useState("cyan"),2),ze=qe[0],Me=qe[1],Fe=M(r.useState(0),2),He=Fe[0],Ze=Fe[1],Ke=M(r.useState(0),2),Ue=Ke[0],Ye=Ke[1],Ve=M(r.useState(""),2),Xe=Ve[0],Ge=Ve[1],$e=M(r.useState(!1),2),Je=$e[0],Qe=$e[1],et=M(r.useState(!1),2),tt=et[0],nt=et[1],it=M(r.useState(x.VM("0.eth")),2),st=it[0],at=it[1],rt=M(r.useState(0),2),ot=rt[0],ct=rt[1],lt=M(r.useState([]),2),dt=lt[0],ut=lt[1],ft=M(r.useState([]),2),xt=ft[0],pt=ft[1],mt=M(r.useState(!1),2),ht=mt[0],gt=mt[1],yt=M(r.useState(!1),2),jt=yt[0],vt=yt[1],St=M(r.useState(!1),2),wt=St[0],Nt=St[1],bt=M(r.useState("Loading Names"),2),Ct=bt[0],Et=bt[1],It=M(r.useState(""),2),Rt=It[0],kt=It[1],Dt=M(r.useState(""),2),Ot=Dt[0],Lt=Dt[1],Tt=M(r.useState(""),2),Wt=Tt[0],Pt=Tt[1],Bt=M(r.useState(["","",""]),2),_t=Bt[0],At=Bt[1],qt=M(r.useState(!1),2),zt=qt[0],Mt=qt[1],Ft=M(r.useState(""),2),Ht=Ft[0],Zt=Ft[1],Kt=M(r.useState(""),2),Ut=Kt[0],Yt=Kt[1],Vt=M(r.useState({modalData:"",trigger:!1}),2),Xt=Vt[0],Gt=Vt[1],$t=M(r.useState({modalData:void 0,trigger:!1}),2),Jt=$t[0],Qt=$t[1],en=r.useRef(),tn=!t||"mainnet"!==t.name.toLowerCase()&&"ethereum"!==t.name.toLowerCase()?"5":"1",nn=D.bt["1"===tn?1:0],sn=D.K0["1"===tn?1:0],an=(0,d.QW)({onSuccess:function(e,t){var n=(0,j.verifyMessage)(t.message,e);en.current=n}}),rn=an.data,on=an.error,cn=an.isLoading,ln=an.signMessage,dn=(0,d.do)({address:"0x".concat(D.qP[1].addressOrName.slice(2)),abi:D.qP[1].contractInterface,functionName:"ownerOf",args:[we]}),un=dn.data,fn=(dn.isLoading,dn.isError,(0,d.do)({address:"0x".concat(D.qP[0].addressOrName.slice(2)),abi:D.qP[0].contractInterface,functionName:"owner",args:[we]})),xn=fn.data,pn=(fn.isLoading,fn.isError,(0,d.do)({address:"0x".concat(D.qP["1"===tn?7:3].addressOrName.slice(2)),abi:D.qP["1"===tn?7:3].contractInterface,functionName:"ownerOf",args:[Ce]})),mn=pn.data,hn=(pn.isLoading,pn.isError),gn=(0,d.do)({address:"0x".concat(sn.addressOrName.slice(2)),abi:sn.contractInterface,functionName:"getRecordhash",args:[x.VM(Oe)]}).data,yn=(0,d.do)({address:"0x".concat(sn.addressOrName.slice(2)),abi:sn.contractInterface,functionName:"getRecordhash",args:[p.hexZeroPad(i||D.DR,32).toLowerCase()]}).data,jn=(0,d.GG)({address:"0x".concat(sn.addressOrName.slice(2)),abi:sn.contractInterface,functionName:"setOwnerhash",args:[D.vb(Ht)]}),vn=jn.data,Sn=jn.write;jn.isLoading,jn.isSuccess,jn.isError;function wn(){return Nn.apply(this,arguments)}function Nn(){return(Nn=A(s().mark((function e(){var t,n,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={type:"gas"},e.prev=1,e.next=4,fetch("https://sshmatrix.club:3003/gas",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 4:return n=e.sent,e.next=7,n.json();case 7:return i=e.sent,e.abrupt("return",i.response.gas);case 11:return e.prev=11,e.t0=e.catch(1),console.error("Error:","Failed to get gas data from CCIP2 backend"),e.abrupt("return","");case 15:case"end":return e.stop()}}),e,null,[[1,11]])})))).apply(this,arguments)}r.useEffect((function(){D.hc(5);var e=function(){var e=A(s().mark((function e(){var t;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,wn();case 2:t=e.sent,Pe(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),r.useEffect((function(){if(Xt.trigger){var e=_,t=e.findIndex((function(e){return"".concat(e.name,".eth")===Xt.modalData})),n=function(){var n=A(s().mark((function n(){var a,r,o;return s().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!Xt.modalData){n.next=11;break}return n.next=3,D.Ap.getResolver(Xt.modalData);case 3:return a=n.sent,n.next=6,O.c(Xt.modalData,sn,i||D.DR);case 6:return r=n.sent,n.next=9,O.Y(sn,i||D.DR);case 9:o=n.sent,e[t].migrated=(null===a||void 0===a?void 0:a.address)===nn&&r?"1":(null===a||void 0===a?void 0:a.address)===nn&&o?"3/4":(null===a||void 0===a?void 0:a.address)===nn?"1/2":"0";case 11:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();n(),q(e),pt(e),ut(e)}}),[Xt]),r.useEffect((function(){if(Jt.trigger&&!_t[0]&&!_t[1]){var e="eth:"+i,t="eip155:".concat(tn,":").concat(i);ln({message:(n=e,s=t,a=m.keccak256(h.pack(["bytes32","address"],[m.keccak256(h.pack(["string"],[Jt.modalData])),i])),"Requesting Signature For IPNS Key Generation\n\nOrigin: ".concat(n,"\nKey Type: ed25519\nExtradata: ").concat(a,"\nSigned By: ").concat(s))}),nt(!0)}var n,s,a}),[Jt]),r.useEffect((function(){if(!_t[0]&&!_t[1]&&rn){var e=function(){var e=A(s().mark((function e(){var t,n,a;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t="eth:"+i,n="eip155:".concat(tn,":").concat(i),e.next=4,(0,L.X)(t,n,rn,Jt.modalData);case 4:a=e.sent,At([a[0][0],a[1][0],a[0][1]]);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}}),[tt,rn]),r.useEffect((function(){if(_t[0]&&_t[2]&&"ownerhash"===Ut){var e=function(){var e=A(s().mark((function e(){var t,n,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=D.yt([[_t[0],_t[2]],["",""]]),e.next=3,T.Dp(W.UG.hexToBytes(t));case 3:n=e.sent,i=n.toString(),Zt(i);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}}),[_t]),r.useEffect((function(){Ht.startsWith("k5")&&(Sn(),Et("Waiting For Transaction"))}),[Ht]),r.useEffect((function(){var e=i||D.DR;de||ue(!0),!jt&&st&&e===Rt?Et("Loading Names"):(Et("Please be Patient"),kt(D.DR)),jt||st||(kt(D.DR),Et("Loading Names"))}),[i,jt]),r.useEffect((function(){var e=i||D.DR;if(!jt&&0===Ue&&e!==Rt){ue(!0),kt(e);var t=function(){var t=A(s().mark((function t(){var n,a,r,o,c,l,d,f,m,h,g,y,j;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,D.iJ.nft.getNftsForOwner(e);case 2:for(n=t.sent,a=n.ownedNfts,r=[],o=[],c=0,l=[],g=0;g<a.length;g++)D.O.includes(a[g].contract.address)&&a[g].title&&l.push(a[g].title);if(Ye(l.length),0!==l.length){t.next=14;break}pe(!0),t.next=41;break;case 14:return d=new u.CH(sn.addressOrName,sn.contractInterface,D.Ap),t.next=17,d.getRecordhash(p.hexZeroPad(i||D.DR,32).toLowerCase());case 17:f=t.sent,m=!1,h=!1,g=0;case 21:if(!(g<a.length)){t.next=41;break}if(!D.O.includes(a[g].contract.address)||!a[g].title){t.next=37;break}return Ze(c+=1),r.push(a[g].title.split(".eth")[0]),t.next=28,D.Ap.getResolver(a[g].title);case 28:return y=t.sent,o.push({key:c,name:a[g].title.split(".eth")[0],migrated:(null===y||void 0===y?void 0:y.address)===nn?"1/2":"0"}),at(a[g].title),t.next=33,d.getRecordhash(x.VM(a[g].title));case 33:(j=t.sent)&&"0x"!==j&&j===f?m=!1:j&&"0x"!==j&&j!==f&&(m=!0),f&&"0x"!==f&&(h=!0),o[c-1].migrated=m&&"1/2"===o[c-1].migrated?"1":h&&"1/2"===o[c-1].migrated?"3/4":"1/2"===o[c-1].migrated?o[c-1].migrated:"0";case 37:g===a.length-1&&(vt(!0),Ye(0),ct(0),Et("Showing Names"),q(o),pt(o),ue(!1),ge(!0));case 38:g++,t.next=21;break;case 41:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}}),[i,jt,Ue,Rt]),r.useEffect((function(){var e=function(){};return window.addEventListener("beforeunload",e),function(){window.removeEventListener("beforeunload",e)}}),[_]);var bn=function(e){ae(!0),ce(e)};r.useEffect((function(){He>ot&&He>0&&ct(He)}),[He]),r.useEffect((function(){un&&(null===un||void 0===un?void 0:un.toString())!==D.DR?un.toString()===D.O["1"===tn?7:3]?mn&&(null===mn||void 0===mn?void 0:mn.toString())!==D.DR&&ke(mn.toString()):ke(un.toString()):xn&&(null===xn||void 0===xn?void 0:xn.toString())!==D.DR&&(xn.toString()===D.O["1"===tn?7:3]?mn&&(null===mn||void 0===mn?void 0:mn.toString())!==D.DR?ke(mn.toString()):hn&&ke(""):ke(xn.toString())),"OWNER"!==je&&setTimeout((function(){ue(!1),gt(!1)}),2e3)}),[we,Ce,un,je,mn,xn]),r.useEffect((function(){if(Re&&Re===i&&Oe.length>0){gt(!0);var e=[];[].push(Oe.split(".eth")[0]);var t=function(){var t=A(s().mark((function t(){return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:D.Ap.getResolver(Oe).then((function(t){e.push({key:1,name:Oe.split(".eth")[0],migrated:(null===t||void 0===t?void 0:t.address)===nn?"1/2":"0"}),e.length>0&&(null===t||void 0===t?void 0:t.address)?(Ot&&"0x"!==Ot.toString()&&Ot.toString()!==Wt.toString()&&"1/2"===e[0].migrated?e[0].migrated="1":Wt&&"0x"!==Wt.toString()&&"1/2"===e[0].migrated&&(e[0].migrated="3/4"),q(e),ge(!0),setTimeout((function(){ue(!1)}),1e3)):(ge(!1),ne("Name not Registered"),Q(!0),ue(!1))}));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}else Re&&Re!==i&&Oe.length>0&&(ue(!1),ge(!1),ne("You are not Owner"),Q(!0))}),[Re,i,Oe,Ot,Wt]),r.useEffect((function(){gn&&Lt("ipns://".concat(P.K5(gn.toString()).decoded))}),[gn,yn]),r.useEffect((function(){yn&&Pt("ipns://".concat(P.K5(yn.toString()).decoded))}),[yn]),r.useEffect((function(){if(Oe){try{var e=x.VM(Oe),t=f.O$.from(e);Ee(t.toString())}catch(s){}try{var n=m.keccak256(g.Y0(Oe.split(".eth")[0])),i=f.O$.from(n);2==Oe.split(".").length?Ne(i.toString()):Ne(x.VM(Oe))}catch(a){}}}),[Oe]);var Cn=(0,d.BX)({hash:null===vn||void 0===vn?void 0:vn.hash}),En=Cn.isSuccess,In=Cn.isError,Rn=Cn.isLoading;return r.useEffect((function(){En&&Pt("ipns://".concat(Ht))}),[En]),r.useEffect((function(){Rn&&!In&&(ue(!0),Et("Waiting for Confirmation")),!Rn&&In&&(Et("Transaction Failed"),Nt(!0),ue(!1))}),[Rn,In]),r.useEffect((function(){cn&&!on&&(ue(!0),Et("Waiting for Signature")),on&&!cn&&(Et("Signature Failed"),Nt(!0),ue(!1))}),[cn,on]),(0,a.jsxs)("div",{className:"page",style:{maxWidth:"100%",justifyContent:"center",display:"flex",flexDirection:"column",top:"20px"},children:[!y.tq&&(0,a.jsx)("div",{style:{margin:"20px",width:"40%",display:"flex",justifyContent:"flex-start"},children:(0,a.jsx)("img",{className:"avatar",alt:"corner-account",src:"logo.png"})}),(0,a.jsxs)(c(),{children:[(0,a.jsx)("title",{children:"NameSys - Off-chain Records Manager"}),(0,a.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width, user-scalable=no"}),(0,a.jsx)("link",{rel:"shortcut icon",href:"logo.png"}),(0,a.jsx)("link",{rel:"preload",as:"style",href:"https://fonts.googleapis.com/icon?family=Material+Icons"}),(0,a.jsx)("link",{rel:"preload",href:"SF-Mono.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"}),(0,a.jsx)("link",{rel:"preload",href:"Spotnik.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"})]}),(0,a.jsx)("div",{style:{fontFamily:"Rajdhani"}}),(0,a.jsx)("div",{style:{fontFamily:"SF Mono"}}),(0,a.jsx)("div",{style:{fontFamily:"Spotnik"}}),(0,a.jsx)("div",{id:"overlay",className:"overlay",children:(0,a.jsxs)("div",{className:"overlay-content overlay-content-alt",children:[(0,a.jsx)(R.Z,{height:75,width:75}),(0,a.jsx)("div",{style:{marginTop:"20px"},children:(0,a.jsx)("span",{children:"PLEASE WAIT"})})]})}),(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"space-between",width:"100%"},children:[(0,a.jsxs)("div",{style:{display:"flex",flexDirection:y.tq?"column":"row",marginLeft:y.tq?"25px":"9%",marginRight:"auto",marginTop:y.tq?"25px":"-7%"},children:[(0,a.jsx)("div",{style:{marginRight:y.tq?"20px":"40px"},children:(0,a.jsx)("button",{className:"button",onClick:function(){window.location.href="/ccip2-eth-client/",At(["","",""])},"data-tooltip":"Homepage",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:[(y.tq,"Home"),(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"home"})]})})}),(0,a.jsx)("div",{style:{marginLeft:y.tq?"-9px":"-30px"},children:(0,a.jsx)(I.Z,{variable:We})})]}),(0,a.jsxs)("div",{className:"connect-button",style:{marginLeft:"auto",display:"flex",flexDirection:"row",marginTop:y.tq?"25px":"-7%"},children:[(0,a.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),Z(!0),At(["","",""])},style:{marginRight:10,display:"none"},"data-tooltip":"Learn more",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["about",(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"info"})]})}),(0,a.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),G(!0),At(["","",""])},style:{marginRight:10,display:"none"},"data-tooltip":"Terms of Use",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["terms",(0,a.jsx)("span",{children:"\xa0"}),(0,a.jsx)("span",{className:"material-icons",children:"gavel"})]})}),!y.tq&&(0,a.jsx)("div",{children:(0,a.jsx)(l.NL,{label:"connect"})}),y.tq&&(0,a.jsx)("div",{children:(0,a.jsx)(l.NL,{label:"connect"})})]})]})}),(0,a.jsx)("div",{className:"container",style:{maxWidth:"inherit",margin:"50px 0 0 0"},children:(0,a.jsxs)("div",{className:y.tq||Je?"none":"heading-alt",style:{flex:"1 1 auto"},children:[(0,a.jsx)("div",{style:{marginTop:"-120px"},children:(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"center",textAlign:"center",paddingTop:"100px"},children:[!y.tq&&!o&&(0,a.jsxs)("div",{children:[(0,a.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,a.jsx)("h4",{style:{fontSize:"70px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,a.jsx)("h4",{style:{fontSize:26,color:"#eb8634"},children:"Off-chain Records Manager"})]}),!y.tq&&o&&(0,a.jsxs)("div",{style:{marginTop:"0px",marginBottom:"20px"},children:[(0,a.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,a.jsx)("h4",{style:{fontSize:"52px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,a.jsx)("h4",{style:{fontSize:22,color:"#eb8634"},children:"Your Names"})]}),y.tq&&!o&&(0,a.jsxs)("div",{children:[(0,a.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",style:{marginBottom:"7px"}}),(0,a.jsx)("h4",{style:{fontSize:"52px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,a.jsx)("h4",{style:{fontSize:26,color:"#eb8634"},children:"Off-chain Records Manager"})]}),y.tq&&o&&(0,a.jsxs)("div",{style:{marginTop:"-15px",marginBottom:"20px"},children:[(0,a.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",style:{marginBottom:"7px"}}),(0,a.jsx)("h4",{style:{fontSize:"40px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,a.jsx)("h4",{style:{fontSize:18,color:"#eb8634"},children:"Your Names"})]})]})}),(0,a.jsx)("br",{}),(0,a.jsx)("br",{}),!o&&(0,a.jsx)("div",{style:{marginBottom:"0px"},children:(0,a.jsx)("div",{className:"content-slider",children:(0,a.jsx)("div",{className:"slider",children:(0,a.jsx)("div",{className:"mask",children:(0,a.jsx)("ul",{children:D.hh.map((function(e,t){return(0,a.jsx)("li",{className:"anim".concat(t+1),children:(0,a.jsx)("div",{className:"carousal-item",children:(0,a.jsx)("div",{dangerouslySetInnerHTML:{__html:e}})})},t)}))})})})})}),o&&(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row",marginBottom:"50px",marginTop:"-30px"},children:[(0,a.jsx)("button",{onClick:function(){ve("OWNER"),dt.length>0&&q(dt),Ne(""),Ee(""),Le(""),ge(!1),ke(""),dt.length>0?ue(!1):ue(!xe),Q(!1),At(["","",""]),dt?ge(!0):kt(D.DR)},className:"button-header",disabled:"OWNER"===je||de,"data-tooltip":"Show names you own",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["NAMES",(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"manage_accounts"})]})}),(0,a.jsx)("button",{onClick:function(){"SEARCH"===je||ut(xt),q([]),ve("UTILS"),ge(!1),ke(""),ue(!0),Le(""),Q(!1),At(["","",""]),Et("Please Wait")},className:"button-header",disabled:"UTILS"===je||de,"data-tooltip":"NameSys Utility Functions",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["UTILS",(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"supervised_user_circle"})]})}),(0,a.jsx)("button",{onClick:function(){"UTILS"===je||ut(xt),q([]),ve("SEARCH"),ge(!1),ke(""),ue(!0),Le(""),Q(!1),Et("Please Wait")},className:"button-header",disabled:"SEARCH"===je||de,"data-tooltip":"Search for an ENS name",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["SEARCH",(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"search"})]})})]}),de&&o&&(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",marginTop:"50px",marginBottom:"200px"},children:[(0,a.jsx)("div",{style:{paddingBottom:"10px",alignItems:"center",justifyContent:"center",display:"flex"},children:(0,a.jsx)(R.Z,{height:60,width:60})}),(0,a.jsxs)("div",{style:{marginTop:"40px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[(0,a.jsx)("div",{style:{color:"#fc6603",fontWeight:"700"},children:"OWNER"!==je?"".concat(Ct):Xt.modalData?"Please wait":"".concat(Ct)}),(0,a.jsx)("div",{style:{color:"#fc6603",fontWeight:"700",fontFamily:"SF Mono"},children:"OWNER"!==je||Ue<3||Xt.modalData?"":"".concat(ot,"/").concat(Ue)})]})]})}),!de&&"OWNER"===je&&_.length>0&&o&&!xe&&Rt===i&&!jt&&(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",marginTop:"50px",marginBottom:"200px"},children:[(0,a.jsx)("div",{style:{paddingBottom:"10px",alignItems:"center",justifyContent:"center",display:"flex"},children:(0,a.jsx)(R.Z,{height:60,width:60})}),(0,a.jsx)("div",{style:{marginTop:"40px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:(0,a.jsx)("div",{style:{color:"#fc6603",fontWeight:"700"},children:"Please Wait"})})]})}),!de&&"OWNER"===je&&_.length>0&&o&&!xe&&Rt!==i&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"names you own"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){Y(!0),Ae("info"),Me("cyan"),Ge('<span>This list <span style="color: orangered">does not</span> contain <span style="color: orange">Wrapped Names</span> or <span style="color: orange">Subdomains</span>. Please use the <span style="color: cyan">search</span> tab for missing names</span>')},children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),"OWNER"===je&&!de&&he&&(0,a.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,a.jsx)(E.Z,{label:"edit",items:_,onItemClick:bn})})]}),!de&&"SEARCH"===je&&_.length>0&&o&&!xe&&(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:"search result"}),(0,a.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,a.jsx)(E.Z,{label:"edit",items:_,onItemClick:bn})})]}),!de&&"UTILS"===je&&!he&&_&&o&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"NameSys Utilities"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){Y(!0),Ae("info"),Me("cyan"),Ge('<span>NameSys Utility Functions to set <span style="color: cyan">Ownerhash</span> and <span style="color: cyan">Export Keys</span></span>')},children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,a.jsxs)("div",{className:"export-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"30px",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column"},children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"Ownerhash Setter"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){Y(!0),Ae("info"),Me("cyan"),Ge('<span>Sets <span style="color: cyan">Ownerhash</span> For All Names in a Wallet</span>')},"data-tooltip":"Set New Ownerhash",children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,a.jsx)("input",{style:{width:"90%",color:"rgb(255, 255, 255, 0.75)"},type:"text",placeholder:"ipns://",disabled:!0,value:Wt,id:"owner-hash"}),(0,a.jsx)("button",{className:"button",style:{height:"38px",width:"80px",marginTop:"15px",marginLeft:"15px"},type:"submit","data-tooltip":"Set New Ownerhash",onClick:function(){Mt(!0),Yt("ownerhash")},children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row"},children:[(0,a.jsx)("span",{children:"SET"}),(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700",marginLeft:"3px"},children:"settings"})]})})]}),(0,a.jsxs)("div",{className:"hash-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"70px",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column"},children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"Private Key Exporter"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){Y(!0),Ae("info"),Me("cyan"),Ge('<span>Export your <span style="color: cyan">IPNS</span> and/or Records <span style="color: cyan">Signer</span> Keys</span>')},"data-tooltip":"Export Keys",children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,a.jsxs)("div",{style:{width:"90%",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row"},children:[(0,a.jsx)("input",{style:{width:"100%",paddingRight:"32px",fontWeight:"400",textAlign:"left",color:"rgb(255, 255, 255, 0.75)"},type:"text",placeholder:"IPNS Private Key",value:"export"!==Ut?"":_t[0],id:"export-ipns",disabled:!0}),(0,a.jsx)("button",{className:"button-empty",onClick:function(){e("export-ipns"),Me("lime"),At(["",_t[1],_t[2]])},"data-tooltip":"Copy IPNS Key",style:{marginLeft:"-25px",color:ze&&!_t[0]?ze:"cyan"},children:(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"content_copy"})})]}),(0,a.jsxs)("div",{style:{marginTop:"10px",width:"90%",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row"},children:[(0,a.jsx)("input",{style:{width:"100%",paddingRight:"32px",fontWeight:"400",textAlign:"left",color:"rgb(255, 255, 255, 0.75)"},type:"text",placeholder:"CCIP Manager Key",value:"export"!==Ut?"":_t[1],id:"export-ccip",disabled:!0}),(0,a.jsx)("button",{className:"button-empty",onClick:function(){e("export-ccip"),Me("lime"),At([_t[0],"",_t[2]])},"data-tooltip":"Copy Manager Key",style:{marginLeft:"-25px",color:ze&&!_t[1]?ze:"cyan"},children:(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"content_copy"})})]}),(0,a.jsx)("button",{className:"button",style:{height:"38px",width:"115px",marginLeft:"15px",marginTop:"15px"},type:"submit","data-tooltip":"Export Keys",onClick:function(){Mt(!0),Yt("export")},children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row"},children:[(0,a.jsx)("span",{children:"EXPORT"}),(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700",marginLeft:"5px"},children:"file_download"})]})})]})]}),!de&&"SEARCH"===je&&_&&o&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",marginTop:_?"-15px":"0px"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"search names"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){Y(!0),Ae("info"),Me("cyan"),Ge('<span>Search for a name that you <span style="color: cyan">own</span></span>')},children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,a.jsx)("div",{className:"search-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,a.jsx)(k,{onSearch:function(e){q([]),ue(!0),Qe(!0),at(e),Le(e)}})})]}),!de&&xe&&"OWNER"===je&&!J&&(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",fontSize:"22px",color:"#fc6603",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{className:"material-icons miui-smaller",children:"warning"}),(0,a.jsx)("br",{}),"No Names Found"]})}),!ht&&!Re&&Oe&&"OWNER"!==je&&!de&&!J&&(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",fontSize:"22px",color:"#fc6603",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{className:"material-icons miui-smaller",children:"warning"}),(0,a.jsx)("br",{}),"No Names Found"]})}),(0,a.jsxs)("div",{style:{color:"#fc6603",top:"auto",left:"50%",transform:"translateX(-50%)",bottom:10,alignItems:"center",justifyContent:"center",display:"flex",position:"fixed"},children:[(0,a.jsx)("span",{className:"material-icons",children:"folder_open"}),"\xa0",(0,a.jsx)("a",{href:"https://github.com/namesys-eth/ccip2-eth-client",className:"footer-text",target:"_blank",rel:"noreferrer",children:"GitHub"})]}),(0,a.jsxs)("div",{id:"modal",children:[se&&(0,a.jsx)(w.Z,{onClose:function(){return ae(!1)},show:se,_ENS_:oe,chain:tn,handleParentTrigger:function(e){Gt((function(t){return z({},t,{trigger:e})}))},handleParentModalData:function(e){Gt((function(t){return z({},t,{modalData:e})}))}}),(0,a.jsx)(N.Z,{onClose:function(){return Z(!1)},show:H}),(0,a.jsx)(S.Z,{onClose:function(){return G(!1)},show:X}),(0,a.jsx)(C.Z,{onClose:function(){Nt(!1)},color:"red",show:wt&&!de,title:"cancel",children:Ct}),(0,a.jsx)(C.Z,{onClose:function(){Q(!1),Ne(""),Ee(""),Le(""),ke("")},color:"red",show:J&&!Je&&!de,title:"block",children:te}),(0,a.jsx)(C.Z,{onClose:function(){Q(!1),Ne(""),Ee(""),Le(""),ke("")},color:"red",show:J&&Je&&!de,title:"block",children:te}),(0,a.jsx)(b.Z,{handleTrigger:function(e){Qt((function(t){return z({},t,{trigger:e})}))},handleModalData:function(e){Qt((function(t){return z({},t,{modalData:e})}))},onClose:function(){return Mt(!1)},show:zt}),(0,a.jsx)(v.Z,{color:ze,_ENS_:_e,onClose:function(){return Y(!1)},show:U,children:Xe})]})]})})]})}}},function(e){e.O(0,[8543,8041,8764,8109,2132,7429,9774,2888,179],(function(){return t=682,e(e.s=t);var t}));var t=e.O();_N_E=t}]);