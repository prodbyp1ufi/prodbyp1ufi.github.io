import { query, collection,where, getDoc, doc, updateDoc, addDoc, deleteDoc} from 'firebase/firestore';
import {db, auth} from '../firebase-config'
import { onSnapshot} from 'firebase/firestore'
import WorkSpace from '../models/workspace'
import BoardsAction from './boardsAction';
import TagsAction from './tagsAction';

export default class WorkSpaceAction{
    static async getWorkSpaces(setWorkSpaces, email){
        onSnapshot(query(collection(db, "workspace"), where('users', 'array-contains', email)), docs => {
            let workspace = []
            docs.forEach(doc=>{
                const workspaceData = doc.data()
                workspace.push(new WorkSpace(doc.id, workspaceData.name, workspaceData.users))
            })
            setWorkSpaces(workspace)
        });
        
    }
    static async getWorkSpace(workSpaceId){
        const workspaceDoc = await getDoc(doc(db, 'workspace',workSpaceId))
        const workspaceData = workspaceDoc.data()
        return new WorkSpace(workspaceDoc.id, workspaceData.name, workspaceData.users)
    }

    static async updateWorkspaceName(workSpaceId, newWorkSpaceName){
        await updateDoc(doc(collection(db,'workspace'), workSpaceId),{
            name : newWorkSpaceName
        })
    }
    static async addWorkspace(newWorkSpaceName){
        await addDoc(collection(db,'workspace'),{
            name : newWorkSpaceName,
            users: [auth.currentUser.email]
        })
    }

    static async removeWorkspace(workspaceId){
        await deleteDoc(doc(collection(db,'workspace' ), workspaceId))
        await BoardsAction.removeBoards(workspaceId)
        await TagsAction.removeTags(workspaceId)
    }

    static async updateWorkspaceUsers(workSpaceId, users){
        await updateDoc(doc(collection(db,'workspace'), workSpaceId),{
            users : users
        })
    }
}