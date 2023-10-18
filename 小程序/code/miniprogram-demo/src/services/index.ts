import { HomeRecommendListItem, DetailInfo } from "./types";
import { get } from "@/lib/request";

export default class Services {
    // 首页推荐列表
    static async getHomeRecommendList() {
        // 请求回来的结果 res.data是 HomeRecommendListItem[]
        return get<HomeRecommendListItem[]>("/homeRecommendList");
    }

    // 列表数据
    static async getList() {
        // 请求回来的结果 res.data是 DetailInfo[]
        return get<DetailInfo[]>("/list");
    }
}
