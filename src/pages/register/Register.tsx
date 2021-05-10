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
import {login, register} from '../../services/security';
import {executeDelayed} from '../../helpers/async-helpers';
import {User} from '../../types/types';
import { loggedIn } from '../../actions/actions';
import { useDispatch } from 'react-redux';

type formData = Readonly<User>;

const formDescription: FormDescription<formData> = {
    name: 'register',
    fields: [
        {name: 'username', label: 'Username', type: 'text',
            position: 'floating', color: 'primary', validators: [Validator.required, Validator.required]},
        {name: 'email', label: 'Email', type: 'email',
            position: 'floating', color: 'primary', validators: [Validator.required, Validator.email]},
        {name: 'password', label: 'Password', type: 'password',
            position: 'floating', color: 'primary',validators: [Validator.required]}
    ],
    submitLabel: 'Register'
}

const {Form ,loading, error} = BuildForm(formDescription);

export const Register: React.FunctionComponent<RouteComponentProps<any>> = (props) => {

    const dispatch = useDispatch();

    const submit = (user: User) => {
        dispatch(loading(true));
        register(user)
           /* .then((loginInfo) => {
                dispatch(loggedIn(loginInfo))
                executeDelayed(200,() => props.history.replace('/home/list'))
            })*/
            .catch((err: Error) => {
                dispatch(error('Error while registering: ' + err.message));
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
                    <IonTitle>Register</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <Form handleSubmit={submit}/>
               {/* <IonButton expand="block" color="medium" onClick={e => {
                    e.preventDefault();
                    props.history.push('/login/register')
                } }>Create an Account</IonButton>*/}
            </IonContent>
        </IonPage>
    );
}

export default Register