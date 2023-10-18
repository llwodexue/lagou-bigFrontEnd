export function getParameterByName(name: string, url: string) {
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function joinParams(url: string, params: any, enableEncode = true) {
    url = url || "";
    if (params) {
        params = Object.keys(params)
            .map(
                key =>
                    `${key}=${
                        enableEncode
                            ? encodeURIComponent(params[key])
                            : params[key]
                    }`
            )
            .join("&");

        if (params) {
            url += (url.indexOf("?") === -1 ? "?" : "&") + params;
        }
    }
    return url;
}
