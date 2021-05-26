import React, {FunctionComponent, MutableRefObject, useEffect, useRef, useState} from 'react';
import 'leaflet/dist/leaflet.css'
import '@fortawesome/fontawesome-free/css/all.css'
import L, { map } from 'leaflet';
import './ShowTrip.css';
import {RouteComponentProps} from "react-router";
import {TripState} from "../../reducers/reducers";
import {useSelector} from "react-redux";
import {AppState} from "../../index";
import {IonButtons, IonContent, IonHeader, IonItem, IonPage, IonSpinner, IonTitle, IonToolbar,IonBackButton} from "@ionic/react";
import {executeDelayed} from "../../helpers/async-helpers";
import {Plugins} from "@capacitor/core";

export const ShowTrip: FunctionComponent<RouteComponentProps<{ id: string }>> = ({ match, history }) => {
    const mapMargin = 5;
    const defaultLocation: [number, number] = [47.312579, 15.567274];
    const markerHtmlStyles = (color: string) => `
        background-color: ${color};
        width: 3rem;
        height: 3rem;
        display: block;
        left: -1.5rem;
        top: -1.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 3px solid #FFFFFF`
// Relevant Application State
    const { currentTrip, isLoading } =
        useSelector<AppState, TripState>(state => state.tLogApp.trips);
// Ephemeral (local, short-lived) state
    const [height, setHeight] = useState(window.innerHeight);
// References to DOM elements
    const headerRef: MutableRefObject<HTMLIonHeaderElement | null> = useRef(null);
    const mapContainerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
    let latitude = 0;
    let longitude = 0;
    // Calculate the height of the map container
    useEffect(() => {
        if (headerRef.current && mapContainerRef.current) {
            if (headerRef.current.clientHeight === 0) {
                // Dirty workaround to re-initialize faulty HTML container
                executeDelayed(100, () => setHeight(height))
            }
            setHeight(window.innerHeight - headerRef.current.clientHeight - mapMargin)
        }
    }, [height]);
    const mapRef: React.MutableRefObject<L.Map | null> = useRef(null);
    const layerRef: React.MutableRefObject<L.LayerGroup | null> = useRef(null);
    let defaultColor = 'red';
    const icon = (type: string, color = defaultColor) => L.divIcon({
        className: 'my-custom-pin',
        iconAnchor: [0, 30],
        // labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<div style="${markerHtmlStyles(color)}" /><i class='fa fa-${type} awesome'></div>`
    })
    const { Geolocation } = Plugins;
    const marker = L.marker( [latitude, longitude],
        { title: "A cool name", icon: icon("poo") })
    Geolocation.getCurrentPosition({ timeout: 6000 })
        .then(pos => {
            console.log('Got current location: ' + JSON.stringify(pos.coords))
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;

            if (JSON.stringify(pos.coords)==='{}'){
                console.log('Geht nix! Kummt nix!')
                latitude = defaultLocation[0];
                longitude = defaultLocation[1];
            }
        })
        .catch(err => {
            latitude = defaultLocation[0];
            longitude = defaultLocation[1];
            // Use defaultLocation instead setUsingDefaultLocation(true);

        })
        .finally(
            ()=> marker.setLatLng([latitude,longitude])
        )
    useEffect(() => {
        if (mapContainerRef.current) {
            // Only create map if the div container already got its height
            if (mapContainerRef.current.clientHeight > 0 && !mapRef.current) {

                mapRef.current = L.map('map', {
                    center: defaultLocation,
                    zoom: 16,
                    layers: [
                        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                            attribution:
                                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        }),
                    ]
                });
                layerRef.current = L.layerGroup().addTo(mapRef.current as L.Map);
                const layerGrp = layerRef.current;
                marker.addTo(layerGrp);
            }
        }
    }, [height]);




    // Helper function to bring up a spinner on a given condition with a given text
    const spinner = (isLoading: boolean, text: string = 'Loading Trip...') => isLoading ?
        (<IonItem>
            <IonSpinner /> {text}
        </IonItem>) : (<></>);

    // Styles for Leaflet DIVIcon


// Create Icon of given POI-type and color





    return (
        <IonPage>
            <IonHeader ref={headerRef}>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref='/trips/' />
                    </IonButtons>
                    <IonTitle>The Trip Name</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {isLoading ? spinner(isLoading) :
                    <div id="map" ref={mapContainerRef}
                         style={{ width: '100%', height: height, display: isLoading ? 'none' : 'block', marginTop: mapMargin }} >
                    </div>}
            </IonContent>
        </IonPage>
    )
}