import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import {auth} from '../firebase-config'
import { collection, doc,  addDoc } from 'firebase/firestore';
import {db} from '../firebase-config'
import UsersAction from "./usersAction";

export default class AuthAction{
    static async logout(){
        await signOut(auth);
    };
    static async login(loginEmail, loginPassword){
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                loginEmail,
                loginPassword
            );
        } catch (error) {
            console.log(error.message);
        }
    }
    static async resetPassword(email){
        await sendPasswordResetEmail(auth, email)
    }
    static async register(registerEmail, registerPassword, displayName){
        try {
            const user = await createUserWithEmailAndPassword(
                auth,
                registerEmail,
                registerPassword
            )
            await updateProfile(user.user, {
                displayName : displayName
            })
            sendEmailVerification(user.user)
            UsersAction.addUser(registerEmail, displayName)
        } catch (error) {
            console.log(error.message);
        }
    }
}