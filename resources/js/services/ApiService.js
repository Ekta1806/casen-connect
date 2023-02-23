import axios from 'axios';

class ApiService {
  query(url, params) {
    return this.finalRequest('get', url, '', params);
  }

  get(url) {
    return this.finalRequest('get', url);
  }

  post(url, data) {
    return this.finalRequest('post', url, data);
  }

  patch(url, data) {
    return this.finalRequest('patch', resource, data);
  }

  destroy(url) {
    return this.finalRequest('delete', url);
  }

  finalRequest(method, url, data, params = {}) {
    return axios.request({
      url,
      params,
      data,
      method,
    });
  }
}
export default new ApiService();
