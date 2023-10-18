import { joinParams } from "./url";

export interface RejectedError {
    code?: string;
    message?: string;
    config: any;
    request: any;
    response: any;
}

interface RequestParams {
    header?: object;
    query?: object;
    body?: object;
}

type RequestMethod =
    | "OPTIONS"
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT";

const APPENDED_PARAMS = {
    timestamp: Date.now(),
    version: "6.4.0"
};

const baseUrl =
    "https://www.fastmock.site/mock/505750b853376ff038612e1d348bf716/mockflow";

export function get<T>(url: string, params?: object) {
    return baseRequest<T>(url, { query: params });
}

export function post<T>(url: string, params?: RequestParams) {
    return baseRequest(url, params, "POST");
}

function baseRequest<T>(
    url: string,
    params: RequestParams = {},
    method: RequestMethod = "GET"
) {
    const queryParams = params!.query
        ? {
              timestamp: Date.now(),
              ...APPENDED_PARAMS,
              ...params!.query
          }
        : {
              timestamp: Date.now(),
              ...APPENDED_PARAMS
          };
    url = joinParams(url, queryParams);
    if (url.indexOf("http") !== 0) {
        url = baseUrl + url;
    }
    return request<T>(url, params!.body, method, params!.header);
}

async function request<T>(
    url: string,
    params?: object,
    method: RequestMethod = "GET",
    header: object = {}
) {
    return await new Promise((resolve, reject) => {
        uni.request({
            url,
            method,
            header,
            data: {
                ...params
            },
            success: (res: any) => {
                if (res.statusCode !== 200) {
                    reject(res.data);
                }
                resolve(res.data);
            },
            fail: (e: any) => {
                reject(e);
            }
        });
    })
        .then((res: any) => res as T)
        .catch(e => {
            const errorMessage = `${method} ${url} failed: ${e.status} ${e.message}`;
            console.error(new Error(errorMessage));
            errHandler(e);
        });
}

const errHandler = (e: any) => {
    // 处理499-501 断网以及超时情况
    let msg = "";
    if (e.status > 499 && e.status < 501) {
        // 5xx服务器内部错误处理
        msg = "服务器错误";
    } else if (
        e.errMsg === "request:fail" ||
        e.errMsg === "request:fail timeout"
    ) {
        // 断网 请求超时
        msg = "无法连接至网络";
    }
    if (msg) {
        uni.showToast({
            title: msg,
            icon: "none",
            duration: 4000
        });
    }
    throw e;
};
