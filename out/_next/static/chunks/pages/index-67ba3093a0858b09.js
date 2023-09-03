(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5405],{41928:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return _}});var r=n(50029),a=n(59499),s=n(16835),i=n(87794),o=n.n(i),c=n(67294),l=n(9008),d=n.n(l),u=n(56974),f=n(35133),p=n(64146),x=n(2593),h=n(27586),m=n(16441),g=n(38197),v=n(84917),y=n(9279),j=n(85518),w=n(22794),N=n(92675),b=n(91930),S=n(92673),k=n(64637),O=n(58595),Z=n(40342),q=n(22661),D=n(85893),E=function(e){var t=e.onSearch,n=(0,c.useState)(""),r=n[0],a=n[1];return(0,D.jsx)("form",{style:{display:"flex",alignItems:"center",flexDirection:"column"},onSubmit:function(e){e.preventDefault(),t(r)},children:(0,D.jsxs)("div",{style:{display:"flex",alignItems:"center",flexDirection:"row"},children:[(0,D.jsx)("input",{className:"input-main",type:"text",placeholder:j.tq?"search .eth":"search for a .eth domain",value:r.toLowerCase(),name:".eth search",id:"eth-search",onChange:function(e){a(e.target.value.toLowerCase())},onInvalid:function(e){e.target.setCustomValidity("Please enter a valid .eth name")},onInput:function(e){e.target.setCustomValidity("")},required:!0,pattern:".*\\.eth$",title:"\u2757 Input must end with '.eth'",style:{fontFamily:r?"SF Mono":"Spotnik",fontWeight:"600",fontSize:r?"22px":"19px",paddingTop:r?"8px":"15px",paddingBottom:r?"8px":"15px"}}),(0,D.jsx)("button",{className:"button",style:{height:"46px",width:"80px",marginLeft:"20px"},type:"submit","data-tooltip":"Search",disabled:!r.length,children:(0,D.jsx)("span",{className:"material-icons",style:{fontSize:"28px",fontWeight:"700"},children:"search"})})]})})},R=n(3472),C=n(71775),P=n(67191);function T(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function I(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?T(Object(n),!0).forEach((function(t){(0,a.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):T(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var _=function(){(0,f.LN)().chain;var e=(0,f.mA)(),t=e.address,n=e.isConnected,a=e.isDisconnected,i=c.useState([]),l=(0,s.Z)(i,2),T=l[0],_=l[1],L=c.useState(!1),M=(0,s.Z)(L,2),W=M[0],F=M[1],A=c.useState(!1),z=(0,s.Z)(A,2),H=z[0],B=z[1],K=c.useState(!1),V=(0,s.Z)(K,2),G=V[0],U=V[1],X=c.useState(!1),Y=(0,s.Z)(X,2),$=Y[0],J=Y[1],Q=c.useState(""),ee=(0,s.Z)(Q,2),te=ee[0],ne=ee[1],re=c.useState(!1),ae=(0,s.Z)(re,2),se=ae[0],ie=ae[1],oe=c.useState(""),ce=(0,s.Z)(oe,2),le=ce[0],de=ce[1],ue=c.useState(!0),fe=(0,s.Z)(ue,2),pe=fe[0],xe=fe[1],he=c.useState(!1),me=(0,s.Z)(he,2),ge=me[0],ve=me[1],ye=c.useState(!1),je=(0,s.Z)(ye,2),we=je[0],Ne=je[1],be=c.useState(!1),Se=(0,s.Z)(be,2),ke=Se[0],Oe=Se[1],Ze=c.useState(""),qe=(0,s.Z)(Ze,2),De=qe[0],Ee=qe[1],Re=c.useState(""),Ce=(0,s.Z)(Re,2),Pe=Ce[0],Te=Ce[1],Ie=c.useState(""),_e=(0,s.Z)(Ie,2),Le=_e[0],Me=_e[1],We=c.useState(""),Fe=(0,s.Z)(We,2),Ae=Fe[0],ze=Fe[1],He=c.useState(""),Be=(0,s.Z)(He,2),Ke=Be[0],Ve=Be[1],Ge=c.useState(""),Ue=(0,s.Z)(Ge,2),Xe=Ue[0],Ye=Ue[1],$e=c.useState(""),Je=(0,s.Z)($e,2),Qe=Je[0],et=Je[1],tt=c.useState(""),nt=(0,s.Z)(tt,2),rt=nt[0],at=nt[1],st=c.useState(""),it=(0,s.Z)(st,2),ot=it[0],ct=it[1],lt=c.useState(""),dt=(0,s.Z)(lt,2),ut=dt[0],ft=dt[1],pt=c.useState(""),xt=(0,s.Z)(pt,2),ht=xt[0],mt=xt[1],gt=c.useState(""),vt=(0,s.Z)(gt,2),yt=vt[0],jt=vt[1],wt=c.useState(""),Nt=(0,s.Z)(wt,2),bt=Nt[0],St=Nt[1],kt=c.useState(!1),Ot=(0,s.Z)(kt,2),Zt=Ot[0],qt=Ot[1],Dt=c.useState({modalData:"",trigger:!1}),Et=(0,s.Z)(Dt,2),Rt=Et[0],Ct=Et[1],Pt=R.bt[1],Tt=R.K0[1];function It(e){return _t.apply(this,arguments)}function _t(){return(_t=(0,r.Z)(o().mark((function e(t){var n,r,a,s,i,c;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="",r="",a=new p.CH(R.qP[0].addressOrName,R.qP[0].contractInterface,t),e.prev=3,e.next=6,a.owner(Le);case 6:r=e.sent,e.next=11;break;case 9:e.prev=9,e.t0=e.catch(3);case 11:return s=new p.CH(R.qP[1].addressOrName,R.qP[1].contractInterface,t),e.prev=12,e.next=15,s.ownerOf(De);case 15:n=e.sent,e.next=20;break;case 18:e.prev=18,e.t1=e.catch(12);case 20:return i=new p.CH(R.qP[7].addressOrName,R.qP[7].contractInterface,t),c="",e.prev=22,e.next=25,i.ownerOf(Pe);case 25:c=e.sent,e.next=30;break;case 28:e.prev=28,e.t2=e.catch(22);case 30:if(n!==y.d){e.next=32;break}return e.abrupt("return","0x");case 32:if(n!==R.O[7]){e.next=38;break}if(c===y.d){e.next=37;break}return e.abrupt("return",c);case 37:return e.abrupt("return","0x");case 38:return e.abrupt("return",r);case 39:case"end":return e.stop()}}),e,null,[[3,9],[12,18],[22,28]])})))).apply(this,arguments)}function Lt(e,t){return Mt.apply(this,arguments)}function Mt(){return(Mt=(0,r.Z)(o().mark((function e(t,n){var r,a;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=new p.CH(Tt.addressOrName,Tt.contractInterface,t),a="",e.prev=2,e.next=5,r.getRecordhash(h.VM(n));case 5:a=e.sent,e.next=11;break;case 8:e.prev=8,e.t0=e.catch(2),console.error("Error in getRecordhash():",e.t0);case 11:if(null!==a){e.next=13;break}return e.abrupt("return","");case 13:return e.abrupt("return","ipns://".concat(P.K5(a.toString()).decoded));case 14:case"end":return e.stop()}}),e,null,[[2,8]])})))).apply(this,arguments)}function Wt(e,t){return Ft.apply(this,arguments)}function Ft(){return(Ft=(0,r.Z)(o().mark((function e(t,n){var r,a;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=new p.CH(Tt.addressOrName,Tt.contractInterface,t),a="",e.prev=2,e.next=5,r.getRecordhash(m.hexZeroPad(n,32).toLowerCase());case 5:a=e.sent,e.next=11;break;case 8:e.prev=8,e.t0=e.catch(2),console.error("Error in getRecordhash():",e.t0);case 11:if(null!==a){e.next=13;break}return e.abrupt("return","");case 13:return e.abrupt("return","ipns://".concat(P.K5(a.toString()).decoded));case 14:case"end":return e.stop()}}),e,null,[[2,8]])})))).apply(this,arguments)}function At(){return zt.apply(this,arguments)}function zt(){return(zt=(0,r.Z)(o().mark((function e(){var t,n,r;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={type:"gas"},e.prev=1,e.next=4,fetch("https://ipfs.namesys.xyz:3003/gas",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 4:return n=e.sent,e.next=7,n.json();case 7:return r=e.sent,e.abrupt("return",r.response.gas);case 11:return e.prev=11,e.t0=e.catch(1),console.error("Error:","Failed to get gas data from NameSys backend"),e.abrupt("return","");case 15:case"end":return e.stop()}}),e,null,[[1,11]])})))).apply(this,arguments)}c.useEffect((function(){St(""),jt(""),mt(""),R.hc(5);var e=function(){var e=(0,r.Z)(o().mark((function e(){var t;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,At();case 2:t=e.sent,Ye(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),c.useEffect((function(){if(Rt.trigger&&Rt.modalData){var e=T,n=e.findIndex((function(e){return"".concat(e.name,".eth")===Rt.modalData.slice(0,-1)})),a=function(){var a=(0,r.Z)(o().mark((function r(){var a,s,i;return o().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(!Rt.modalData){r.next=11;break}return r.next=3,R.Ap.getResolver(Rt.modalData.slice(0,-1));case 3:return a=r.sent,r.next=6,C.cU(Rt.modalData.slice(0,-1),Tt,t||R.DR);case 6:return s=r.sent,r.next=9,C.Yy(Tt,t||R.DR);case 9:i=r.sent,e[n].migrated=(null===a||void 0===a?void 0:a.address)===Pt&&s?"1":(null===a||void 0===a?void 0:a.address)===Pt&&i?"3/4":(null===a||void 0===a?void 0:a.address)===Pt?"1/2":"0";case 11:case"end":return r.stop()}}),r)})));return function(){return a.apply(this,arguments)}}();a(),_(e),ie(!1)}}),[Rt]),c.useEffect((function(){Rt.trigger&&Rt.modalData&&!se&&("#"===Rt.modalData.charAt(Rt.modalData.length-1)?de("".concat(Rt.modalData.slice(0,-1),"#")):"-"===Rt.modalData.charAt(Rt.modalData.length-1)?de("".concat(Rt.modalData.slice(0,-1),"-")):"+"===Rt.modalData.charAt(Rt.modalData.length-1)&&de("".concat(Rt.modalData.slice(0,-1),"+")),Ct({modalData:"",trigger:!1}))}),[se,Rt]),c.useEffect((function(){le.endsWith(":")||le.endsWith("#")||le.endsWith("-")?ie(!0):ie(!1)}),[le]),c.useEffect((function(){var e=function(){};return window.addEventListener("beforeunload",e),function(){window.removeEventListener("beforeunload",e)}}),[T]);var Ht=(0,f.do)({address:"0x".concat(R.qP[1].addressOrName.slice(2)),abi:R.qP[1].contractInterface,functionName:"ownerOf",args:[De]}),Bt=Ht.data,Kt=(Ht.isLoading,Ht.isError,(0,f.do)({address:"0x".concat(R.qP[7].addressOrName.slice(2)),abi:R.qP[7].contractInterface,functionName:"ownerOf",args:[Pe]})),Vt=Kt.data,Gt=(Kt.isLoading,Kt.isError,(0,f.do)({address:"0x".concat(R.qP[0].addressOrName.slice(2)),abi:R.qP[0].contractInterface,functionName:"owner",args:[Le]})),Ut=Gt.data,Xt=(Gt.isLoading,Gt.isError,(0,f.do)({address:"0x".concat(Tt.addressOrName.slice(2)),abi:Tt.contractInterface,functionName:"getRecordhash",args:[h.VM(Ke)]})),Yt=Xt.data,$t=(Xt.isLoading,Xt.isError,(0,f.do)({address:"0x".concat(Tt.addressOrName.slice(2)),abi:Tt.contractInterface,functionName:"getRecordhash",args:[m.hexZeroPad(t||R.DR,32).toLowerCase()]})),Jt=$t.data;$t.isLoading,$t.isError;c.useEffect((function(){Bt&&Ut&&(null===Bt||void 0===Bt?void 0:Bt.toString())!==R.DR&&(null===Ut||void 0===Ut?void 0:Ut.toString())!==R.DR?Bt.toString()===R.O[7]?Vt&&(null===Vt||void 0===Vt?void 0:Vt.toString())!==R.DR&&(ze(Vt.toString()),St(Vt.toString())):(ze(Ut.toString()),St(Ut.toString())):St("0x")}),[De,Bt,Pe,Vt,Ut]),c.useEffect((function(){if(!t&&De&&Pe&&Ke&&""!==Ke){var e=function(){var e=(0,r.Z)(o().mark((function e(){var t,n,r;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,It(R.Ap);case 2:return t=e.sent,e.next=5,Lt(R.Ap,Ke);case 5:return n=e.sent,e.next=8,Wt(R.Ap,t);case 8:r=e.sent,t?(St(t),n&&r&&n!==r?(mt(n),jt(r)):n&&r&&n===r?(mt(""),jt(r)):n&&!r?(mt(n),jt("")):(mt(""),jt(""))):(St("0x"),Ne(!1));case 10:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}}),[Ke,De,Pe]),c.useEffect((function(){if(Ke.length>0){var e=[];[].push(Ke.split(".eth")[0]);var t=function(){var t=(0,r.Z)(o().mark((function t(){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:R.Ap.getResolver(Ke).then((function(t){e.push({key:1,name:Ke.split(".eth")[0],migrated:(null===t||void 0===t?void 0:t.address)===Pt?"1/2":"0"}),e.length>0&&(ht&&"ipns://"!==ht.toString()&&"1/2"===e[0].migrated?e[0].migrated="1":yt&&"ipns://"!==yt.toString()&&"1/2"===e[0].migrated&&(e[0].migrated="3/4"),_(e),Ne(!0),Oe(!0))}));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}}),[Ke,ht,yt]),c.useEffect((function(){mt(Yt&&Yt!==Jt&&t?"ipns://".concat(P.K5(Yt.toString()).decoded):"")}),[Yt,Jt]),c.useEffect((function(){jt(Jt&&t?"ipns://".concat(P.K5(Jt.toString()).decoded):"")}),[Jt]),c.useEffect((function(){we&&ke?"0x"!==bt&&bt!==R.DR?(J(!1),xe(!0),setTimeout((function(){xe(!1)}),5e3),ve(!1)):(setTimeout((function(){xe(!1)}),2e3),ne("Name not Registered Or Expired Or in Grace"),J(!0),ve(!0),Ve("")):ke?(setTimeout((function(){xe(!1)}),2e3),ne("Name not Registered Or Expired Or in Grace"),J(!0),ve(!0)):xe(!0)}),[we,bt,ke]),c.useEffect((function(){if(Ke)try{var e=h.VM(Ke),t=x.O$.from(e);Te(t.toString());var n=g.keccak256(v.Y0(Ke.split(".eth")[0]));Me(e),Ee(x.O$.from(n).toString())}catch(r){}}),[Ke,bt,Ae]);return(0,D.jsxs)("div",{className:"page flex-column-sans-align",style:{maxWidth:"100vw",top:"20px"},children:[!j.tq&&(0,D.jsx)("div",{style:{margin:"20px",width:"40%",display:"flex",justifyContent:"flex-start"},children:(0,D.jsx)("img",{className:"avatar",alt:"corner-index",src:"logo.png"})}),(0,D.jsxs)(d(),{children:[(0,D.jsx)("title",{children:"NameSys - Off-Chain Records Manager"}),(0,D.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width"}),(0,D.jsx)("meta",{name:"description",content:"NameSys"}),(0,D.jsx)("link",{rel:"manifest",href:"/manifest.json"}),(0,D.jsx)("link",{rel:"shortcut icon",href:"logo.png"}),(0,D.jsx)("link",{rel:"preload",href:"https://fonts.googleapis.com/icon?family=Material+Icons",as:"style"}),(0,D.jsx)("link",{rel:"preload",href:"SF-Mono.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"}),(0,D.jsx)("link",{rel:"preload",href:"Spotnik.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"}),(0,D.jsx)("link",{rel:"preload",href:"Rajdhani.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"})]}),(0,D.jsx)("div",{style:{fontFamily:"Rajdhani"}}),(0,D.jsx)("div",{style:{fontFamily:"SF Mono"}}),(0,D.jsx)("div",{style:{fontFamily:"Spotnik"}}),(0,D.jsx)("div",{id:"overlay",className:"overlay",children:(0,D.jsxs)("div",{className:"overlay-content",children:[(0,D.jsx)(q.Z,{height:75,width:75}),(0,D.jsx)("div",{style:{marginTop:"20px"},children:(0,D.jsx)("span",{children:"PLEASE WAIT"})})]})}),(0,D.jsx)("div",{children:(0,D.jsxs)("div",{style:{display:"flex",flexDirection:"row",alignItems:"space-between",width:"100%"},children:[(0,D.jsxs)("div",{style:{display:"flex",flexDirection:j.tq?"column":"row",marginLeft:j.tq?"25px":"9%",marginRight:"auto",marginTop:j.tq?"25px":"-7%"},children:[(0,D.jsx)("div",{style:{marginRight:j.tq?"20px":"40px"},children:(0,D.jsx)("button",{className:"button",onClick:function(){window.location.href="/ccip2-eth-client/account.html"},"data-tooltip":"My Names",disabled:a,hidden:j.tq,children:(0,D.jsxs)("div",{className:"flex-sans-direction",children:[j.tq?"Names":"My Names","\xa0",(0,D.jsx)("span",{className:"material-icons",children:"admin_panel_settings"})]})})}),(0,D.jsx)("div",{style:{marginLeft:j.tq?"-9px":"-30px",marginTop:j.tq?"-15px":"0px"},children:(0,D.jsx)(Z.Z,{variable:Xe})})]}),(0,D.jsxs)("div",{className:"connect-button",style:{marginLeft:"auto",display:"flex",flexDirection:j.tq?"column":"row",marginTop:j.tq?"-5px":"-7%"},children:[(0,D.jsxs)("div",{style:{marginRight:j.tq?"10px":"15px",marginTop:j.tq?"10px":"6px",color:"#fc6603",fontFamily:"SF Mono",fontSize:j.tq?"13px":"18px"},children:[(0,D.jsx)("span",{style:{fontFamily:"Spotnik",fontSize:j.tq?"7.5px":"12px",fontWeight:"700",marginRight:"2px"},children:"v"}),"1.0.2",(0,D.jsx)("span",{style:{fontFamily:"Spotnik",fontSize:j.tq?"10px":"15px",fontWeight:"700",marginLeft:"2px"}})]}),(0,D.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),F(!0)},style:{marginRight:10,display:"none"},"data-tooltip":"Learn more",children:(0,D.jsxs)("div",{className:"flex-row",children:["about",(0,D.jsx)("span",{style:{fontFamily:"SF Mono"},children:"\xa0"}),(0,D.jsx)("span",{className:"material-icons",children:"info"})]})}),(0,D.jsx)("button",{className:"button clear",onClick:function(){window.scrollTo(0,0),U(!0)},style:{marginRight:10,display:"none"},"data-tooltip":"Terms of Use",children:(0,D.jsxs)("div",{className:"flex-row",children:["terms","\xa0",(0,D.jsx)("span",{className:"material-icons",children:"gavel"})]})}),!j.tq&&(0,D.jsx)("div",{children:(0,D.jsx)(u.NL,{label:"connect"})}),j.tq&&(0,D.jsx)("div",{children:(0,D.jsx)(u.NL,{label:"connect"})})]})]})}),(0,D.jsx)("div",{className:"container",style:{maxWidth:"inherit",marginTop:Zt?"0px":"40px"},children:(0,D.jsxs)("div",{className:j.tq||Zt?!j.tq&&Zt?"heading":"none":"heading",style:{flex:"1 1 auto"},children:[(0,D.jsx)("div",{style:{marginTop:"-120px"},children:(0,D.jsxs)("div",{style:{display:"flex",justifyContent:"center",textAlign:"center",paddingTop:"100px"},children:[!j.tq&&(0,D.jsxs)("div",{children:[(0,D.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:!0}),(0,D.jsx)("div",{className:"flex-column",style:{fontSize:Zt?"46px":"50px",marginTop:Zt?"20px":"28px",color:"#fc6603",marginBottom:"10px",fontWeight:"700"},children:"NameSys"}),(0,D.jsx)("div",{className:"flex-column",style:{fontSize:Zt?"24px":"28px",marginTop:"0px",color:"#eb8634",fontWeight:"700"},children:"Off-chain Records Manager"})]}),j.tq&&(0,D.jsxs)("div",{children:[(0,D.jsx)("img",{className:"icon-ccip2",alt:"sample-icon",src:"logo.png",hidden:Zt}),(0,D.jsx)("div",{className:"flex-column",style:{fontSize:Zt?"36px":"44px",marginTop:Zt?"44px":"10px",color:"#fc6603"},children:"NameSys"}),(0,D.jsx)("div",{className:"flex-column",style:{fontSize:Zt?"20px":"24px",fontWeight:700,color:"#eb8634",marginTop:"5px"},children:"Off-chain Records Manager"}),(0,D.jsx)("div",{style:{},children:(0,D.jsx)("button",{className:"button",onClick:function(){window.location.href="/ccip2-eth-client/account.html"},"data-tooltip":"My Names",disabled:a,style:{marginTop:"15px",marginBottom:"-10px"},children:(0,D.jsxs)("div",{className:"flex-sans-direction",children:["My Names","\xa0",(0,D.jsx)("span",{className:"material-icons",children:"admin_panel_settings"})]})})})]})]})}),(0,D.jsx)("br",{}),(0,D.jsx)("br",{}),(0,D.jsx)("div",{className:"main-search-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,D.jsx)(E,{onSearch:function(e){xe(!0),Ve(e),_([]),Ee(""),Te(""),ze(""),ft("search"),mt(""),St(""),qt(!0),t||jt("")}})}),!Zt&&(0,D.jsx)("div",{children:(0,D.jsx)("div",{className:"content-slider",children:(0,D.jsx)("div",{className:"slider",children:(0,D.jsx)("div",{className:"mask",children:(0,D.jsx)("ul",{children:R.hh.map((function(e,t){return(0,D.jsx)("li",{className:"anim".concat(t+1),children:(0,D.jsx)("div",{className:"carousal-item",children:(0,D.jsx)("div",{dangerouslySetInnerHTML:{__html:e}})})},t)}))})})})})}),pe&&Zt&&(0,D.jsx)("div",{children:(0,D.jsxs)("div",{className:"flex-column",style:{marginTop:"-10px",marginBottom:"200px"},children:[(0,D.jsx)("div",{className:"flex-column",style:{paddingBottom:"10px"},children:(0,D.jsx)(q.Z,{height:50,width:50})}),(0,D.jsx)("div",{style:{marginTop:"10px"},children:(0,D.jsx)("span",{style:{color:"#fc6603",fontWeight:"700"},children:"Please Wait"})})]})}),!pe&&T.length>0&&!ge&&Zt&&(0,D.jsxs)("div",{children:[(0,D.jsxs)("div",{style:{alignItems:"center",justifyContent:"center",display:"flex",fontSize:"18px",color:"cyan",marginBottom:"25px",fontWeight:"700"},children:[(0,D.jsx)("span",{style:{marginRight:"5px"},children:"search results"}),(0,D.jsx)("button",{className:"button-tiny",onClick:function(){B(!0),et("info"),at("cyan"),ct("search results for your query")},children:(0,D.jsx)("div",{className:"material-icons smol",style:{color:"cyan"},children:"info_outline"})})]}),(0,D.jsx)("div",{className:"list-container",style:{maxHeight:"520px",overflowY:"auto",marginBottom:"50px"},children:(0,D.jsx)(O.Z,{label:a&&!n||Ae!==t?"view":"edit",items:T,onItemClick:function(e){de("".concat(e,":"))}})})]}),(0,D.jsxs)("div",{className:"flex-sans-direction",style:{color:"#fc6603",top:"auto",left:j.tq?"32%":"13%",transform:j.tq?"translateX(-72%)":"translateX(-93%)",bottom:10,position:"fixed"},children:[(0,D.jsxs)("div",{className:"flex-row",style:{marginRight:"15px"},children:[(0,D.jsx)("span",{className:"material-icons",style:{marginRight:"3px"},children:"source"}),(0,D.jsx)("a",{href:"https://github.com/namesys-eth",className:"footer-text",target:"_blank",rel:"noreferrer",children:"GitHub"})]}),(0,D.jsxs)("div",{className:"flex-row",children:[(0,D.jsx)("span",{className:"material-icons",style:{marginRight:"3px"},children:"info_outline"}),(0,D.jsx)("a",{href:"readme/readme.htm?src=https://namesys-eth.github.io/ccip2-eth-resources/GUIDE.md",className:"footer-text",target:"_blank",rel:"noreferrer",children:"Help"})]})]}),(0,D.jsxs)("div",{id:"modal",children:[se&&(0,D.jsx)(b.Z,{onClose:function(){return ie(!1)},show:se,_ENS_:le,chain:R.wU.chainId,handleParentTrigger:function(e){Ct((function(t){return I(I({},t),{},{trigger:e})}))},handleParentModalData:function(e){Ct((function(t){return I(I({},t),{},{modalData:e})}))}}),(0,D.jsx)(S.Z,{onClose:function(){return F(!1)},show:W}),(0,D.jsx)(N.Z,{onClose:function(){return U(!1)},show:G}),(0,D.jsx)(k.Z,{onClose:function(){J(!1),Ee(""),Te(""),Ve(""),ze("")},color:"red",show:$&&"search"===ut&&!pe,title:"block",children:te}),(0,D.jsx)(w.Z,{color:rt,icon:Qe,onClose:function(){return B(!1)},show:H,children:ot})]})]})})]})}},48312:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(41928)}])}},function(e){e.O(0,[8543,8041,8764,8109,4794,6563,9774,2888,179],(function(){return t=48312,e(e.s=t);var t}));var t=e.O();_N_E=t}]);