import FileAction from "../actions/fileAction"

export default class CardHistory{
    constructor(id, type, date, creatorName,creatorEmail, creatorAvatar, delay, comment, cardId){
        this.id = id
        this.type = type
        this.date = date
        this.creatorName = creatorName
        this.creatorEmail = creatorEmail
        this.creatorAvatar = creatorAvatar
        this.delay = delay
        this.comment = comment
        this.cardId = cardId
        this.files = []
    }
}