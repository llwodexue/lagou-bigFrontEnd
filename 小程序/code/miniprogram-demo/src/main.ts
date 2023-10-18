import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import ComponentOptions from "@dcloudio/types";

Vue.config.productionTip = false;

new App({
    store
}).$mount();
