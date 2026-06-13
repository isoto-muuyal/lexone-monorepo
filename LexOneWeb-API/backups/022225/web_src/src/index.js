import React,{ Suspense } from 'react';
import ReactDOM from 'react-dom';
import { registerServiceWorker } from "./register-sw";
import * as serviceWorker from './serviceWorker';
import './styles/style.scss';
import axios from 'axios';
import { createStore } from 'redux';
import allReducers from './redux/reducers';
import { Provider } from 'react-redux';
import './i18n';
import i18next from 'i18next';
import Loader from'react-loader-spinner';

const lang = localStorage.getItem('lang') || 'en';
// if(lang === 'ar') {
//   require('./styles/rtl/rtl_style.scss');
// } 
registerServiceWorker();
const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
);

axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
axios.defaults.headers.common['Accept-Language'] = lang;

i18next.changeLanguage(lang);

const App = React.lazy(() => import('./App'));

ReactDOM.render(
    <Provider store={store}>
      <Suspense fallback={<div className="loadercls vh-100">
                        <Loader
                            type="ThreeDots"
                            color="#10AB81"
                            height={100}
                            width={100}
                        />
                    </div>}>
        <App /> 
      </Suspense>
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
