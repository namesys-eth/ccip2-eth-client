(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{48312:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(11033)}])},11033:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return q}});var r=n(34051),i=n.n(r),s=n(85893),a=n(67294),o=n(9008),l=n.n(o),c=n(71649),u=n(5286),d=n(2593),f=n(27586),h=n(38197),p=n(29251),x=n(85518),m=n(65721),y=n(2959),g=n(48695),v=n(68059),j=n(48879),w=n(23513),S=n(454),b=n(83306),N=function(e){var t=e.onSearch,n=(0,a.useState)(""),r=n[0],i=n[1];return(0,s.jsx)("form",{style:{display:"flex",alignItems:"center",flexDirection:"column"},onSubmit:function(e){e.preventDefault(),t(r)},children:(0,s.jsxs)("div",{style:{display:"flex",alignItems:"center",flexDirection:"row"},children:[(0,s.jsx)("input",{className:"input-main",type:"text",placeholder:x.tq?"search .eth":"search for a .eth domain",value:r,name:".eth search",id:"eth-search",onChange:function(e){i(e.target.value)},onInvalid:function(e){e.target.setCustomValidity("Please enter a valid .eth name")},onInput:function(e){e.target.setCustomValidity("")},required:!0,pattern:".*\\.eth$",title:"\u2757 Input must end with '.eth'"}),(0,s.jsx)("button",{className:"button",style:{height:"46px",width:"80px",marginLeft:"20px"},type:"submit","data-tooltip":"Search",children:(0,s.jsx)("span",{className:"material-icons",style:{fontSize:"28px",fontWeight:"700"},children:"search"})})]})})},C=n(47076),k=n(72035);function E(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function _(e,t,n,r,i,s,a){try{var o=e[s](a),l=o.value}catch(c){return void n(c)}o.done?t(l):Promise.resolve(l).then(r,i)}function I(e){return function(){var t=this,n=arguments;return new Promise((function(r,i){var s=e.apply(t,n);function a(e){_(s,r,i,a,o,"next",e)}function o(e){_(s,r,i,a,o,"throw",e)}a(void 0)}))}}function D(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function O(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){D(e,t,n[t])}))}return e}function T(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,i,s=[],a=!0,o=!1;try{for(n=n.call(e);!(a=(r=n.next()).done)&&(s.push(r.value),!t||s.length!==t);a=!0);}catch(l){o=!0,i=l}finally{try{a||null==n.return||n.return()}finally{if(o)throw i}}return s}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return E(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return E(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var q=function(){var e=(0,u.LN)().activeChain,t=(0,u.mA)().data,n=(0,u.$4)().isConnected,r=T(a.useState([]),2),o=r[0],E=r[1],_=T(a.useState(!1),2),D=_[0],q=_[1],R=T(a.useState(!1),2),P=R[0],A=R[1],L=T(a.useState(!1),2),M=L[0],W=L[1],Z=T(a.useState(!1),2),F=Z[0],B=Z[1],z=T(a.useState(""),2),H=z[0],U=z[1],Y=T(a.useState(!1),2),$=Y[0],V=Y[1],X=T(a.useState(""),2),Q=X[0],G=X[1],J=T(a.useState(!0),2),K=J[0],ee=J[1],te=T(a.useState(!1),2),ne=te[0],re=te[1],ie=T(a.useState(!1),2),se=ie[0],ae=ie[1],oe=T(a.useState(""),2),le=oe[0],ce=oe[1],ue=T(a.useState(""),2),de=ue[0],fe=ue[1],he=T(a.useState(""),2),pe=he[0],xe=he[1],me=T(a.useState(""),2),ye=me[0],ge=me[1],ve=T(a.useState(""),2),je=ve[0],we=ve[1],Se=T(a.useState(""),2),be=Se[0],Ne=Se[1],Ce=T(a.useState(""),2),ke=Ce[0],Ee=Ce[1],_e=T(a.useState(""),2),Ie=_e[0],De=_e[1],Oe=T(a.useState(""),2),Te=Oe[0],qe=Oe[1],Re=T(a.useState(""),2),Pe=Re[0],Ae=Re[1],Le=T(a.useState(""),2),Me=(Le[0],Le[1]),We=T(a.useState(!1),2),Ze=We[0],Fe=We[1],Be=T(a.useState({modalData:"",trigger:!1}),2),ze=Be[0],He=Be[1],Ue=e&&"goerli"===e.name.toLowerCase()?"5":"1",Ye=C.bt["5"===Ue?0:1],$e=C.K0["5"===Ue?0:1];function Ve(){return Xe.apply(this,arguments)}function Xe(){return(Xe=I(i().mark((function e(){var t,n,r;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={type:"gas"},e.prev=1,e.next=4,fetch("https://sshmatrix.club:3003/gas",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 4:return n=e.sent,e.next=7,n.json();case 7:return r=e.sent,e.abrupt("return",r.response.gas);case 11:return e.prev=11,e.t0=e.catch(1),console.error("Error:","Failed to get gas data from NameSys backend"),e.abrupt("return","");case 15:case"end":return e.stop()}}),e,null,[[1,11]])})))).apply(this,arguments)}a.useEffect((function(){C.hc(5);var e=function(){var e=I(i().mark((function e(){var t;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Ve();case 2:t=e.sent,ge(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),a.useEffect((function(){if(ze.trigger){var e=o,t=e.findIndex((function(e){return"".concat(e.name,".eth")===ze.modalData})),n=function(){var n=I(i().mark((function n(){var r,s;return i().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,C.Ap.getResolver(ze.modalData);case 2:return r=n.sent,n.next=5,k.c(ze.modalData,$e);case 5:s=n.sent,e[t].migrated=(null===r||void 0===r?void 0:r.address)===Ye&&s?"1":(null===r||void 0===r?void 0:r.address)!==Ye||s?"0":"1/2";case 7:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();n(),E(e)}}),[ze]),a.useEffect((function(){var e=function(){};return window.addEventListener("beforeunload",e),function(){window.removeEventListener("beforeunload",e)}}),[o]);var Qe=(0,u.do)(C.qP[1],"getApproved",{args:[le]}).data,Ge=(0,u.do)(C.qP[1],"ownerOf",{args:[le]}).data,Je=(0,u.do)($e,"recordhash",{args:[f.VM(pe)]}).data;a.useEffect((function(){Ge&&Qe&&(null===Qe||void 0===Qe?void 0:Qe.toString())!==C.DR?(fe(Qe.toString()),Me(Qe.toString()),Ae(Ge.toString())):Ge&&(null===Qe||void 0===Qe?void 0:Qe.toString())===C.DR?(fe(Ge.toString()),Ae(Ge.toString())):setTimeout((function(){ee(!1)}),2e3)}),[le,Qe,Ge]),a.useEffect((function(){if(pe.length>0&&Te){var e=[];[].push(pe.split(".eth")[0]);var t=function(){var t=I(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:console.log("Query:",pe),C.Ap.getResolver(pe).then((function(t){e.push({key:1,name:pe.split(".eth")[0],migrated:(null===t||void 0===t?void 0:t.address)===Ye?"1/2":"0"}),e.length>0&&(null===t||void 0===t?void 0:t.address)?("0x"!==Te.toString()&&"1/2"===e[0].migrated&&(e[0].migrated="1"),E(e),ae(!0)):ae(!1)}));case 2:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}}),[pe,Te]),a.useEffect((function(){Je&&qe(Je.toString())}),[Je]),a.useEffect((function(){se&&(Pe&&null!==Pe&&Pe!==C.DR?(B(!1),ee(!1),re(!1)):(U("Name not Registered"),B(!0),ee(!1),re(!0)))}),[se]),a.useEffect((function(){if(pe)try{var e=h.keccak256(p.Y0(pe.split(".eth")[0])),t=d.O$.from(e);ce(t.toString())}catch(n){console.log("Warning:","BigNumberWarning")}}),[pe]);return(0,s.jsxs)("div",{className:"page",style:{maxWidth:"100%",justifyContent:"center",display:"flex",flexDirection:"column",top:"20px"},children:[!x.tq&&(0,s.jsx)("div",{style:{margin:"20px",width:"40%",display:"flex",justifyContent:"flex-start"},children:(0,s.jsx)("img",{className:"avatar",alt:"corner-index",src:"logo.png"})}),(0,s.jsxs)(l(),{children:[(0,s.jsx)("title",{children:"NameSys - Off-Chain Records Manager"}),(0,s.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width"}),(0,s.jsx)("link",{rel:"shortcut icon",href:"logo.png"}),(0,s.jsx)("link",{rel:"preload",href:"https://fonts.googleapis.com/icon?family=Material+Icons",as:"style"}),(0,s.jsx)("link",{rel:"preload",href:"SF-Mono.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"}),(0,s.jsx)("link",{rel:"preload",href:"Spotnik.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"}),(0,s.jsx)("link",{rel:"preload",href:"Rajdhani.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"})]}),(0,s.jsx)("div",{style:{fontFamily:"Rajdhani"}}),(0,s.jsx)("div",{style:{fontFamily:"SF Mono"}}),(0,s.jsx)("div",{style:{fontFamily:"Spotnik"}}),(0,s.jsx)("div",{id:"overlay",className:"overlay",children:(0,s.jsxs)("div",{className:"overlay-content",children:[(0,s.jsx)(b.Z,{height:75,width:75}),(0,s.jsx)("div",{style:{marginTop:"20px"},children:(0,s.jsx)("span",{children:"PLEASE WAIT"})})]})}),(0,s.jsx)("div",{children:(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"space-between",width:"100%"},children:[(0,s.jsxs)("div",{style:{display:"flex",flexDirection:x.tq?"column":"row",marginLeft:x.tq?"25px":"9%",marginRight:"auto",marginTop:x.tq?"25px":"-7%"},children:[(0,s.jsx)("div",{style:{marginRight:x.tq?"20px":"40px"},children:(0,s.jsx)("button",{className:"button",onClick:function(){window.location.href="/ccip2-eth-client/account.html"},"data-tooltip":"My Names",disabled:!n,children:(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:[x.tq?"Names":"My Names","\xa0",(0,s.jsx)("span",{className:"material-icons",children:"admin_panel_settings"})]})})}),(0,s.jsx)("div",{style:{marginLeft:x.tq?"-9px":"-30px"},children:(0,s.jsx)(S.Z,{variable:ye})})]}),(0,s.jsxs)("div",{className:"connect-button",style:{marginLeft:"auto",display:"flex",flexDirection:"row",marginTop:x.tq?"25px":"-7%"},children:[(0,s.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),q(!0)},style:{marginRight:10,display:"none"},"data-tooltip":"Learn more",children:(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["about",(0,s.jsx)("span",{style:{fontFamily:"SF Mono"},children:"\xa0"}),(0,s.jsx)("span",{className:"material-icons",children:"info"})]})}),(0,s.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),W(!0)},style:{marginRight:10,display:"none"},"data-tooltip":"Terms of Use",children:(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["terms","\xa0",(0,s.jsx)("span",{className:"material-icons",children:"gavel"})]})}),!x.tq&&(0,s.jsx)("div",{children:(0,s.jsx)(c.NL,{label:"connect"})}),x.tq&&(0,s.jsx)("div",{children:(0,s.jsx)(c.NL,{label:"connect"})})]})]})}),(0,s.jsx)("div",{className:"container",style:{maxWidth:"inherit",marginTop:Ze?"0px":"40px"},children:(0,s.jsxs)("div",{className:x.tq||Ze?"none":"heading",style:{flex:"1 1 auto"},children:[(0,s.jsx)("div",{style:{marginTop:"-120px"},children:(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"center",textAlign:"center",paddingTop:"100px"},children:[!x.tq&&(0,s.jsxs)("div",{children:[(0,s.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,s.jsx)("h4",{style:{fontSize:Ze?"46px":"50px",marginTop:Ze?"20px":"25px",color:"#fc6603",marginBottom:"10px"},children:"NameSys"}),(0,s.jsx)("h4",{style:{fontSize:Ze?"24px":"28px",color:"#eb8634"},children:"Off-chain Records Manager"})]}),x.tq&&(0,s.jsxs)("div",{children:[(0,s.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png"}),(0,s.jsx)("h4",{style:{fontSize:Ze?"36px":"44px",marginTop:Ze?"12px":"10px",color:"#fc6603"},children:"NameSys"}),(0,s.jsx)("div",{style:{fontSize:Ze?"20px":"24px",fontWeight:700,color:"#eb8634"},children:"Off-chain Records Manager"})]})]})}),(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),(0,s.jsx)("div",{className:"main-search-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,s.jsx)(N,{onSearch:function(e){(null===t||void 0===t?void 0:t.address)?(E([]),ce(""),fe(""),ee(!0),De("search"),xe(e),Fe(!0),console.log("QUERY:",e)):(xe(e),De("search"),U("Please Connect Wallet"),B(!0),ee(!1),re(!0))}})}),!Ze&&(0,s.jsx)("div",{children:(0,s.jsx)("div",{className:"content-slider",children:(0,s.jsx)("div",{className:"slider",children:(0,s.jsx)("div",{className:"mask",children:(0,s.jsx)("ul",{children:C.hh.map((function(e,t){return(0,s.jsx)("li",{className:"anim".concat(t+1),children:(0,s.jsx)("div",{className:"carousal-item",children:(0,s.jsx)("div",{dangerouslySetInnerHTML:{__html:e}})})},t)}))})})})})}),K&&Ze&&(0,s.jsx)("div",{children:(0,s.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",marginTop:"-10px",marginBottom:"200px"},children:[(0,s.jsx)("div",{style:{paddingBottom:"10px",alignItems:"center",justifyContent:"center",display:"flex"},children:(0,s.jsx)(b.Z,{height:50,width:50})}),(0,s.jsx)("div",{style:{marginTop:"40px"},children:(0,s.jsx)("span",{style:{color:"#fc6603",fontWeight:"700"},children:"Please Wait"})})]})}),!K&&o.length>0&&!ne&&Ze&&(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px",fontWeight:"700"},children:[(0,s.jsx)("span",{style:{marginRight:"5px"},children:"search results"}),(0,s.jsx)("button",{className:"button-tiny",onClick:function(){A(!0),we("info"),Ne("skyblue"),Ee("search results for your query")},children:(0,s.jsx)("div",{className:"material-icons smol",style:{color:"skyblue"},children:"info_outline"})})]}),(0,s.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,s.jsx)(w.Z,{label:n&&de===(null===t||void 0===t?void 0:t.address)?"edit":"view",items:o,onItemClick:function(e){V(!0),G(e)}})})]}),(0,s.jsxs)("div",{style:{color:"#fc6603",top:"auto",left:"50%",transform:"translateX(-50%)",bottom:10,alignItems:"center",justifyContent:"center",display:"flex",position:"fixed"},children:[(0,s.jsx)("span",{className:"material-icons",children:"folder_open"}),"\xa0",(0,s.jsx)("a",{href:"https://github.com/namesys-eth/ccip2-eth-client",className:"footer-text",target:"_blank",rel:"noreferrer",children:"GitHub"})]}),(0,s.jsxs)("div",{id:"modal",children:[$&&(0,s.jsx)(g.Z,{onClose:function(){return V(!1)},show:$,_ENS_:Q,chain:C.wU.chainId,handleParentTrigger:function(e){He((function(t){return O({},t,{trigger:e})}))},handleParentModalData:function(e){He((function(t){return O({},t,{modalData:e})}))}}),(0,s.jsx)(v.Z,{onClose:function(){return q(!1)},show:D}),(0,s.jsx)(y.Z,{onClose:function(){return W(!1)},show:M}),(0,s.jsx)(j.Z,{onClose:function(){B(!1),ce(""),xe(""),fe("")},show:F&&"search"===Ie&&!K,title:"block",children:H}),(0,s.jsx)(m.Z,{color:be,_ENS_:je,onClose:function(){return A(!1)},show:P,children:ke})]})]})})]})}}},function(e){e.O(0,[543,41,764,989,111,645,774,888,179],(function(){return t=48312,e(e.s=t);var t}));var t=e.O();_N_E=t}]);