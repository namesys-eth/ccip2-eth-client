(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[966],{682:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/account",function(){return n(91290)}])},91290:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return O}});var i,s=n(34051),r=n.n(s),o=n(85893),a=n(67294),l=n(9008),c=n.n(l),d=n(71649),u=n(5286),f=n(2593),m=n(38197),h=n(29251),x=n(85518),p=n(65721),g=n(2959),y=n(18534),j=n(68059),v=n(48879),w=n(23513),b=n(454),S=n(83306),N=function(e){var t=e.onSearch,n=(0,a.useState)(""),i=n[0],s=n[1];return(0,o.jsx)("form",{style:{display:"flex",alignItems:"center",flexDirection:"column"},onSubmit:function(e){e.preventDefault(),t(i)},children:(0,o.jsxs)("div",{style:{display:"flex",alignItems:"center",flexDirection:"row"},children:[(0,o.jsx)("input",{type:"text",placeholder:"search .eth name".toLowerCase(),value:i,name:".eth search",id:"eth-search",onChange:function(e){s(e.target.value)},onInvalid:function(e){e.target.setCustomValidity("Please enter a valid .eth name")},onInput:function(e){e.target.setCustomValidity("")},required:!0,pattern:".*\\.eth$",title:"\u2757 Input must end with '.eth'"}),(0,o.jsx)("button",{className:"button",style:{height:"38px",width:"50px",marginLeft:"15px"},type:"submit","data-tooltip":"Search",children:(0,o.jsx)("span",{className:"material-icons",style:{fontSize:"22px",fontWeight:"700"},children:"search"})})]})})},k=n(39428);function C(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function I(e,t,n,i,s,r,o){try{var a=e[r](o),l=a.value}catch(c){return void n(c)}a.done?t(l):Promise.resolve(l).then(i,s)}function T(e){return function(){var t=this,n=arguments;return new Promise((function(i,s){var r=e.apply(t,n);function o(e){I(r,i,s,o,a,"next",e)}function a(e){I(r,i,s,o,a,"throw",e)}o(void 0)}))}}function _(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function D(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),i.forEach((function(t){_(e,t,n[t])}))}return e}function B(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var i,s,r=[],o=!0,a=!1;try{for(n=n.call(e);!(o=(i=n.next()).done)&&(r.push(i.value),!t||r.length!==t);o=!0);}catch(l){a=!0,s=l}finally{try{o||null==n.return||n.return()}finally{if(a)throw s}}return r}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return C(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return C(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var O=function(){var e=(0,u.mA)().data,t=(0,u.$4)().isConnected,n=B(a.useState([]),2),s=n[0],l=n[1],C=B(a.useState(!1),2),I=C[0],_=C[1],O=B(a.useState(!1),2),E=O[0],q=O[1],R=B(a.useState(!1),2),P=R[0],z=R[1],A=B(a.useState(!1),2),L=A[0],M=A[1],W=B(a.useState(""),2),F=W[0],Z=W[1],Y=B(a.useState(!1),2),H=Y[0],$=Y[1],U=B(a.useState(""),2),X=U[0],J=U[1],V=B(a.useState(!0),2),G=V[0],K=V[1],Q=B(a.useState(!1),2),ee=Q[0],te=Q[1],ne=B(a.useState(!1),2),ie=ne[0],se=ne[1],re=B(a.useState("owner"),2),oe=re[0],ae=re[1],le=B(a.useState(""),2),ce=le[0],de=le[1],ue=B(a.useState(""),2),fe=ue[0],me=ue[1],he=B(a.useState(""),2),xe=he[0],pe=he[1],ge=B(a.useState(""),2),ye=ge[0],je=ge[1],ve=B(a.useState(""),2),we=ve[0],be=ve[1],Se=B(a.useState(""),2),Ne=Se[0],ke=Se[1],Ce=B(a.useState(""),2),Ie=Ce[0],Te=Ce[1],_e=B(a.useState(""),2),De=_e[0],Be=_e[1],Oe=B(a.useState([]),2),Ee=Oe[0],qe=Oe[1],Re=B(a.useState(!1),2),Pe=Re[0],ze=Re[1],Ae=B(a.useState({modalData:!1,trigger:!1}),2),Le=Ae[0],Me=Ae[1];function We(){return Fe.apply(this,arguments)}function Fe(){return(Fe=T(r().mark((function e(){var t,n,i;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={type:"gas"},e.prev=1,e.next=4,fetch("https://sshmatrix.club:3003/gas",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 4:return n=e.sent,e.next=7,n.json();case 7:return i=e.sent,e.abrupt("return",i.response.gas);case 11:return e.prev=11,e.t0=e.catch(1),console.log("Failed to get gas data from CCIP2 backend"),e.abrupt("return","");case 15:case"end":return e.stop()}}),e,null,[[1,11]])})))).apply(this,arguments)}a.useEffect((function(){k.hc(5);var e=function(){var e=T(r().mark((function e(){var t;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,We();case 2:t=e.sent,je(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]);var Ze=(0,a.useCallback)(T(r().mark((function t(){var n,i,s,o,a,c,d;return r().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,k.iJ.nft.getNftsForOwner((null===e||void 0===e?void 0:e.address)?e.address:"");case 2:n=t.sent,i=n.ownedNfts,s=[],o=[],a=0,c=0;case 8:if(!(c<i.length)){t.next=19;break}if(!k.O.includes(i[c].contract.address)||!i[c].title){t.next=16;break}return a+=1,s.push(i[c].title.split(".eth")[0]),t.next=14,k.Ap.getResolver(i[c].title);case 14:d=t.sent,o.push({key:a,name:i[c].title.split(".eth")[0],migrated:(null===d||void 0===d?void 0:d.address)===k.bt[0]?"1/2":"0"});case 16:c++,t.next=8;break;case 19:l(o),te(0===a),setTimeout((function(){K(!1)}),2e3);case 22:case"end":return t.stop()}}),t)}))),[e]),Ye=(0,a.useCallback)(T(r().mark((function t(){return r().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e){t.next=3;break}return t.next=3,Ze();case 3:case"end":return t.stop()}}),t)}))),[e,Ze]);a.useEffect((function(){K(!0);var e=function(){var e=T(r().mark((function e(){return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Ye().then((function(){i&&(l(i),setTimeout((function(){K(!1)}),2e3))}));case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[e,t,Ye,Le]),a.useEffect((function(){var e=function(){i=s};return window.addEventListener("beforeunload",e),function(){window.removeEventListener("beforeunload",e)}}),[s]);var He=function(e){$(!0),J(e)},$e=(0,u.do)(k.qP[1],"getApproved",{args:[ce]}).data,Ue=(0,u.do)(k.qP[1],"ownerOf",{args:[ce]}).data;a.useEffect((function(){$e&&(null===$e||void 0===$e?void 0:$e.toString())!==k.DR?me($e.toString()):Ue&&(null===$e||void 0===$e?void 0:$e.toString())===k.DR?me(Ue.toString()):"owner"!==oe&&setTimeout((function(){K(!1),ze(!1)}),2e3)}),[ce,$e,Ue,oe]),a.useEffect((function(){if(fe===(null===e||void 0===e?void 0:e.address)){ze(!0);var t=[];[].push(xe.split(".eth")[0]);var n=function(){var e=T(r().mark((function e(){return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:k.Ap.getResolver(xe).then((function(e){t.push({key:1,name:xe.split(".eth")[0],migrated:(null===e||void 0===e?void 0:e.address)===k.bt[0]?"1/2":"0"}),t.length>0&&(null===e||void 0===e?void 0:e.address)?(l(t),se(!0),console.log("You are Owner/Manager"),M(!1),K(!1)):(se(!1),te(!0))}));case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();Ue&&(null===Ue||void 0===Ue?void 0:Ue.toString())!==k.DR?n():(console.log("Name not Registered"),Z("Name not Registered"),M(!0),K(!1))}else Z("You are not Manager"),M(!0),se(!1),K(!1)}),[fe,null===e||void 0===e?void 0:e.address,xe]),a.useEffect((function(){if(xe)try{var e=m.keccak256(h.Y0(xe.split(".eth")[0])),t=f.O$.from(e);de(t.toString())}catch(n){console.log("BigNumberWarning")}}),[xe]);return(0,o.jsxs)("div",{className:"page",style:{maxWidth:"100%",justifyContent:"center",display:"flex",flexDirection:"column",top:"20px"},children:[!x.tq&&(0,o.jsx)("div",{style:{margin:"20px",width:"40%",display:"flex",justifyContent:"flex-start"},children:(0,o.jsx)("img",{className:"avatar",alt:"corner-account",src:"logo.png"})}),(0,o.jsxs)(c(),{children:[(0,o.jsx)("title",{children:"NameSys - Off-chain Records Manager"}),(0,o.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width, user-scalable=no"}),(0,o.jsx)("link",{rel:"shortcut icon",href:"logo.png"}),(0,o.jsx)("link",{rel:"preload",as:"style",href:"https://fonts.googleapis.com/icon?family=Material+Icons"}),(0,o.jsx)("link",{rel:"preload",href:"SF-Mono.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"}),(0,o.jsx)("link",{rel:"preload",href:"Spotnik.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"})]}),(0,o.jsx)("div",{style:{fontFamily:"Rajdhani"}}),(0,o.jsx)("div",{style:{fontFamily:"SF Mono"}}),(0,o.jsx)("div",{style:{fontFamily:"Spotnik"}}),(0,o.jsx)("div",{id:"overlay",className:"overlay",children:(0,o.jsxs)("div",{className:"overlay-content overlay-content-alt",children:[(0,o.jsx)(S.Z,{height:75,width:75}),(0,o.jsx)("div",{style:{marginTop:"20px"},children:(0,o.jsx)("span",{children:"PLEASE WAIT"})})]})}),(0,o.jsx)("div",{children:(0,o.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"space-between",width:"100%"},children:[(0,o.jsxs)("div",{style:{display:"flex",flexDirection:x.tq?"column":"row",marginLeft:x.tq?"25px":"9%",marginRight:"auto",marginTop:x.tq?"25px":"-7%"},children:[(0,o.jsx)("div",{style:{marginRight:x.tq?"20px":"40px"},children:(0,o.jsx)("button",{className:"button",onClick:function(){window.location.href="/ccip2-eth-client/"},"data-tooltip":"Homepage",children:(0,o.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:[(x.tq,"Home"),"\xa0",(0,o.jsx)("span",{className:"material-icons",children:"home"})]})})}),(0,o.jsx)("div",{style:{marginLeft:x.tq?"-9px":"-30px"},children:(0,o.jsx)(b.Z,{variable:ye})})]}),(0,o.jsxs)("div",{className:"connect-button",style:{marginLeft:"auto",display:"flex",flexDirection:"row",marginTop:x.tq?"25px":"-7%"},children:[(0,o.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),_(!0)},style:{marginRight:10},"data-tooltip":"Learn more",children:(0,o.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["about",(0,o.jsx)("span",{style:{fontFamily:"SF Mono"},children:"\xa0"}),(0,o.jsx)("span",{className:"material-icons",children:"info"})]})}),(0,o.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),z(!0)},style:{marginRight:10},"data-tooltip":"Terms of Use",children:(0,o.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["terms","\xa0",(0,o.jsx)("span",{className:"material-icons",children:"gavel"})]})}),!x.tq&&(0,o.jsx)("div",{children:(0,o.jsx)(d.NL,{label:"connect"})}),x.tq&&(0,o.jsx)("div",{children:(0,o.jsx)(d.NL,{label:"connect"})})]})]})}),(0,o.jsx)("div",{className:"container",style:{maxWidth:"inherit",margin:"50px 0 0 0"},children:(0,o.jsxs)("div",{className:x.tq||De?"none":"heading-alt",style:{flex:"1 1 auto"},children:[(0,o.jsx)("div",{style:{marginTop:"-120px"},children:(0,o.jsxs)("div",{style:{display:"flex",justifyContent:"center",textAlign:"center",paddingTop:"100px"},children:[!x.tq&&!t&&(0,o.jsxs)("div",{children:[(0,o.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,o.jsx)("h4",{style:{fontSize:"70px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,o.jsx)("h4",{style:{fontSize:26,color:"#eb8634"},children:"Off-chain Records Manager"})]}),!x.tq&&t&&(0,o.jsxs)("div",{style:{marginTop:"0px",marginBottom:"20px"},children:[(0,o.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,o.jsx)("h4",{style:{fontSize:"52px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,o.jsx)("h4",{style:{fontSize:22,color:"#eb8634"},children:"Your Names"})]}),x.tq&&!t&&(0,o.jsxs)("div",{children:[(0,o.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",style:{marginBottom:"7px"}}),(0,o.jsx)("h4",{style:{fontSize:"52px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,o.jsx)("h4",{style:{fontSize:26,color:"#eb8634"},children:"Off-chain Records Manager"})]}),x.tq&&t&&(0,o.jsxs)("div",{style:{marginTop:"-15px",marginBottom:"20px"},children:[(0,o.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",style:{marginBottom:"7px"}}),(0,o.jsx)("h4",{style:{fontSize:"40px",color:"#fc6603",marginBottom:"20px"},children:"NameSys"}),(0,o.jsx)("h4",{style:{fontSize:18,color:"#eb8634"},children:"Your Names"})]})]})}),(0,o.jsx)("br",{}),(0,o.jsx)("br",{}),!t&&(0,o.jsx)("div",{style:{marginBottom:"0px"},children:(0,o.jsx)("div",{className:"content-slider",children:(0,o.jsx)("div",{className:"slider",children:(0,o.jsx)("div",{className:"mask",children:(0,o.jsx)("ul",{children:k.hh.map((function(e,t){return(0,o.jsx)("li",{className:"anim".concat(t+1),children:(0,o.jsx)("div",{className:"carousal-item",children:(0,o.jsx)("div",{dangerouslySetInnerHTML:{__html:e}})})},t)}))})})})})}),t&&(0,o.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row",marginBottom:"50px",marginTop:"-30px"},children:[(0,o.jsx)("button",{onClick:function(){ae("owner"),l(Ee),de(""),pe(""),se(!1),me(""),K(!0),setTimeout((function(){K(!1)}),2e3)},className:"button-header",disabled:"owner"===oe,"data-tooltip":"Show names you own",children:(0,o.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["owned","\xa0",(0,o.jsx)("span",{className:"material-icons",children:"manage_accounts"})]})}),(0,o.jsx)("button",{onClick:function(){"search"===oe?console.log(Ee):qe(s),l([]),ae("manager"),se(!1),me(""),K(!0),setTimeout((function(){K(!1)}),2e3)},className:"button-header",disabled:"manager"===oe||G,"data-tooltip":"Search for a name that you manage",children:(0,o.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["managed","\xa0",(0,o.jsx)("span",{className:"material-icons",children:"supervised_user_circle"})]})}),(0,o.jsx)("button",{onClick:function(){"manager"===oe?console.log(Ee):qe(s),l([]),ae("search"),se(!1),me(""),K(!0),setTimeout((function(){K(!1)}),2e3)},className:"button-header",disabled:"search"===oe||G,"data-tooltip":"Search for an ENS name",children:(0,o.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["search","\xa0",(0,o.jsx)("span",{className:"material-icons",children:"search"})]})})]}),G&&t&&(0,o.jsxs)("div",{children:[(0,o.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",marginTop:"50px",marginBottom:"200px"},children:[(0,o.jsx)("div",{style:{paddingBottom:"10px",alignItems:"center",justifyContent:"center",display:"flex"},children:(0,o.jsx)(S.Z,{height:60,width:60})}),(0,o.jsx)("div",{style:{marginTop:"40px"},children:(0,o.jsx)("span",{style:{color:"#fc6603",fontWeight:"700"},children:"owner"!==oe?"Please Wait":Le.modalData?"Please wait":"Loading Names"})})]}),(0,o.jsx)("h1",{children:"please wait"})]}),!G&&"owner"===oe&&s.length>0&&t&&!ee&&(0,o.jsxs)("div",{children:[(0,o.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px",fontWeight:"700"},children:[(0,o.jsx)("span",{style:{marginRight:"5px"},children:"names you own"}),(0,o.jsx)("button",{className:"button-tiny",onClick:function(){q(!0),be("info"),ke("skyblue"),Te("if a name that you own is not listed, please use the search \ud83d\udd0e tab")},children:(0,o.jsx)("div",{className:"material-icons smol",style:{color:"skyblue"},children:"info_outline"})})]}),(0,o.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,o.jsx)(w.Z,{label:"edit",items:s,onItemClick:He})})]}),!G&&("manager"===oe||"search"===oe)&&s.length>0&&t&&!ee&&(0,o.jsxs)("div",{children:[(0,o.jsx)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px",fontWeight:"700"},children:"search result"}),(0,o.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,o.jsx)(w.Z,{label:"edit",items:s,onItemClick:He})})]}),!G&&"manager"===oe&&!ie&&s&&t&&(0,o.jsxs)("div",{children:[(0,o.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px",fontWeight:"700"},children:[(0,o.jsx)("span",{style:{marginRight:"5px"},children:"names you manage"}),(0,o.jsx)("button",{className:"button-tiny",onClick:function(){q(!0),be("info"),ke("skyblue"),Te("search for an ENS name that you manage (or own)")},children:(0,o.jsx)("div",{className:"material-icons smol",style:{color:"skyblue"},children:"info_outline"})})]}),(0,o.jsx)("div",{className:"search-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,o.jsx)(N,{onSearch:function(e){K(!0),Be("manager"),pe(e),console.log("Searching Manager for ".concat(e))}})})]}),!G&&"search"===oe&&!ie&&s&&t&&(0,o.jsxs)("div",{children:[(0,o.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px"},children:[(0,o.jsx)("span",{style:{marginRight:"5px"},children:"search names"}),(0,o.jsx)("button",{className:"button-tiny",onClick:function(){q(!0),be("info"),ke("skyblue"),Te("search for a name")},children:(0,o.jsx)("div",{className:"material-icons smol",style:{color:"skyblue"},children:"info_outline"})})]}),(0,o.jsx)("div",{className:"search-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,o.jsx)(N,{onSearch:function(e){K(!0),Be("search"),pe(e),console.log("Searching for ".concat(e))}})})]}),!G&&ee&&"owner"===oe&&(0,o.jsx)("div",{children:(0,o.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",fontSize:"22px",color:"#fc6603",marginBottom:"25px",fontWeight:"700"},children:[(0,o.jsx)("span",{className:"material-icons miui-smaller",children:"warning"}),(0,o.jsx)("br",{}),"No Names Found"]})}),!Pe&&!fe&&xe&&"owner"!==oe&&!G&&(0,o.jsx)("div",{children:(0,o.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",fontSize:"22px",color:"#fc6603",marginBottom:"25px",fontWeight:"700"},children:[(0,o.jsx)("span",{className:"material-icons miui-smaller",children:"warning"}),(0,o.jsx)("br",{}),"No Names Found"]})}),(0,o.jsxs)("div",{style:{color:"#fc6603",top:"auto",left:"50%",transform:"translateX(-50%)",bottom:10,alignItems:"center",justifyContent:"center",display:"flex",position:"fixed"},children:[(0,o.jsx)("span",{className:"material-icons",children:"folder_open"}),"\xa0",(0,o.jsx)("a",{href:"https://github.com/namesys-eth/ccip2-eth-client",className:"footer-text",target:"_blank",rel:"noreferrer",children:"GitHub"})]}),(0,o.jsxs)("div",{id:"modal",children:[H&&(0,o.jsx)(y.Z,{onClose:function(){return $(!1)},show:H,_ENS_:X,chain:k.wU.chainId,handleParentTrigger:function(e){Me((function(t){return D({},t,{trigger:e})}))},handleParentModalData:function(e){Me((function(t){return D({},t,{modalData:e})}))}}),(0,o.jsx)(j.Z,{onClose:function(){return _(!1)},show:I}),(0,o.jsx)(g.Z,{onClose:function(){return z(!1)},show:P}),(0,o.jsx)(v.Z,{onClose:function(){M(!1),de(""),pe(""),me("")},show:L&&"manager"===De&&fe&&!G,title:"block",children:F}),(0,o.jsx)(v.Z,{onClose:function(){M(!1),de(""),pe(""),me("")},show:L&&"search"===De&&fe&&!G,title:"block",children:"not owner or manager"}),(0,o.jsx)(p.Z,{color:Ne,_ENS_:we,onClose:function(){return q(!1)},show:E,children:Ie})]})]})})]})}}},function(e){e.O(0,[543,874,41,764,989,904,48,774,888,179],(function(){return t=682,e(e.s=t);var t}));var t=e.O();_N_E=t}]);