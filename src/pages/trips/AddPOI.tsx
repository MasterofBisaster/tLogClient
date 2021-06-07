import {BuildForm, FormDescription} from "../../helpers/form-builder";
import {POI, Trip} from "../../types/types";
import * as Validator from "../../helpers/validators";
import {RouteComponentProps} from "react-router";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonSpinner,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import React, {useEffect, useState} from "react";
import {Simulate} from "react-dom/test-utils";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../index";
import {ThunkDispatch} from "redux-thunk";
import {
    fetchTripAction,
    fetchTripActions,
    fetchTripsAction,
    setSelectedPOIAction,
    TripsResult,
    updatePOIAction
} from "../../actions/actions";
import {addPOIToTrip, addTrip, updateTrip} from "../../services/trips";
import {executeDelayed} from "../../helpers/async-helpers";
import {GeoJSON} from "leaflet";

const form = (mode: string): FormDescription<POI> => ({
    name: `trip_${mode}`,
    fields: [
        {
            name: 'name', label: 'Name', type: 'text', position: 'floating',
            color: 'primary', validators: [Validator.required, Validator.minLength(4)]
        },
        {
            name: 'description',
            label: 'Description',
            type: 'text',
            position: 'floating',
            validators: [],
            color: 'primary'
        },
        {
            name: 'type',
            type: 'select',
            label: 'Type',
            position: 'floating',
            color: 'primary',
            validators: [Validator.required],
            options: [
                { key: 'sight', value: 'Sight' },
                { key: 'bar', value: 'Bar' },
                { key: 'restaurant', value: 'Restaurant' },
                { key: 'museum', value: 'Museum' },
            ]
        }
    ],
    submitLabel: mode === 'add' ? 'Save' : 'Update',
    debug: false
});


export default (mode: 'add' | 'edit'): React.FC<RouteComponentProps<{ tripId: string }>> => ({ history, match }) => {

    const {Form, loading, error} = BuildForm(form(mode));

    const dispatch = useDispatch();
    const token = useSelector<AppState, any>(state => state.tLogApp.user.token);
    const currentPosition = useSelector<AppState, any>(state => state.tLogApp.trips.currentPosition);

    const thunkDispatch: ThunkDispatch<AppState, null, TripsResult> = useDispatch();

    const { isLoading, currentTrip } = useSelector<AppState, any>(state => state.tLogApp.trips);

    useEffect(() => {
        if (mode === 'edit' && (!currentTrip || currentTrip._id !== match.params.tripId)) {
            thunkDispatch(fetchTripAction(match.params.tripId))
        }
    }, [])

    const submit = (poiData: POI) => {
        dispatch(loading(true));

        poiData.loc = {
            "type": "Point",
            "coordinates": currentPosition
        }
        console.log("POI: " + JSON.stringify(poiData))

        if(mode == "add") {
            addPOIToTrip(token, match.params.tripId, poiData)
                .then(trip => {
                    dispatch(updatePOIAction(poiData));
                    dispatch(setSelectedPOIAction(poiData));
                })
                //.then(reload => thunkDispatch(fetchTripAction(match.params.tripId)))
                .then(() => executeDelayed(200,() => history.push('/trips/show/' + match.params.tripId)
                    //history.goBack()
                ))
                .catch((err: Error) => {
                    dispatch(error('Error while adding poi: ' + err.message));
                })
                .finally(() => {
                        window.location.reload();
                        dispatch(loading(false));
                    }
                );
        } else {
            updateTrip(token, poiData)
                .then(trip => dispatch(fetchTripActions.success(trip)))
                .then(reload => thunkDispatch(fetchTripsAction()))
                .then(() => executeDelayed(200,() => history.goBack()))
                .catch((err: Error) => {
                    dispatch(error('Error while updating trip: ' + err.message));
                })
                .finally(() => dispatch(loading(false)));
        }
    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    {(() => {
                        if (mode == "add") {
                            return (
                                <IonTitle>Add POI</IonTitle>
                            );
                        } else {
                            return (
                                <IonTitle>Edit POI</IonTitle>
                            );
                        }
                    })()}
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {isLoading ? <div><IonSpinner />...Loading POI</div> :
                    mode === 'edit' ?
                        currentTrip ? <Form handleSubmit={submit} initialState={currentTrip} /> : <p>NO TRIP</p> :
                        <Form handleSubmit={submit} />
                }
            </IonContent>
        </IonPage>
    );


}