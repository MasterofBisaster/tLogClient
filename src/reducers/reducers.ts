import { createReducer } from "typesafe-actions";
import { LoginInfo, loggedIn, loggedOut } from "../actions/actions";
import { clearUserData } from "../services/security";
import { combineReducers, AnyAction } from "redux";

const initialState = {
    loginInfo: {
        user: null,
        token: null
    }
}

const user = createReducer<LoginInfo, AnyAction>(initialState.loginInfo)
    .handleAction(loggedIn, (state, action) => {
        return action.payload
    })
    .handleAction(loggedOut, (state, action) => {
            clearUserData();
            return ({ user: null, token: null })
        }
    )

export const tLogApp = combineReducers({
    user
});