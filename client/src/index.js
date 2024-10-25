// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './State/configureStore';
import App from './App';
import './Styles/index.css';
import 'react-daypicker/lib/DayPicker.css';


// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;
const store = configureStore(initialState);

window.store = store;


const rootElement = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    rootElement
);
