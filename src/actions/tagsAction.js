import {  collection, updateDoc, doc, query, where, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import {db} from '../firebase-config'
import Tag from '../models/tags'
import { onSnapshot} from 'firebase/firestore'

export default class TagsAction{
    static async getTags(setTags, workspaceId){
        onSnapshot((query(collection(db, "tags"),where('workspace', '==', workspaceId))), docs => {
            let tags = []
            docs.forEach(doc=>{
                const tagData = doc.data()
                tags.push(new Tag(doc.id, tagData.name, tagData.color, tagData.cardids, tagData.workspace))
            })
            setTags(tags)
        });
    }
    static async getCardTags(cardId){
        const tags = []
        await getDocs(query(collection(db,'tags'), where('cardids', 'array-contains', cardId))).then(
            tagDocs=>{
                tagDocs.forEach(doc=>{
                    const tagData = doc.data()
                tags.push(new Tag(doc.id, tagData.name, tagData.color, tagData.cardids, tagData.workspace))
                })
            }
        )
        return tags
    }
    static async updateTagCards(tag){
        await updateDoc(doc(collection(db, 'tags'), tag.id),{
            cardids : tag.cardids
        })
    }
    static async updateTag(tagId, newName, newColor){
        await updateDoc(doc(collection(db, 'tags'), tagId),{
            name : newName,
            color: newColor
        })
    }
    static async addTag(newName, newColor, workspaceId){
        await addDoc(collection(db, 'tags'),{
            name : newName,
            color: newColor,
            cardids : [],
            workspace: workspaceId
        })
    }
    static async removeTag(tagId){
        await deleteDoc(doc(collection(db, 'tags'), tagId))
    }
    static async removeTags(workspaceId){
        await getDocs(query(collection(db, "tags"), where("workspace", "==", workspaceId))).then((tags) => {
            tags.forEach((tag) => {
                this.removeTag(tag.id);
            });
        });
    }
}