export default class UserNotification{
    constructor(id, userEmail, createUserName, createUserEmail,createUserAvatar, workSpaceId, date, delay, cardId, isNotificated){
        this.id = id
        this.userEmail = userEmail
        this.createUserName = createUserName
        this.createUserEmail = createUserEmail
        this.createUserAvatar = createUserAvatar
        this.workSpaceId = workSpaceId
        this.date = date
        this.delay = delay
        this.cardId = cardId
        this.isNotificated = isNotificated
    }
}