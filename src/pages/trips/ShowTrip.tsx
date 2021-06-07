import React, {FunctionComponent, MutableRefObject, useEffect, useRef, useState} from 'react';
import 'leaflet/dist/leaflet.css'
import '@fortawesome/fontawesome-free/css/all.css'
import L, { map } from 'leaflet';
import './ShowTrip.css';
import {RouteComponentProps} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {TripState} from "../../reducers/reducers";
import {AppState} from "../../index";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonPage, IonMenuToggle, IonItem, IonIcon, IonLabel, IonSpinner, IonToast, IonBackButton, IonFab, IonFabButton, IonFabList
} from '@ionic/react';
import {executeDelayed} from "../../helpers/async-helpers";
import {Plugins} from "@capacitor/core";
import {addCircleOutline, locate, trashOutline, eyeOutline, chevronUpCircleOutline} from "ionicons/icons";
import {
    deletePOIActions, deleteTripActions,
    fetchTripAction,
    fetchTripsAction,
    setCurrentPositionAction,
    setSelectedPOIAction,
    TripsResult, updatePOIAction
} from "../../actions/actions";
import {ThunkDispatch} from "redux-thunk";
import {removePOI} from "../../services/trips";

const mapMargin = 5;
const defaultLocation: [number, number] = [47.068634, 15.430109];

