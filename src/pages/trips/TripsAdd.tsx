import React, {useEffect, useState} from 'react';
import * as Validator from '../../helpers/validators';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonPage, IonSpinner
} from '@ionic/react';
import {FormDescription, BuildForm} from '../../helpers/form-builder';
import {RouteComponentProps} from 'react-router';
import {login, register} from '../../services/security';
import {executeDelayed} from '../../helpers/async-helpers';
import {Trip, User} from '../../types/types';
import {fetchTripAction, fetchTripActions, fetchTripsAction, TripsResult} from '../../actions/actions';
import {useDispatch, useSelector} from 'react-redux';
import {addTrip, fetchTrip, updateTrip} from "../../services/trips";
import {AppState} from "../../index";
import thunk, {ThunkDispatch} from "redux-thunk";
import {TripState} from "../../reducers/reducers";

type formData = Readonly<Trip>;

const formDescription: FormDescription<formData> = {
    name: 'Add Trip',
    fields: [
        {name: 'name', label: 'Name', type: 'text',
            position: 'floating', color: 'primary', validators: [Validator.required]},
        {name: 'description', label: 'Description', type: 'text',
            position: 'floating', color: 'primary'},
        {name: 'begin', label: 'Begin Date', type: 'date',
            position: 'floating', color: 'primary'},
        {name: 'end', label: 'End Date', type: 'date',
            position: 'floating', color: 'primary'}
    ],
    submitLabel: 'Update'
}

const {Form ,loading, error} = BuildForm(formDescription);

export default (mode: 'add' | 'edit'): React.FC<RouteComponentProps<{ id: string }>> =>
    ({ history, match }) => {

        const thunkDispatch: ThunkDispatch<AppState, null, TripsResult> = useDispatch();
        const {currentTrip, isLoading} = useSelector<AppState, any>(s => s.tLogApp.trips);
        useEffect(() => { if (mode ==='edit' && (!currentTrip || currentTrip._id !== match.params.id)) thunkDispatch(fetchTripAction(match.params.id)) }, []);


        const dispatch = useDispatch();
    const token = useSelector<AppState, string | null>(state => state.tLogApp.user.token || null);
    const submit = (trip: Trip) => {
        dispatch(loading(true));
        if(mode=='add'){
            addTrip(token,trip)
                .then (trip=> dispatch(fetchTripActions.success(trip)))
                .then (t=> thunkDispatch(fetchTripsAction()))
                .then (t => executeDelayed(200,() => history.goBack()))
                .catch((err: Error) => {
                    dispatch(error('Error while registering: ' + err.message));
                })
                .finally(() => dispatch(loading(false)))
        }
        else{
            updateTrip(token,trip)
                .then(trip => dispatch(fetchTripActions.success(trip)))
                .then(t => thunkDispatch(fetchTripsAction()))
                .then(t => executeDelayed(200, () => history.goBack()))
                .catch((err: Error) => {
                    dispatch(error('Error while registering: ' + err.message));
                })
                .finally(() => dispatch(loading(false)))
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
                                <IonTitle>Add Trip</IonTitle>
                            );
                        } else {
                            return (
                                <IonTitle>Edit Trip</IonTitle>
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
