import {
  IonChip,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonHeader,
  IonToolbar,
  IonTitle, IonText,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
  logIn,
    logOut,
    home,
    list,
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
  personAddOutline
} from 'ionicons/icons';
import './Menu.css';
import {loggedIn, loggedOut} from "../actions/actions";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../index";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [

  {
    title: 'Home',
    url: '/home',
    iosIcon: home,
    mdIcon: home
  },
  {
    title: 'Login',
    url: '/login',
    iosIcon: logIn,
    mdIcon: logIn
  },
  {
    title: 'Register',
    url: '/login/register',
    iosIcon: personAddOutline,
    mdIcon: personAddOutline
  }
];
const secureAppPage: AppPage[] = [
  {
    title: 'Home',
    url: '/home',
    iosIcon: home,
    mdIcon: home
  },
    {
  title: 'My Trips',
  url: '/trips',
  iosIcon: list,
  mdIcon: list
},{
    title: 'Logout',
    url: '/logout',
    iosIcon: logOut,
    mdIcon: logOut
  }];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {
  const location = useLocation();
  const token = useSelector<AppState, string | null>(state => state.tLogApp.user.token || null);
  const userName = useSelector<AppState, string | null>(state => state.tLogApp.user.user?.username || null);
  const dispatch = useDispatch();

  return (
      <IonMenu contentId="main" type="overlay">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <h4 >Welcome</h4>
          {(() => {
            if (token) {
              return (<IonListHeader>
                <IonLabel>{userName}</IonLabel>
              </IonListHeader>)
            } else {
              return (<IonListHeader>
                <IonLabel>Not logged in</IonLabel>
              </IonListHeader>)
            }
          })()}
          <h4 > test</h4>
          <IonList>
            {appPages.map((appPage, index) => {
              if (!token) {
                return (
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem routerLink={appPage.url} routerDirection="none">
                      <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
              ); }
            })}
            {secureAppPage.map((appPage, index) => {
              if (token) {
                return (
                    <IonMenuToggle key={index} autoHide={false}>
                      <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="back" lines="none" detail={false}>
                        <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                        <IonLabel>{appPage.title}</IonLabel>
                      </IonItem>
                    </IonMenuToggle>
                );
              }
            })}
          </IonList>
        </IonContent>
      </IonMenu>
  );
};

export default Menu;
