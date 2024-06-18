import storage from "./storage";
import {Options} from "./options";


export default {
    saveOptions(options: Options): void {
        storage.setItem('faban-calendar-options', options)
    },
    getOptions(): Options {
        let opts = storage.getItemObject<Options>('faban-calendar-options');
        if (opts == null) {
            opts = {
                projects: [],
                defaultOptions: null
            }
        }
        return opts
    }
}
