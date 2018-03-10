import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./helpers/registerServiceWorker";
import AppController from "./AppController";

import "../node_modules/jquery/dist/jquery.min";
import "../node_modules/react-bootstrap/dist/react-bootstrap.min";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/index.css";

// bootstrap needs jquery available globally
//window.jQuery = window.$ =  require('jquery/dist/jquery.min');


ReactDOM.render(<AppController />, document.getElementById("root"));

registerServiceWorker();
