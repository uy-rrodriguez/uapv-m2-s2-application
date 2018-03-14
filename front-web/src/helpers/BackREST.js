class BackREST {
  constructor() {
    this.baseURL = "http://192.168.1.67:4000/";
  }

  /**
   * Makes a GET request to the back-end REST API and returns a promise.
   *
   * @param url
   */
  get(url) {
    return fetch(this.baseURL + url)
      .then((response) => response.json());
  }

  /**
   * Makes a POST request to the back-end REST API and returns a promise.
   *
   * @param url
   * @param data
   */
  post(url, data) {
    return fetch(this.baseURL + url, {
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
    return fetch(this.baseURL + url, {
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
   * Makes a DEL request to the back-end REST API and returns a promise.
   *
   * @param url
   * @param data
   */
  del(url, data) {
    return fetch(this.baseURL + url, {
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

module.exports = new BackREST();