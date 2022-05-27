import { getDocs, deleteDoc, addDoc, collection, where, onSnapshot, query, updateDoc, doc} from 'firebase/firestore';
import {auth, db} from '../firebase-config'
import { Timestamp } from 'firebase/firestore';
import UserNotification from '../models/userNotification';

export default class UserNotificationAction{

    static async updateUserNotification(userNotification){
        await updateDoc(doc(collection(db,'userNotification'), userNotification.id), { isNotificated : true})
    }

    static async addUserNotification(card, delay,workSpaceId){
        if(card.users !== null){
            card.users.forEach(user=>{
                if(user !== auth.currentUser.email){
                    addDoc(collection(db,'userNotification'), {
                        userEmail : user,
                        createUserName : auth.currentUser.displayName || null,
                        createUserEmail : auth.currentUser.email || null,
                        createUserAvatar : auth.currentUser.photoURL || null,
                        workSpaceId : workSpaceId,
                        date : Timestamp.now(),
                        delay : delay,
                        cardId : card.id,
                        isNotificated : false
                    })
                }
            })
        }
    }

    static async getUserNotification(setUserNotfication, workSpaceId){
        onSnapshot(query(collection(db, "userNotification"),where('userEmail', '==', auth.currentUser.email)), docs => {
            const notifications = []
            docs.forEach(doc=>{
                const notificationsData = doc.data()
                if(notificationsData.isNotificated === false && notificationsData.workSpaceId === workSpaceId){
                    notifications.push(new UserNotification(doc.id, notificationsData.userEmail, notificationsData.createUserName, notificationsData.createUserEmail, notificationsData.createUserAvatar,
                        notificationsData.workSpaceId, notificationsData.date, notificationsData.delay,  notificationsData.cardId, notificationsData.isNotificated))
                }
            })
            
            notifications.sort((a,b)=>{return b.date - a.date})
            setUserNotfication(notifications)
        });
    }

    static async removeNotifications(cardId){
        await getDocs(query(collection(db, "userNotification"), where('cardId', '==', cardId))).then(
            notifications=>{
                notifications.forEach(notify=>{
                    deleteDoc(doc(collection(db,'userNotification'), notify.id))
                })
            }
        )
    }

}