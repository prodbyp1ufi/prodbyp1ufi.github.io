import { getStorage, ref, uploadBytes, listAll, getDownloadURL, deleteObject} from "firebase/storage";
import FileUtils from "../utils/fileUtils";

export default class FileAction{

    static async uploadFiles(files, historyId, cardId){
        const storage = getStorage();
        for (let index = 0; index < files.length; index++) {
            const storageRef = ref(storage, cardId + '/'+ historyId + '/' +files[index].name);
            await uploadBytes(storageRef, files[index].file, {'contentType' : files[index].file.type})
        } 
    }

    static async getHistoryFiles(cardId, historyId){
        const storage = getStorage();
        const storageRef = ref(storage, cardId + '/' + historyId);
        const items = []
        let itemInStorage = await listAll(storageRef)
        for (let index = 0; index < itemInStorage.items.length; index++) {
            const fileData = await  getDownloadURL(itemInStorage.items[index])
            items.push({name : itemInStorage.items[index].name, url : fileData, type : FileUtils.getFileType(itemInStorage.items[index].name) })
        }
        return items
    }

    static async uploadFiles(files, historyId, cardId){
        const storage = getStorage();
        for (let index = 0; index < files.length; index++) {
            const storageRef = ref(storage, cardId + '/'+ historyId + '/' +files[index].name);
            await uploadBytes(storageRef, files[index].file, {'contentType' : files[index].file.type})
        } 
    }

    static async uploadNewProfileImage(file, user){
        let resultURL = ''
        const storage = getStorage();
        const storageRef = ref(storage, 'users/' +  user.uid);
        await getDownloadURL(storageRef).then(oldPhoto=>{
            deleteObject(storageRef)
        })
        .catch(error=>{
            
        })
        .finally(async ()=>{
            await uploadBytes(storageRef, file, {'contentType' : file.type}).then(
                async result=>{
                    resultURL = await getDownloadURL(storageRef)
                }
            )
        })
        return resultURL
    }

    static async removeAttachements(cardId){
        const storage = getStorage();
        const storageRef = ref(storage, cardId);
        let itemInStorage = await listAll(storageRef)
        for (let index = 0; index < itemInStorage.prefixes.length; index++) {
            const files = await listAll(itemInStorage.prefixes[index])
            files.items.forEach(file=>{
                deleteObject(file)
            })
        }
    }
}