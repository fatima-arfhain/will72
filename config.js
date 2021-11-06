import  firebase from 'firebase';
require("@firebase/firestore")

var firebaseConfig = {
  apiKey: "AIzaSyBr1drnwyK_CagdSU-41b66uSSR_WbOYE8",
  authDomain: "wilys-28066.firebaseapp.com",
  projectId: "wilys-28066",
  databaseURL : "https://wilys-28066.firebase.io.com",
  storageBucket: "wilys-28066.appspot.com",
  messagingSenderId: "869077287675",
  appId: "1:869077287675:web:c85bb106796978fff2665e"
};

if(!firebase.apps.length)
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
  