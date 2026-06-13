import * as firebase from "firebase/app";
import "firebase/messaging";

const initializedFirebaseApp = firebase.initializeApp({
// Project Settings => Add Firebase to your web app
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDID
});

const messaging = initializedFirebaseApp.messaging();

messaging.usePublicVapidKey(
// Project Settings => Cloud Messaging => Web Push certificates
  "BOVgeEt6ayTASst_3vfbfN2pnBmLO2ijuYjiwxP9cJ8Dn8OOvlDz6poJG9P13-zquskxKm6Qrcuh-H2u9hVFX30"
);

export { messaging };
