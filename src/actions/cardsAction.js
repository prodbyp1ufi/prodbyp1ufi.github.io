import { orderBy, query, collection, doc, updateDoc, addDoc, deleteDoc, getDocs, where } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import Card from "../models/card";
import { onSnapshot } from "firebase/firestore";
import CardHistoryAction from "./cardHistoryAction";
import UserNotificationAction from "./userNotificationAction";
import FileAction from "./fileAction";
import PrintCard from "../models/printCard";

export default class CardsAction {
    static async getCards(setCards) {
        onSnapshot(query(collection(db, "cards"), orderBy("sortIndex")), (docs) => {
            let cards = [];
            docs.forEach((doc) => {
                const cardData = doc.data();
                cards.push(new Card(doc.id, cardData.name, cardData.caption, cardData.sortIndex, cardData.board, cardData.users || [], cardData.date || null, cardData.commentCount));
            });
            cards = cards.sort((a, b) => {
                return a.sortIndex - b.sortIndex;
            });
            setCards(cards);
        });
    }
    static async moveCard(card){
        const cardDoc = doc(collection(db, "cards"), card.id);
            updateDoc(cardDoc, {
                board: card.boardId,
                sortIndex: card.sortIndex,
            });
    }
    static async getBoardCard(boardId) {
        const cards = [];
        await getDocs(query(collection(db, "cards"), where("board", "==", boardId))).then((cardDocs) => {
            cardDocs.forEach((doc) => {
                const cardData = doc.data();
                cards.push(new PrintCard(doc.id, cardData.name, cardData.caption, cardData.sortIndex, cardData.date || null, cardData.users, [], [], []));
            });
        });
        return cards;
    }

    static async updateCards(cards) {
        cards.forEach((c) => {
            const cardDoc = doc(collection(db, "cards"), c.id);
            updateDoc(cardDoc, {
                name: c.name,
                caption: c.caption,
                board: c.boardId,
                sortIndex: c.sortIndex,
            });
        });
    }

    static async updateCardName(newCardName, cardId) {
        await updateDoc(doc(collection(db, "cards"), cardId), {
            name: newCardName,
        });
    }
    static async updateCardCaption(newCardCaption, cardId) {
        await updateDoc(doc(collection(db, "cards"), cardId), {
            caption: newCardCaption,
        });
    }

    static async updateCardDate(newCardDate, card, workSpaceId) {
        await updateDoc(doc(collection(db, "cards"), card.id), {
            date: newCardDate,
        });
        const formatter = new Intl.DateTimeFormat("ru", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
        let userDelay = "";
        if (card.date === null && newCardDate !== null) {
            userDelay = "добавил(-а)";
        }
        if (card.date !== null && newCardDate === null) {
            userDelay = "удалил(-а)";
        }
        if (card.date !== null && newCardDate !== null) {
            userDelay = "изменил(-а)";
        }
        let historyDelay = `${auth.currentUser.displayName || auth.currentUser.email} `;
        switch (userDelay) {
            case "добавил(-а)":
                historyDelay += `${userDelay} срок сдачи на ${formatter.format(newCardDate)}`;
                break;
            case "удалил(-а)":
                historyDelay += `${userDelay} срок сдачи`;
                break;
            case "изменил(-а)":
                historyDelay += `${userDelay} срок сдачи с ${formatter.format(card.date)} на ${formatter.format(newCardDate)}`;
                break;
            default:
                break;
        }
        await CardHistoryAction.addHistroy("move", historyDelay, [], card, workSpaceId);
    }

    static async addCard(newCard, workSpaceId) {
        const newCardDoc = await addDoc(collection(db, "cards"), {
            name: newCard.name,
            caption: newCard.caption,
            sortIndex: newCard.sortIndex,
            board: newCard.boardId,
            users: newCard.users,
            date: newCard.date,
            commentCount: newCard.commentCount,
        });
        newCard.id = newCardDoc.id;
        let historyDelay = `${auth.currentUser.displayName || auth.currentUser.email} создал(-а) карточку`;
        await CardHistoryAction.addHistroy("move", historyDelay, [], newCard, workSpaceId);
    }
    static async joinInCard(card, workSpaceId) {
        await updateDoc(doc(collection(db, "cards"), card.id), {
            users: card.users,
        });

        let historyDelay = `${auth.currentUser.displayName || auth.currentUser.email} присоеденился(-лась) к карточке`;
        await CardHistoryAction.addHistroy("move", historyDelay, [], card, workSpaceId);
    }

    static async unsubscribeFromCard(card, workSpaceId) {
        await updateDoc(doc(collection(db, "cards"), card.id), {
            users: card.users,
        });

        let historyDelay = `${auth.currentUser.displayName || auth.currentUser.email} отсоеденился(-лась) от карточки`;
        await CardHistoryAction.addHistroy("move", historyDelay, [], card, workSpaceId);
    }

    static async removeCards(boardId) {
        await getDocs(query(collection(db, "cards"), where("board", "==", boardId))).then((cards) => {
            cards.forEach((card) => {
                this.deleteCard(card);
            });
        });
    }

    static async deleteCard(card) {
        const cardId = card.id;
        await deleteDoc(doc(collection(db, "cards"), cardId));
        await CardHistoryAction.removeHistories(cardId);
        await UserNotificationAction.removeNotifications(cardId);
        await FileAction.removeAttachements(cardId);
    }

    static async removeUserFromCard(email, card, name, workSpaceId) {
        await updateDoc(doc(collection(db, "cards"), card.id), {
            users: card.users,
        });
        let historyDelay = `${auth.currentUser.displayName || auth.currentUser.email} убрал(-а) ${name || email} из карточки`;
        await CardHistoryAction.addHistroy("move", historyDelay, [], card, workSpaceId);
    }
    static async addUserInCard(email, card, name, workSpaceId) {
        await updateDoc(doc(collection(db, "cards"), card.id), {
            users: card.users,
        });
        let historyDelay = `${auth.currentUser.displayName || auth.currentUser.email} добавил(-а) ${name || email} в карточку`;
        await CardHistoryAction.addHistroy("move", historyDelay, [], card, workSpaceId);
    }

    static async updateCommentCount(cardId, commentCount) {
        await updateDoc(doc(collection(db, "cards"), cardId), {
            commentCount: commentCount,
        });
    }
}
