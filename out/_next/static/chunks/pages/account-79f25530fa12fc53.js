(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[966],{682:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/account",function(){return n(91290)}])},91290:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return M}});var i=n(34051),s=n.n(i),a=n(85893),o=n(67294),r=n(9008),l=n.n(r),c=n(71649),d=n(5286),u=n(2593),f=n(27586),p=n(16441),x=n(38197),h=n(31886),m=n(29251),y=n(85518),g=n(56371),v=n(65721),j=n(2959),S=n(76322),w=n(68059),N=n(34464),b=n(48879),C=n(23513),E=n(454),R=n(83306),k=function(e){var t=e.onSearch,n=(0,o.useState)(""),i=n[0],s=n[1];return(0,a.jsx)("form",{style:{display:"flex",alignItems:"center",flexDirection:"column"},onSubmit:function(e){e.preventDefault(),t(i)},children:(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",flexDirection:"row"},children:[(0,a.jsx)("input",{type:"text",placeholder:"search .eth name".toLowerCase(),value:i.toLowerCase(),name:".eth search",id:"eth-search",onChange:function(e){s(e.target.value.toLowerCase())},onInvalid:function(e){e.target.setCustomValidity("Please enter a valid .eth name")},onInput:function(e){e.target.setCustomValidity("")},required:!0,pattern:".*\\.eth$",title:"\u2757 Input must end with '.eth'"}),(0,a.jsx)("button",{className:"button",style:{height:"38px",width:"50px",marginLeft:"15px"},type:"submit","data-tooltip":"Search",children:(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"search"})})]})})},D=n(33630),I=n(72035),O=n(3922),W=n(19745),T=n(24978),L=n(58619);function B(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function P(e,t,n,i,s,a,o){try{var r=e[a](o),l=r.value}catch(c){return void n(c)}r.done?t(l):Promise.resolve(l).then(i,s)}function _(e){return function(){var t=this,n=arguments;return new Promise((function(i,s){var a=e.apply(t,n);function o(e){P(a,i,s,o,r,"next",e)}function r(e){P(a,i,s,o,r,"throw",e)}o(void 0)}))}}function A(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function z(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),i.forEach((function(t){A(e,t,n[t])}))}return e}function q(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var i,s,a=[],o=!0,r=!1;try{for(n=n.call(e);!(o=(i=n.next()).done)&&(a.push(i.value),!t||a.length!==t);o=!0);}catch(l){r=!0,s=l}finally{try{o||null==n.return||n.return()}finally{if(r)throw s}}return a}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return B(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return B(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var M=function(){var e=function(e){var t=document.getElementById(e);t.select(),t.setSelectionRange(0,99999),navigator.clipboard.writeText(t.value).then((function(){})).catch((function(e){console.error("ERROR:",e)}))},t=(0,d.LN)().activeChain,n=(0,d.mA)().data,i=(0,d.$4)().isConnected,r=q(o.useState([]),2),B=r[0],P=r[1],A=q(o.useState(!1),2),M=A[0],F=A[1],Z=q(o.useState(!1),2),H=Z[0],K=Z[1],Y=q(o.useState(!1),2),U=Y[0],X=Y[1],G=q(o.useState(!1),2),V=G[0],$=G[1],J=q(o.useState(""),2),Q=J[0],ee=J[1],te=q(o.useState(!1),2),ne=te[0],ie=te[1],se=q(o.useState(""),2),ae=se[0],oe=se[1],re=q(o.useState(!0),2),le=re[0],ce=re[1],de=q(o.useState(!1),2),ue=de[0],fe=de[1],pe=q(o.useState(!1),2),xe=pe[0],he=pe[1],me=q(o.useState("OWNER"),2),ye=me[0],ge=me[1],ve=q(o.useState(""),2),je=ve[0],Se=ve[1],we=q(o.useState(""),2),Ne=we[0],be=we[1],Ce=q(o.useState(""),2),Ee=Ce[0],Re=Ce[1],ke=q(o.useState(""),2),De=ke[0],Ie=ke[1],Oe=q(o.useState(""),2),We=Oe[0],Te=Oe[1],Le=q(o.useState(""),2),Be=Le[0],Pe=Le[1],_e=q(o.useState("cyan"),2),Ae=_e[0],ze=_e[1],qe=q(o.useState(0),2),Me=qe[0],Fe=qe[1],Ze=q(o.useState(0),2),He=Ze[0],Ke=Ze[1],Ye=q(o.useState(""),2),Ue=Ye[0],Xe=Ye[1],Ge=q(o.useState(!1),2),Ve=Ge[0],$e=Ge[1],Je=q(o.useState(!1),2),Qe=Je[0],et=Je[1],tt=q(o.useState(f.VM("0.eth")),2),nt=tt[0],it=tt[1],st=q(o.useState(0),2),at=st[0],ot=st[1],rt=q(o.useState([]),2),lt=rt[0],ct=rt[1],dt=q(o.useState([]),2),ut=dt[0],ft=dt[1],pt=q(o.useState(!1),2),xt=pt[0],ht=pt[1],mt=q(o.useState(!1),2),yt=mt[0],gt=mt[1],vt=q(o.useState(!1),2),jt=vt[0],St=vt[1],wt=q(o.useState("Loading Names"),2),Nt=wt[0],bt=wt[1],Ct=q(o.useState(""),2),Et=Ct[0],Rt=Ct[1],kt=q(o.useState(""),2),Dt=kt[0],It=kt[1],Ot=q(o.useState(""),2),Wt=Ot[0],Tt=Ot[1],Lt=q(o.useState(["","",""]),2),Bt=Lt[0],Pt=Lt[1],_t=q(o.useState(!1),2),At=_t[0],zt=_t[1],qt=q(o.useState(""),2),Mt=qt[0],Ft=qt[1],Zt=q(o.useState(""),2),Ht=Zt[0],Kt=Zt[1],Yt=q(o.useState({modalData:"",trigger:!1}),2),Ut=Yt[0],Xt=Yt[1],Gt=q(o.useState({modalData:void 0,trigger:!1}),2),Vt=Gt[0],$t=Gt[1],Jt=o.useRef(),Qt=!t||"mainnet"!==t.name.toLowerCase()&&"ethereum"!==t.name.toLowerCase()?"5":"1",en=D.bt["1"===Qt?1:0],tn=D.K0["1"===Qt?1:0],nn=(0,d.QW)({onSuccess:function(e,t){var n=(0,g.verifyMessage)(t.message,e);Jt.current=n}}),sn=nn.data,an=nn.error,on=nn.isLoading,rn=nn.signMessage,ln=(0,d.do)(D.qP[1],"ownerOf",{args:[je]}).data,cn=(0,d.do)(D.qP["1"===Qt?7:3],"ownerOf",{args:[Ne]}).data,dn=(0,d.do)(tn,"getRecordhash",{args:[p.hexZeroPad((null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:D.DR,32).toLowerCase()]}).data,un=(0,d.do)(tn,"getRecordhash",{args:[f.VM(nt)]}).data,fn=(0,d.GG)(tn,"setOwnerhash",{args:[D.vb(Mt)]}),pn=fn.data,xn=fn.write;fn.isLoading,fn.isSuccess,fn.isError;function hn(){return mn.apply(this,arguments)}function mn(){return(mn=_(s().mark((function e(){var t,n,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={type:"gas"},e.prev=1,e.next=4,fetch("https://sshmatrix.club:3003/gas",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 4:return n=e.sent,e.next=7,n.json();case 7:return i=e.sent,e.abrupt("return",i.response.gas);case 11:return e.prev=11,e.t0=e.catch(1),console.error("Error:","Failed to get gas data from CCIP2 backend"),e.abrupt("return","");case 15:case"end":return e.stop()}}),e,null,[[1,11]])})))).apply(this,arguments)}o.useEffect((function(){D.hc(5);var e=function(){var e=_(s().mark((function e(){var t;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,hn();case 2:t=e.sent,Te(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),o.useEffect((function(){if(Ut.trigger){var e=B,t=e.findIndex((function(e){return"".concat(e.name,".eth")===Ut.modalData})),i=function(){var i=_(s().mark((function i(){var a,o,r;return s().wrap((function(i){for(;;)switch(i.prev=i.next){case 0:if(!Ut.modalData){i.next=11;break}return i.next=3,D.Ap.getResolver(Ut.modalData);case 3:return a=i.sent,i.next=6,I.c(Ut.modalData,tn,(null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:D.DR);case 6:return o=i.sent,i.next=9,I.Y(tn,(null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:D.DR);case 9:r=i.sent,e[t].migrated=(null===a||void 0===a?void 0:a.address)===en&&o?"1":(null===a||void 0===a?void 0:a.address)===en&&r?"3/4":(null===a||void 0===a?void 0:a.address)===en?"1/2":"0";case 11:case"end":return i.stop()}}),i)})));return function(){return i.apply(this,arguments)}}();i(),P(e),ft(e),ct(e)}}),[Ut]),o.useEffect((function(){if(Vt.trigger&&!Bt[0]&&!Bt[1]){var e="eth:"+(null===n||void 0===n?void 0:n.address),t="eip155:".concat(Qt,":").concat(null===n||void 0===n?void 0:n.address);rn({message:(i=e,s=t,a=x.keccak256(h.pack(["bytes32","address"],[x.keccak256(h.pack(["string"],[Vt.modalData])),null===n||void 0===n?void 0:n.address])),"Requesting Signature For IPNS Key Generation\n\nOrigin: ".concat(i,"\nKey Type: ed25519\nExtradata: ").concat(a,"\nSigned By: ").concat(s))}),et(!0)}var i,s,a}),[Vt]),o.useEffect((function(){if(!Bt[0]&&!Bt[1]&&sn){var e=function(){var e=_(s().mark((function e(){var t,i,a;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t="eth:"+(null===n||void 0===n?void 0:n.address),i="eip155:".concat(Qt,":").concat(null===n||void 0===n?void 0:n.address),e.next=4,(0,O.X)(t,i,sn,Vt.modalData);case 4:a=e.sent,Pt([a[0][0],a[1][0],a[0][1]]);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}}),[Qe,sn]),o.useEffect((function(){if(Bt[0]&&Bt[2]&&"ownerhash"===Ht){var e=function(){var e=_(s().mark((function e(){var t,n,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=D.yt([[Bt[0],Bt[2]],["",""]]),e.next=3,W.Dp(T.UG.hexToBytes(t));case 3:n=e.sent,i=n.toString(),Ft(i);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}}),[Bt]),o.useEffect((function(){Mt.startsWith("k5")&&(xn(),bt("Waiting For Transaction"))}),[Mt]),o.useEffect((function(){var e=(null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:D.DR;le||ce(!0),!yt&&nt&&e===Et?bt("Loading Names"):(bt("Please be Patient"),Rt(D.DR)),yt||nt||(Rt(D.DR),bt("Loading Names"))}),[n,yt]),o.useEffect((function(){var e=(null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:D.DR;if(!yt&&0===He&&e!==Et){ce(!0),Rt(e);var t=function(){var t=_(s().mark((function t(){var i,a,o,r,l,c,d,u,f,p;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,D.iJ.nft.getNftsForOwner(e);case 2:for(i=t.sent,a=i.ownedNfts,o=[],r=[],l=0,c=[],u=0;u<a.length;u++)D.O.includes(a[u].contract.address)&&a[u].title&&c.push(a[u].title);if(Ke(c.length),0!==c.length){t.next=14;break}fe(!0),t.next=36;break;case 14:return t.next=16,I.Y(tn,(null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:D.DR);case 16:d=t.sent,u=0;case 18:if(!(u<a.length)){t.next=36;break}if(!D.O.includes(a[u].contract.address)||!a[u].title){t.next=32;break}return Fe(l+=1),o.push(a[u].title.split(".eth")[0]),t.next=25,D.Ap.getResolver(a[u].title);case 25:return f=t.sent,r.push({key:l,name:a[u].title.split(".eth")[0],migrated:(null===f||void 0===f?void 0:f.address)===en?"1/2":"0"}),it(a[u].title),t.next=30,I.c(a[u].title,tn,(null===n||void 0===n?void 0:n.address)?null===n||void 0===n?void 0:n.address:D.DR);case 30:p=t.sent,r[l-1].migrated=p&&"1/2"===r[l-1].migrated?"1":d&&"1/2"===r[l-1].migrated?"3/4":"1/2"===r[l-1].migrated?r[l-1].migrated:"0";case 32:u===a.length-1&&(gt(!0),Ke(0),ot(0),bt("Showing Names"),P(r),ft(r),ce(!1),he(!0));case 33:u++,t.next=18;break;case 36:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}}),[n,yt,He,Et]),o.useEffect((function(){var e=function(){};return window.addEventListener("beforeunload",e),function(){window.removeEventListener("beforeunload",e)}}),[B]);var yn=function(e){ie(!0),oe(e)};o.useEffect((function(){Me>at&&Me>0&&ot(Me)}),[Me]),o.useEffect((function(){ln&&(null===ln||void 0===ln?void 0:ln.toString())!==D.DR?ln.toString()===D.O["1"===Qt?7:3]?cn&&(null===cn||void 0===cn?void 0:cn.toString())!==D.DR&&Re(cn.toString()):Re(ln.toString()):"OWNER"!==ye&&setTimeout((function(){ce(!1),ht(!1)}),2e3)}),[je,Ne,ln,ye,cn]),o.useEffect((function(){if(Ee&&Ee===(null===n||void 0===n?void 0:n.address)&&De.length>0&&2===De.split(".").length){ht(!0);var e=[];[].push(De.split(".eth")[0]);var t=function(){var t=_(s().mark((function t(){return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:D.Ap.getResolver(De).then((function(t){e.push({key:1,name:De.split(".eth")[0],migrated:(null===t||void 0===t?void 0:t.address)===en?"1/2":"0"}),e.length>0&&(null===t||void 0===t?void 0:t.address)?(Dt&&"0x"!==Dt.toString()&&Dt.toString()!==Wt.toString()&&"1/2"===e[0].migrated?e[0].migrated="1":Wt&&"0x"!==Wt.toString()&&"1/2"===e[0].migrated&&(e[0].migrated="3/4"),P(e),he(!0),ce(!1)):(he(!1),ee("Name not Registered"),$(!0),ce(!1))}));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}else Ee&&Ee!==(null===n||void 0===n?void 0:n.address)&&2===De.split(".").length&&(ce(!1),he(!1),ee("You are not Owner"),$(!0));De.split(".").length>2&&(he(!1),P([]))}),[Ee,null===n||void 0===n?void 0:n.address,De,Dt,Wt]),o.useEffect((function(){un&&It("ipns://".concat(L.K5(un.toString()).decoded))}),[un,dn]),o.useEffect((function(){dn&&Tt("ipns://".concat(L.K5(dn.toString()).decoded))}),[dn]),o.useEffect((function(){if(De&&2===De.split(".").length){try{var e=f.VM(De),t=u.O$.from(e);be(t.toString())}catch(s){}try{var n=x.keccak256(m.Y0(De.split(".eth")[0])),i=u.O$.from(n);Se(i.toString())}catch(a){}}else De&&De.split(".").length>2&&(ce(!1),he(!1),ee("Subdomain Support Coming Soon"),$(!0),P([]))}),[De]);var gn=(0,d.BX)({hash:null===pn||void 0===pn?void 0:pn.hash}),vn=gn.isSuccess,jn=gn.isError,Sn=gn.isLoading;return o.useEffect((function(){vn&&Tt("ipns://".concat(Mt))}),[vn]),o.useEffect((function(){Sn&&!jn&&(ce(!0),bt("Waiting for Confirmation")),!Sn&&jn&&(bt("Transaction Failed"),St(!0),ce(!1))}),[Sn,jn]),o.useEffect((function(){on&&!an&&(ce(!0),bt("Waiting for Signature")),an&&!on&&(bt("Signature Failed"),St(!0),ce(!1))}),[on,an]),(0,a.jsxs)("div",{className:"page",style:{maxWidth:"100%",justifyContent:"center",display:"flex",flexDirection:"column",top:"20px"},children:[!y.tq&&(0,a.jsx)("div",{style:{margin:"20px",width:"40%",display:"flex",justifyContent:"flex-start"},children:(0,a.jsx)("img",{className:"avatar",alt:"corner-account",src:"logo.png"})}),(0,a.jsxs)(l(),{children:[(0,a.jsx)("title",{children:"NameSys - Off-chain Records Manager"}),(0,a.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width, user-scalable=no"}),(0,a.jsx)("link",{rel:"shortcut icon",href:"logo.png"}),(0,a.jsx)("link",{rel:"preload",as:"style",href:"https://fonts.googleapis.com/icon?family=Material+Icons"}),(0,a.jsx)("link",{rel:"preload",href:"SF-Mono.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"}),(0,a.jsx)("link",{rel:"preload",href:"Spotnik.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"})]}),(0,a.jsx)("div",{style:{fontFamily:"Rajdhani"}}),(0,a.jsx)("div",{style:{fontFamily:"SF Mono"}}),(0,a.jsx)("div",{style:{fontFamily:"Spotnik"}}),(0,a.jsx)("div",{id:"overlay",className:"overlay",children:(0,a.jsxs)("div",{className:"overlay-content overlay-content-alt",children:[(0,a.jsx)(R.Z,{height:75,width:75}),(0,a.jsx)("div",{style:{marginTop:"20px"},children:(0,a.jsx)("span",{children:"PLEASE WAIT"})})]})}),(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"space-between",width:"100%"},children:[(0,a.jsxs)("div",{style:{display:"flex",flexDirection:y.tq?"column":"row",marginLeft:y.tq?"25px":"9%",marginRight:"auto",marginTop:y.tq?"25px":"-7%"},children:[(0,a.jsx)("div",{style:{marginRight:y.tq?"20px":"40px"},children:(0,a.jsx)("button",{className:"button",onClick:function(){window.location.href="/ccip2-eth-client/",Pt(["","",""])},"data-tooltip":"Homepage",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:[(y.tq,"Home"),(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"home"})]})})}),(0,a.jsx)("div",{style:{marginLeft:y.tq?"-9px":"-30px"},children:(0,a.jsx)(E.Z,{variable:We})})]}),(0,a.jsxs)("div",{className:"connect-button",style:{marginLeft:"auto",display:"flex",flexDirection:"row",marginTop:y.tq?"25px":"-7%"},children:[(0,a.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),F(!0),Pt(["","",""])},style:{marginRight:10,display:"none"},"data-tooltip":"Learn more",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["about",(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"info"})]})}),(0,a.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),X(!0),Pt(["","",""])},style:{marginRight:10,display:"none"},"data-tooltip":"Terms of Use",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["terms",(0,a.jsx)("span",{children:"\xa0"}),(0,a.jsx)("span",{className:"material-icons",children:"gavel"})]})}),!y.tq&&(0,a.jsx)("div",{children:(0,a.jsx)(c.NL,{label:"connect"})}),y.tq&&(0,a.jsx)("div",{children:(0,a.jsx)(c.NL,{label:"connect"})})]})]})}),(0,a.jsx)("div",{className:"container",style:{maxWidth:"inherit",margin:"50px 0 0 0"},children:(0,a.jsxs)("div",{className:y.tq||Ve?"none":"heading-alt",style:{flex:"1 1 auto"},children:[(0,a.jsx)("div",{style:{marginTop:"-120px"},children:(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"center",textAlign:"center",paddingTop:"100px"},children:[!y.tq&&!i&&(0,a.jsxs)("div",{children:[(0,a.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,a.jsx)("h4",{style:{fontSize:"70px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,a.jsx)("h4",{style:{fontSize:26,color:"#eb8634"},children:"Off-chain Records Manager"})]}),!y.tq&&i&&(0,a.jsxs)("div",{style:{marginTop:"0px",marginBottom:"20px"},children:[(0,a.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,a.jsx)("h4",{style:{fontSize:"52px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,a.jsx)("h4",{style:{fontSize:22,color:"#eb8634"},children:"Your Names"})]}),y.tq&&!i&&(0,a.jsxs)("div",{children:[(0,a.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",style:{marginBottom:"7px"}}),(0,a.jsx)("h4",{style:{fontSize:"52px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,a.jsx)("h4",{style:{fontSize:26,color:"#eb8634"},children:"Off-chain Records Manager"})]}),y.tq&&i&&(0,a.jsxs)("div",{style:{marginTop:"-15px",marginBottom:"20px"},children:[(0,a.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",style:{marginBottom:"7px"}}),(0,a.jsx)("h4",{style:{fontSize:"40px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,a.jsx)("h4",{style:{fontSize:18,color:"#eb8634"},children:"Your Names"})]})]})}),(0,a.jsx)("br",{}),(0,a.jsx)("br",{}),!i&&(0,a.jsx)("div",{style:{marginBottom:"0px"},children:(0,a.jsx)("div",{className:"content-slider",children:(0,a.jsx)("div",{className:"slider",children:(0,a.jsx)("div",{className:"mask",children:(0,a.jsx)("ul",{children:D.hh.map((function(e,t){return(0,a.jsx)("li",{className:"anim".concat(t+1),children:(0,a.jsx)("div",{className:"carousal-item",children:(0,a.jsx)("div",{dangerouslySetInnerHTML:{__html:e}})})},t)}))})})})})}),i&&(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row",marginBottom:"50px",marginTop:"-30px"},children:[(0,a.jsx)("button",{onClick:function(){ge("OWNER"),lt.length>0&&P(lt),Se(""),be(""),Ie(""),he(!1),Re(""),lt.length>0?ce(!1):ce(!ue),$(!1),Pt(["","",""]),lt?he(!0):Rt(D.DR)},className:"button-header",disabled:"OWNER"===ye,"data-tooltip":"Show names you own",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["NAMES",(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"manage_accounts"})]})}),(0,a.jsx)("button",{onClick:function(){"SEARCH"===ye||ct(ut),P([]),ge("UTILS"),he(!1),Re(""),ce(!0),Ie(""),$(!1),Pt(["","",""]),bt("Please Wait")},className:"button-header",disabled:"OWNER"===ye&&le,"data-tooltip":"NameSys Utility Functions",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["UTILS",(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"supervised_user_circle"})]})}),(0,a.jsx)("button",{onClick:function(){"UTILS"===ye||ct(ut),P([]),ge("SEARCH"),he(!1),Re(""),ce(!0),Ie(""),$(!1),bt("Please Wait")},className:"button-header",disabled:"OWNER"===ye&&le,"data-tooltip":"Search for an ENS name",children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["SEARCH",(0,a.jsx)("span",{className:"material-icons",style:{marginLeft:"3px"},children:"search"})]})})]}),le&&i&&(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",marginTop:"50px",marginBottom:"200px"},children:[(0,a.jsx)("div",{style:{paddingBottom:"10px",alignItems:"center",justifyContent:"center",display:"flex"},children:(0,a.jsx)(R.Z,{height:60,width:60})}),(0,a.jsxs)("div",{style:{marginTop:"40px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[(0,a.jsx)("div",{style:{color:"#fc6603",fontWeight:"700"},children:"OWNER"!==ye?"".concat(Nt):Ut.modalData?"Please wait":"".concat(Nt)}),(0,a.jsx)("div",{style:{color:"#fc6603",fontWeight:"700",fontFamily:"SF Mono"},children:"OWNER"!==ye||He<3||Ut.modalData?"":"".concat(at,"/").concat(He)})]})]})}),!le&&"OWNER"===ye&&B.length>0&&i&&!ue&&Et===(null===n||void 0===n?void 0:n.address)&&!yt&&(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",marginTop:"50px",marginBottom:"200px"},children:[(0,a.jsx)("div",{style:{paddingBottom:"10px",alignItems:"center",justifyContent:"center",display:"flex"},children:(0,a.jsx)(R.Z,{height:60,width:60})}),(0,a.jsx)("div",{style:{marginTop:"40px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:(0,a.jsx)("div",{style:{color:"#fc6603",fontWeight:"700"},children:"Please Wait"})})]})}),!le&&"OWNER"===ye&&B.length>0&&i&&!ue&&Et!==(null===n||void 0===n?void 0:n.address)&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"names you own"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){K(!0),Pe("info"),ze("cyan"),Xe('<span>This list <span style="color: orangered">does not</span> contain <span style="color: orange">Wrapped Names</span> or <span style="color: orange">Subdomains</span>. Please use the <span style="color: cyan">search</span> tab for missing names</span>')},children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),"OWNER"===ye&&!le&&xe&&(0,a.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,a.jsx)(C.Z,{label:"edit",items:B,onItemClick:yn})})]}),!le&&"SEARCH"===ye&&B.length>0&&i&&!ue&&(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:"search result"}),(0,a.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,a.jsx)(C.Z,{label:"edit",items:B,onItemClick:yn})})]}),!le&&"UTILS"===ye&&!xe&&B&&i&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"NameSys Utilities"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){K(!0),Pe("info"),ze("cyan"),Xe('<span>NameSys Utility Functions to set <span style="color: cyan">Ownerhash</span> and <span style="color: cyan">Export Keys</span></span>')},children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,a.jsxs)("div",{className:"export-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"30px",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column"},children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"Ownerhash Setter"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){K(!0),Pe("info"),ze("cyan"),Xe('<span>Sets <span style="color: cyan">Ownerhash</span> For All Names in a Wallet</span>')},"data-tooltip":"Set New Ownerhash",children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,a.jsx)("input",{style:{width:"90%",color:"rgb(255, 255, 255, 0.75)"},type:"text",placeholder:"ipns://",disabled:!0,value:Wt,id:"owner-hash"}),(0,a.jsx)("button",{className:"button",style:{height:"38px",width:"80px",marginTop:"15px",marginLeft:"15px"},type:"submit","data-tooltip":"Set New Ownerhash",onClick:function(){zt(!0),Kt("ownerhash")},children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row"},children:[(0,a.jsx)("span",{children:"SET"}),(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700",marginLeft:"3px"},children:"settings"})]})})]}),(0,a.jsxs)("div",{className:"hash-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"70px",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column"},children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"Private Key Exporter"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){K(!0),Pe("info"),ze("cyan"),Xe('<span>Export your <span style="color: cyan">IPNS</span> and/or Records <span style="color: cyan">Signer</span> Keys</span>')},"data-tooltip":"Export Keys",children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,a.jsxs)("div",{style:{width:"90%",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row"},children:[(0,a.jsx)("input",{style:{width:"100%",paddingRight:"32px",fontWeight:"400",textAlign:"left",color:"rgb(255, 255, 255, 0.75)"},type:"text",placeholder:"IPNS Private Key",value:"export"!==Ht?"":Bt[0],id:"export-ipns",disabled:!0}),(0,a.jsx)("button",{className:"button-empty",onClick:function(){e("export-ipns"),ze("lime"),Pt(["",Bt[1],Bt[2]])},"data-tooltip":"Copy IPNS Key",style:{marginLeft:"-25px",color:Ae&&!Bt[0]?Ae:"cyan"},children:(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"content_copy"})})]}),(0,a.jsxs)("div",{style:{marginTop:"10px",width:"90%",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row"},children:[(0,a.jsx)("input",{style:{width:"100%",paddingRight:"32px",fontWeight:"400",textAlign:"left",color:"rgb(255, 255, 255, 0.75)"},type:"text",placeholder:"CCIP Manager Key",value:"export"!==Ht?"":Bt[1],id:"export-ccip",disabled:!0}),(0,a.jsx)("button",{className:"button-empty",onClick:function(){e("export-ccip"),ze("lime"),Pt([Bt[0],"",Bt[2]])},"data-tooltip":"Copy Manager Key",style:{marginLeft:"-25px",color:Ae&&!Bt[1]?Ae:"cyan"},children:(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"content_copy"})})]}),(0,a.jsx)("button",{className:"button",style:{height:"38px",width:"115px",marginLeft:"15px",marginTop:"15px"},type:"submit","data-tooltip":"Export Keys",onClick:function(){zt(!0),Kt("export")},children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row"},children:[(0,a.jsx)("span",{children:"EXPORT"}),(0,a.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700",marginLeft:"5px"},children:"file_download"})]})})]})]}),!le&&"SEARCH"===ye&&B&&i&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",marginTop:B?"-15px":"0px"},children:[(0,a.jsx)("span",{style:{marginRight:"5px"},children:"search names"}),(0,a.jsx)("button",{className:"button-tiny",onClick:function(){K(!0),Pe("info"),ze("cyan"),Xe('<span>Search for a name that you <span style="color: cyan">own</span></span>')},children:(0,a.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,a.jsx)("div",{className:"search-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,a.jsx)(k,{onSearch:function(e){P([]),ce(!0),$e(!0),it(e),Ie(e)}})})]}),!le&&ue&&"OWNER"===ye&&!V&&(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",fontSize:"22px",color:"#fc6603",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{className:"material-icons miui-smaller",children:"warning"}),(0,a.jsx)("br",{}),"No Names Found"]})}),!xt&&!Ee&&De&&"OWNER"!==ye&&!le&&!V&&(0,a.jsx)("div",{children:(0,a.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",fontSize:"22px",color:"#fc6603",marginBottom:"25px",fontWeight:"700"},children:[(0,a.jsx)("span",{className:"material-icons miui-smaller",children:"warning"}),(0,a.jsx)("br",{}),"No Names Found"]})}),(0,a.jsxs)("div",{style:{color:"#fc6603",top:"auto",left:"50%",transform:"translateX(-50%)",bottom:10,alignItems:"center",justifyContent:"center",display:"flex",position:"fixed"},children:[(0,a.jsx)("span",{className:"material-icons",children:"folder_open"}),"\xa0",(0,a.jsx)("a",{href:"https://github.com/namesys-eth/ccip2-eth-client",className:"footer-text",target:"_blank",rel:"noreferrer",children:"GitHub"})]}),(0,a.jsxs)("div",{id:"modal",children:[ne&&(0,a.jsx)(S.Z,{onClose:function(){return ie(!1)},show:ne,_ENS_:ae,chain:Qt,handleParentTrigger:function(e){Xt((function(t){return z({},t,{trigger:e})}))},handleParentModalData:function(e){Xt((function(t){return z({},t,{modalData:e})}))}}),(0,a.jsx)(w.Z,{onClose:function(){return F(!1)},show:M}),(0,a.jsx)(j.Z,{onClose:function(){return X(!1)},show:U}),(0,a.jsx)(b.Z,{onClose:function(){St(!1)},show:jt&&!le,title:"cancel",children:Nt}),(0,a.jsx)(b.Z,{onClose:function(){$(!1),Se(""),be(""),Ie(""),Re("")},show:V&&!Ve&&!le,title:"block",children:Q}),(0,a.jsx)(b.Z,{onClose:function(){$(!1),Se(""),be(""),Ie(""),Re("")},show:V&&Ve&&!le,title:"block",children:Q}),(0,a.jsx)(N.Z,{handleTrigger:function(e){$t((function(t){return z({},t,{trigger:e})}))},handleModalData:function(e){$t((function(t){return z({},t,{modalData:e})}))},onClose:function(){return zt(!1)},show:At}),(0,a.jsx)(v.Z,{color:Ae,_ENS_:Be,onClose:function(){return K(!1)},show:H,children:Ue})]})]})})]})}}},function(e){e.O(0,[543,41,764,989,111,747,774,888,179],(function(){return t=682,e(e.s=t);var t}));var t=e.O();_N_E=t}]);