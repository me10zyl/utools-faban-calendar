import storage from "./storage";
import {DefaultOptions} from "./options";


export default {
    saveDefaultConf(options: DefaultOptions):void {
        storage.setItem('defaultOptions', options)
    },
    getDefaultConf(){
        storage.getItem('defaultOptions')
    }
}
