import React from 'react';
import ReactDOM from 'react-dom';
import App from './component/App';
import registerServiceWorker from './registerServiceWorker';
import 'antd/dist/antd.css';            //引入antd的css
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
