import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        detailInfos: []
    },
    mutations: {
        setDetailInfo(state, payload) {
            state.detailInfos = payload;
        }
    },
    actions: {},
    modules: {}
});
