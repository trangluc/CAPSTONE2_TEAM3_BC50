import { DOMAIN } from "./constant.js";

class Api {
  callApi(uri, method, data) {
    return axios({
      url: `${DOMAIN}/${uri}`,
      method,
      data,
    });
  }
}

export default Api;