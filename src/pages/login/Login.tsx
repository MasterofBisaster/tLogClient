import React from 'react';
import * as Validator from '../../helpers/validators';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonPage
} from '@ionic/react';
import {FormDescription, BuildForm} from '../../helpers/form-builder';
import {RouteComponentProps} from 'react-router';
import {login} from '../../services/security';
import {executeDelayed} from '../../helpers/async-helpers';
import {LoginData} from '../../types/types';
import { loggedIn } from '../../actions/actions';
import { useDispatch } from 'react-redux';

type formData = Readonly<LoginData>;

const formDescription: FormDescription<formData> = {
    name: 'login',
    fields: [
        {name: 'email', label: 'Email', type: 'email',
            position: 'floating', color: 'primary', validators: [Validator.required, Validator.email]},
        {name: 'password', label: 'Password', type: 'password',
            position: 'floating', color: 'primary',validators: [Validator.required]}
    ],
    submitLabel: 'Login'
}

const {Form ,loading, error} = BuildForm(formDescription);

export const Login: React.FunctionComponent<RouteComponentProps<any>> = (props) => {

    const dispatch = useDispatch();

    const submit = (loginData: LoginData) => {
        dispatch(loading(true));
        login(loginData)
            .then((loginInfo) => {
                dispatch(loggedIn(loginInfo))
                executeDelayed(200,() => props.history.replace('/home/list'))
            })
            .catch((err: Error) => {
                dispatch(error('Error while logging in: ' + err.message));
            })
            .finally(() => dispatch(loading(false)))
    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <Form handleSubmit={submit}/>
                <IonButton expand="block" color="medium" onClick={e => {
                    e.preventDefault();
                    props.history.push('/login/register')
                } }>Create an Account</IonButton>
            </IonContent>
        </IonPage>
    );
}

export default Login