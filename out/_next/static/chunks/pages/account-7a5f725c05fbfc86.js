(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[966],{682:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/account",function(){return n(91290)}])},91290:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return q}});var i=n(34051),s=n.n(i),a=n(85893),o=n(67294),r=n(9008),l=n.n(r),c=n(71649),d=n(5286),u=n(2593),f=n(27586),p=n(16441),x=n(38197),h=n(31886),m=n(29251),y=n(85518),g=n(56371),v=n(65721),j=n(2959),S=n(28413),b=n(68059),w=n(34464),N=n(48879),k=n(23513),C=n(454),E=n(83306),R=function(e){var t=e.onSearch,n=(0,o.useState)(""),i=n[0],s=n[1];return(0,a.jsx)("form",{style:{display:"flex",alignItems:"center",flexDirection:"column"},onSubmit:function(e){e.preventDefault(),t(i)},children:(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",flexDirection:"row"},children:[(0,a.jsx)("input",{type:"text",placeholder:"search .eth name".toLowerCase(),value:i,name:".eth search",id:"eth-search",onChange:function(e){s(e.target.value)},onInvalid:function(e){e.target.setCustomValidity("Please enter a valid .eth name")},onInput:function(e){e.target.setCustomValidity("")},required:!0,pattern:".*\\.eth$",title:"\u2757 Input must end with '.eth'"}),(0,a.jsx)("button",{className:"button",style:{height:"38px",width:"50px",marginLeft:"15px"},type:"submit","data-tooltip":"Search",children:(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"search"})})]})})},I=n(33630),D=n(72035),O=n(3922),W=n(19745),T=n(24978),L=n(58619);function B(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function _(e,t,n,i,s,a,o){try{var r=e[a](o),l=r.value}catch(c){return void n(c)}r.done?t(l):Promise.resolve(l).then(i,s)}function P(e){return function(){var t=this,n=arguments;return new Promise((function(i,s){var a=e.apply(t,n);function o(e){_(a,i,s,o,r,"next",e)}function r(e){_(a,i,s,o,r,"throw",e)}o(void 0)}))}}function A(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function z(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),i.forEach((function(t){A(e,t,n[t])}))}return e}function M(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var i,s,a=[],o=!0,r=!1;try{for(n=n.call(e);!(o=(i=n.next()).done)&&(a.push(i.value),!t||a.length!==t);o=!0);}catch(l){r=!0,s=l}finally{try{o||null==n.return||n.return()}finally{if(r)throw s}}return a}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return B(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return B(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var q=function(){var e=function(e){var t=document.getElementById(e);t.select(),t.setSelectionRange(0,99999),navigator.clipboard.writeText(t.value).then((function(){})).catch((function(e){console.error("ERROR:",e)}))},t=(0,d.LN)().activeChain,n=(0,d.mA)().data,i=(0,d.$4)().isConnected,r=M(o.useState([]),2),B=r[0],_=r[1],A=M(o.useState(!1),2),q=A[0],F=A[1],H=M(o.useState(!1),2),Z=H[0],K=H[1],Y=M(o.useState(!1),2),U=Y[0],X=Y[1],G=M(o.useState(!1),2),V=G[0],$=G[1],J=M(o.useState(""),2),Q=J[0],ee=J[1],te=M(o.useState(!1),2),ne=te[0],ie=te[1],se=M(o.useState(""),2),ae=se[0],oe=se[1],re=M(o.useState(!0),2),le=re[0],ce=re[1],de=M(o.useState(!1),2),ue=de[0],fe=de[1],pe=M(o.useState(!1),2),xe=pe[0],he=pe[1],me=M(o.useState("OWNER"),2),ye=me[0],ge=me[1],ve=M(o.useState(""),2),je=ve[0],Se=ve[1],be=M(o.useState(""),2),we=be[0],Ne=be[1],ke=M(o.useState(""),2),Ce=ke[0],Ee=ke[1],Re=M(o.useState(""),2),Ie=Re[0],De=Re[1],Oe=M(o.useState(""),2),We=Oe[0],Te=Oe[1],Le=M(o.useState("skyblue"),2),Be=Le[0],_e=Le[1],Pe=M(o.useState(0),2),Ae=Pe[0],ze=Pe[1],Me=M(o.useState(0),2),qe=Me[0],Fe=Me[1],He=M(o.useState(""),2),Ze=He[0],Ke=He[1],Ye=M(o.useState(!1),2),Ue=Ye[0],Xe=Ye[1],Ge=M(o.useState(!1),2),Ve=Ge[0],$e=Ge[1],Je=M(o.useState(f.VM("0.eth")),2),Qe=Je[0],et=Je[1],tt=M(o.useState(0),2),nt=tt[0],it=tt[1],st=M(o.useState([]),2),at=st[0],ot=st[1],rt=M(o.useState([]),2),lt=rt[0],ct=rt[1],dt=M(o.useState(!1),2),ut=dt[0],ft=dt[1],pt=M(o.useState(!1),2),xt=pt[0],ht=pt[1],mt=M(o.useState(!1),2),yt=mt[0],gt=mt[1],vt=M(o.useState("Loading Names"),2),jt=vt[0],St=vt[1],bt=M(o.useState(""),2),wt=bt[0],Nt=bt[1],kt=M(o.useState(""),2),Ct=kt[0],Et=kt[1],Rt=M(o.useState(""),2),It=Rt[0],Dt=Rt[1],Ot=M(o.useState(["","",""]),2),Wt=Ot[0],Tt=Ot[1],Lt=M(o.useState(!1),2),Bt=Lt[0],_t=Lt[1],Pt=M(o.useState(""),2),At=Pt[0],zt=Pt[1],Mt=M(o.useState(""),2),qt=Mt[0],Ft=Mt[1],Ht=M(o.useState({modalData:"",trigger:!1}),2),Zt=Ht[0],Kt=Ht[1],Yt=M(o.useState({modalData:void 0,trigger:!1}),2),Ut=Yt[0],Xt=Yt[1],Gt=o.useRef(),Vt=!t||"mainnet"!==t.name.toLowerCase()&&"ethereum"!==t.name.toLowerCase()?"5":"1",$t=I.bt["1"===Vt?1:0],Jt=I.K0["1"===Vt?1:0],Qt=(0,d.QW)({onSuccess:function(e,t){var n=(0,g.verifyMessage)(t.message,e);Gt.current=n}}),en=Qt.data,tn=Qt.error,nn=Qt.isLoading,sn=Qt.signMessage,an=(0,d.do)(I.qP[1],"ownerOf",{args:[je]}).data,on=(0,d.do)(Jt,"getRecordhash",{args:[p.hexZeroPad((null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:I.DR,32).toLowerCase()]}).data,rn=(0,d.do)(Jt,"getRecordhash",{args:[f.VM(Qe)]}).data,ln=(0,d.GG)(Jt,"setOwnerhash",{args:[I.vb(At)]}),cn=ln.data,dn=ln.write;ln.isLoading,ln.isSuccess,ln.isError;function un(){return fn.apply(this,arguments)}function fn(){return(fn=P(s().mark((function e(){var t,n,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={type:"gas"},e.prev=1,e.next=4,fetch("https://sshmatrix.club:3003/gas",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 4:return n=e.sent,e.next=7,n.json();case 7:return i=e.sent,e.abrupt("return",i.response.gas);case 11:return e.prev=11,e.t0=e.catch(1),console.error("Error:","Failed to get gas data from CCIP2 backend"),e.abrupt("return","");case 15:case"end":return e.stop()}}),e,null,[[1,11]])})))).apply(this,arguments)}o.useEffect((function(){I.hc(5);var e=function(){var e=P(s().mark((function e(){var t;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,un();case 2:t=e.sent,De(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),o.useEffect((function(){if(Zt.trigger){var e=B,t=e.findIndex((function(e){return"".concat(e.name,".eth")===Zt.modalData})),i=function(){var i=P(s().mark((function i(){var a,o,r;return s().wrap((function(i){for(;;)switch(i.prev=i.next){case 0:if(!Zt.modalData){i.next=11;break}return i.next=3,I.Ap.getResolver(Zt.modalData);case 3:return a=i.sent,i.next=6,D.c(Zt.modalData,Jt,(null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:I.DR);case 6:return o=i.sent,i.next=9,D.Y(Jt,(null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:I.DR);case 9:r=i.sent,e[t].migrated=(null===a||void 0===a?void 0:a.address)===$t&&o?"1":(null===a||void 0===a?void 0:a.address)===$t&&r?"3/4":(null===a||void 0===a?void 0:a.address)===$t?"1/2":"0";case 11:case"end":return i.stop()}}),i)})));return function(){return i.apply(this,arguments)}}();i(),_(e),ct(e)}}),[Zt]),o.useEffect((function(){if(Ut.trigger&&!Wt[0]&&!Wt[1]){var e="eth:"+(null===n||void 0===n?void 0:n.address),t="eip155:".concat(Vt,":").concat(null===n||void 0===n?void 0:n.address);sn({message:(i=e,s=t,a=x.keccak256(h.pack(["bytes32","address"],[x.keccak256(h.pack(["string"],[Ut.modalData])),null===n||void 0===n?void 0:n.address])),"Requesting Signature For IPNS Key Generation\n\nOrigin: ".concat(i,"\nKey Type: ed25519\nExtradata: ").concat(a,"\nSigned By: ").concat(s))}),$e(!0)}var i,s,a}),[Ut]),o.useEffect((function(){if(!Wt[0]&&!Wt[1]&&en){var e=function(){var e=P(s().mark((function e(){var t,i,a;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t="eth:"+(null===n||void 0===n?void 0:n.address),i="eip155:".concat(Vt),e.next=4,(0,O.X)(t,i,en,Ut.modalData);case 4:a=e.sent,Tt([a[0][0],a[1][0],a[0][1]]);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}}),[Ve,en]),o.useEffect((function(){if(Wt[0]&&Wt[2]&&"ownerhash"===qt){var e=function(){var e=P(s().mark((function e(){var t,n,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=I.yt([[Wt[0],Wt[2]],["",""]]),e.next=3,W.Dp(T.UG.hexToBytes(t));case 3:n=e.sent,i=n.toString(),zt(i);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}}),[Wt]),o.useEffect((function(){At.startsWith("k5")&&(dn(),St("Waiting For Transaction"))}),[At]),o.useEffect((function(){var e=(null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:I.DR;le||ce(!0),!xt&&Qe&&e===wt?St("Loading Names"):(St("Please be Patient"),Nt(I.DR)),xt||Qe||(Nt(I.DR),St("Loading Names"))}),[n,xt]),o.useEffect((function(){var e=(null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:I.DR;if(!xt&&0===qe&&e!==wt){ce(!0),Nt(e);var t=function(){var t=P(s().mark((function t(){var i,a,o,r,l,c,d,u,f,p;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,I.iJ.nft.getNftsForOwner(e);case 2:for(i=t.sent,a=i.ownedNfts,o=[],r=[],l=0,c=[],u=0;u<a.length;u++)I.O.includes(a[u].contract.address)&&a[u].title&&c.push(a[u].title);if(Fe(c.length),0!==c.length){t.next=14;break}fe(!0),t.next=36;break;case 14:return t.next=16,D.Y(Jt,(null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:I.DR);case 16:d=t.sent,u=0;case 18:if(!(u<a.length)){t.next=36;break}if(!I.O.includes(a[u].contract.address)||!a[u].title){t.next=32;break}return ze(l+=1),o.push(a[u].title.split(".eth")[0]),t.next=25,I.Ap.getResolver(a[u].title);case 25:return f=t.sent,r.push({key:l,name:a[u].title.split(".eth")[0],migrated:(null===f||void 0===f?void 0:f.address)===$t?"1/2":"0"}),et(a[u].title),t.next=30,D.c(a[u].title,Jt,(null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:I.DR);case 30:p=t.sent,r[l-1].migrated=p&&"1/2"===r[l-1].migrated?"1":d&&"1/2"===r[l-1].migrated?"3/4":"1/2"===r[l-1].migrated?r[l-1].migrated:"0";case 32:u===a.length-1&&(ht(!0),Fe(0),it(0),St("Showing Names"),_(r),ct(r),ce(!1));case 33:u++,t.next=18;break;case 36:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}}),[n,It]),o.useEffect((function(){var e=function(){};return window.addEventListener("beforeunload",e),function(){window.removeEventListener("beforeunload",e)}}),[B]);var pn=function(e){ie(!0),oe(e)};o.useEffect((function(){Ae>nt&&Ae>0&&it(Ae)}),[Ae]),o.useEffect((function(){an&&(null===an||void 0===an?void 0:an.toString())!==I.DR?Ne(an.toString()):"OWNER"!==ye&&setTimeout((function(){ce(!1),ft(!1)}),2e3)}),[je,an,ye]),o.useEffect((function(){if(we&&we===(null===n||void 0===n?void 0:n.address)&&Ce.length>0){ft(!0);var e=[];[].push(Ce.split(".eth")[0]);var t=function(){var t=P(s().mark((function t(){return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:I.Ap.getResolver(Ce).then((function(t){e.push({key:1,name:Ce.split(".eth")[0],migrated:(null===t||void 0===t?void 0:t.address)===$t?"1/2":"0"}),e.length>0&&(null===t||void 0===t?void 0:t.address)?(console.log(Ct),console.log(It),Ct&&"0x"!==Ct.toString()&&Ct.toString()!==It.toString()&&"1/2"===e[0].migrated?e[0].migrated="1":It&&"0x"!==It.toString()&&"1/2"===e[0].migrated&&(e[0].migrated="3/4"),ct(B),_(e),he(!0)):(he(!1),ee("Name not Registered"),$(!0))}));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}else we&&we!==(null===n||void 0===n?void 0:n.address)&&(ce(!1),he(!1),ee("You are not Owner or Manager"),$(!0))}),[we,null===n||void 0===n?void 0:n.address,Ce,Ct,It]),o.useEffect((function(){xe&&an&&an.toString()!==I.DR?($(!1),ce(!1)):ce(!1)}),[xe]),o.useEffect((function(){rn&&Et("ipns://".concat(L.K5(rn.toString()).decoded))}),[rn,on]),o.useEffect((function(){on&&Dt("ipns://".concat(L.K5(on.toString()).decoded))}),[on]),o.useEffect((function(){if(Ce)try{var e=x.keccak256(m.Y0(Ce.split(".eth")[0])),t=u.O$.from(e);Se(t.toString())}catch(n){}}),[Ce]);var xn=(0,d.BX)({hash:null===cn||void 0===cn?void 0:cn.hash}),hn=xn.isSuccess,mn=xn.isError,yn=xn.isLoading;return o.useEffect((function(){hn&&Dt("ipns://".concat(At))}),[hn]),o.useEffect((function(){yn&&!mn&&(ce(!0),St("Waiting for Confirmation")),!yn&&mn&&(St("Transaction Failed"),gt(!0),ce(!1))}),[yn,mn]),o.useEffect((function(){nn&&!tn&&(ce(!0),St("Waiting for Signature")),tn&&!nn&&(St("Signature Failed"),gt(!0),ce(!1))}),[nn,tn]),(0,a.jsxs)("div",{className:"page",style:{maxWidth:"100%",justifyContent:"center",display:"flex",flexDirection:"column",top:"20px"},children:[!y.tq&&(0,a.jsx)("div",{style:{margin:"20px",width:"40%",display:"flex",justifyContent:"flex-start"},children:(0,a.jsx)("img",{className:"avatar",alt:"corner-account",src:"logo.png"})}),(0,a.jsxs)(l(),{children:[(0,a.jsx)("title",{children:"NameSys - Off-chain Records Manager"}),(0,a.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width, user-scalable=no"}),(0,a.jsx)("link",{rel:"shortcut icon",href:"logo.png"}),(0,a.jsx)("link",{rel:"preload",as:"style",href:"https://fonts.googleapis.com/icon?family=Material+Icons"}),(0,a.jsx)("link",{rel:"preload",href:"SF-Mono.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"}),(0,a.jsx)("link",{rel:"preload",href:"Spotnik.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"})]}),(0,a.jsx)("div",{style:{fontFamily:"Rajdhani"}}),(0,a.jsx)("div",{style:{fontFamily:"SF Mono"}}),(0,a.jsx)("div",{style:{fontFamily:"Spotnik"}}),(0,a.jsx)("div",{id:"overlay",className:"overlay",children:(0,a.jsxs)("div",{className:"overlay-content overlay-content-alt",children:[(0,a.jsx)(E.Z,{height:75,width:75}),(0,a.jsx)("div",{style:{marginTop:"20px"},children:(0,a.jsx)("span",{children:"PLEASE WAIT"})})]})}),(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"space-between",width:"100%"},children:[(0,a.jsxs)("div",{style:{display:"flex",flexDirection:y.tq?"column":"row",marginLeft:y.tq?"25px":"9%",marginRight:"auto",marginTop:y.tq?"25px":"-7%"},children:[(0,a.jsx)("div",{style:{marginRight:y.tq?"20px":"40px"},children:(0,a.jsx)("button",{className:"button",onClick:function(){window.location.href="/ccip2-eth-client/",Tt(["","",""])},"data-tooltip":"Homepage",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:[(y.tq,"Home"),(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"home"})]})})}),(0,a.jsx)("div",{style:{marginLeft:y.tq?"-9px":"-30px"},children:(0,a.jsx)(C.Z,{variable:Ie})})]}),(0,a.jsxs)("div",{className:"connect-button",style:{marginLeft:"auto",display:"flex",flexDirection:"row",marginTop:y.tq?"25px":"-7%"},children:[(0,a.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),F(!0),Tt(["","",""])},style:{marginRight:10,display:"none"},"data-tooltip":"Learn more",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["about",(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"info"})]})}),(0,a.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),X(!0),Tt(["","",""])},style:{marginRight:10,display:"none"},"data-tooltip":"Terms of Use",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["terms",(0,a.jsx)("span",{children:"\xa0"}),(0,a.jsx)("span",{className:"material-icons",children:"gavel"})]})}),!y.tq&&(0,a.jsx)("div",{children:(0,a.jsx)(c.NL,{label:"connect"})}),y.tq&&(0,a.jsx)("div",{children:(0,a.jsx)(c.NL,{label:"connect"})})]})]})}),(0,a.jsx)("div",{className:"container",style:{maxWidth:"inherit",margin:"50px 0 0 0"},children:(0,a.jsxs)("div",{className:y.tq||Ue?"none":"heading-alt",style:{flex:"1 1 auto"},children:[(0,a.jsx)("div",{style:{marginTop:"-120px"},children:(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"center",textAlign:"center",paddingTop:"100px"},children:[!y.tq&&!i&&(0,a.jsxs)("div",{children:[(0,a.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,a.jsx)("h4",{style:{fontSize:"70px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,a.jsx)("h4",{style:{fontSize:26,color:"#eb8634"},children:"Off-chain Records Manager"})]}),!y.tq&&i&&(0,a.jsxs)("div",{style:{marginTop:"0px",marginBottom:"20px"},children:[(0,a.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,a.jsx)("h4",{style:{fontSize:"52px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,a.jsx)("h4",{style:{fontSize:22,color:"#eb8634"},children:"Your Names"})]}),y.tq&&!i&&(0,a.jsxs)("div",{children:[(0,a.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",style:{marginBottom:"7px"}}),(0,a.jsx)("h4",{style:{fontSize:"52px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,a.jsx)("h4",{style:{fontSize:26,color:"#eb8634"},children:"Off-chain Records Manager"})]}),y.tq&&i&&(0,a.jsxs)("div",{style:{marginTop:"-15px",marginBottom:"20px"},children:[(0,a.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",style:{marginBottom:"7px"}}),(0,a.jsx)("h4",{style:{fontSize:"40px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,a.jsx)("h4",{style:{fontSize:18,color:"#eb8634"},children:"Your Names"})]})]})}),(0,a.jsx)("br",{}),(0,a.jsx)("br",{}),!i&&(0,a.jsx)("div",{style:{marginBottom:"0px"},children:(0,a.jsx)("div",{className:"content-slider",children:(0,a.jsx)("div",{className:"slider",children:(0,a.jsx)("div",{className:"mask",children:(0,a.jsx)("ul",{children:I.hh.map((function(e,t){return(0,a.jsx)("li",{className:"anim".concat(t+1),children:(0,a.jsx)("div",{className:"carousal-item",children:(0,a.jsx)("div",{dangerouslySetInnerHTML:{__html:e}})})},t)}))})})})})}),i&&(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row",marginBottom:"50px",marginTop:"-30px"},children:[(0,a.jsx)("button",{onClick:function(){ge("OWNER"),_(at),Se(""),Ee(""),he(!1),Ne(""),ce(!0),$(!1),Tt(["","",""])},className:"button-header",disabled:"OWNER"===ye,"data-tooltip":"Show names you own",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["NAMES",(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"manage_accounts"})]})}),(0,a.jsx)("button",{onClick:function(){"SEARCH"===ye||ot(lt),_([]),ge("UTILS"),he(!1),Ne(""),ce(!0),Ee(""),$(!1),Tt(["","",""]),St("Please Wait")},className:"button-header",disabled:"UTILS"===ye,"data-tooltip":"NameSys Utility Functions",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["UTILS",(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"supervised_user_circle"})]})}),(0,a.jsx)("button",{onClick:function(){"UTILS"===ye||ot(lt),_([]),ge("SEARCH"),he(!1),Ne(""),ce(!0),Ee(""),$(!1),St("Please Wait")},className:"button-header",disabled:"SEARCH"===ye,"data-tooltip":"Search for an ENS name",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["SEARCH",(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"search"})]})})]}),le&&i&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",marginTop:"50px",marginBottom:"200px"},children:[(0,a.jsx)("div",{style:{paddingBottom:"10px",alignItems:"center",justifyContent:"center",display:"flex"},children:(0,a.jsx)(E.Z,{height:60,width:60})}),(0,a.jsxs)("div",{style:{marginTop:"40px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[(0,a.jsx)("div",{style:{color:"#fc6603",fontWeight:"700"},children:"OWNER"!==ye?"".concat(jt):Zt.modalData?"Please wait":"".concat(jt)}),(0,a.jsx)("div",{style:{color:"#fc6603",fontWeight:"700",fontFamily:"SF Mono"},children:"OWNER"!==ye||qe<3||Zt.modalData?"":"".concat(nt,"/").concat(qe)})]})]}),(0,a.jsx)("h1",{children:"please wait"})]}),!le&&"OWNER"===ye&&B.length>0&&i&&!ue&&wt===(null===n||void 0===n?void 0:n.address)&&!xt&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",marginTop:"50px",marginBottom:"200px"},children:[(0,a.jsx)("div",{style:{paddingBottom:"10px",alignItems:"center",justifyContent:"center",display:"flex"},children:(0,a.jsx)(E.Z,{height:60,width:60})}),(0,a.jsx)("div",{style:{marginTop:"40px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:(0,a.jsx)("div",{style:{color:"#fc6603",fontWeight:"700"},children:"Please Wait"})})]}),(0,a.jsx)("h1",{children:"please wait"})]}),!le&&"OWNER"===ye&&B.length>0&&i&&!ue&&wt!==(null===n||void 0===n?void 0:n.address)&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"names you own"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){K(!0),Te("info"),_e("skyblue"),Ke('<span>This list <span style="color: orangered">does not</span> contain <span style="color: orange">Wrapped Names</span> or <span style="color: orange">Subdomains</span>. Please use the <span style="color: skyblue">search</span> tab for missing names</span>')},children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"skyblue"},children:"info_outline"})})]}),"OWNER"===ye&&!le&&(0,a.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,a.jsx)(k.Z,{label:"edit",items:B,onItemClick:pn})})]}),!le&&"SEARCH"===ye&&B.length>0&&i&&!ue&&(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px",fontWeight:"700"},children:"search result"}),(0,a.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,a.jsx)(k.Z,{label:"edit",items:B,onItemClick:pn})})]}),!le&&"UTILS"===ye&&!xe&&B&&i&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"NameSys Utilities"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){K(!0),Te("info"),_e("skyblue"),Ke('<span>NameSys Utility Functions to set <span style="color: skyblue">Ownerhash</span> and <span style="color: skyblue">Export Keys</span></span>')},children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"skyblue"},children:"info_outline"})})]}),(0,a.jsxs)("div",{className:"export-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"30px",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column"},children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"Ownerhash Setter"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){K(!0),Te("info"),_e("skyblue"),Ke('<span>Sets <span style="color: skyblue">Ownerhash</span> For All Names in a Wallet</span>')},"data-tooltip":"Set New Ownerhash",children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"skyblue"},children:"info_outline"})})]}),(0,a.jsx)("input",{style:{width:"90%",color:"rgb(255, 255, 255, 0.75)"},type:"text",placeholder:"ipns://",disabled:!0,value:It,id:"owner-hash"}),(0,a.jsx)("button",{className:"button",style:{height:"38px",width:"80px",marginTop:"15px",marginLeft:"15px"},type:"submit","data-tooltip":"Set New Ownerhash",onClick:function(){_t(!0),Ft("ownerhash")},children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row"},children:[(0,a.jsx)("span",{children:"SET"}),(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700",marginLeft:"3px"},children:"settings"})]})})]}),(0,a.jsxs)("div",{className:"hash-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"70px",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column"},children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"Private Key Exporter"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){K(!0),Te("info"),_e("skyblue"),Ke('<span>Export your <span style="color: skyblue">IPNS</span> and/or Records <span style="color: skyblue">Signer</span> Keys</span>')},"data-tooltip":"Export Keys",children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"skyblue"},children:"info_outline"})})]}),(0,a.jsxs)("div",{style:{width:"90%",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row"},children:[(0,a.jsx)("input",{style:{width:"100%",paddingRight:"32px",fontWeight:"400",textAlign:"left",color:"rgb(255, 255, 255, 0.75)"},type:"text",placeholder:"IPNS Private Key",value:"export"!==qt?"":Wt[0],id:"export-ipns",disabled:!0}),(0,a.jsx)("button",{className:"button-empty",onClick:function(){e("export-ipns"),_e("lime"),Tt(["",Wt[1],Wt[2]])},"data-tooltip":"Copy IPNS Key",style:{marginLeft:"-25px",color:Be&&!Wt[0]?Be:"skyblue"},children:(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"content_copy"})})]}),(0,a.jsxs)("div",{style:{marginTop:"10px",width:"90%",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row"},children:[(0,a.jsx)("input",{style:{width:"100%",paddingRight:"32px",fontWeight:"400",textAlign:"left",color:"rgb(255, 255, 255, 0.75)"},type:"text",placeholder:"CCIP Manager Key",value:"export"!==qt?"":Wt[1],id:"export-ccip",disabled:!0}),(0,a.jsx)("button",{className:"button-empty",onClick:function(){e("export-ccip"),_e("lime"),Tt([Wt[0],"",Wt[2]])},"data-tooltip":"Copy Manager Key",style:{marginLeft:"-25px",color:Be&&!Wt[1]?Be:"skyblue"},children:(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"content_copy"})})]}),(0,a.jsx)("button",{className:"button",style:{height:"38px",width:"115px",marginLeft:"15px",marginTop:"15px"},type:"submit","data-tooltip":"Export Keys",onClick:function(){_t(!0),Ft("export")},children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row"},children:[(0,a.jsx)("span",{children:"EXPORT"}),(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700",marginLeft:"5px"},children:"file_download"})]})})]})]}),!le&&"SEARCH"===ye&&!xe&&B&&i&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"search names"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){K(!0),Te("info"),_e("skyblue"),Ke('<span>Search for a name that you <span style="color: skyblue">own</span></span>')},children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"skyblue"},children:"info_outline"})})]}),(0,a.jsx)("div",{className:"search-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,a.jsx)(R,{onSearch:function(e){ce(!0),Xe(!0),et(e),Ee(e)}})})]}),!le&&ue&&"OWNER"===ye&&(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",fontSize:"22px",color:"#fc6603",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{className:"material-icons miui-smaller",children:"warning"}),(0,a.jsx)("br",{}),"No Names Found"]})}),!ut&&!we&&Ce&&"OWNER"!==ye&&!le&&(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",fontSize:"22px",color:"#fc6603",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{className:"material-icons miui-smaller",children:"warning"}),(0,a.jsx)("br",{}),"No Names Found"]})}),(0,a.jsxs)("div",{style:{color:"#fc6603",top:"auto",left:"50%",transform:"translateX(-50%)",bottom:10,alignItems:"center",justifyContent:"center",display:"flex",position:"fixed"},children:[(0,a.jsx)("span",{className:"material-icons",children:"folder_open"}),"\xa0",(0,a.jsx)("a",{href:"https://github.com/namesys-eth/ccip2-eth-client",className:"footer-text",target:"_blank",rel:"noreferrer",children:"GitHub"})]}),(0,a.jsxs)("div",{id:"modal",children:[ne&&(0,a.jsx)(S.Z,{onClose:function(){return ie(!1)},show:ne,_ENS_:ae,chain:Vt,handleParentTrigger:function(e){Kt((function(t){return z({},t,{trigger:e})}))},handleParentModalData:function(e){Kt((function(t){return z({},t,{modalData:e})}))}}),(0,a.jsx)(b.Z,{onClose:function(){return F(!1)},show:q}),(0,a.jsx)(j.Z,{onClose:function(){return X(!1)},show:U}),(0,a.jsx)(N.Z,{onClose:function(){gt(!1)},show:yt&&!le,title:"cancel",children:jt}),(0,a.jsx)(N.Z,{onClose:function(){$(!1),Se(""),Ee(""),Ne("")},show:V&&!Ue&&we&&!le,title:"block",children:Q}),(0,a.jsx)(N.Z,{onClose:function(){$(!1),Se(""),Ee(""),Ne("")},show:V&&Ue&&we&&!le,title:"block",children:"Not Owned By You"}),(0,a.jsx)(w.Z,{handleTrigger:function(e){Xt((function(t){return z({},t,{trigger:e})}))},handleModalData:function(e){Xt((function(t){return z({},t,{modalData:e})}))},onClose:function(){return _t(!1)},show:Bt}),(0,a.jsx)(v.Z,{color:Be,_ENS_:We,onClose:function(){return K(!1)},show:Z,children:Ze})]})]})})]})}}},function(e){e.O(0,[543,41,764,989,111,228,774,888,179],(function(){return t=682,e(e.s=t);var t}));var t=e.O();_N_E=t}]);