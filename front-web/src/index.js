import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import '../node_modules/jquery/dist/jquery.min';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
