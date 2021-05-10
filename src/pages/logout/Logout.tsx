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
import {loggedIn, loggedOut} from '../../actions/actions';
import { useDispatch } from 'react-redux';
import "./Logout.css";
type formData = Readonly<LoginData>;

/*const formDescription: FormDescription<formData> = {
    name: 'login',
    fields: [
        {name: 'email', label: 'Email', type: 'email',
            position: 'floating', color: 'primary', validators: [Validator.required, Validator.email]},
        {name: 'password', label: 'Password', type: 'password',
            position: 'floating', color: 'primary',validators: [Validator.required]}
    ],
    submitLabel: 'Login'
}*/

// const {Form ,loading, error} = BuildForm(formDescription);

export const Logout: React.FunctionComponent<RouteComponentProps<any>> = (props) => {

    const dispatch = useDispatch();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>You are about to log out!</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <h3 className="center">Are you sure you want to log out?</h3>
                <div>
                    <div className="div-parent">
                        <div className="div-child-left">
                            <IonButton  expand="block" color="medium" onClick={e => {
                                e.preventDefault();
                                props.history.push('/home/list')
                            } }>Cancel</IonButton>
                        </div>

                    </div>
                    <div className="div-parent">

                        <div className="div-child-right">
                            <IonButton expand="block" onClick={e => {
                                e.preventDefault();
                                dispatch(loggedOut());
                            } }>Logout</IonButton>
                        </div>
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
}

    export default Logout