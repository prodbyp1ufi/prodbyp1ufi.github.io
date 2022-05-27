import { addDoc,doc, collection, deleteDoc, getDocs, onSnapshot,  query, updateDoc, where} from 'firebase/firestore';
import {auth, db} from '../firebase-config'
import { Timestamp } from 'firebase/firestore';
import CardHistory from '../models/cardHistory';
import UserNotificationAction from './userNotificationAction';
import FileAction from './fileAction';
import CardsAction from './cardsAction';

export default class CardHistoryAction{

    static async addHistroy(type, delay, comment, card, workSpaceId){
        let commentText = null;
        if(comment.length > 0){
            commentText = comment[0].text || null
        }

        const docRef = await addDoc(collection(db,'cardHistory'), {
            type : type,
            date : Timestamp.now(),
            creatorname: auth.currentUser.displayName || null,
            creatoremail: auth.currentUser.email || null,
            creatoravatar: auth.currentUser.photoURL || null,
            delay : delay,
            comment : commentText,
            card : card.id
        })

        if(comment.length > 1){
            const files = comment[1].files
            FileAction.uploadFiles(files, docRef.id, card.id).then(action=>{
                updateDoc(docRef, {date: Timestamp.now()})
            })
        }
        if(type === 'move'){
            UserNotificationAction.addUserNotification(card, delay, workSpaceId)
        }
        if(type==="comment"){
            CardsAction.updateCommentCount(card.id, card.commentCount + 1)
        }
    }

    static async getHistory(setHistory,cardId){

        onSnapshot(query(collection(db, "cardHistory"), where('card', '==', cardId)), async  docs => {
            let history = []
            docs.forEach(doc=>{
                const historyData = doc.data()
                history.push(new CardHistory(doc.id, historyData.type, historyData.date, historyData.creatorname, historyData.creatoremail, historyData.creatoravatar , historyData.delay, historyData.comment, historyData.card))
            })
            for (let index = 0; index < history.length; index++) {
                history[index].files = await FileAction.getHistoryFiles( history[index].cardId,  history[index].id)
            }
            history.sort((a,b)=> {return b.date - a.date})
            setHistory(history)
        });
    }
    static async removeHistories(cardId){
        await getDocs(query(collection(db, "cardHistory"), where('card', '==', cardId))).then(
            histories=>{
                histories.forEach(history=>{
                    deleteDoc(doc(collection(db,'cardHistory'), history.id))
                })
            }
        )
    }
}