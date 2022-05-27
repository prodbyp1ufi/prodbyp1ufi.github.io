import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth  } from "firebase/auth";

const app = initializeApp({
    apiKey: "AIzaSyAn4vaSvy0RYLjA4BTuI_Hso-jCrSbA-fQ",
    authDomain: "taskboard-36175.firebaseapp.com",
    projectId: "taskboard-36175",
    storageBucket: "taskboard-36175.appspot.com",
    messagingSenderId: "823787540229",
    appId: "1:823787540229:web:1bc09b24f39f778bb3f16c"
});

export const db = getFirestore(app);
export const auth = getAuth(app);
