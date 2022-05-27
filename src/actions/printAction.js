import CardsAction from "./cardsAction";
import TagsAction from "./tagsAction";
import TaskListAction from "./taskListAction";
import UsersAction from "./usersAction";
import { jsPDF } from "jspdf";
import '../fonts/Stem-Regular-normal.js'
import { auth } from "../firebase-config";
export default class PrintAction{

    static async printCardsInBoard(board){
        const formatter = new Intl.DateTimeFormat("ru", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
        const boardCards = await CardsAction.getBoardCard(board.id)
        for (let index = 0; index < boardCards.length; index++) {
            await TagsAction.getCardTags(boardCards[index].id).then(
                tags=>{
                    boardCards[index].tags = tags
                }
            )
            await TaskListAction.getCardTaskList(boardCards[index].id).then(
                taskList=>{
                    boardCards[index].tasklist = taskList
                }
            )
            if(boardCards[index].userEmails !== null && boardCards[index].userEmails.length > 0){
                await UsersAction.getCardUsers(boardCards[index].userEmails).then(
                    users=>{
                        boardCards[index].users = users
                    }
                )
            }
        }

        const dateNow = Date.now()
        const cardOnPrint = boardCards.filter(card=> card.date !== null && card.date < dateNow)
        
        const doc = new jsPDF();
        doc.addFont('Stem-Regular-normal.ttf', 'MyFont', 'normal')
        doc.setFont('MyFont')
        doc.setFontSize(14)
        if(cardOnPrint.length === 0){
            doc.text(auth.currentUser.displayName + `<${auth.currentUser.email}> - ${formatter.format(dateNow)}`, 55, 20)
            doc.text(`В столбце \'${board.name}\' нет просроченных задач`, 20,30,{maxWidth:180})
        }
        else{
            cardOnPrint.forEach((card,index)=>{
                doc.text(auth.currentUser.displayName + `<${auth.currentUser.email}> - ${formatter.format(dateNow)}`, 55, 20)
                const cardString = this.cardToString(card)
                doc.text(cardString, 20,30,{maxWidth:180})
                
                if(index !== cardOnPrint.length-1){
                    doc.addPage()
                }
            })
        }
        const fileName = `${board.name} - ${formatter.format(dateNow)}.pdf`
        doc.save(fileName)
    }
    static cardToString(card){
        const formatter = new Intl.DateTimeFormat("ru", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
        let cardString = `Имя: ${card.name}\r\r\n`
        cardString += `Описание: ${card.caption}\r\r\n`
        cardString += `Срок сдачи: ${formatter.format(card.date)}\r\r\n`
        cardString += `Прикрепленные метки: ${card.tags.length === 0 ? 'отсутвуют' : '\r\n'}`
        card.tags.forEach(tag=>{
            cardString+=`       ·${tag.name}\r\n`
        })
        cardString += '\r\r\n'
        cardString += `Поставленные задачи:  ${card.tasklist.length === 0 ? 'отсутвуют' : '\r\n'}`
        card.tasklist.forEach(task=>{
            cardString+=`       ·${task.task} ${!task.isComplete ? '(не выполнена)' : ''}\r\n`
        })
        cardString += '\r\r\n'
        cardString += `Участники:  ${card.users.length === 0 ? 'отсутвуют' : '\r\n'}`
        card.users.forEach(user=>{
            cardString+=`       ·${user.displayName} <${user.email}>\r\n`
        })
        return cardString
    }
}