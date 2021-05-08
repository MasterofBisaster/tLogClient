import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider} from 'react-redux';
import { tLogApp } from './reducers/reducers';
import { formBuilderReducer } from './helpers/form-builder';
import { loadUserData } from './services/security';
import { loggedIn } from './actions/actions';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    tLogApp,
    formBuilder: formBuilderReducer

})

const store = createStore(rootReducer,applyMiddleware(thunk))

loadUserData()
    .then(info =>  {
        console.log('Loaded data: ' + JSON.stringify(info));
        return info.user && info.token ? store.dispatch(loggedIn({user: info.user, token: info.token})): false
    })
    .catch(e => console.log(e))

export type AppState = ReturnType<typeof rootReducer>

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));