export const ShowTrip: FunctionComponent<RouteComponentProps<{ id: string }>> = ({ match, history }) => {

    // Relevant Application State
    const { currentTrip, isLoading } = useSelector<AppState, TripState>(state => state.tLogApp.trips);
    const selectedPOI = useSelector<AppState, any>(state => state.tLogApp.trips.selectedPOI);
    const pois = currentTrip?.pois;
    const token = useSelector<AppState, any>(state => state.tLogApp.user.token);

    // Ephemeral (local, short-lived) state
    const [height, setHeight] = useState(window.innerHeight);

    // References to DOM elements
    const headerRef: MutableRefObject<HTMLIonHeaderElement | null> = useRef(null);
    const mapContainerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const currentMarkerRef: MutableRefObject<L.Marker | null> = useRef(null);
    const lastSelectedMarkerRef: MutableRefObject<L.Marker | null> = useRef(null);

    const { Geolocation } = Plugins;

    const [currentPosition, setCurrentPosition] = useState(defaultLocation);
    const [hasCurrentLocationMarker, setHasCurrentLocationMarker] = useState(false);
    const [findingLocation, setFindingLocation] = useState(false);

    const dispatch = useDispatch();
    const thunkDispatch: ThunkDispatch<AppState, null, TripsResult> = useDispatch();

    const layerRef: React.MutableRefObject<L.LayerGroup | null> = useRef(null);

    useEffect(() => {
        if ((!currentTrip || currentTrip._id !== match.params.id)) {
            console.log("GET THE TRIP")
            thunkDispatch(fetchTripAction(match.params.id))
        }
    }, [])


    // Styles for Leaflet DIVIcon
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

    const defaultColor = "orange";
    // Create Icon of given POI-type and color
    const icon = (type: string, color = defaultColor) => L.divIcon({
        className: 'my-custom-pin',
        iconAnchor: [0, 30],
        // labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<div style="${markerHtmlStyles(color)}" /><i class='fa fa-${type} awesome' /></div>`
    })

    const refreshMap = () => {
        window.location.reload();
    }

    const findLocation = () => {
        Geolocation.getCurrentPosition({ timeout: 6000 })
            .then(pos => {
                //console.log('Got current location: ' + JSON.stringify(pos.coords))
                console.log("Current location: " + pos.coords.latitude + " & " + pos.coords.longitude);
                setCurrentPosition([pos.coords.latitude, pos.coords.longitude]);

            })
            .catch(err => {
                setCurrentPosition(defaultLocation);
            })
            .finally(() => {
                    setFindingLocation(false);
                    dispatch(setCurrentPositionAction(currentPosition));
                    addCurrentLocationMarker(currentPosition);
                }
            )
    };

    const addCurrentLocationMarker = (location: [number, number]) => {
        if (mapRef.current) {
            if(currentMarkerRef.current){
                (currentMarkerRef.current as L.Marker).remove()
            }
            dispatch(setSelectedPOIAction(null));
            console.log("Creating current location marker");
            const currentPositionMarker = L.marker(currentPosition,
                {
                    title: "Your current Position",
                    draggable: true,
                    icon: icon('compass', 'red'),
                    autoPan: true
                })
            currentPositionMarker.on('dragend', (e) => {
                dispatch(setCurrentPositionAction([e.target._latlng.lat, e.target._latlng.lng]))
            })
            currentPositionMarker.bindPopup('<h1>Current Position</h1><p>Drag me!</p>');
            currentPositionMarker.addTo(mapRef.current);
            currentPositionMarker.openPopup();
            currentMarkerRef.current = currentPositionMarker;
            setHasCurrentLocationMarker(true);
            lastSelectedMarkerRef.current?.remove();
            executeDelayed(50, () => mapRef.current ? mapRef.current.panTo(currentPosition):false);
        }
    }

    const clearCurrentLocationMarker = () => {
        if(currentMarkerRef.current) {
            currentMarkerRef.current.remove();
            setHasCurrentLocationMarker(false);
            dispatch(setCurrentPositionAction([500,500]));
        }
    }

    const chooseIcon = (name: string) => {
        let theIcon = 'ban';
        console.log("Type: " + name);
        switch (name) {
            case "sight":
                theIcon = 'camera';
                break;
            case "bar":
                theIcon = 'beer';
                break;
            case "restaurant":
                theIcon = 'utensils';
                break;
            case "museum":
                theIcon = 'monument';
                break;
        };
        return theIcon;
    }

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

                if(JSON.stringify(currentTrip?.pois) === '[]') {
                    console.log("No POIs yet");
                    findLocation();
                } else {
                    console.log("Already got POIS");
                    console.log("Pois: " + currentTrip?.pois)

                    if(pois) {
                        console.log('Adding Markers!')
                        const markers = pois?.map(poi => {
                            console.log("SelectedPOI: " + JSON.stringify(selectedPOI));
                            const markerIcon = icon(chooseIcon(poi.type), selectedPOI && (selectedPOI._id === poi._id) ? 'green' : defaultColor)
                            const marker = L.marker(poi.loc.coordinates as [number, number],
                                { title: poi.name, icon: markerIcon })
                            marker.on('click', (e) => {
                                console.log("Clicked: " + JSON.stringify(poi));
                                clearCurrentLocationMarker();
                                dispatch(setSelectedPOIAction(poi))

                                const newMarker = L.marker([marker.getLatLng().lat, marker.getLatLng().lng]);
                                newMarker.setIcon(icon(chooseIcon(poi.type), 'green'));
                                newMarker.addTo(layerGrp);
                                lastSelectedMarkerRef.current?.remove();
                                lastSelectedMarkerRef.current = newMarker;
                            });
                            marker.addTo(layerGrp);
                            if (selectedPOI && (selectedPOI._id === poi._id)) {
                                marker.openPopup();
                            }
                            return { poiId: poi._id, type: poi.type, marker }
                        });
                        const polyline = L.polyline(
                            pois.map(poi => poi.loc.coordinates as [number, number]),
                            { color: defaultColor }).addTo(layerGrp);
                    }
                }
            }
        }
    }, [height]);



    // Helper function to bring up a spinner on a given condition with a given text
    const spinner = (isLoading: boolean, text: string = 'Loading Trip...') => isLoading ?
        (<IonItem>
            <IonSpinner /> {text}
        </IonItem>) : (<></>);

    return (
        <IonPage>
            <IonHeader ref={headerRef}>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref='/trips/' />
                    </IonButtons>
                    <IonTitle>{currentTrip?.name}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton disabled={!hasCurrentLocationMarker} onClick={e => {
                            e.preventDefault();
                            history.push('/trips/poi/add/' + match.params.id);}}>
                            <IonIcon slot="icon-only" icon={addCircleOutline}/>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {isLoading ? spinner(isLoading) :
                    <div id="map" ref={mapContainerRef}
                         style={{ width: '100%', height: height, display: isLoading ? 'none' : 'block', marginTop: mapMargin }} >

                        <IonFab vertical="bottom" horizontal="end" >
                            <IonFabButton disabled={hasCurrentLocationMarker || findingLocation}
                                          onClick={
                                              findLocation
                                          }>
                                <IonIcon icon={locate} />
                            </IonFabButton>
                        </IonFab>

                        <IonFab vertical="bottom" horizontal="start" hidden={!selectedPOI}>
                            <IonFabButton>
                                <IonIcon icon={chevronUpCircleOutline} />
                            </IonFabButton>
                            <IonFabList side="top">
                                <IonFabButton>
                                    <IonIcon icon={trashOutline} onClick={e => {
                                        e.preventDefault();
                                        removePOI(token, match.params.id, selectedPOI._id)
                                            .then(trip => dispatch(deletePOIActions.success()))
                                            //.then(reload => refreshMap())
                                            .catch((err: Error) => {
                                                console.log(err);
                                            })
                                            .finally(refreshMap)
                                    }}/>
                                </IonFabButton>
                                <IonFabButton>
                                    <IonIcon icon={eyeOutline} onClick={e => {
                                        e.preventDefault();
                                        history.push('/trips/poi/show')}}/>
                                </IonFabButton>
                            </IonFabList>
                        </IonFab>
                    </div>}

            </IonContent>
        </IonPage>
    )

}