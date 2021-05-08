import {LoginData, User} from '../types/types';
import config from './server-config';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Plugins} from '@capacitor/core';

const { Storage } = Plugins;

const endpoint = axios.create({
    baseURL: config.host,
    responseType: 'json'
});

interface TokenResponse {
    token: string
}

const timeout = 5000;

export const register = (user:User) =>
    endpoint.post<User, User>('/users', user, {timeout})

const getExpirationDate = (token: string | null) => {
    const t = token || '';
    const dec = jwt.decode(t)
    return (dec && typeof dec === 'object') ? new Date(dec['exp']*1000) : new Date;
}

export const login = (loginData: LoginData) =>
    endpoint.post<TokenResponse>('/login', loginData, {timeout})
        .then(
            ({data: {token}}) => {
                const dec = jwt.decode(token)
                const user: User = (dec && typeof dec === 'object') ? dec['user'] : {};
                return Promise.all([
                    user,
                    token,
                    Storage.set({key: 'user', value: JSON.stringify(( dec && typeof dec === 'object') ? dec['user'] : {})}),
                    Storage.set({key: 'token', value: token}),
                ])}
        ).then(([user, token, ...others]) => ({user, token}) )


export const isNotExpired = (token: string | null | undefined) => {
    if (!token) return false;
    const dec = jwt.decode(token)
    return  (dec && typeof dec === 'object') ? new Date(dec['exp']*1000) > new Date: false;
}

export const loadUserData = () => Promise.all([Storage.get({key: 'user'}),Storage.get({key: 'token'})])
    .then(([user, token]) => ({ user: user.value ? JSON.parse(user.value): null , token: token.value }))

export const clearUserData = () => Promise.all([Storage.remove({key: 'user'}), Storage.remove({key: 'token'})])

export const getUserInfo = () => Promise.all([Storage.get({key: 'user'}),Storage.get({key: 'token'})])
    .then(([user, token]) => {
        if (user.value && token.value)
            return {user: JSON.parse(user.value), token: token.value}
        else throw new Error('Not logged in!')
    })

export const createAuthenticationHeader = (token: string | null) => ({'Authorization': `Bearer ${token}`})