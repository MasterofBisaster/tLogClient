import { createAction, createAsyncAction, createCustomAction } from 'typesafe-actions';
import {POI, Trip, TripList, User} from '../types/types';
import {ThunkAction} from 'redux-thunk';
import {AppState} from "../index";
import {AnyAction, Dispatch} from "redux";
import {deleteTrip, fetchMyTrips, fetchTrip, removePOI} from "../services/trips";

export interface LoginInfo {
    user: User | null;
    token: string | null;
}

// Security related actions
export const loggedIn = createAction('user/loggedIn')<LoginInfo>();
export const loggedOut = createAction('user/loggedOut')<void>();
export const fetchTripsActions = createAsyncAction(
    'FETCH_TRIPS_REQUEST',
    'FETCH_TRIPS_SUCCESS',
    'FETCH_TRIPS_FAILURE')<void, TripList, Error>();

export const fetchTripActions = createAsyncAction(
    'FETCH_TRIP_REQUEST',
    'FETCH_TRIP_SUCCESS',
    'FETCH_TRIP_FAILURE')<void, Trip, Error>();

export const deleteTripActions = createAsyncAction(
    'DELETE_TRIP_REQUEST',
    'DELETE_TRIP_SUCCESS',
    'DELETE_TRIP_FAILURE'
)<void, void, Error>();
export type TripsResult = ReturnType<typeof fetchTripsActions.success> | ReturnType<typeof fetchTripsActions.failure>

export const fetchTripsAction = ():ThunkAction<Promise<TripsResult>, AppState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchTripsActions.request());
        return fetchMyTrips(getState().tLogApp.user.token || '').then(trips =>
            dispatch(fetchTripsActions.success(trips)))
            .catch(err => dispatch(fetchTripsActions.failure(err)))
    };

export type TripResult = ReturnType<typeof fetchTripActions.success> | ReturnType<typeof fetchTripActions.failure>

export const fetchTripAction = (id: string):ThunkAction<Promise<TripResult>, AppState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchTripActions.request());
        return fetchTrip(getState().tLogApp.user.token || '', id).then(trip =>
            dispatch(fetchTripActions.success(trip)))
            .catch(err => dispatch(fetchTripActions.failure(err)))
    };

type DeleteTripFailure = ReturnType<typeof deleteTripActions.failure>

export const deleteTripAction = (id: string):ThunkAction<Promise<TripsResult | DeleteTripFailure>, AppState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(deleteTripActions.request());
        return deleteTrip(getState().tLogApp.user.token || '', id).then(r =>
            dispatch(fetchTripsAction()))
            .catch(err => dispatch(deleteTripActions.failure(err)))
    };
export const hasSeenSwipeHintAction = createAction('trip/hint')<void>();
export const resetAppState = createAction('trip/reset')<void>();

export const setCurrentPositionAction = createAction('trip/currentPosition')<[number, number]>()
export const setSelectedPOIAction = createAction('trip/selectedPOI')<POI | null>()
export const updatePOIAction = createAction('trip/updatePOI')<POI>()
export const deletePOIActions = createAsyncAction(
    'DELETE_POI_REQUEST',
    'DELETE_POI_SUCCESS',
    'DELETE_POI_FAILURE'
)<void, void, Error>();

export const deletePOIAction = (tripId: string, poiId: string) =>
    (dispatch: Dispatch<AnyAction>, getState: () => AppState) => {
        dispatch(deletePOIActions.request());
        return removePOI(getState().tLogApp.user.token || '', tripId, poiId).then(trip => {
            dispatch(setSelectedPOIAction(null));
            dispatch(fetchTripActions.success(trip));
        })
            .catch(err => dispatch(fetchTripActions.failure(err)))
    }