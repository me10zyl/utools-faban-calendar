import storage from "./storage";
import {Options} from "./options";


export default {
    saveOptions(options: Options):void {
        storage.setItem('faban-calendar-options', options)
    },
    getOptions(): Options{
        return storage.getItemObject<Options>('faban-calendar-options')
    }
}
