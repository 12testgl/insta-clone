import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import 'firebase/compat/storage';
const firebaseConfig = {
    apiKey: "AIzaSyDj-3qE7YcwmK2ByTpAN2oQxLGnGLyi9ng",
    authDomain: "insta-clone-8d193.firebaseapp.com",
    projectId: "insta-clone-8d193",
    storageBucket: "insta-clone-8d193.appspot.com",
    messagingSenderId: "554195562820",
    appId: "1:554195562820:web:f4c49f374c4a3b00b6e711"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const storage = firebase.storage()
const db = firebaseApp.firestore()
export { auth, db, storage }