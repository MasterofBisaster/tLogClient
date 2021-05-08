import { IonButtons, IonCard, IonButton, IonIcon, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { personCircle, search, star, ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import './Homepage.css';
import '../../actions/actions'


const HomePage: React.FunctionComponent = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard class="welcome-card">
                    <IonCardHeader>

                        <IonCardTitle>Welcome to Tlog</IonCardTitle>
                        <IonCardSubtitle>The ultimate Travel Blog Application</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <p>
                            You are now ready to document all your trips and probably share them with others!
                        </p>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default HomePage;