import { createReducer } from "typesafe-actions";
import {
    LoginInfo,
    loggedIn,
    loggedOut,
    deleteTripActions,
    fetchTripActions,
    hasSeenSwipeHintAction,
    resetAppState,
    fetchTripsActions,
    setCurrentPositionAction,
    setSelectedPOIAction,
    updatePOIAction
} from "../actions/actions";
import { clearUserData } from "../services/security";
import { combineReducers, AnyAction } from "redux";
import {POI, Trip, TripList} from "../types/types";

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
        hasSeenSwipeHint: false,
        currentPosition: [1, 1],
        selectedPOI: null
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
    .handleAction(setCurrentPositionAction,
        (state, { payload: currentPosition }) =>
            ({ ...state, currentPosition }))
    .handleAction(setSelectedPOIAction, (state, { payload: selectedPOI }) =>
        ({ ...state, selectedPOI: selectedPOI ? { ...selectedPOI } : null })
    )
    .handleAction(updatePOIAction, (state, action) => {
        return state.currentTrip ? ({
            ...state, currentTrip: {
                ...state.currentTrip, pois: state.currentTrip.pois ? state.currentTrip.pois.reduce((acc, poi) =>
                    [...acc, (poi._id === action.payload._id ? action.payload : poi)], [] as POI[]) : undefined
            }
        }) : state
    })
export const tLogApp = combineReducers({
    user, trips
});
export interface TripState {
    isLoading: boolean;
    trips: TripList;
    errorMessage: string;
    currentTrip: null | Readonly<Trip>;
    hasSeenSwipeHint: boolean;
    currentPosition: [number, number];
    selectedPOI: POI | null;
}

