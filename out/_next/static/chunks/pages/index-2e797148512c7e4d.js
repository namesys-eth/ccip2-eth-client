(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{48312:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(11033)}])},11033:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return F}});var r=n(34051),s=n.n(r),i=n(85893),a=n(67294),o=n(9008),l=n.n(o),c=n(71649),u=n(79747),d=n(5286),f=n(2593),h=n(38197),p=n(29251),m=n(333),x=n(85518),g=n(65721),y=n(2959),v=n(19425),j=n(68059),w=n(48879),b=n(2662),S=n(454),N=function(e){var t=e.onSearch,n=(0,a.useState)(""),r=n[0],s=n[1];return(0,i.jsx)("form",{style:{display:"flex",alignItems:"center",flexDirection:"column"},onSubmit:function(e){e.preventDefault(),t(r)},children:(0,i.jsxs)("div",{style:{display:"flex",alignItems:"center",flexDirection:"row"},children:[(0,i.jsx)("input",{className:"input-main",type:"text",placeholder:"search for a .eth domain",value:r,name:".eth search",id:"eth-search",onChange:function(e){s(e.target.value)},onInvalid:function(e){e.target.setCustomValidity("Please enter a valid .eth name")},onInput:function(e){e.target.setCustomValidity("")},required:!0,pattern:".*\\.eth$",title:"\u2757 Input must end with '.eth'"}),(0,i.jsx)("button",{className:"button",style:{height:"50px",width:"80px",marginLeft:"20px"},type:"submit","data-tooltip":"Search",children:(0,i.jsx)("span",{className:"material-icons",style:{fontSize:"30px",fontWeight:"700"},children:"search"})})]})})},k=n(26786);function C(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function I(e,t,n,r,s,i,a){try{var o=e[i](a),l=o.value}catch(c){return void n(c)}o.done?t(l):Promise.resolve(l).then(r,s)}function _(e){return function(){var t=this,n=arguments;return new Promise((function(r,s){var i=e.apply(t,n);function a(e){I(i,r,s,a,o,"next",e)}function o(e){I(i,r,s,a,o,"throw",e)}a(void 0)}))}}function O(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function E(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){O(e,t,n[t])}))}return e}function T(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,s,i=[],a=!0,o=!1;try{for(n=n.call(e);!(a=(r=n.next()).done)&&(i.push(r.value),!t||i.length!==t);a=!0);}catch(l){o=!0,s=l}finally{try{a||null==n.return||n.return()}finally{if(o)throw s}}return i}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return C(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return C(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var P,R="goerli",D={apiKey:"oAgcfmuZf2tff0qnF-FT5xjnr_SxN3DG",network:u.N.ETH_GOERLI,chainId:"5"},q=new u.m(D),M=new m.D(R,D.apiKey),A=['<span class="material-icons miui">energy_savings_leaf</span><br></br>Gasless <span style="color: skyblue">ENS</span> Records','<span class="material-icons miui">hub</span><br></br>Decentralised Records Storage on <span style="color: skyblue">IPFS</span>','<span class="material-icons miui">recycling</span><br></br>Unlimited Free Updates through in-built <span style="color: skyblue">IPNS</span> Support','<span class="material-icons miui">badge</span><br></br><span style="color: skyblue">Dynamic</span> Avatars, Contenthash and Reverse Resolution','<img class="icon-ens" src="/ccip2-eth-client/ens-white.png"/><br></br>Enjoy ENS gasfree</span>'],F=function(){var e=(0,d.mA)().data,t=(0,d.$4)().isConnected,n=T(a.useState([]),2),r=n[0],o=n[1],u=T(a.useState(!1),2),m=u[0],C=u[1],I=T(a.useState(!1),2),O=I[0],R=I[1],F=T(a.useState(!1),2),L=F[0],Z=F[1],B=T(a.useState(!1),2),W=B[0],z=B[1],H=T(a.useState(!1),2),G=H[0],U=H[1],Y=T(a.useState(""),2),$=Y[0],K=Y[1],V=T(a.useState(!0),2),X=V[0],J=V[1],Q=T(a.useState(!1),2),ee=Q[0],te=Q[1],ne=T(a.useState(!1),2),re=(ne[0],ne[1]),se=T(a.useState("owner"),2),ie=se[0],ae=se[1],oe=T(a.useState(""),2),le=oe[0],ce=oe[1],ue=T(a.useState(""),2),de=ue[0],fe=ue[1],he=T(a.useState(""),2),pe=he[0],me=he[1],xe=T(a.useState(""),2),ge=xe[0],ye=xe[1],ve=T(a.useState(""),2),je=ve[0],we=(ve[1],T(a.useState(""),2)),be=we[0],Se=(we[1],T(a.useState(""),2)),Ne=Se[0],ke=(Se[1],T(a.useState(""),2)),Ce=ke[0],Ie=ke[1],_e=T(a.useState([]),2),Oe=(_e[0],_e[1],T(a.useState(!1),2)),Ee=(Oe[0],Oe[1]),Te=T(a.useState(!1),2),Pe=Te[0],Re=(Te[1],T(a.useState({modalData:!1,trigger:!1}),2)),De=Re[0],qe=Re[1];function Me(){return Ae.apply(this,arguments)}function Ae(){return(Ae=_(s().mark((function e(){var t;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={type:"gas"},e.prev=1,e.next=4,fetch("https://sshmatrix.club:3003/gas",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then((function(e){return e.json()})).then((function(e){return e.response.gas}));case 4:e.next=10;break;case 6:return e.prev=6,e.t0=e.catch(1),console.log("Failed to get gas data from CCIP2 backend"),e.abrupt("return","");case 10:return e.abrupt("return","");case 11:case"end":return e.stop()}}),e,null,[[1,6]])})))).apply(this,arguments)}var Fe=(0,a.useCallback)(_(s().mark((function t(){var n,r,i,a,l,c,u;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,q.nft.getNftsForOwner((null===e||void 0===e?void 0:e.address)?e.address:"");case 2:n=t.sent,r=n.ownedNfts,i=[],a=[],l=0,c=0;case 8:if(!(c<r.length)){t.next=19;break}if(!k.O.includes(r[c].contract.address)){t.next=16;break}return l+=1,i.push(r[c].title.split(".eth")[0]),t.next=14,M.getResolver(r[c].title);case 14:u=t.sent,a.push({key:l,name:r[c].title.split(".eth")[0],migrated:(null===u||void 0===u?void 0:u.address)===k.bt});case 16:c++,t.next=8;break;case 19:o(a),te(0===l),setTimeout((function(){J(!1)}),2e3);case 22:case"end":return t.stop()}}),t)}))),[Pe]),Le=(0,a.useCallback)(_(s().mark((function t(){return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e){t.next=3;break}return t.next=3,Fe();case 3:case"end":return t.stop()}}),t)}))),[e,Fe]);a.useEffect((function(){ae("search");var e=function(){var e=_(s().mark((function e(){var t;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Me();case 2:t=e.sent,ye(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),a.useEffect((function(){if(Pe){J(!0);var e=function(){var e=_(s().mark((function e(){return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Le().then((function(){P&&(o(P),setTimeout((function(){J(!1)}),2e3))}));case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}else J(!1)}),[Pe,De]),a.useEffect((function(){var e=function(){P=r};return window.addEventListener("beforeunload",e),function(){window.removeEventListener("beforeunload",e)}}),[r]);var Ze=(0,d.do)(k.qP[1],"getApproved",{args:[le]}).data,Be=(0,d.do)(k.qP[1],"ownerOf",{args:[le]}).data;a.useEffect((function(){Ze&&(null===Ze||void 0===Ze?void 0:Ze.toString())!=="0x"+"0".repeat(40)?fe(Ze.toString()):(null===Ze||void 0===Ze?void 0:Ze.toString())==="0x"+"0".repeat(40)&&Be?fe(Be.toString()):"owner"!==ie&&setTimeout((function(){J(!1),Ee(!1)}),2e3)}),[le,Ze,Be,ie]),a.useEffect((function(){if(de===(null===e||void 0===e?void 0:e.address)){Ee(!0);var t=[];[].push(pe.split(".eth")[0]);var n=function(){var e=_(s().mark((function e(){return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:M.getResolver(pe).then((function(e){t.push({key:1,name:pe.split(".eth")[0],migrated:(null===e||void 0===e?void 0:e.address)===k.bt}),t?(o(t),re(!0),console.log("You are owner/manager"),z(!1),J(!1)):(re(!1),te(!0))}));case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();n()}else z(!0),re(!1)}),[de,null===e||void 0===e?void 0:e.address,pe]),a.useEffect((function(){if(pe)try{var e=h.keccak256(p.Y0(pe.split(".eth")[0])),t=f.O$.from(e);ce(t.toString())}catch(n){console.log("BigNumberWarning")}}),[pe]);return(0,i.jsxs)("div",{className:"page",style:{maxWidth:"100%",justifyContent:"center",display:"flex",flexDirection:"column",top:"20px"},children:[(0,i.jsx)("div",{style:{margin:"20px",width:"60%",display:"flex",justifyContent:"flex-start"},children:(0,i.jsx)("img",{className:"avatar",alt:"sample",src:"logo.png"})}),(0,i.jsxs)(l(),{children:[(0,i.jsx)("title",{children:"CCIP2 - Off-chain Records Manager"}),(0,i.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width, user-scalable=no"}),(0,i.jsx)("link",{rel:"shortcut icon",href:"logo.png"}),(0,i.jsx)("link",{rel:"preload",as:"style",href:"https://fonts.googleapis.com/icon?family=Material+Icons"}),(0,i.jsx)("link",{rel:"preload",href:"SF-Mono.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"}),(0,i.jsx)("link",{rel:"preload",href:"Spotnik.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"})]}),(0,i.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"end"},children:[(0,i.jsxs)("div",{className:"connect-button",style:{width:"100%",display:"flex",justifyContent:"flex-end"},children:[(0,i.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),C(!0)},style:{marginRight:10},"data-tooltip":"Learn more",children:(0,i.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["about",(0,i.jsx)("span",{style:{fontFamily:"SF Mono"},children:"\xa0"}),(0,i.jsx)("span",{className:"material-icons",children:"info"})]})}),(0,i.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),Z(!0)},style:{marginRight:10},"data-tooltip":"Terms of Use",children:(0,i.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["terms","\xa0",(0,i.jsx)("span",{className:"material-icons",children:"gavel"})]})}),!x.tq&&(0,i.jsx)("div",{children:(0,i.jsx)(c.NL,{label:"connect"})}),x.tq&&(0,i.jsx)("div",{children:(0,i.jsx)(c.NL,{label:"connect"})})]}),t&&(0,i.jsx)("div",{style:{marginRight:x.tq?"0":"15px",paddingRight:"10px"},children:(0,i.jsx)("button",{className:"button",onClick:function(){window.location.href="/account"},style:{marginRight:15,marginTop:12},"data-tooltip":"My Names",children:(0,i.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["Ny Names","\xa0",(0,i.jsx)("span",{className:"material-icons",children:"admin_panel_settings"})]})})}),(0,i.jsx)("div",{style:{marginRight:x.tq?"0":"15px",paddingRight:"10px"},children:(0,i.jsx)(S.Z,{variable:ge})})]}),(0,i.jsx)("div",{className:"container",style:{maxWidth:"inherit",margin:"50px 0 0 0"},children:(0,i.jsxs)("div",{style:{flex:"1 1 auto"},children:[(0,i.jsx)("div",{style:{marginTop:"-35px"},children:(0,i.jsxs)("div",{style:{display:"flex",justifyContent:"center",textAlign:"center"},children:[!x.tq&&!t&&(0,i.jsxs)("div",{children:[(0,i.jsx)("img",{className:"icon-ens",alt:"sample-icon",src:"ens-red.png"}),(0,i.jsx)("h4",{style:{fontSize:36,color:"white"},children:"Off-chain Records Manager"})]}),!x.tq&&t&&(0,i.jsxs)("div",{style:{marginTop:"-50px"},children:[(0,i.jsx)("img",{className:"icon-ens",alt:"sample-icon",src:"ens-red.png"}),(0,i.jsx)("h4",{style:{fontSize:22,color:"white"},children:"Off-chain Records Manager"})]}),x.tq&&!t&&(0,i.jsxs)("div",{children:[(0,i.jsx)("img",{className:"icon-ens",alt:"sample-icon",src:"ens-red.png"}),(0,i.jsx)("h4",{style:{fontSize:26,color:"white"},children:"Off-chain Records Manager"})]}),x.tq&&t&&(0,i.jsxs)("div",{children:[(0,i.jsx)("img",{className:"icon-ens",alt:"sample-icon",src:"ens-red.png"}),(0,i.jsx)("h4",{style:{fontSize:18,color:"white"},children:"Off-chain Records Manager"})]})]})}),(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),t&&(0,i.jsx)("div",{className:"main-search-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"100px"},children:(0,i.jsx)(N,{onSearch:function(e){J(!0),Ie("search"),me(e),console.log("Searching for ".concat(e))}})}),t&&!Pe&&(0,i.jsx)("div",{style:{marginBottom:"0px"},children:(0,i.jsx)("div",{className:"content-slider",children:(0,i.jsx)("div",{className:"slider",children:(0,i.jsx)("div",{className:"mask",children:(0,i.jsx)("ul",{children:A.map((function(e,t){return(0,i.jsx)("li",{className:"anim".concat(t+1),children:(0,i.jsx)("div",{className:"home-modal-item",children:(0,i.jsx)("div",{dangerouslySetInnerHTML:{__html:e}})})},t)}))})})})})}),X&&t&&(0,i.jsxs)("div",{children:[(0,i.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",marginTop:"50px",marginBottom:"200px"},children:[(0,i.jsx)("div",{style:{paddingBottom:"10px",alignItems:"center",justifyContent:"center",display:"flex"}}),(0,i.jsx)("div",{style:{marginTop:"40px"},children:(0,i.jsx)("span",{style:{color:"white",fontWeight:"700"},children:"owner"!==ie?"Please Wait":De.modalData?"Please wait":"Loading Names"})})]}),(0,i.jsx)("h1",{children:"please wait"})]}),!X&&"search"===ie&&r.length>0&&t&&!ee&&(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px",fontWeight:"700"},children:"search result"}),(0,i.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,i.jsx)(b.Z,{items:r,onItemClick:function(e){U(!0),K(e)}})})]}),(0,i.jsxs)("div",{style:{color:"white",marginTop:"20%",marginBottom:20,alignItems:"center",justifyContent:"center",display:"flex"},children:[(0,i.jsx)("span",{className:"material-icons",children:"folder_open"}),"\xa0",(0,i.jsx)("a",{href:"https://github.com/namesys-eth/ccip2-eth-client",className:"footer-text",target:"_blank",rel:"noreferrer",children:"GitHub"})]}),(0,i.jsxs)("div",{id:"modal",children:[G&&(0,i.jsx)(v.Z,{onClose:function(){return U(!1)},show:G,_ENS_:$,chain:D.chainId,handleParentTrigger:function(e){qe((function(t){return E({},t,{trigger:e})}))},handleParentModalData:function(e){qe((function(t){return E({},t,{modalData:e})}))},children:!0}),(0,i.jsx)(j.Z,{onClose:function(){return C(!1)},show:m}),(0,i.jsx)(y.Z,{onClose:function(){return Z(!1)},show:L}),(0,i.jsx)(w.Z,{onClose:function(){z(!1),ce(""),me(""),fe("")},show:W&&"manager"===Ce&&de&&!X,title:"block",children:"you are not manager"}),(0,i.jsx)(w.Z,{onClose:function(){z(!1),ce(""),me(""),fe("")},show:W&&"search"===Ce&&de&&!X,title:"block",children:"not owner or manager"}),(0,i.jsx)(g.Z,{color:be,_ENS_:je,onClose:function(){return R(!1)},show:O,children:Ne})]})]})})]})}}},function(e){e.O(0,[543,874,788,764,789,648,774,888,179],(function(){return t=48312,e(e.s=t);var t}));var t=e.O();_N_E=t}]);