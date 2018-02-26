import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/index.css";
import "../node_modules/jquery/dist/jquery.min";

import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import AppController from "./AppController";

ReactDOM.render(<AppController />, document.getElementById("root"));

registerServiceWorker();
