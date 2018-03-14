module.exports = new class BackREST {
  constructor(props) {
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
};