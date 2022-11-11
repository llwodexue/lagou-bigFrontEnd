import { isPlainObject } from './util';

function request(url, method, data, headers = {}, onProgress, requestList) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    Object.keys(headers).forEach((name) => {
      xhr.setRequestHeader(name, headers[name]);
    });

    if (onProgress && typeof onProgress === 'function') {
      xhr.upload.onprogress = onProgress;
    }

    xhr.onload = (e) => {
      // 请求成功从 requestList 中移除
      if (requestList) {
        const index = requestList.findIndex((item) => item === xhr);
        requestList.splice(index, 1);
      }

      const contentType = xhr.getResponseHeader('Content-type');
      let data = e.target.response;

      if (contentType.indexOf('application/json') !== -1) {
        data = JSON.parse(data);
      }

      resolve(data);
    };

    xhr.send(data);

    requestList?.push(xhr);
  });
}

function normalizeHeaderName(headers, normalizeName) {
  Object.keys(headers).forEach((name) => {
    if (
      name !== normalizeName &&
      name.toLowerCase() === normalizeName.toLowerCase()
    ) {
      headers[normalizeName] = headers[name];
      delete headers[name];
    }
  });
}

function post(url, data, headers = {}, onProgress, requestList) {
  normalizeHeaderName(headers, 'Content-Type');

  if (headers && !headers['Content-Type'] && isPlainObject(data)) {
    headers['Content-Type'] = 'application/json;charset=utf-8';
  }

  if (isPlainObject(data)) {
    data = JSON.stringify(data);
  }

  return request(url, 'post', data, headers, onProgress, requestList);
}

export { request, post };
