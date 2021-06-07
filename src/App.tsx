import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';
import HomePage from './pages/home/Homepage';
import Register from './pages/register/Register';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Login from "./pages/login/Login";
import Logout from "./pages/logout/Logout";
import TripsList from "./pages/trips/TripsList";
import React from 'react';
import { SecureRoute } from './components/SecureRoute';
import TripsAdd from "./pages/trips/TripsAdd";
import {ShowTrip} from "./pages/trips/ShowTrip";
import AddPOI from "./pages/trips/AddPOI";
import {ShowPOI} from "./pages/trips/ShowPOI";

const App: React.FC = () => {
    return (
        <IonApp>
            <IonReactRouter>
                <IonSplitPane contentId="main">
                    <Menu />
                    <IonRouterOutlet id="main">
                        <Route path="/home" component={HomePage} exact={true} />
                        <Route path="/login" component={Login} exact={true} />
                        <Route path="/login/register" component={Register} exact={true} />
                        <Route path="/logout" component={Logout} exact={true} />
                        <SecureRoute path="/trips" component={TripsList} exact={true} />
                        <SecureRoute path="/trips/add" component={TripsAdd("add")} exact={true} />
                        <SecureRoute path="/trips/edit/:id" component={TripsAdd("edit")} exact={true} />
                        <SecureRoute path="/trips/show/:id" component={ShowTrip} exact={true} />
                        <SecureRoute path="/trips/poi/add/:tripId" component={AddPOI('add')} exact={true} />
                        <SecureRoute path="/trips/poi/edit/:tripId" component={AddPOI('edit')} exact={true} />
                        <SecureRoute path="/trips/poi/show" component={ShowPOI} exact={true} />
                        <Route path="/" exact={true}>
                            <Redirect to="/home" />
                        </Route>
                    </IonRouterOutlet>
                </IonSplitPane>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;