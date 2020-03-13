import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Ionic from "@ionic/vue";
import "@ionic/core/css/ionic.bundle.css";
import IpfsClient from "./tools/IpfsClient.js";
import createBlockchainTool from "./tools/blockchain/BlockchainTool.js";

Vue.use(Ionic);
Vue.config.productionTip = false;

Vue.prototype.$createBlockchainTool = createBlockchainTool;
Vue.prototype.$ipfs = new IpfsClient()
//Vue.prototype.$ipfs = new IpfsClient("https","ipfs.infura.io",5001)

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
