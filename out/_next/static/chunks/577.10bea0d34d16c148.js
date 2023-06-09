"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[577],{55577:function(e,t,r){r.r(t),r.d(t,{AlchemyProvider:function(){return h}});var s=r(59205),n=r(45710),i=r(82169),o=r(37707);r(9669);class c{constructor(e,t=100){this.sendBatchFn=e,this.maxBatchSize=t,this.pendingBatch=[]}enqueueRequest(e){return(0,s._)(this,void 0,void 0,(function*(){const t={request:e,resolve:void 0,reject:void 0},r=new Promise(((e,r)=>{t.resolve=e,t.reject=r}));return this.pendingBatch.push(t),this.pendingBatch.length===this.maxBatchSize?this.sendBatchRequest():this.pendingBatchTimer||(this.pendingBatchTimer=setTimeout((()=>this.sendBatchRequest()),10)),r}))}sendBatchRequest(){return(0,s._)(this,void 0,void 0,(function*(){const e=this.pendingBatch;this.pendingBatch=[],this.pendingBatchTimer&&(clearTimeout(this.pendingBatchTimer),this.pendingBatchTimer=void 0);const t=e.map((e=>e.request));return this.sendBatchFn(t).then((t=>{e.forEach(((e,r)=>{const s=t[r];if(s.error){const t=new Error(s.error.message);t.code=s.error.code,t.data=s.error.data,e.reject(t)}else e.resolve(s.result)}))}),(t=>{e.forEach((e=>{e.reject(t)}))}))}))}}class h extends i.r{constructor(e){const t=h.getApiKey(e.apiKey),r=h.getAlchemyNetwork(e.network),n=h.getAlchemyConnectionInfo(r,t,"http");void 0!==e.url&&(n.url=e.url),n.throttleLimit=e.maxRetries;super(n,s.E[r]),this.apiKey=e.apiKey,this.maxRetries=e.maxRetries,this.batchRequests=e.batchRequests;const i=Object.assign(Object.assign({},this.connection),{headers:Object.assign(Object.assign({},this.connection.headers),{"Alchemy-Ethers-Sdk-Method":"batchSend"})});this.batcher=new c((e=>(0,o.fetchJson)(i,JSON.stringify(e))))}static getApiKey(e){if(null==e)return s.D;if(e&&"string"!==typeof e)throw new Error(`Invalid apiKey '${e}' provided. apiKey must be a string.`);return e}static getNetwork(e){return"string"===typeof e&&e in s.C?s.C[e]:(0,n.H)(e)}static getAlchemyNetwork(e){if(void 0===e)return s.a;if("number"===typeof e)throw new Error(`Invalid network '${e}' provided. Network must be a string.`);if(!Object.values(s.N).includes(e))throw new Error(`Invalid network '${e}' provided. Network must be one of: ${Object.values(s.N).join(", ")}.`);return e}static getAlchemyConnectionInfo(e,t,r){const n="http"===r?(0,s.g)(e,t):(0,s.b)(e,t);return{headers:s.I?{"Alchemy-Ethers-Sdk-Version":s.V}:{"Alchemy-Ethers-Sdk-Version":s.V,"Accept-Encoding":"gzip"},allowGzip:!0,url:n}}detectNetwork(){const e=Object.create(null,{detectNetwork:{get:()=>super.detectNetwork}});return(0,s._)(this,void 0,void 0,(function*(){let t=this.network;if(null==t&&(t=yield e.detectNetwork.call(this),!t))throw new Error("No network detected");return t}))}_startPending(){(0,s.l)("WARNING: Alchemy Provider does not support pending filters")}isCommunityResource(){return this.apiKey===s.D}send(e,t){return this._send(e,t,"send")}_send(e,t,r,n=!1){const i={method:e,params:t,id:this._nextId++,jsonrpc:"2.0"};if(Object.assign({},this.connection).headers["Alchemy-Ethers-Sdk-Method"]=r,this.batchRequests||n)return this.batcher.enqueueRequest(i);this.emit("debug",{action:"request",request:(0,s.d)(i),provider:this});const c=["eth_chainId","eth_blockNumber"].indexOf(e)>=0;if(c&&this._cache[e])return this._cache[e];const h=(0,o.fetchJson)(this.connection,JSON.stringify(i),a).then((e=>(this.emit("debug",{action:"response",request:i,response:e,provider:this}),e)),(e=>{throw this.emit("debug",{action:"response",error:e,request:i,provider:this}),e}));return c&&(this._cache[e]=h,setTimeout((()=>{this._cache[e]=null}),0)),h}}function a(e){if(e.error){const t=new Error(e.error.message);throw t.code=e.error.code,t.data=e.error.data,t}return e.result}}}]);