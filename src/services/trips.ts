import { createAuthenticationHeader } from './security'
import axios from 'axios';
import config from './server-config'
import { TripList, Trip, POI } from '../types/types';
import { executeDelayed } from '../helpers/async-helpers';
import serverConfig from './server-config';

interface ErrorMessage {
    message: string;
}

const endpoint = axios.create({
    baseURL: config.host,
    responseType: 'json'
});

export const fetchMyTrips = (token: string) =>
    endpoint.get<TripList | ErrorMessage>(config.myTripURI, { headers: createAuthenticationHeader(token) })
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            return r.data as TripList;
        })

export const addTrip = (token: string | null, trip: Trip) =>
    endpoint.post<Trip | ErrorMessage>(config.tripURI, trip, { headers: createAuthenticationHeader(token) })
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            return r.data as Trip;
        })

export const updateTrip = (token: string | null, trip: Trip) =>
    endpoint.put<Trip | ErrorMessage>(`${config.tripURI}/${trip._id}`, trip, { headers: createAuthenticationHeader(token) })
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            return r.data as Trip;
        })

export const fetchTrip = (token: string | null, id: string) =>
    endpoint.get<Trip | ErrorMessage>(`${config.tripURI}/${id}`, { headers: createAuthenticationHeader(token) })
        // Use this to simulate network latency
        //.then(r => executeDelayed(3000, () => r))
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            return r.data as Trip;
        })

export const deleteTrip = (token: string | null, id: string) =>
    endpoint.delete<boolean>(`${config.tripURI}/${id}`, { headers: createAuthenticationHeader(token) })
        .then(r => true);