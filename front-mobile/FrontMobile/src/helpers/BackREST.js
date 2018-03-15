module.exports = new class BackREST {
  constructor(props) {
    global.backendIP = "192.168.137.1";
    global.backendPort = "4000";
  }
  
  getBaseURL() {
    return "http://" + global.backendIP + ":" + global.backendPort + "/";
  }
  
  getIP() {
    return global.backendIP;
  }

  /**
   * Configure the IP of the backend server.
   *
   * @param ip
   */
  setIP(ip) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(ip)) {  
      global.backendIP = ip;
    }
  }

  /**
   * Makes a GET request to the back-end REST API and returns a promise.
   *
   * @param url
   */
  get(url) {
    return fetch(this.getBaseURL() + url)
      .then((response) => response.json());
  }

  /**
   * Makes a POST request to the back-end REST API and returns a promise.
   *
   * @param url
   * @param data
   */
  post(url, data) {
    return fetch(this.getBaseURL() + url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json());
  }

  /**
   * Makes a PUT request to the back-end REST API and returns a promise.
   *
   * @param url
   * @param data
   */
  put(url, data) {
    return fetch(this.getBaseURL() + url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json());
  }

  /**
   * Makes a DELETE request to the back-end REST API and returns a promise.
   *
   * @param url
   * @param data
   */
  del(url, data) {
    return fetch(this.getBaseURL() + url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json());
  }
};