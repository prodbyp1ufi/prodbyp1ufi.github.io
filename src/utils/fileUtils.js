
const imageExtension = ['.apng', '.avif', '.gif', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp',
'.png', '.svg', '.webp', '.bmp', '.ico', '.cur', '.tif', '.tiff']
const videoExtension = ['.mp4', '.mov', '.wmv', 'avi', 'avchd', 'flv', 'f4v', 'swf', 'mkv', 'webm', 'mpeg-2']
export default class FileUtils{
    

    static getFileExtension(fileName){
        return fileName.substring(fileName.lastIndexOf('.'), fileName.length) || fileName;
    }

    static getFileType(fileName){
        const extension = this.getFileExtension(fileName)
        if(imageExtension.includes(extension)){
            return 'image'
        }
        if(videoExtension.includes(extension)){
            return 'video'
        }
        return 'other file'
    }
}