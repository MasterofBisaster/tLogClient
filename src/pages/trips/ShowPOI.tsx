import React, { FunctionComponent, useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem } from '@ionic/react';
import { match } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../../index';
import { TripState } from '../../reducers/reducers';

export const ShowPOI: FunctionComponent = () => {

    const {selectedPOI} = useSelector<AppState, TripState>(state => state.tLogApp.trips)


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>{selectedPOI ? selectedPOI.name : 'No Name POI'}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonItem>{selectedPOI && selectedPOI.description ? selectedPOI.description : 'No description available.'}</IonItem>
            </IonContent>
        </IonPage>)
}