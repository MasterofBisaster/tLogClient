import { createReducer } from "typesafe-actions";
import {
    LoginInfo,
    loggedIn,
    loggedOut,
    deleteTripActions,
    fetchTripActions,
    hasSeenSwipeHintAction, resetAppState, fetchTripsActions
} from "../actions/actions";
import { clearUserData } from "../services/security";
import { combineReducers, AnyAction } from "redux";
import {Trip, TripList} from "../types/types";

const initialState = {
    loginInfo: {
        user: null,
        token: null
    },
    trips: {
        isLoading: false,
        trips: [],
        errorMessage: '',
        currentTrip: null,
        hasSeenSwipeHint: false
    } as TripState
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
const trips = createReducer<TripState,AnyAction>(initialState.trips)
    .handleAction([fetchTripsActions.request,
        deleteTripActions.request,
        fetchTripActions.request,
        deleteTripActions.request
    ], (state, action) => ({
        ...state,
        errorMessage: '',
        isLoading: true
    }))
    .handleAction(resetAppState, (state, _) => initialState.trips)
    .handleAction([fetchTripsActions.failure, deleteTripActions.failure, fetchTripActions.failure], (state, action) =>
        ({ ...state, isLoading: false, errorMessage: action.payload.message }))
    .handleAction(fetchTripsActions.success, (state, action) =>
        ({ ...state, isLoading: false, trips: action.payload }))
    .handleAction(deleteTripActions.success, (state, action) =>
        ({ ...state, isLoading: false }))
    .handleAction(fetchTripActions.success, (state, action) => ({
        ...state,
        isLoading: false,
        currentTrip: action.payload
    }))
    .handleAction(hasSeenSwipeHintAction, (state, _) => ({ ...state, hasSeenSwipeHint: true }))

export const tLogApp = combineReducers({
    user, trips
});
export interface TripState {
    isLoading: boolean;
    trips: TripList;
    errorMessage: string;
    currentTrip: null | Readonly<Trip>;
    hasSeenSwipeHint: boolean;
}

