import { createAction, createAsyncAction, createCustomAction } from 'typesafe-actions';
import {User} from '../types/types';


export interface LoginInfo {
    user: User | null;
    token: string | null;
}

// Security related actions
export const loggedIn = createAction('user/loggedIn')<LoginInfo>();
export const loggedOut = createAction('user/loggedOut')<void>();
