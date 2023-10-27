const BASE_URL = "http://codercba.com:9002";

class MYRequest {
  request(url, method, data) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: BASE_URL + url,
        method: method || "GET",
        timeout: 6000,
        data,
        success(res) {
          resolve(res.data);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }
  get(url, params) {
    return this.request(url, "GET", params);
  }
  post(url, params) {
    return this.request(url, "POST", params);
  }
}

export default new MYRequest();
