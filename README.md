# uapv-m2-s2-application
Projet pour l'UE Application. Baptiste BRIOT--RIBEYRE, Ricardo RODRIGUEZ. Université d'Avignon et des Pays de Vaucluse.


# Introduction #
This application its meant to be used in a warehouse, where managers can check the orders and create order groups using an optimisation algorithm. These ordres will be sent to order pickers, who will pick the products in the warehouse and then prepare them to be delivered. They can also create alerts to indicate that a product placement has been emptied. A web application will be accessible by the managers to see the orders and receive the alerts. A mobile application will be used by the order pickers to see, chose and deliver order groups, and to create alerts. A back-end REST API connects everything.

Both front-end application are based on React.js. The REST API is built on Node.js using the framework Express.

Bootstrap has been integrated to the webapp to simplify the development process.


# React.js : Creating and building the web application #

```npm install -g create-react-app```
This will install an official React.js script that helps creating a new application, ready for development and producting environments.

```create-react-app front-web```
This will install react, react-dom and react-scripts, and create our application skeleton.

As stated after creating the application :
 - npm start:
    Starts the development server.

 - npm run build:
    Bundles the app into static files for production.

 - npm test:
    Starts the test runner.

 - npm run eject:
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

```cd front-web; npm start```
The last command will start a local server on port 3000 and open a browser. The initial application will show a simple index page with a title and a logo. Changes to the files will be instantly updated on the browser.

```npm install --save react-bootstrap```
Install React-Bootstrap to add Bootstrap capabilities to our React applications.

Then, in index.js, we can import the css from de node_modules directory. The full code of index.js at this stage is copied below:
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
```


# Node.js + Express : Creating and building the REST API #

(We followed this guide: https://stormpath.com/blog/tutorial-build-rest-api-mobile-apps-using-node-js)

```mkdir back-rest; cd back-rest```

```npm init```
Start a new project with npm. We just give the default answer to each question, except for this ones:
 - version = 0.1.0, so now it's the same as our webapp
 - start command = node index.js
 - description = Back-end REST API

```npm install --save express```
Install express locally (in the node_modules folder inside our project root) and save it as a dependency

Create the file /index.js with the next content. It will create an express instance and configure a handler for the request "GET /" that will return a json object. The server will listen on port 4000.

```javascript
var express = require('express')

var app = express()

app.get('/', function(req, res) {
  res.json({result: "It's alive!"})
})

app.listen(4000)
```

```npm start``` or ```node index.js``` 
Will start a local server listening on port 4000. We can open a new browser windows and send a request to localhost:4000/index to get the response.
