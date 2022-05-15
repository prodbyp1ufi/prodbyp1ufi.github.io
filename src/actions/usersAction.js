import User from '../models/user'
import { db } from '../firebase-config';
import { collection, onSnapshot, addDoc, getDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export default class UsersAction{
    static async addUser(email, displayName){
        await addDoc(collection(db,'users'),{
            email : email,
            displayName : displayName,
            avatarURL: null
        })
    }
    static async getCardUsers(cardUsers){
        const users =[]
        await getDocs(query(collection(db,'users'),where('email','in',cardUsers))).then(
            userDocs=>{
                userDocs.forEach(doc=>{
                    const userData = doc.data()
                    users.push(new User(doc.id, userData.avatarURL, userData.displayName, userData.email))
                })
            }
        )
        return users
    }
    static async userExist(email){
        const users =await getDocs(query(collection(db, 'users'), where('email', '==', email)))
        if(users.docs.length === 1){
            const userData= users.docs[0].data()
            return new User(users.docs[0].id, userData.avatarURL, userData.displayName, userData.email)
        }
        else{
            return undefined
        }
    }
    static async getWorkspaceUsers(emails, setUsers){
        onSnapshot(collection(db, "users"), docs => {
            let users = []
            docs.forEach(doc=>{
                const userData = doc.data()
                if(emails.includes(userData.email)){
                    users.push(new User(doc.id, userData.avatarURL, userData.displayName, userData.email))
                }
            })
            setUsers(users)
        });
    }
    static async updateUser(newPhotoURL, newDispayName, user){
        const users =await getDocs(query(collection(db, 'users'), where('email', '==', user.email)))
        if(users.docs.length === 1){
            if(newPhotoURL !== null){
                updateProfile(user, 
                    {
                        displayName : newDispayName,
                        photoURL : newPhotoURL
                    })
                updateDoc(doc(collection(db,'users'), users.docs[0].id), {
                    displayName : newDispayName,
                    avatarURL: newPhotoURL
                })
            }
            else{
                updateProfile(user, 
                    {
                        displayName : newDispayName
                    })
                updateDoc(doc(collection(db,'users'), users.docs[0].id), {
                    displayName : newDispayName
                })
            }
        }
        
    }
}