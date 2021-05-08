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
}