(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{48312:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(11033)}])},11033:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return q}});var i=n(34051),r=n.n(i),s=n(85893),o=n(67294),a=n(9008),l=n.n(a),c=n(71649),d=n(5286),u=n(2593),f=n(27586),h=n(38197),x=n(29251),p=n(85518),m=n(65721),y=n(2959),g=n(48695),v=n(68059),j=n(48879),w=n(23513),b=n(454),S=n(83306),N=function(e){var t=e.onSearch,n=(0,o.useState)(""),i=n[0],r=n[1];return(0,s.jsx)("form",{style:{display:"flex",alignItems:"center",flexDirection:"column"},onSubmit:function(e){e.preventDefault(),t(i)},children:(0,s.jsxs)("div",{style:{display:"flex",alignItems:"center",flexDirection:"row"},children:[(0,s.jsx)("input",{className:"input-main",type:"text",placeholder:p.tq?"search .eth":"search for a .eth domain",value:i,name:".eth search",id:"eth-search",onChange:function(e){r(e.target.value)},onInvalid:function(e){e.target.setCustomValidity("Please enter a valid .eth name")},onInput:function(e){e.target.setCustomValidity("")},required:!0,pattern:".*\\.eth$",title:"\u2757 Input must end with '.eth'"}),(0,s.jsx)("button",{className:"button",style:{height:"46px",width:"80px",marginLeft:"20px"},type:"submit","data-tooltip":"Search",children:(0,s.jsx)("span",{className:"material-icons",style:{fontSize:"28px",fontWeight:"700"},children:"search"})})]})})},k=n(39428);function C(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function _(e,t,n,i,r,s,o){try{var a=e[s](o),l=a.value}catch(c){return void n(c)}a.done?t(l):Promise.resolve(l).then(i,r)}function I(e){return function(){var t=this,n=arguments;return new Promise((function(i,r){var s=e.apply(t,n);function o(e){_(s,i,r,o,a,"next",e)}function a(e){_(s,i,r,o,a,"throw",e)}o(void 0)}))}}function O(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function T(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),i.forEach((function(t){O(e,t,n[t])}))}return e}function E(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var i,r,s=[],o=!0,a=!1;try{for(n=n.call(e);!(o=(i=n.next()).done)&&(s.push(i.value),!t||s.length!==t);o=!0);}catch(l){a=!0,r=l}finally{try{o||null==n.return||n.return()}finally{if(a)throw r}}return s}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return C(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return C(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var q=function(){var e=(0,d.mA)().data,t=(0,d.$4)().isConnected,n=E(o.useState([]),2),i=n[0],a=n[1],C=E(o.useState(!1),2),_=C[0],O=C[1],q=E(o.useState(!1),2),D=q[0],P=q[1],R=E(o.useState(!1),2),M=R[0],A=R[1],L=E(o.useState(!1),2),W=L[0],Z=L[1],F=E(o.useState(""),2),B=F[0],z=F[1],H=E(o.useState(!1),2),$=H[0],U=H[1],V=E(o.useState(""),2),X=V[0],Y=V[1],G=E(o.useState(!0),2),J=G[0],K=G[1],Q=E(o.useState(!1),2),ee=Q[0],te=Q[1],ne=E(o.useState(!1),2),ie=ne[0],re=ne[1],se=E(o.useState(""),2),oe=se[0],ae=se[1],le=E(o.useState(""),2),ce=le[0],de=le[1],ue=E(o.useState(""),2),fe=ue[0],he=ue[1],xe=E(o.useState(""),2),pe=xe[0],me=xe[1],ye=E(o.useState(""),2),ge=ye[0],ve=ye[1],je=E(o.useState(""),2),we=je[0],be=je[1],Se=E(o.useState(""),2),Ne=Se[0],ke=Se[1],Ce=E(o.useState(""),2),_e=Ce[0],Ie=Ce[1],Oe=E(o.useState(!1),2),Te=Oe[0],Ee=Oe[1],qe=E(o.useState({modalData:!1,trigger:!1}),2),De=(qe[0],qe[1]);function Pe(){return Re.apply(this,arguments)}function Re(){return(Re=I(r().mark((function e(){var t,n,i;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={type:"gas"},e.prev=1,e.next=4,fetch("https://sshmatrix.club:3003/gas",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 4:return n=e.sent,e.next=7,n.json();case 7:return i=e.sent,e.abrupt("return",i.response.gas);case 11:return e.prev=11,e.t0=e.catch(1),console.log("Failed to get gas data from NameSys backend"),e.abrupt("return","");case 15:case"end":return e.stop()}}),e,null,[[1,11]])})))).apply(this,arguments)}o.useEffect((function(){k.hc(5);var e=function(){var e=I(r().mark((function e(){var t;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Pe();case 2:t=e.sent,me(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),o.useEffect((function(){var e=function(){};return window.addEventListener("beforeunload",e),function(){window.removeEventListener("beforeunload",e)}}),[i]);var Me=(0,d.do)(k.qP[1],"getApproved",{args:[oe]}).data,Ae=(0,d.do)(k.qP[1],"ownerOf",{args:[oe]}).data,Le=(0,d.do)(k.K0[0],"recordhash",{args:[f.VM(fe)]}).data;o.useEffect((function(){Me&&(null===Me||void 0===Me?void 0:Me.toString())!=="0x"+"0".repeat(40)?de(Me.toString()):(null===Me||void 0===Me?void 0:Me.toString())==="0x"+"0".repeat(40)&&Ae?de(Ae.toString()):setTimeout((function(){K(!1)}),2e3)}),[oe,Me,Ae]),o.useEffect((function(){if(fe.length>0){var e=[];[].push(fe.split(".eth")[0]);var t=function(){var t=I(r().mark((function t(){return r().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:k.Ap.getResolver(fe).then((function(t){e.push({key:1,name:fe.split(".eth")[0],migrated:(null===t||void 0===t?void 0:t.address)===k.bt[0]?"1/2":"0"}),e.length>0&&(null===t||void 0===t?void 0:t.address)?("0x"!==(null===Le||void 0===Le?void 0:Le.toString())&&"1/2"===e[0].migrated&&(e[0].migrated="1"),a(e),re(!0)):re(!1)}));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}}),[fe]),o.useEffect((function(){ie&&Ae&&Ae.toString()!==k.DR?(console.log("Name is Registered"),Z(!1),K(!1),te(!1)):(console.log("Name not Registered"),z("Name not Registered"),Z(!0),K(!1),te(!0))}),[ie]),o.useEffect((function(){if(fe)try{var e=h.keccak256(x.Y0(fe.split(".eth")[0])),t=u.O$.from(e);ae(t.toString())}catch(n){console.log("BigNumberWarning")}}),[fe]);return(0,s.jsxs)("div",{className:"page",style:{maxWidth:"100%",justifyContent:"center",display:"flex",flexDirection:"column",top:"20px"},children:[!p.tq&&(0,s.jsx)("div",{style:{margin:"20px",width:"40%",display:"flex",justifyContent:"flex-start"},children:(0,s.jsx)("img",{className:"avatar",alt:"corner-index",src:"logo.png"})}),(0,s.jsxs)(l(),{children:[(0,s.jsx)("title",{children:"NameSys - Off-Chain Records Manager"}),(0,s.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width"}),(0,s.jsx)("link",{rel:"shortcut icon",href:"logo.png"}),(0,s.jsx)("link",{rel:"preload",href:"https://fonts.googleapis.com/icon?family=Material+Icons",as:"style"}),(0,s.jsx)("link",{rel:"preload",href:"SF-Mono.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"}),(0,s.jsx)("link",{rel:"preload",href:"Spotnik.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"}),(0,s.jsx)("link",{rel:"preload",href:"Rajdhani.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"})]}),(0,s.jsx)("div",{style:{fontFamily:"Rajdhani"}}),(0,s.jsx)("div",{style:{fontFamily:"SF Mono"}}),(0,s.jsx)("div",{style:{fontFamily:"Spotnik"}}),(0,s.jsx)("div",{id:"overlay",className:"overlay",children:(0,s.jsxs)("div",{className:"overlay-content",children:[(0,s.jsx)(S.Z,{height:75,width:75}),(0,s.jsx)("div",{style:{marginTop:"20px"},children:(0,s.jsx)("span",{children:"PLEASE WAIT"})})]})}),(0,s.jsx)("div",{children:(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"space-between",width:"100%"},children:[(0,s.jsxs)("div",{style:{display:"flex",flexDirection:p.tq?"column":"row",marginLeft:p.tq?"25px":"9%",marginRight:"auto",marginTop:p.tq?"25px":"-7%"},children:[(0,s.jsx)("div",{style:{marginRight:p.tq?"20px":"40px"},children:(0,s.jsx)("button",{className:"button",onClick:function(){window.location.href="/ccip2-eth-client/account"},"data-tooltip":"My Names",disabled:!t,children:(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:[p.tq?"Names":"My Names","\xa0",(0,s.jsx)("span",{className:"material-icons",children:"admin_panel_settings"})]})})}),(0,s.jsx)("div",{style:{marginLeft:p.tq?"-9px":"-30px"},children:(0,s.jsx)(b.Z,{variable:pe})})]}),(0,s.jsxs)("div",{className:"connect-button",style:{marginLeft:"auto",display:"flex",flexDirection:"row",marginTop:p.tq?"25px":"-7%"},children:[(0,s.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),O(!0)},style:{marginRight:10},"data-tooltip":"Learn more",children:(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["about",(0,s.jsx)("span",{style:{fontFamily:"SF Mono"},children:"\xa0"}),(0,s.jsx)("span",{className:"material-icons",children:"info"})]})}),(0,s.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),A(!0)},style:{marginRight:10},"data-tooltip":"Terms of Use",children:(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["terms","\xa0",(0,s.jsx)("span",{className:"material-icons",children:"gavel"})]})}),!p.tq&&(0,s.jsx)("div",{children:(0,s.jsx)(c.NL,{label:"connect"})}),p.tq&&(0,s.jsx)("div",{children:(0,s.jsx)(c.NL,{label:"connect"})})]})]})}),(0,s.jsx)("div",{className:"container",style:{maxWidth:"inherit",marginTop:Te?"0px":"40px"},children:(0,s.jsxs)("div",{className:p.tq||Te?"none":"heading",style:{flex:"1 1 auto"},children:[(0,s.jsx)("div",{style:{marginTop:"-120px"},children:(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"center",textAlign:"center",paddingTop:"100px"},children:[!p.tq&&(0,s.jsxs)("div",{children:[(0,s.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,s.jsx)("h4",{style:{fontSize:Te?"46px":"50px",marginTop:Te?"20px":"25px",color:"#fc6603",marginBottom:"10px"},children:"NameSys"}),(0,s.jsx)("h4",{style:{fontSize:Te?"24px":"28px",color:"#eb8634"},children:"Off-chain Records Manager"})]}),p.tq&&(0,s.jsxs)("div",{children:[(0,s.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png"}),(0,s.jsx)("h4",{style:{fontSize:Te?"36px":"44px",marginTop:Te?"12px":"10px",color:"#fc6603"},children:"NameSys"}),(0,s.jsx)("div",{style:{fontSize:Te?"20px":"24px",fontWeight:700,color:"#eb8634"},children:"Off-chain Records Manager"})]})]})}),(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),(0,s.jsx)("div",{className:"main-search-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,s.jsx)(N,{onSearch:function(e){a([]),ae(""),de(""),K(!0),Ie("search"),he(e),Ee(!0),console.log("Searching for ".concat(e))}})}),!Te&&(0,s.jsx)("div",{children:(0,s.jsx)("div",{className:"content-slider",children:(0,s.jsx)("div",{className:"slider",children:(0,s.jsx)("div",{className:"mask",children:(0,s.jsx)("ul",{children:k.hh.map((function(e,t){return(0,s.jsx)("li",{className:"anim".concat(t+1),children:(0,s.jsx)("div",{className:"carousal-item",children:(0,s.jsx)("div",{dangerouslySetInnerHTML:{__html:e}})})},t)}))})})})})}),J&&Te&&(0,s.jsx)("div",{children:(0,s.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",marginTop:"-10px",marginBottom:"200px"},children:[(0,s.jsx)("div",{style:{paddingBottom:"10px",alignItems:"center",justifyContent:"center",display:"flex"},children:(0,s.jsx)(S.Z,{height:50,width:50})}),(0,s.jsx)("div",{style:{marginTop:"40px"},children:(0,s.jsx)("span",{style:{color:"#fc6603",fontWeight:"700"},children:"Please Wait"})})]})}),!J&&i.length>0&&!ee&&Te&&(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"skyblue",marginBottom:"25px",fontWeight:"700"},children:[(0,s.jsx)("span",{style:{marginRight:"5px"},children:"search results"}),(0,s.jsx)("button",{className:"button-tiny",onClick:function(){P(!0),ve("info"),be("skyblue"),ke("search results for your query")},children:(0,s.jsx)("div",{className:"material-icons smol",style:{color:"skyblue"},children:"info_outline"})})]}),(0,s.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,s.jsx)(w.Z,{label:t&&ce===(null===e||void 0===e?void 0:e.address)?"edit":"view",items:i,onItemClick:function(e){U(!0),Y(e)}})})]}),(0,s.jsxs)("div",{style:{color:"#fc6603",top:"auto",left:"50%",transform:"translateX(-50%)",bottom:10,alignItems:"center",justifyContent:"center",display:"flex",position:"fixed"},children:[(0,s.jsx)("span",{className:"material-icons",children:"folder_open"}),"\xa0",(0,s.jsx)("a",{href:"https://github.com/namesys-eth/ccip2-eth-client",className:"footer-text",target:"_blank",rel:"noreferrer",children:"GitHub"})]}),(0,s.jsxs)("div",{id:"modal",children:[$&&(0,s.jsx)(g.Z,{onClose:function(){return U(!1)},show:$,_ENS_:X,chain:k.wU.chainId,handleParentTrigger:function(e){De((function(t){return T({},t,{trigger:e})}))},handleParentModalData:function(e){De((function(t){return T({},t,{modalData:e})}))}}),(0,s.jsx)(v.Z,{onClose:function(){return O(!1)},show:_}),(0,s.jsx)(y.Z,{onClose:function(){return A(!1)},show:M}),(0,s.jsx)(j.Z,{onClose:function(){Z(!1),ae(""),he(""),de("")},show:W&&"search"===_e&&!J,title:"block",children:B}),(0,s.jsx)(m.Z,{color:we,_ENS_:ge,onClose:function(){return P(!1)},show:D,children:Ne})]})]})})]})}}},function(e){e.O(0,[543,874,41,764,989,904,667,774,888,179],(function(){return t=48312,e(e.s=t);var t}));var t=e.O();_N_E=t}]);