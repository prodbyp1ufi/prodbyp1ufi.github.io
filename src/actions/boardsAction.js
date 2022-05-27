import { getDocs, query, collection, doc, updateDoc, where, addDoc, deleteDoc } from 'firebase/firestore';
import {db} from '../firebase-config'
import { onSnapshot} from 'firebase/firestore'
import Board from '../models/board'
import CardsAction from './cardsAction';

export default class BoardsAction{

    static async getBoards(setBoards, workSpaceId){
        onSnapshot(query(collection(db, "boards"),where('workspace', '==', workSpaceId)), docs => {
            let boards = []
            docs.forEach(doc=>{
                const boardData = doc.data()
                const board =  new Board(doc.id, boardData.name, boardData.sortIndex, boardData.workspace )
                boards.push(board)
            })
            boards.sort((a,b)=>{return a.sortIndex - b.sortIndex})
            setBoards(boards)
        });
        
    }

    static async updateAllBoards(boards){
        boards.forEach(board=>{
            const boardDoc  = doc(collection(db, "boards"), board.id)
            updateDoc(boardDoc,{
                name : board.name,
                sortIndex : board.sortIndex
            })
        })
    }
    static async updateBoardName(boardId, newBoardName){
        await updateDoc(doc(collection(db, "boards"), boardId),{
            name : newBoardName
        })
    }

    static async addBoard(board){
        await addDoc(collection(db, "boards"), {
            name : board.name,
            sortIndex : board.sortIndex,
            workspace : board.workspaceId
        })
    }
    static async deleteBoard(boardId){
        await deleteDoc(doc(collection(db, "boards"), boardId))
    }

    static async removeBoards(workspaceId){
        await getDocs(query(collection(db, "boards"), where('workspace', '==', workspaceId))).then(
            boards=>{
                boards.forEach(board=>{
                    CardsAction.removeCards(board.id)
                    deleteDoc(doc(collection(db,'boards'), board.id))
                })
            }
        )
    }
}