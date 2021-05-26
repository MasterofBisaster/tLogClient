export interface User {
    _id?: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string,
    password: string
}

export interface ErrorMessage {
    message: string
}export interface POI {
    _id: string
    name: string;
    type: string;
    description?: string;
    loc: GeoJSON.Point;
    creator?: any;
    createdAt?: Date;
}

export interface Trip {
    _id: string,
    name: string,
    description?: string,
    begin?: Date,
    end?: Date,
    createdAt?: Date;
    creator?: {
        _id: string,
        username: string
    };
    pois?: POI[]
}
export type POIType =  'current'|'bar'|'sight'|'restaurant'|'museum'|'church'|'pub'|'hotel'

export type TripList = Trip[]