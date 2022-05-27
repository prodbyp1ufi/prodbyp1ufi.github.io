export default class AvatarUtils{
    static getAvatarReplacerText(creatorName, creatorEmail){
        if(creatorName !== null){
            return creatorName.charAt(0)
        }
        if(creatorEmail !== null){
            return creatorEmail.charAt(0)
        }
        return ''
    }
}