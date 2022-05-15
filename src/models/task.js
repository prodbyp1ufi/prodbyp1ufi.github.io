export default class Task{
    constructor(id, task, card, sortIndex, isComplete){
        this.id = id
        this.task = task
        this.card = card
        this.sortIndex = sortIndex
        this.isComplete = isComplete
    }
}