(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7966],{682:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/account",function(){return n(91290)}])},91290:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return H}});var a=n(34051),s=n.n(a),i=n(85893),o=n(67294),r=n(9008),c=n.n(r),l=n(56974),d=n(35133),u=n(64146),f=n(2593),m=n(27586),h=n(16441),x=n(84243),p=n(38197),g=n(31886),y=n(84917),v=n(85518),j=n(56371),N=n(65721),S=n(2959),w=n(57997),b=n(68059),E=n(34464),R=n(48879),k=n(23513),C=n(454),O=n(83306),T=function(e){var t=e.onSearch,n=(0,o.useState)(""),a=n[0],s=n[1];return(0,i.jsx)("form",{className:"flex-column-sans-justify",onSubmit:function(e){e.preventDefault(),t(a)},children:(0,i.jsxs)("div",{className:"flex-row-sans-justify",children:[(0,i.jsx)("input",{type:"text",placeholder:"search .eth name".toLowerCase(),value:a.toLowerCase(),name:".eth search",id:"eth-search",onChange:function(e){s(e.target.value.toLowerCase())},onInvalid:function(e){e.target.setCustomValidity("Please enter a valid .eth name")},onInput:function(e){e.target.setCustomValidity("")},required:!0,pattern:".*\\.eth$",title:"\u2757 Input must end with '.eth'"}),(0,i.jsx)("button",{className:"button",style:{height:"38px",width:"50px",marginLeft:"15px"},type:"submit","data-tooltip":"Search",disabled:!a.length,children:(0,i.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"search"})})]})})},L=n(26676),W=n(33630),D=n(72035),P=n(3922),B=n(19745),I=n(24978),_=n(58619);function q(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function A(e,t,n,a,s,i,o){try{var r=e[i](o),c=r.value}catch(l){return void n(l)}r.done?t(c):Promise.resolve(c).then(a,s)}function M(e){return function(){var t=this,n=arguments;return new Promise((function(a,s){var i=e.apply(t,n);function o(e){A(i,a,s,o,r,"next",e)}function r(e){A(i,a,s,o,r,"throw",e)}o(void 0)}))}}function z(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function F(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},a=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),a.forEach((function(t){z(e,t,n[t])}))}return e}function Z(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,s,i=[],o=!0,r=!1;try{for(n=n.call(e);!(o=(a=n.next()).done)&&(i.push(a.value),!t||i.length!==t);o=!0);}catch(c){r=!0,s=c}finally{try{o||null==n.return||n.return()}finally{if(r)throw s}}return i}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return q(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return q(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var H=function(){var e=function(e){var t=document.getElementById(e);t.select(),t.setSelectionRange(0,99999),navigator.clipboard.writeText(t.value).then((function(){})).catch((function(e){console.error("ERROR:",e)}))},t=(0,d.LN)().chain,n=(0,d.mA)(),a=n.address,r=n.isConnected,q=n.isDisconnected,A=Z(o.useState([]),2),z=A[0],H=A[1],K=Z(o.useState(!1),2),U=K[0],Y=K[1],V=Z(o.useState(!1),2),G=V[0],X=V[1],$=Z(o.useState(!1),2),J=$[0],Q=$[1],ee=Z(o.useState(!1),2),te=ee[0],ne=ee[1],ae=Z(o.useState(""),2),se=ae[0],ie=ae[1],oe=Z(o.useState(!1),2),re=oe[0],ce=oe[1],le=Z(o.useState(""),2),de=le[0],ue=le[1],fe=Z(o.useState(!0),2),me=fe[0],he=fe[1],xe=Z(o.useState(!1),2),pe=xe[0],ge=xe[1],ye=Z(o.useState(!1),2),ve=ye[0],je=ye[1],Ne=Z(o.useState("OWNER"),2),Se=Ne[0],we=Ne[1],be=Z(o.useState(""),2),Ee=be[0],Re=be[1],ke=Z(o.useState(""),2),Ce=ke[0],Oe=ke[1],Te=Z(o.useState(""),2),Le=Te[0],We=Te[1],De=Z(o.useState(""),2),Pe=De[0],Be=De[1],Ie=Z(o.useState(""),2),_e=Ie[0],qe=Ie[1],Ae=Z(o.useState(""),2),Me=Ae[0],ze=Ae[1],Fe=Z(o.useState("cyan"),2),Ze=Fe[0],He=Fe[1],Ke=Z(o.useState(0),2),Ue=Ke[0],Ye=Ke[1],Ve=Z(o.useState(0),2),Ge=Ve[0],Xe=Ve[1],$e=Z(o.useState(""),2),Je=$e[0],Qe=$e[1],et=Z(o.useState(""),2),tt=et[0],nt=et[1],at=Z(o.useState(!1),2),st=at[0],it=at[1],ot=Z(o.useState(!1),2),rt=ot[0],ct=ot[1],lt=Z(o.useState(!1),2),dt=lt[0],ut=lt[1],ft=Z(o.useState(m.VM("0.eth")),2),mt=ft[0],ht=ft[1],xt=Z(o.useState(0),2),pt=xt[0],gt=xt[1],yt=Z(o.useState([]),2),vt=yt[0],jt=yt[1],Nt=Z(o.useState([]),2),St=Nt[0],wt=Nt[1],bt=Z(o.useState(!1),2),Et=bt[0],Rt=bt[1],kt=Z(o.useState(!1),2),Ct=kt[0],Ot=kt[1],Tt=Z(o.useState(!1),2),Lt=Tt[0],Wt=Tt[1],Dt=Z(o.useState("Loading Names"),2),Pt=Dt[0],Bt=Dt[1],It=Z(o.useState(""),2),_t=It[0],qt=It[1],At=Z(o.useState(""),2),Mt=At[0],zt=At[1],Ft=Z(o.useState(["","",""]),2),Zt=Ft[0],Ht=Ft[1],Kt=Z(o.useState(!1),2),Ut=Kt[0],Yt=Kt[1],Vt=Z(o.useState(""),2),Gt=Vt[0],Xt=Vt[1],$t=Z(o.useState(""),2),Jt=$t[0],Qt=$t[1],en=Z(o.useState(!1),2),tn=en[0],nn=en[1],an=Z(o.useState(!1),2),sn=(an[0],an[1]),on=Z(o.useState({modalData:"",trigger:!1}),2),rn=on[0],cn=on[1],ln=Z(o.useState({modalData:void 0,trigger:!1}),2),dn=ln[0],un=ln[1],fn=Z(o.useState({modalData:void 0,trigger:!1}),2),mn=fn[0],hn=fn[1],xn=o.useRef(),pn=!t||"mainnet"!==t.name.toLowerCase()&&"ethereum"!==t.name.toLowerCase()?"5":"1",gn=W.bt["1"===pn?1:0],yn=W.K0["1"===pn?1:0],vn=(0,d.QW)({onSuccess:function(e,t){var n=(0,j.verifyMessage)(t.message,e);xn.current=n}}),jn=vn.data,Nn=vn.error,Sn=vn.isLoading,wn=vn.signMessage,bn=(0,d.do)({address:"0x".concat(W.qP[1].addressOrName.slice(2)),abi:W.qP[1].contractInterface,functionName:"ownerOf",args:[Ee]}),En=bn.data,Rn=(bn.isLoading,bn.isError,(0,d.do)({address:"0x".concat(W.qP[0].addressOrName.slice(2)),abi:W.qP[0].contractInterface,functionName:"owner",args:[Ee]})),kn=Rn.data,Cn=(Rn.isLoading,Rn.isError,(0,d.do)({address:"0x".concat(W.qP["1"===pn?7:3].addressOrName.slice(2)),abi:W.qP["1"===pn?7:3].contractInterface,functionName:"ownerOf",args:[Ce]})),On=Cn.data,Tn=(Cn.isLoading,Cn.isError),Ln=(0,d.do)({address:"0x".concat(yn.addressOrName.slice(2)),abi:yn.contractInterface,functionName:"getRecordhash",args:[m.VM(Pe)]}).data,Wn=(0,d.do)({address:"0x".concat(yn.addressOrName.slice(2)),abi:yn.contractInterface,functionName:"getRecordhash",args:[h.hexZeroPad(a||W.DR,32).toLowerCase()]}).data,Dn=(0,d.GG)({address:"0x".concat(yn.addressOrName.slice(2)),abi:yn.contractInterface,functionName:"setShortOwnerhash",args:[x.$.encode(["bytes32"],[Gt?"0x".concat(W.vb(Gt).split(W.O4)[1]):W.dR])]}),Pn=Dn.data,Bn=Dn.write,In=Dn.isLoading,_n=Dn.isSuccess,qn=Dn.isError;function An(){return Mn.apply(this,arguments)}function Mn(){return(Mn=M(s().mark((function e(){var t,n,a;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={type:"gas"},e.prev=1,e.next=4,fetch("https://ipfs.namesys.xyz:3003/gas",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 4:return n=e.sent,e.next=7,n.json();case 7:return a=e.sent,e.abrupt("return",a.response.gas);case 11:return e.prev=11,e.t0=e.catch(1),console.error("Error:","Failed to get gas data from CCIP2 backend"),e.abrupt("return","");case 15:case"end":return e.stop()}}),e,null,[[1,11]])})))).apply(this,arguments)}o.useEffect((function(){W.hc(5);var e=function(){var e=M(s().mark((function e(){var t;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,An();case 2:t=e.sent,qe(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),o.useEffect((function(){if(rn.trigger){var e=z,t=e.findIndex((function(e){return"".concat(e.name,".eth")===rn.modalData})),n=function(){var n=M(s().mark((function n(){var i,o,r;return s().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!rn.modalData){n.next=11;break}return n.next=3,W.Ap.getResolver(rn.modalData);case 3:return i=n.sent,n.next=6,D.c(rn.modalData,yn,a||W.DR);case 6:return o=n.sent,n.next=9,D.Y(yn,a||W.DR);case 9:r=n.sent,e[t].migrated=(null===i||void 0===i?void 0:i.address)===gn&&o?"1":(null===i||void 0===i?void 0:i.address)===gn&&r?"3/4":(null===i||void 0===i?void 0:i.address)===gn?"1/2":"0";case 11:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();n(),H(e),wt(e),jt(e)}}),[rn]),o.useEffect((function(){if(dn.trigger&&!Zt[0]&&!Zt[1]){var e="eth:"+a,t="eip155:".concat(pn,":").concat(a);wn({message:(n=e,s=t,i=p.keccak256(g.pack(["bytes32","address"],[p.keccak256(g.pack(["string"],[dn.modalData])),a])),"Requesting Signature For Keypair Generation\n\nOrigin: ".concat(n,"\nKey Type: ed25519\nExtradata: ").concat(i,"\nSigned By: ").concat(s))}),ut(!0)}var n,s,i}),[dn,Zt]),o.useEffect((function(){if(!Zt[0]&&!Zt[1]&&tt){var e=function(){var e=M(s().mark((function e(){var t,n,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t="eth:"+a,n="eip155:".concat(pn,":").concat(a),e.next=4,(0,P.X)(t,n,tt,dn.modalData);case 4:i=e.sent,Ht([i[0][0],i[1][0],i[0][1]]);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}}),[dt,tt]),o.useEffect((function(){if(Zt[0]&&Zt[2]&&"ownerhash"===Jt){var e=function(){var e=M(s().mark((function e(){var t,n,a;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=W.yt([Zt[0],Zt[2]]),e.next=3,B.Dp(I.UG.hexToBytes(t));case 3:n=e.sent,a=n.toString(),Xt(a);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}}),[Zt]),o.useEffect((function(){Gt.startsWith("k5")&&(Bn(),Bt("Waiting For Transaction"))}),[Gt]),o.useEffect((function(){Ct||ve||!mt||"OWNER"!==Se?Ct||ve||mt||Bt("Failed to Fetch"):Bt("Loading Names")}),[a,Ct,ve,Se]),o.useEffect((function(){if(!Ct&&!ve&&0===Ge&&a){he(!0);var e=function(){var e=M(s().mark((function e(){var t,n,i,o,r,c,l,d,f,x,p,g,y;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,W.iJ.nft.getNftsForOwner(a);case 2:for(t=e.sent,n=t.ownedNfts,i=[],o=[],r=0,c=[],g=0;g<n.length;g++)W.O.includes(n[g].contract.address)&&n[g].title&&c.push(n[g].title);if(Xe(c.length),0!==c.length){e.next=14;break}ge(!0),e.next=44;break;case 14:return l=new u.CH(yn.addressOrName,yn.contractInterface,W.Ap),e.next=17,l.getRecordhash(h.hexZeroPad(a||W.DR,32).toLowerCase());case 17:d=e.sent,x=!1,p=!1,g=0;case 22:if(!(g<n.length)){e.next=44;break}if(!W.O.includes(n[g].contract.address)||!n[g].title){e.next=37;break}return Ye(r+=1),i.push(n[g].title.split(".eth")[0]),e.next=29,W.Ap.getResolver(n[g].title);case 29:return y=e.sent,o.push({key:r,name:n[g].title.split(".eth")[0],migrated:(null===y||void 0===y?void 0:y.address)===gn?"1/2":"0"}),ht(n[g].title),e.next=34,l.getRecordhash(m.VM(n[g].title));case 34:(f=e.sent)&&"0x"!==f&&f===d?(x=!1,d&&"0x"!==d&&(p=!0)):f&&"0x"!==f&&f!==d&&(x=!0),o[r-1].migrated=x&&"1/2"===o[r-1].migrated?"1":p&&"1/2"===o[r-1].migrated?"3/4":"1/2"===o[r-1].migrated?o[r-1].migrated:"0";case 37:g===n.length-1&&(Ot(!0),Xe(0),gt(0),Bt("Showing Names"),H(o),wt(o),he(!1),je(!0)),x=!1,p=!1,f=void 0;case 41:g++,e.next=22;break;case 44:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}}),[a,Ct,Ge]),o.useEffect((function(){var e=function(){};return window.addEventListener("beforeunload",e),function(){window.removeEventListener("beforeunload",e)}}),[z]);var zn=function(e){ce(!0),ue(e)};o.useEffect((function(){Ue>pt&&Ue>0&&gt(Ue)}),[Ue]),o.useEffect((function(){En&&(null===En||void 0===En?void 0:En.toString())!==W.DR?En.toString()===W.O["1"===pn?7:3]?On&&(null===On||void 0===On?void 0:On.toString())!==W.DR&&We(On.toString()):We(En.toString()):kn&&(null===kn||void 0===kn?void 0:kn.toString())!==W.DR&&(kn.toString()===W.O["1"===pn?7:3]?On&&(null===On||void 0===On?void 0:On.toString())!==W.DR?We(On.toString()):Tn&&We(""):We(kn.toString())),"OWNER"!==Se&&setTimeout((function(){he(!1),Rt(!1)}),2e3)}),[Ee,Ce,En,Se,On,kn,Tn]),o.useEffect((function(){jn&&nt(jn)}),[jn]),o.useEffect((function(){if(Le&&Le===a&&Pe.length>0){Rt(!0);var e=[];[].push(Pe.split(".eth")[0]);var t=function(){var t=M(s().mark((function t(){return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:W.Ap.getResolver(Pe).then((function(t){e.push({key:1,name:Pe.split(".eth")[0],migrated:(null===t||void 0===t?void 0:t.address)===gn?"1/2":"0"}),e.length>0&&(null===t||void 0===t?void 0:t.address)?(_t&&"0x"!==_t.toString()&&_t.toString()!==Mt.toString()&&"1/2"===e[0].migrated?e[0].migrated="1":Mt&&"0x"!==Mt.toString()&&"1/2"===e[0].migrated&&(e[0].migrated="3/4"),jt(St),H(e),je(!0),setTimeout((function(){he(!1)}),1e3)):(je(!1),ie("Name not Registered"),ne(!0),he(!1))}));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}else Le&&Le!==a&&Pe.length>0&&(he(!1),je(!1),ie("You are not Owner"),ne(!0))}),[Le,a,Pe,_t,Mt,St]),o.useEffect((function(){mn.trigger&&mn.modalData&&(nn(!1),"0"===mn.modalData?Yt(!0):sn(!0))}),[mn]),o.useEffect((function(){Ln&&qt("ipns://".concat(_.K5(Ln.toString()).decoded))}),[Ln,Wn]),o.useEffect((function(){Wn&&zt("ipns://".concat(_.K5(Wn.toString()).decoded))}),[Wn]),o.useEffect((function(){if(Pe){try{var e=m.VM(Pe),t=f.O$.from(e);Oe(t.toString())}catch(s){}try{var n=p.keccak256(y.Y0(Pe.split(".eth")[0])),a=f.O$.from(n);2==Pe.split(".").length?Re(a.toString()):Re(m.VM(Pe))}catch(i){}}}),[Pe]);var Fn=(0,d.BX)({hash:null===Pn||void 0===Pn?void 0:Pn.hash}),Zn=Fn.isSuccess,Hn=Fn.isError,Kn=Fn.isLoading;return o.useEffect((function(){if(Zn&&_n){for(var e=St,t=0;t<St.length;t++)"1/2"===St[t].migrated&&(e[t].migrated="3/4");H(e),wt(e),jt(e),zt("ipns://".concat(Gt)),Bt("Transaction Confirmed"),setTimeout((function(){he(!1)}),2e3)}}),[Zn,_n,St]),o.useEffect((function(){Kn&&!Hn&&(he(!0),Bt("Waiting for Confirmation")),!Kn&&Hn&&(st?st&&it(!1):(Bt("Transaction Failed"),Wt(!0)),he(!1))}),[Kn,Hn]),o.useEffect((function(){In&&!qn?(he(!0),Ot(!1),Bt("Waiting for Transaction"),st&&it(!1)):!In&&qn&&(st?st&&it(!1):(Wt(!0),nt(""),Ht([]),Yt(!1),Xt(""),he(!1),Bt("Transaction Declined By User")),un({modalData:void 0,trigger:!1}))}),[In,qn]),o.useEffect((function(){"UTILS"===Se&&(Sn&&!Nn?(he(!0),Bt("Waiting for Signature"),st&&it(!1)):Nn&&!Sn&&(st?st&&it(!1):(Bt("Signature Failed"),Wt(!0),Ht([]),nt(""),Yt(!1),he(!1),Xt("")),un({modalData:void 0,trigger:!1})))}),[Sn,Nn,Se]),(0,i.jsxs)("div",{className:"page flex-column-sans-align",style:{maxWidth:"100%",top:"20px"},children:[!v.tq&&(0,i.jsx)("div",{style:{margin:"20px",width:"40%",display:"flex",justifyContent:"flex-start"},children:(0,i.jsx)("img",{className:"avatar",alt:"corner-account",src:"logo.png"})}),(0,i.jsxs)(c(),{children:[(0,i.jsx)("title",{children:"NameSys - Off-chain Records Manager"}),(0,i.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width, user-scalable=no"}),(0,i.jsx)("link",{rel:"shortcut icon",href:"logo.png"}),(0,i.jsx)("link",{rel:"preload",as:"style",href:"https://fonts.googleapis.com/icon?family=Material+Icons"}),(0,i.jsx)("link",{rel:"preload",href:"SF-Mono.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"}),(0,i.jsx)("link",{rel:"preload",href:"Spotnik.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"})]}),(0,i.jsx)("div",{style:{fontFamily:"Rajdhani"}}),(0,i.jsx)("div",{style:{fontFamily:"SF Mono"}}),(0,i.jsx)("div",{style:{fontFamily:"Spotnik"}}),(0,i.jsx)("div",{id:"overlay",className:"overlay",children:(0,i.jsxs)("div",{className:"overlay-content overlay-content-alt",children:[(0,i.jsx)(O.Z,{height:75,width:75}),(0,i.jsx)("div",{style:{marginTop:"20px"},children:(0,i.jsx)("span",{children:"PLEASE WAIT"})})]})}),(0,i.jsx)("div",{children:(0,i.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"space-between",width:"100%"},children:[(0,i.jsxs)("div",{style:{display:"flex",flexDirection:v.tq?"column":"row",marginLeft:v.tq?"25px":"9%",marginRight:"auto",marginTop:v.tq?"25px":"-7%"},children:[(0,i.jsx)("div",{style:{marginRight:v.tq?"20px":"40px"},children:(0,i.jsx)("button",{className:"button",onClick:function(){window.location.href="/ccip2-eth-client/",Ht(["","",""])},"data-tooltip":"Homepage",children:(0,i.jsxs)("div",{className:"flex-sans-direction",children:[(v.tq,"Home"),(0,i.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"home"})]})})}),(0,i.jsx)("div",{style:{marginLeft:v.tq?"-9px":"-30px"},children:(0,i.jsx)(C.Z,{variable:_e})})]}),(0,i.jsxs)("div",{className:"connect-button",style:{marginLeft:"auto",display:"flex",flexDirection:"row",marginTop:v.tq?"25px":"-7%"},children:[(0,i.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),Y(!0),Ht(["","",""])},style:{marginRight:10,display:"none"},"data-tooltip":"Learn more",children:(0,i.jsxs)("div",{className:"flex-row",children:["about",(0,i.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"info"})]})}),(0,i.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),Q(!0),Ht(["","",""])},style:{marginRight:10,display:"none"},"data-tooltip":"Terms of Use",children:(0,i.jsxs)("div",{className:"flex-row",children:["terms",(0,i.jsx)("span",{children:"\xa0"}),(0,i.jsx)("span",{className:"material-icons",children:"gavel"})]})}),!v.tq&&(0,i.jsx)("div",{children:(0,i.jsx)(l.NL,{label:"connect"})}),v.tq&&(0,i.jsx)("div",{children:(0,i.jsx)(l.NL,{label:"connect"})})]})]})}),(0,i.jsx)("div",{className:"container",style:{maxWidth:"inherit",margin:"50px 0 0 0"},children:(0,i.jsxs)("div",{className:v.tq||rt?"none":"heading-alt",style:{flex:"1 1 auto"},children:[(0,i.jsx)("div",{style:{marginTop:"-120px"},children:(0,i.jsxs)("div",{className:"flex-column",style:{paddingTop:"100px"},children:[!v.tq&&q&&(0,i.jsxs)("div",{children:[(0,i.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,i.jsx)("h4",{style:{fontSize:"70px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,i.jsx)("h4",{style:{fontSize:26,color:"#eb8634"},children:"Off-chain Records Manager"})]}),!v.tq&&(r||!q)&&(0,i.jsxs)("div",{style:{marginTop:"-35px",marginBottom:"10px"},children:[(0,i.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,i.jsx)("h4",{style:{fontSize:"52px",color:"#fc6603",marginBottom:"20px",marginTop:"30px"},children:"NameSys"})]}),v.tq&&q&&(0,i.jsxs)("div",{className:"flex-column",children:[(0,i.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",style:{marginBottom:"7px"}}),(0,i.jsx)("h4",{style:{fontSize:"52px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,i.jsx)("h4",{style:{fontSize:26,color:"#eb8634"},children:"Off-chain Records Manager"})]}),v.tq&&(r||!q)&&(0,i.jsxs)("div",{className:"flex-column",style:{marginTop:"-30px",marginBottom:v.tq?"10px":"2px"},children:[(0,i.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",style:{marginBottom:"7px"}}),(0,i.jsx)("h4",{style:{fontSize:"40px",color:"#fc6603",marginTop:"10px"},children:"NameSys"})]})]})}),q&&(0,i.jsx)("div",{style:{marginBottom:"0px"},children:(0,i.jsx)("div",{className:"content-slider",children:(0,i.jsx)("div",{className:"slider",children:(0,i.jsx)("div",{className:"mask",children:(0,i.jsx)("ul",{children:W.hh.map((function(e,t){return(0,i.jsx)("li",{className:"anim".concat(t+1),children:(0,i.jsx)("div",{className:"carousal-item",children:(0,i.jsx)("div",{dangerouslySetInnerHTML:{__html:e}})})},t)}))})})})})}),(r||!q)&&(0,i.jsxs)("div",{className:"flex-sans-direction",style:{marginBottom:"50px",marginTop:v.tq?"-35px":"2px"},children:[(0,i.jsx)("button",{onClick:function(){we("OWNER"),vt.length>0?H(vt):console.error("BUG"),Re(""),Oe(""),Be(""),je(!1),We(""),vt.length>0?he(!1):he(!pe),ne(!1),Ht(["","",""]),vt&&je(!0)},className:"button-header",disabled:"OWNER"===Se||me,"data-tooltip":"Show names you own",children:(0,i.jsxs)("div",{className:"flex-sans-direction",children:["NAMES",(0,i.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"manage_accounts"})]})}),(0,i.jsx)("button",{onClick:function(){"SEARCH"===Se||jt(St),H([]),we("UTILS"),je(!1),We(""),he(!0),Be(""),ne(!1),Ht(["","",""]),Bt("Please Wait")},className:"button-header",disabled:"UTILS"===Se||me,"data-tooltip":"NameSys Utility Functions",children:(0,i.jsxs)("div",{className:"flex-sans-direction",children:["UTILS",(0,i.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"supervised_user_circle"})]})}),(0,i.jsx)("button",{onClick:function(){"UTILS"===Se||jt(St),H([]),we("SEARCH"),je(!1),We(""),he(!0),Be(""),ne(!1),Bt("Please Wait")},className:"button-header",disabled:"SEARCH"===Se||me,"data-tooltip":"Search for an ENS name",children:(0,i.jsxs)("div",{className:"flex-sans-direction",children:["SEARCH",(0,i.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"search"})]})})]}),me&&(r||!q)&&(0,i.jsx)("div",{children:(0,i.jsxs)("div",{className:"flex-column",style:{marginTop:"50px",marginBottom:"200px"},children:[(0,i.jsx)("div",{className:"flex-column",style:{paddingBottom:"10px"},children:(0,i.jsx)(O.Z,{height:60,width:60})}),(0,i.jsxs)("div",{className:"flex-column",style:{marginTop:"40px"},children:[(0,i.jsx)("div",{style:{color:"#fc6603",fontWeight:"700"},children:"OWNER"!==Se?"".concat(Pt):rn.modalData?"Please wait":"".concat(Pt)}),(0,i.jsx)("div",{style:{color:"#fc6603",fontWeight:"700",fontFamily:"SF Mono"},children:"OWNER"!==Se||Ge<3||rn.modalData?"":"".concat(pt,"/").concat(Ge)})]})]})}),me&&"OWNER"===Se&&z.length>0&&(r||!q)&&!pe&&!Ct&&(0,i.jsx)("div",{children:(0,i.jsxs)("div",{className:"flex-column",style:{marginTop:"50px",marginBottom:"200px"},children:[(0,i.jsx)("div",{className:"flex-column",style:{paddingBottom:"10px"},children:(0,i.jsx)(O.Z,{height:60,width:60})}),(0,i.jsx)("div",{className:"flex-column",style:{marginTop:"40px"},children:(0,i.jsx)("div",{style:{color:"#fc6603",fontWeight:"700"},children:"Please Wait"})})]})}),!me&&"OWNER"===Se&&z.length>0&&(r||!q)&&!pe&&(0,i.jsxs)("div",{children:[(0,i.jsxs)("div",{className:"flex-sans-direction",style:{fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,i.jsx)("span",{style:{marginRight:"5px"},children:"names you own"}),(0,i.jsx)("button",{className:"button-tiny",onClick:function(){X(!0),ze("info"),He("cyan"),Qe('<span>This list <span style="color: orangered">does not</span> contain <span style="color: orange">Wrapped Names</span> or <span style="color: orange">Subdomains</span>. Please use the <span style="color: cyan">search</span> tab for missing names</span>')},"data-tooltip":"Enlighten me",children:(0,i.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),"OWNER"===Se&&!me&&ve&&(0,i.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,i.jsx)(k.Z,{label:"edit",items:z,onItemClick:zn})})]}),!me&&"SEARCH"===Se&&z.length>0&&(r||!q)&&!pe&&(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{className:"flex-sans-direction",style:{fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:"search result"}),(0,i.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,i.jsx)(k.Z,{label:"edit",items:z,onItemClick:zn})})]}),!me&&"UTILS"===Se&&!ve&&z&&(r||!q)&&(0,i.jsxs)("div",{children:[(0,i.jsxs)("div",{className:"flex-sans-direction",style:{fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,i.jsx)("span",{style:{marginRight:"5px"},children:"NameSys Utilities"}),(0,i.jsx)("button",{className:"button-tiny",onClick:function(){X(!0),ze("info"),He("cyan"),Qe('<span>NameSys Utility Functions to set <span style="color: cyan">Ownerhash</span> and <span style="color: cyan">Export Keys</span></span>')},"data-tooltip":"Enlighten me",children:(0,i.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,i.jsxs)("div",{className:"export-container flex-column",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"30px"},children:[(0,i.jsxs)("div",{className:"flex-sans-direction",style:{fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,i.jsx)("span",{style:{marginRight:"5px"},children:"Ownerhash Setter"}),(0,i.jsx)("button",{className:"button-tiny",onClick:function(){X(!0),ze("info"),He("cyan"),Qe('<span>Sets <span style="color: cyan">Ownerhash</span> For All Names in a Wallet</span>')},"data-tooltip":"Set New Ownerhash",children:(0,i.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,i.jsx)("input",{style:{width:"90%",color:"rgb(255, 255, 255, 0.75)"},type:"text",placeholder:"ipns://",disabled:!0,value:Mt,id:"owner-hash"}),(0,i.jsx)("button",{className:"button",style:{height:"38px",width:"80px",marginTop:"15px",marginLeft:"15px"},type:"submit","data-tooltip":"Set New Ownerhash",onClick:function(){nn(!0),Qt("ownerhash")},children:(0,i.jsxs)("div",{className:"flex-sans-direction",children:[(0,i.jsx)("span",{children:"SET"}),(0,i.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700",marginLeft:"3px"},children:"settings"})]})})]}),(0,i.jsxs)("div",{className:"hash-container flex-column",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"70px"},children:[(0,i.jsxs)("div",{className:"flex-sans-direction",style:{fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,i.jsx)("span",{style:{marginRight:"5px"},children:"Private Key Exporter"}),(0,i.jsx)("button",{className:"button-tiny",onClick:function(){X(!0),ze("info"),He("cyan"),Qe('<span>Export your <span style="color: cyan">IPNS</span> and/or Records <span style="color: cyan">Signer</span> Keys</span>')},"data-tooltip":"Export Keys",children:(0,i.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,i.jsxs)("div",{className:"flex-sans-direction",style:{width:"90%"},children:[(0,i.jsx)("input",{style:{width:"100%",paddingRight:"32px",fontWeight:"400",textAlign:"left",color:"rgb(255, 255, 255, 0.75)"},type:"text",placeholder:"IPNS Private Key",value:"export"!==Jt?"":Zt[0],id:"export-ipns",disabled:!0}),(0,i.jsx)("button",{className:"button-empty",onClick:function(){e("export-ipns"),He("lime"),Ht(["",Zt[1],Zt[2]])},"data-tooltip":"Copy IPNS Key",style:{marginLeft:"-25px",color:Ze&&!Zt[0]?Ze:"cyan"},children:(0,i.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"content_copy"})})]}),(0,i.jsxs)("div",{className:"flex-sans-direction",style:{marginTop:"10px",width:"90%"},children:[(0,i.jsx)("input",{style:{width:"100%",paddingRight:"32px",fontWeight:"400",textAlign:"left",color:"rgb(255, 255, 255, 0.75)"},type:"text",placeholder:"CCIP Manager Key",value:"export"!==Jt?"":Zt[1],id:"export-ccip",disabled:!0}),(0,i.jsx)("button",{className:"button-empty",onClick:function(){e("export-ccip"),He("lime"),Ht([Zt[0],"",Zt[2]])},"data-tooltip":"Copy Manager Key",style:{marginLeft:"-25px",color:Ze&&!Zt[1]?Ze:"cyan"},children:(0,i.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"content_copy"})})]}),(0,i.jsx)("button",{className:"button",style:{height:"38px",width:"115px",marginLeft:"15px",marginTop:"15px"},type:"submit","data-tooltip":"Export Keys",onClick:function(){Yt(!0),Qt("export")},children:(0,i.jsxs)("div",{className:"flex-sans-direction",children:[(0,i.jsx)("span",{children:"EXPORT"}),(0,i.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700",marginLeft:"5px"},children:"file_download"})]})})]})]}),!me&&"SEARCH"===Se&&z&&(r||!q)&&(0,i.jsxs)("div",{children:[(0,i.jsxs)("div",{className:"flex-sans-direction",style:{fontSize:"18px",color:"cyan",marginBottom:"25px",marginTop:z?"-15px":"0px"},children:[(0,i.jsx)("span",{style:{marginRight:"5px"},children:"search names"}),(0,i.jsx)("button",{className:"button-tiny",onClick:function(){X(!0),ze("info"),He("cyan"),Qe('<span>Search for a name that you <span style="color: cyan">own</span></span>')},"data-tooltip":"Enlighten me",children:(0,i.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,i.jsx)("div",{className:"search-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,i.jsx)(T,{onSearch:function(e){H([]),he(!0),ct(!0),ht(e),Be(e)}})})]}),!me&&pe&&"OWNER"===Se&&!te&&(0,i.jsx)("div",{children:(0,i.jsxs)("div",{className:"flex-column",style:{fontSize:"22px",color:"#fc6603",marginBottom:"25px",fontWeight:"700"},children:[(0,i.jsx)("span",{className:"material-icons miui-smaller",children:"warning"}),(0,i.jsx)("br",{}),"No Names Found"]})}),!Et&&!Le&&Pe&&"OWNER"!==Se&&!me&&!te&&(0,i.jsx)("div",{children:(0,i.jsxs)("div",{className:"flex-column",style:{fontSize:"22px",color:"#fc6603",marginBottom:"25px",fontWeight:"700"},children:[(0,i.jsx)("span",{className:"material-icons miui-smaller",children:"warning"}),(0,i.jsx)("br",{}),"No Names Found"]})}),(0,i.jsxs)("div",{className:"flex-sans-direction",style:{color:"#fc6603",top:"auto",left:"50%",transform:"translateX(-50%)",bottom:10,position:"fixed"},children:[(0,i.jsx)("span",{className:"material-icons",children:"folder_open"}),"\xa0",(0,i.jsx)("a",{href:"https://github.com/namesys-eth/ccip2-eth-client",className:"footer-text",target:"_blank",rel:"noreferrer",children:"GitHub"})]}),(0,i.jsxs)("div",{id:"modal",children:[re&&(0,i.jsx)(w.Z,{onClose:function(){return ce(!1)},show:re,_ENS_:de,chain:pn,handleParentTrigger:function(e){cn((function(t){return F({},t,{trigger:e})}))},handleParentModalData:function(e){cn((function(t){return F({},t,{modalData:e})}))}}),(0,i.jsx)(b.Z,{onClose:function(){return Y(!1)},show:U}),(0,i.jsx)(S.Z,{onClose:function(){return Q(!1)},show:J}),(0,i.jsx)(R.Z,{onClose:function(){Wt(!1),it(!0)},color:"red",show:Lt&&!me,title:"cancel",children:Pt}),(0,i.jsx)(R.Z,{onClose:function(){ne(!1),Re(""),Oe(""),Be(""),We("")},color:"red",show:te&&!rt&&!me,title:"block",children:se}),(0,i.jsx)(R.Z,{onClose:function(){ne(!1),Re(""),Oe(""),Be(""),We("")},color:"red",show:te&&rt&&!me,title:"block",children:se}),(0,i.jsx)(E.Z,{handleTrigger:function(e){un((function(t){return F({},t,{trigger:e})}))},handleModalData:function(e){un((function(t){return F({},t,{modalData:e})}))},onClose:function(){return Yt(!1)},show:Ut}),(0,i.jsx)(L.Z,{handleTrigger:function(e){hn((function(t){return F({},t,{trigger:e})}))},handleModalData:function(e){hn((function(t){return F({},t,{modalData:e})}))},onClose:function(){nn(!1)},show:tn&&!Ut,children:"0"}),(0,i.jsx)(N.Z,{color:Ze,_ENS_:Me,onClose:function(){return X(!1)},show:G,children:Je})]})]})})]})}}},function(e){e.O(0,[8543,8041,8764,8109,2132,313,9774,2888,179],(function(){return t=682,e(e.s=t);var t}));var t=e.O();_N_E=t}]);