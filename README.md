[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c01d86246aac4571b5464d1e5c2ca34c)](https://www.codacy.com/app/uy-rrodriguez/uapv-m2-s2-application?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=uy-rrodriguez/uapv-m2-s2-application&amp;utm_campaign=Badge_Grade)


# uapv-m2-s2-application
This is a project for the course "E-commerce, E-marketing, E-reputation", Master's degree second year, Avignon University (Université d'Avignon et des Pays de Vaucluse).

Authors:
 - Baptiste BRIOT--RIBEYRE
 - Ricardo RODRIGUEZ


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

```npm install --save bootstrap@3.3.7 react-bootstrap```
Install Bootstrap and React-Bootstrap to add Bootstrap capabilities to our React applications.

```npm install --save jquery```
Install jQuery to access DOM elements and do asynchronous calls to the back-end API.

Then, in index.js, we can import the css from de node_modules directory. The full code of index.js at this stage is copied below:
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './App';

import "../node_modules/jquery/dist/jquery.min";
import "../node_modules/react-bootstrap/dist/react-bootstrap.min";

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
```

```npm install --save prop-types```
Install PropTypes, a library that lets us define the types and mandatory options for view properties.

```npm install --save react-router-dom```
Install React-Routes, a library to manage routing between different views. With it we can create links to other views which will automatically change the application's state.

```npm install --save fbemitter```
A simple implementation of Events used mainly to indicate the login and logout events.


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


# React Native : Creating and building the native Android application #

```npm install -g create-react-native-app```
This will install the command to create a new React Native application, ready for development and producting environments.

```create-react-native-app front-mobile```
This will install react-native-scripts and then create a new React Native project.

As stated after creating the application :
 - npm start:
    Starts the development server so you can open your app in the Expo
    app on your phone.

  - npm run ios:
    (Mac only, requires Xcode)
    Starts the development server and loads your app in an iOS simulator.

  - npm run android:
    (Requires Android build tools)
    Starts the development server and loads your app on a connected Android
    device or emulator.

  - npm test:
    Starts the test runner.

  - npm run eject:
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

```cd front-mobile; npm start```
The command will start a local development server on port 3000 and show a QR code. This code must be scanned with a mobile device connected to the same network as the development machine. We downloaded the Android application Expo to scan the code and connect the smartphone to the development server. Changes to the files will be instantly updated on the mobile phone.


After some testing using the Expo app, we want to prepare our environment to build directly the Android native application. By doing that, we can build APK files and we won't ever depend on having the smartphone connected to the same wireless connecting than the development machine. We need to install some libraries and then create a new project.

We aldo need to install Android SDK, configure it and add the variable ANDROID_HOME pointing to the SDK root directory. https://facebook.github.io/react-native/docs/getting-started.html

```npm install -g react-native-cli```
Install the client scripts to manage our React Native project.

```npm install -g yarn```
Installing Yarn is recommended by React Native to accelerate the next step.

```cd front-mobile; react-native init FrontMobile```
Install the necessary libraries and initialize a react-native project in the current folder. This will create two folders, ios and android, with some files needed to build the native applications.

```npm install --save react-navigation```
We use the community library React Navigation to navigate between screens.

```npm install --save fbemitter```
A simple implementation of Events used mainly to indicate the login and logout events.

```react-native run-android```
Build the APK and install it in the device. The phone must be connected via USB and have the USB debugging options activated.
