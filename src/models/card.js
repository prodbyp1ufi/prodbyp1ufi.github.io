export default class Card{
    constructor(id, name, caption, sortIndex, boardId, users, date, commentCount){
        this.id = id
        this.name = name
        this.caption = caption
        this.sortIndex = sortIndex
        this.boardId = boardId
        this.users = users
        this.date = date !== null ? date.toDate() : date
        if(date !== null){
            this.date.setTime(this.date.getTime() + (3*60*60*1000));
        }
        this.commentCount = commentCount
    }
}