(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{48312:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return t(35195)}])},35195:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return q}});var r=t(34051),i=t.n(r),s=t(85893),a=t(67294),o=t(9008),l=t.n(o),c=t(71649),d=t(79747),u=t(5286),f=t(85518),m=t(73935),h=t(14141);function x(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}function p(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var r,i,s=[],a=!0,o=!1;try{for(t=t.call(e);!(a=(r=t.next()).done)&&(s.push(r.value),!n||s.length!==n);a=!0);}catch(l){o=!0,i=l}finally{try{a||null==t.return||t.return()}finally{if(o)throw i}}return s}}(e,n)||function(e,n){if(!e)return;if("string"===typeof e)return x(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(t);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return x(e,n)}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function y(e,n){return n||(n=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}function g(){var e=y(["\n  padding-top: 10px;\n  padding-left: 20px;\n  padding-right: 40px;\n  padding-bottom: 20px;\n  display: flex;\n  justify-content: center;\n  height: 500px;\n  overflow-y: auto;\n  color: white;\n"]);return g=function(){return e},e}function j(){var e=y(["\n  padding-top: 0px;\n  font-size: 22px;\n  display: flex;\n  justify-content: center;\n  font-weight: 800;\n  margin-bottom: 20px;\n  color: white;\n"]);return j=function(){return e},e}function v(){var e=y(["\n  display: flex;\n  justify-content: flex-end;\n  font-size: 20px;\n"]);return v=function(){return e},e}function b(){var e=y(["\n  background: linear-gradient(127deg, rgba(125,90,78,1) 0%, rgba(125,90,78,1) 100%);\n  width: 500px;\n  height: 600px;\n  border-radius: 6px;\n  padding: 15px;\n  overflow-y: initial !important\n  padding-bottom: 20px;\n"]);return b=function(){return e},e}function w(){var e=y(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: rgba(0, 0, 0, 0.35);\n"]);return w=function(){return e},e}var N=h.ZP.div(g()),S=h.ZP.div(j()),k=h.ZP.div(v()),C=h.ZP.div(b()),I=h.ZP.div(w()),_=function(e){var n=e.show,t=e.onClose,r="about",i=p(a.useState(!1),2),o=i[0],l=i[1];a.useEffect((function(){l(!0)}),[]);var c=n?(0,s.jsx)(I,{children:(0,s.jsxs)(C,{children:[(0,s.jsx)(k,{children:(0,s.jsx)("a",{href:"#",onClick:function(e){e.preventDefault(),t()},children:(0,s.jsx)("span",{className:"material-icons",style:{marginTop:"4px"},children:"close"})})}),(0,s.jsx)(S,{children:r}),(0,s.jsx)(N,{})]})}):null;return o?m.createPortal(c,document.getElementById("modal")):null},E=function(e){var n=e.items,t=e.onItemClick;return(0,s.jsx)("ul",{style:{listStyle:"none",fontFamily:"SF Mono",color:"white",display:"flex",alignItems:"center",flexDirection:"column",paddingRight:"2%"},children:n.map((function(e){return(0,s.jsxs)("li",{style:{display:"flex",flexDirection:"column",width:"100%"},children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,s.jsx)("span",{style:{marginBottom:"-3px",color:"#bfbfbf"},children:(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{style:{fontFamily:"SF Mono",letterSpacing:"-0px",fontWeight:"800",fontSize:"20px"},children:e.name}),(0,s.jsx)("span",{style:{fontFamily:"SF Mono",fontSize:"15px",color:"skyblue"},children:"."}),(0,s.jsx)("span",{style:{fontFamily:"Spotnik",fontSize:"11px",color:"skyblue",fontWeight:"700"},children:"eth"})]})}),(0,s.jsxs)("div",{children:[(0,s.jsx)("a",{href:"https://app.ens.domains/name/".concat(e.name,".eth"),target:"_blank",rel:"noreferrer",children:(0,s.jsx)("img",{className:"icon-ens-small",alt:"ens-icon",src:"ens.png"})}),(0,s.jsx)("a",{style:{marginRight:"15px"},href:"https://ens.vision/name/".concat(e.name,".eth"),target:"_blank",rel:"noreferrer",children:(0,s.jsx)("img",{className:"icon-vision-small",alt:"ensvision-icon",src:"ens-vision.png"})}),(0,s.jsx)("button",{className:"button",style:{alignSelf:"flex-end",height:"30px",width:"100px"},onClick:function(){return t(e.key)},"data-tooltip":"Click to edit off-chain records",children:(0,s.jsxs)("div",{className:"smol",style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["edit","\xa0",(0,s.jsx)("span",{className:"material-icons smoller",children:"manage_history"})]})})]})]}),(0,s.jsx)("hr",{})]},e.key)}))})},A=function(e){var n=e.onSearch,t=(0,a.useState)(""),r=t[0],i=t[1];return(0,s.jsx)("form",{style:{display:"flex",alignItems:"center",flexDirection:"column"},onSubmit:function(e){e.preventDefault(),n(r)},children:(0,s.jsxs)("div",{children:[(0,s.jsx)("input",{className:"input-box",type:"text",placeholder:"search .eth",value:r,onChange:function(e){i(e.target.value)}}),(0,s.jsx)("button",{className:"button",style:{height:"30px",width:"50px",marginLeft:"20px"},type:"submit",children:"Go"})]})})},O=t(15938),z=t(75533);function D(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}function P(e,n,t,r,i,s,a){try{var o=e[s](a),l=o.value}catch(c){return void t(c)}o.done?n(l):Promise.resolve(l).then(r,i)}function B(e){return function(){var n=this,t=arguments;return new Promise((function(r,i){var s=e.apply(n,t);function a(e){P(s,r,i,a,o,"next",e)}function o(e){P(s,r,i,a,o,"throw",e)}a(void 0)}))}}function F(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var r,i,s=[],a=!0,o=!1;try{for(t=t.call(e);!(a=(r=t.next()).done)&&(s.push(r.value),!n||s.length!==n);a=!0);}catch(l){o=!0,i=l}finally{try{a||null==t.return||t.return()}finally{if(o)throw i}}return s}}(e,n)||function(e,n){if(!e)return;if("string"===typeof e)return D(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(t);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return D(e,n)}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var R,T={apiKey:"oAgcfmuZf2tff0qnF-FT5xjnr_SxN3DG",network:d.N.ETH_GOERLI},M=new d.m(T),L=(O.Z.Countdown,["0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85","0x114d4603199df73e7d157787f8778e21fcd13066"]),Z=['<span class="material-icons miui">energy_savings_leaf</span><br></br>Gasless <span style="color: skyblue">ENS</span> Records','<span class="material-icons miui">hub</span><br></br>Decentralised Records Storage on <span style="color: skyblue">IPFS</span>','<span class="material-icons miui">recycling</span><br></br>Unlimited Free Updates through in-built <span style="color: skyblue">IPNS</span> Support','<span class="material-icons miui">badge</span><br></br><span style="color: skyblue">Dynamic</span> Avatars, Contenthash and Reverse Resolution','<span class="material-icons miui">currency_bitcoin</span><br></br><span style="color: skyblue">Enjoy ENS gasfree</span>'],q=function(){var e=(0,u.mA)().data,n=(0,u.$4)(),t=(n.connectors,n.isConnected),r=(0,u.LK)(),o=(r.data,r.isError,F(a.useState([]),2)),d=o[0],m=o[1],h=F(a.useState(!1),2),x=h[0],p=h[1],y=F(a.useState(!1),2),g=y[0],j=y[1],v=F(a.useState(!1),2),b=v[0],w=v[1],N=F(a.useState("owner"),2),S=N[0],k=N[1],C=((0,u.LN)().chains,(0,a.useCallback)(B(i().mark((function n(){var t,r,s,a,o,l;return i().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,M.nft.getNftsForOwner((null===e||void 0===e?void 0:e.address)?e.address:"");case 2:for(t=n.sent,r=t.ownedNfts,s=[],a=[],o=0,l=0;l<r.length;l++)L.includes(r[l].contract.address)&&r[l].title&&(o+=1,s.push(r[l].title.split(".eth")[0]),a.push({key:o,name:r[l].title.split(".eth")[0]}));m(a),j(!1),w(0===o);case 11:case"end":return n.stop()}}),n)}))),[e])),I=(0,a.useCallback)(B(i().mark((function n(){return i().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!e){n.next=3;break}return n.next=3,C();case 3:case"end":return n.stop()}}),n)}))),[e,C]);a.useEffect((function(){j(!0),I(),R&&(j(!1),m(R))}),[e,t,I]),a.useEffect((function(){var e=function(){R=d};return window.addEventListener("beforeunload",e),function(){window.removeEventListener("beforeunload",e)}}),[d]);return(0,s.jsxs)("div",{className:"page",style:{maxWidth:"100%",justifyContent:"center",display:"flex",flexDirection:"column",top:"20px"},children:[(0,s.jsx)("div",{style:{width:"100%",display:"flex",justifyContent:"flex-start"},children:(0,s.jsx)("img",{className:"avatar",alt:"sample",src:"logo-dark-alpha.png"})}),(0,s.jsxs)(l(),{children:[(0,s.jsx)("title",{children:"CCIP2 - Off-chain Records Manager"}),(0,s.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width, user-scalable=no"}),(0,s.jsx)("link",{rel:"shortcut icon",href:"logo-dark.png"})]}),(0,s.jsxs)("div",{className:"connect-button",style:{width:"100%",display:"flex",justifyContent:"flex-end"},children:[(0,s.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),p(!0)},style:{marginRight:10},"data-tooltip":"Learn more",children:(0,s.jsxs)("div",{className:"smol",style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["about","\xa0",(0,s.jsx)("span",{className:"material-icons",children:"info"})]})}),!f.tq&&(0,s.jsx)("div",{children:(0,s.jsx)(c.NL,{label:"connect"})}),f.tq&&(0,s.jsx)("div",{children:(0,s.jsx)(c.NL,{label:"connect"})})]}),(0,s.jsx)("div",{className:"container",style:{maxWidth:"inherit",margin:"50px 0 0 0"},children:(0,s.jsxs)("div",{style:{flex:"1 1 auto"},children:[(0,s.jsx)("div",{style:{marginTop:"0px"},children:(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"center",textAlign:"center"},children:[!f.tq&&!t&&(0,s.jsxs)("div",{children:[(0,s.jsx)("img",{className:"icon-ens",alt:"sample-icon",src:"ens.png"}),(0,s.jsx)("h4",{style:{fontSize:36,color:"white"},children:"Off-chain Records Manager"})]}),!f.tq&&t&&(0,s.jsxs)("div",{style:{marginTop:"-50px"},children:[(0,s.jsx)("img",{className:"icon-ens",alt:"sample-icon",src:"ens.png"}),(0,s.jsx)("h4",{style:{fontSize:22,color:"white"},children:"Off-chain Records Manager"})]}),f.tq&&!t&&(0,s.jsxs)("div",{children:[(0,s.jsx)("img",{className:"icon-ens",alt:"sample-icon",src:"ens.png"}),(0,s.jsx)("h4",{style:{fontSize:26,color:"white"},children:"Off-chain Records Manager"})]}),f.tq&&t&&(0,s.jsxs)("div",{children:[(0,s.jsx)("img",{className:"icon-ens",alt:"sample-icon",src:"ens.png"}),(0,s.jsx)("h4",{style:{fontSize:18,color:"white"},children:"Off-chain Records Manager"})]})]})}),(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),!t&&(0,s.jsx)("div",{style:{marginBottom:"0px"},children:(0,s.jsx)("div",{className:"content-slider",children:(0,s.jsx)("div",{className:"slider",children:(0,s.jsx)("div",{className:"mask",children:(0,s.jsx)("ul",{children:Z.map((function(e,n){return(0,s.jsx)("li",{className:"anim".concat(n+1),children:(0,s.jsx)("div",{className:"home-modal-item",children:(0,s.jsx)("div",{dangerouslySetInnerHTML:{__html:e}})})},n)}))})})})})}),t&&(0,s.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"row",marginBottom:"50px"},children:[(0,s.jsx)("button",{onClick:function(){k("owner")},className:"button-header",disabled:"owner"===S,"data-tooltip":"Show names you own",children:(0,s.jsxs)("div",{className:"smol",style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["owned","\xa0",(0,s.jsx)("span",{className:"material-icons",children:"manage_accounts"})]})}),(0,s.jsx)("button",{onClick:function(){k("manager")},className:"button-header",disabled:"manager"===S,"data-tooltip":"Search for a name that you manage",children:(0,s.jsxs)("div",{className:"smol",style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["managed","\xa0",(0,s.jsx)("span",{className:"material-icons",children:"supervised_user_circle"})]})}),(0,s.jsx)("button",{onClick:function(){k("search")},className:"button-header",disabled:"search"===S,"data-tooltip":"Search for an ENS name",children:(0,s.jsxs)("div",{className:"smol",style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:["search","\xa0",(0,s.jsx)("span",{className:"material-icons",children:"search"})]})})]}),g&&t&&(0,s.jsx)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",marginTop:"50px",marginBottom:"200px"},children:(0,s.jsx)(z.ZP.Bars,{})}),!g&&"owner"===S&&d&&t&&!b&&(0,s.jsxs)("div",{children:[(0,s.jsx)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"white",marginBottom:"25px"},children:"names you own"}),(0,s.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,s.jsx)(E,{items:d,onItemClick:function(e){console.log("Item ".concat(e," clicked"))}})})]}),!g&&"manager"===S&&d&&t&&(0,s.jsxs)("div",{children:[(0,s.jsx)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"white",marginBottom:"25px"},children:"names you manage"}),(0,s.jsx)("div",{className:"search-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,s.jsx)(A,{onSearch:function(e){console.log("Searching Manager for ".concat(e))}})})]}),!g&&"search"===S&&d&&t&&(0,s.jsxs)("div",{children:[(0,s.jsx)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"white",marginBottom:"25px"},children:"search names"}),(0,s.jsx)("div",{className:"search-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,s.jsx)(A,{onSearch:function(e){console.log("Searching for ".concat(e))}})})]}),b&&(0,s.jsx)("div",{children:(0,s.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"white",marginBottom:"25px"},children:[(0,s.jsx)("span",{className:"material-icons",children:"warning"}),"\xa0 No Names Found"]})}),(0,s.jsxs)("div",{style:{color:"white",marginTop:"20%",marginBottom:20,alignItems:"center",justifyContent:"center",display:"flex"},children:[(0,s.jsx)("span",{className:"material-icons",children:"folder_open"}),"\xa0",(0,s.jsx)("a",{href:"https://github.com/namesys-eth/ccip2-eth-client",className:"footer-text",target:"_blank",rel:"noreferrer",children:"GitHub"})]}),(0,s.jsx)(_,{onClose:function(){return p(!1)},show:x}),(0,s.jsx)("div",{id:"modal"})]})})]})}}},function(e){e.O(0,[788,480,774,888,179],(function(){return n=48312,e(e.s=n);var n}));var n=e.O();_N_E=n}]);