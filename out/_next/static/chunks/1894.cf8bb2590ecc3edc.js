"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1894],{40926:function(t,n,e){function r(){return(null===e.g||void 0===e.g?void 0:e.g.crypto)||(null===e.g||void 0===e.g?void 0:e.g.msCrypto)||{}}function o(){const t=r();return t.subtle||t.webkitSubtle}Object.defineProperty(n,"__esModule",{value:!0}),n.isBrowserCryptoAvailable=n.getSubtleCrypto=n.getBrowerCrypto=void 0,n.getBrowerCrypto=r,n.getSubtleCrypto=o,n.isBrowserCryptoAvailable=function(){return!!r()&&!!o()}},88618:function(t,n,e){var r=e(34155);function o(){return"undefined"===typeof document&&"undefined"!==typeof navigator&&"ReactNative"===navigator.product}function i(){return"undefined"!==typeof r&&"undefined"!==typeof r.versions&&"undefined"!==typeof r.versions.node}Object.defineProperty(n,"__esModule",{value:!0}),n.isBrowser=n.isNode=n.isReactNative=void 0,n.isReactNative=o,n.isNode=i,n.isBrowser=function(){return!o()&&!i()}},1468:function(t,n,e){Object.defineProperty(n,"__esModule",{value:!0});const r=e(34308);r.__exportStar(e(40926),n),r.__exportStar(e(88618),n)},34308:function(t,n,e){e.r(n),e.d(n,{__assign:function(){return i},__asyncDelegator:function(){return b},__asyncGenerator:function(){return m},__asyncValues:function(){return w},__await:function(){return g},__awaiter:function(){return f},__classPrivateFieldGet:function(){return O},__classPrivateFieldSet:function(){return P},__createBinding:function(){return p},__decorate:function(){return c},__exportStar:function(){return d},__extends:function(){return o},__generator:function(){return l},__importDefault:function(){return E},__importStar:function(){return J},__makeTemplateObject:function(){return _},__metadata:function(){return a},__param:function(){return u},__read:function(){return v},__rest:function(){return s},__spread:function(){return y},__spreadArrays:function(){return R},__values:function(){return h}});var r=function(t,n){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e])},r(t,n)};function o(t,n){function e(){this.constructor=t}r(t,n),t.prototype=null===n?Object.create(n):(e.prototype=n.prototype,new e)}var i=function(){return i=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t},i.apply(this,arguments)};function s(t,n){var e={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&n.indexOf(r)<0&&(e[r]=t[r]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(t);o<r.length;o++)n.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(t,r[o])&&(e[r[o]]=t[r[o]])}return e}function c(t,n,e,r){var o,i=arguments.length,s=i<3?n:null===r?r=Object.getOwnPropertyDescriptor(n,e):r;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)s=Reflect.decorate(t,n,e,r);else for(var c=t.length-1;c>=0;c--)(o=t[c])&&(s=(i<3?o(s):i>3?o(n,e,s):o(n,e))||s);return i>3&&s&&Object.defineProperty(n,e,s),s}function u(t,n){return function(e,r){n(e,r,t)}}function a(t,n){if("object"===typeof Reflect&&"function"===typeof Reflect.metadata)return Reflect.metadata(t,n)}function f(t,n,e,r){return new(e||(e=Promise))((function(o,i){function s(t){try{u(r.next(t))}catch(n){i(n)}}function c(t){try{u(r.throw(t))}catch(n){i(n)}}function u(t){var n;t.done?o(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(s,c)}u((r=r.apply(t,n||[])).next())}))}function l(t,n){var e,r,o,i,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"===typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(e)throw new TypeError("Generator is already executing.");for(;s;)try{if(e=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,r=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(o=(o=s.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=n.call(t,s)}catch(c){i=[6,c],r=0}finally{e=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}}function p(t,n,e,r){void 0===r&&(r=e),t[r]=n[e]}function d(t,n){for(var e in t)"default"===e||n.hasOwnProperty(e)||(n[e]=t[e])}function h(t){var n="function"===typeof Symbol&&Symbol.iterator,e=n&&t[n],r=0;if(e)return e.call(t);if(t&&"number"===typeof t.length)return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}function v(t,n){var e="function"===typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,o,i=e.call(t),s=[];try{for(;(void 0===n||n-- >0)&&!(r=i.next()).done;)s.push(r.value)}catch(c){o={error:c}}finally{try{r&&!r.done&&(e=i.return)&&e.call(i)}finally{if(o)throw o.error}}return s}function y(){for(var t=[],n=0;n<arguments.length;n++)t=t.concat(v(arguments[n]));return t}function R(){for(var t=0,n=0,e=arguments.length;n<e;n++)t+=arguments[n].length;var r=Array(t),o=0;for(n=0;n<e;n++)for(var i=arguments[n],s=0,c=i.length;s<c;s++,o++)r[o]=i[s];return r}function g(t){return this instanceof g?(this.v=t,this):new g(t)}function m(t,n,e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r,o=e.apply(t,n||[]),i=[];return r={},s("next"),s("throw"),s("return"),r[Symbol.asyncIterator]=function(){return this},r;function s(t){o[t]&&(r[t]=function(n){return new Promise((function(e,r){i.push([t,n,e,r])>1||c(t,n)}))})}function c(t,n){try{(e=o[t](n)).value instanceof g?Promise.resolve(e.value.v).then(u,a):f(i[0][2],e)}catch(r){f(i[0][3],r)}var e}function u(t){c("next",t)}function a(t){c("throw",t)}function f(t,n){t(n),i.shift(),i.length&&c(i[0][0],i[0][1])}}function b(t){var n,e;return n={},r("next"),r("throw",(function(t){throw t})),r("return"),n[Symbol.iterator]=function(){return this},n;function r(r,o){n[r]=t[r]?function(n){return(e=!e)?{value:g(t[r](n)),done:"return"===r}:o?o(n):n}:o}}function w(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,e=t[Symbol.asyncIterator];return e?e.call(t):(t=h(t),n={},r("next"),r("throw"),r("return"),n[Symbol.asyncIterator]=function(){return this},n);function r(e){n[e]=t[e]&&function(n){return new Promise((function(r,o){(function(t,n,e,r){Promise.resolve(r).then((function(n){t({value:n,done:e})}),n)})(r,o,(n=t[e](n)).done,n.value)}))}}}function _(t,n){return Object.defineProperty?Object.defineProperty(t,"raw",{value:n}):t.raw=n,t}function J(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var e in t)Object.hasOwnProperty.call(t,e)&&(n[e]=t[e]);return n.default=t,n}function E(t){return t&&t.__esModule?t:{default:t}}function O(t,n){if(!n.has(t))throw new TypeError("attempted to get private field on non-instance");return n.get(t)}function P(t,n,e){if(!n.has(t))throw new TypeError("attempted to set private field on non-instance");return n.set(t,e),e}},96641:function(t,n,e){e.d(n,{k:function(){return a},Z:function(){return f}});var r=e(17187),o=e(54098),i=e.n(o),s=e(85094),c=e(56186);const u={headers:{Accept:"application/json","Content-Type":"application/json"},method:"POST"};class a{constructor(t,n=!1){if(this.url=t,this.disableProviderPing=n,this.events=new r.EventEmitter,this.isAvailable=!1,this.registering=!1,!(0,c.isHttpUrl)(t))throw new Error(`Provided URL is not compatible with HTTP connection: ${t}`);this.url=t,this.disableProviderPing=n}get connected(){return this.isAvailable}get connecting(){return this.registering}on(t,n){this.events.on(t,n)}once(t,n){this.events.once(t,n)}off(t,n){this.events.off(t,n)}removeListener(t,n){this.events.removeListener(t,n)}async open(t=this.url){await this.register(t)}async close(){if(!this.isAvailable)throw new Error("Connection already closed");this.onClose()}async send(t,n){this.isAvailable||await this.register();try{const n=(0,s.u)(t),e=await i()(this.url,Object.assign(Object.assign({},u),{body:n})),r=await e.json();this.onPayload({data:r})}catch(e){this.onError(t.id,e)}}async register(t=this.url){if(!(0,c.isHttpUrl)(t))throw new Error(`Provided URL is not compatible with HTTP connection: ${t}`);if(this.registering){const t=this.events.getMaxListeners();return(this.events.listenerCount("register_error")>=t||this.events.listenerCount("open")>=t)&&this.events.setMaxListeners(t+1),new Promise(((t,n)=>{this.events.once("register_error",(t=>{this.resetMaxListeners(),n(t)})),this.events.once("open",(()=>{if(this.resetMaxListeners(),"undefined"===typeof this.isAvailable)return n(new Error("HTTP connection is missing or invalid"));t()}))}))}this.url=t,this.registering=!0;try{if(!this.disableProviderPing){const n=(0,s.u)({id:1,jsonrpc:"2.0",method:"test",params:[]});await i()(t,Object.assign(Object.assign({},u),{body:n}))}this.onOpen()}catch(n){const t=this.parseError(n);throw this.events.emit("register_error",t),this.onClose(),t}}onOpen(){this.isAvailable=!0,this.registering=!1,this.events.emit("open")}onClose(){this.isAvailable=!1,this.registering=!1,this.events.emit("close")}onPayload(t){if("undefined"===typeof t.data)return;const n="string"===typeof t.data?(0,s.D)(t.data):t.data;this.events.emit("payload",n)}onError(t,n){const e=this.parseError(n),r=e.message||e.toString(),o=(0,c.formatJsonRpcError)(t,r);this.events.emit("payload",o)}parseError(t,n=this.url){return(0,c.parseConnectionError)(t,n,"HTTP")}resetMaxListeners(){this.events.getMaxListeners()>10&&this.events.setMaxListeners(10)}}var f=a},46160:function(t,n,e){e.d(n,{r:function(){return i}});var r=e(17187),o=e(56186);class i extends o.IJsonRpcProvider{constructor(t){super(t),this.events=new r.EventEmitter,this.hasRegisteredEventListeners=!1,this.connection=this.setConnection(t),this.connection.connected&&this.registerEventListeners()}async connect(t=this.connection){await this.open(t)}async disconnect(){await this.close()}on(t,n){this.events.on(t,n)}once(t,n){this.events.once(t,n)}off(t,n){this.events.off(t,n)}removeListener(t,n){this.events.removeListener(t,n)}async request(t,n){return this.requestStrict((0,o.formatJsonRpcRequest)(t.method,t.params||[],t.id||(0,o.getBigIntRpcId)().toString()),n)}async requestStrict(t,n){return new Promise((async(e,r)=>{if(!this.connection.connected)try{await this.open()}catch(i){r(i)}this.events.on(`${t.id}`,(t=>{(0,o.isJsonRpcError)(t)?r(t.error):e(t.result)}));try{await this.connection.send(t,n)}catch(i){r(i)}}))}setConnection(t=this.connection){return t}onPayload(t){this.events.emit("payload",t),(0,o.isJsonRpcResponse)(t)?this.events.emit(`${t.id}`,t):this.events.emit("message",{type:t.method,data:t.params})}onClose(t){t&&3e3===t.code&&this.events.emit("error",new Error(`WebSocket connection closed abnormally with code: ${t.code} ${t.reason?`(${t.reason})`:""}`)),this.events.emit("disconnect")}async open(t=this.connection){this.connection===t&&this.connection.connected||(this.connection.connected&&this.close(),"string"===typeof t&&(await this.connection.open(t),t=this.connection),this.connection=this.setConnection(t),await this.connection.open(),this.registerEventListeners(),this.events.emit("connect"))}async close(){await this.connection.close()}registerEventListeners(){this.hasRegisteredEventListeners||(this.connection.on("payload",(t=>this.onPayload(t))),this.connection.on("close",(t=>this.onClose(t))),this.connection.on("error",(t=>this.events.emit("error",t))),this.connection.on("register_error",(t=>this.onClose())),this.hasRegisteredEventListeners=!0)}}},73416:function(t,n,e){e.d(n,{XR:function(){return o},x0:function(){return s}});class r{}class o extends r{constructor(t){super()}}class i extends r{constructor(){super()}}class s extends i{constructor(t){super()}}},79806:function(t,n,e){e.d(n,{CA:function(){return o},JV:function(){return c},O4:function(){return r},dQ:function(){return i},xK:function(){return s}});const r="INTERNAL_ERROR",o="SERVER_ERROR",i=[-32700,-32600,-32601,-32602,-32603],s={PARSE_ERROR:{code:-32700,message:"Parse error"},INVALID_REQUEST:{code:-32600,message:"Invalid Request"},METHOD_NOT_FOUND:{code:-32601,message:"Method not found"},INVALID_PARAMS:{code:-32602,message:"Invalid params"},[r]:{code:-32603,message:"Internal error"},[o]:{code:-32e3,message:"Server error"}},c=o},9698:function(t,n,e){var r=e(1468);e.o(r,"IJsonRpcProvider")&&e.d(n,{IJsonRpcProvider:function(){return r.IJsonRpcProvider}}),e.o(r,"formatJsonRpcError")&&e.d(n,{formatJsonRpcError:function(){return r.formatJsonRpcError}}),e.o(r,"formatJsonRpcRequest")&&e.d(n,{formatJsonRpcRequest:function(){return r.formatJsonRpcRequest}}),e.o(r,"formatJsonRpcResult")&&e.d(n,{formatJsonRpcResult:function(){return r.formatJsonRpcResult}}),e.o(r,"getBigIntRpcId")&&e.d(n,{getBigIntRpcId:function(){return r.getBigIntRpcId}}),e.o(r,"isHttpUrl")&&e.d(n,{isHttpUrl:function(){return r.isHttpUrl}}),e.o(r,"isJsonRpcError")&&e.d(n,{isJsonRpcError:function(){return r.isJsonRpcError}}),e.o(r,"isJsonRpcRequest")&&e.d(n,{isJsonRpcRequest:function(){return r.isJsonRpcRequest}}),e.o(r,"isJsonRpcResponse")&&e.d(n,{isJsonRpcResponse:function(){return r.isJsonRpcResponse}}),e.o(r,"isJsonRpcResult")&&e.d(n,{isJsonRpcResult:function(){return r.isJsonRpcResult}}),e.o(r,"isLocalhostUrl")&&e.d(n,{isLocalhostUrl:function(){return r.isLocalhostUrl}}),e.o(r,"isReactNative")&&e.d(n,{isReactNative:function(){return r.isReactNative}}),e.o(r,"isWsUrl")&&e.d(n,{isWsUrl:function(){return r.isWsUrl}}),e.o(r,"payloadId")&&e.d(n,{payloadId:function(){return r.payloadId}})},90110:function(t,n,e){e.d(n,{CX:function(){return c},L2:function(){return s},by:function(){return i},i5:function(){return o}});var r=e(79806);function o(t){return r.dQ.includes(t)}function i(t){return Object.keys(r.xK).includes(t)?r.xK[t]:r.xK[r.JV]}function s(t){const n=Object.values(r.xK).find((n=>n.code===t));return n||r.xK[r.JV]}function c(t,n,e){return t.message.includes("getaddrinfo ENOTFOUND")||t.message.includes("connect ECONNREFUSED")?new Error(`Unavailable ${e} RPC url at ${n}`):t}},71937:function(t,n,e){e.d(n,{CS:function(){return s},RI:function(){return a},o0:function(){return i},sT:function(){return c},tm:function(){return u}});var r=e(90110),o=e(79806);function i(t=3){return Date.now()*Math.pow(10,t)+Math.floor(Math.random()*Math.pow(10,t))}function s(t=6){return BigInt(i(t))}function c(t,n,e){return{id:e||i(),jsonrpc:"2.0",method:t,params:n}}function u(t,n){return{id:t,jsonrpc:"2.0",result:n}}function a(t,n,e){return{id:t,jsonrpc:"2.0",error:f(n,e)}}function f(t,n){return"undefined"===typeof t?(0,r.by)(o.O4):("string"===typeof t&&(t=Object.assign(Object.assign({},(0,r.by)(o.CA)),{message:t})),"undefined"!==typeof n&&(t.data=n),(0,r.i5)(t.code)&&(t=(0,r.L2)(t.code)),t)}},56186:function(t,n,e){e.d(n,{IJsonRpcProvider:function(){return s.x0},formatJsonRpcError:function(){return i.RI},formatJsonRpcRequest:function(){return i.sT},formatJsonRpcResult:function(){return i.tm},getBigIntRpcId:function(){return i.CS},isHttpUrl:function(){return c.jK},isJsonRpcError:function(){return u.jg},isJsonRpcRequest:function(){return u.DW},isJsonRpcResponse:function(){return u.u},isJsonRpcResult:function(){return u.k4},isLocalhostUrl:function(){return c.JF},isWsUrl:function(){return c.UZ},parseConnectionError:function(){return r.CX},payloadId:function(){return i.o0}});e(79806);var r=e(90110),o=e(9698);e.o(o,"IJsonRpcProvider")&&e.d(n,{IJsonRpcProvider:function(){return o.IJsonRpcProvider}}),e.o(o,"formatJsonRpcError")&&e.d(n,{formatJsonRpcError:function(){return o.formatJsonRpcError}}),e.o(o,"formatJsonRpcRequest")&&e.d(n,{formatJsonRpcRequest:function(){return o.formatJsonRpcRequest}}),e.o(o,"formatJsonRpcResult")&&e.d(n,{formatJsonRpcResult:function(){return o.formatJsonRpcResult}}),e.o(o,"getBigIntRpcId")&&e.d(n,{getBigIntRpcId:function(){return o.getBigIntRpcId}}),e.o(o,"isHttpUrl")&&e.d(n,{isHttpUrl:function(){return o.isHttpUrl}}),e.o(o,"isJsonRpcError")&&e.d(n,{isJsonRpcError:function(){return o.isJsonRpcError}}),e.o(o,"isJsonRpcRequest")&&e.d(n,{isJsonRpcRequest:function(){return o.isJsonRpcRequest}}),e.o(o,"isJsonRpcResponse")&&e.d(n,{isJsonRpcResponse:function(){return o.isJsonRpcResponse}}),e.o(o,"isJsonRpcResult")&&e.d(n,{isJsonRpcResult:function(){return o.isJsonRpcResult}}),e.o(o,"isLocalhostUrl")&&e.d(n,{isLocalhostUrl:function(){return o.isLocalhostUrl}}),e.o(o,"isReactNative")&&e.d(n,{isReactNative:function(){return o.isReactNative}}),e.o(o,"isWsUrl")&&e.d(n,{isWsUrl:function(){return o.isWsUrl}}),e.o(o,"payloadId")&&e.d(n,{payloadId:function(){return o.payloadId}});var i=e(71937),s=e(43659),c=e(46119),u=e(84733)},43659:function(t,n,e){e.d(n,{x0:function(){return r.x0}});var r=e(73416)},46119:function(t,n,e){e.d(n,{JF:function(){return s},UZ:function(){return i},jK:function(){return o}});function r(t,n){const e=function(t){const n=t.match(new RegExp(/^\w+:/,"gi"));if(n&&n.length)return n[0]}(t);return"undefined"!==typeof e&&new RegExp(n).test(e)}function o(t){return r(t,"^https?:")}function i(t){return r(t,"^wss?:")}function s(t){return new RegExp("wss?://localhost(:d{2,5})?").test(t)}},84733:function(t,n,e){function r(t){return"object"===typeof t&&"id"in t&&"jsonrpc"in t&&"2.0"===t.jsonrpc}function o(t){return r(t)&&"method"in t}function i(t){return r(t)&&(s(t)||c(t))}function s(t){return"result"in t}function c(t){return"error"in t}e.d(n,{DW:function(){return o},jg:function(){return c},k4:function(){return s},u:function(){return i}})},85094:function(t,n,e){e.d(n,{D:function(){return r},u:function(){return o}});function r(t){if("string"!==typeof t)throw new Error("Cannot safe json parse value of type "+typeof t);try{return(t=>{const n=t.replace(/([\[:])?(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))([,\}\]])/g,'$1"$2n"$3');return JSON.parse(n,((t,n)=>"string"===typeof n&&n.match(/^\d+n$/)?BigInt(n.substring(0,n.length-1)):n))})(t)}catch(n){return t}}function o(t){return"string"===typeof t?t:(n=t,JSON.stringify(n,((t,n)=>"bigint"===typeof n?n.toString()+"n":n))||"");var n}}}]);