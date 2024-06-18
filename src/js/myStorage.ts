import storage from "./storage";
import {Options} from "./options";
import {Item} from "./calendar";


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
    },
    saveCalendar(items: Item[]) :void  {
        // let calendars = this.getCalendars();
        // let index = calendars.findIndex(e=>e.id === item.id);
        // if(index === -1){
        //     item.
        // }
        storage.setItem('faban-calendar-calendars', items)
    },
    getCalendars(): Item[]{
        let itemObject = storage.getItemObject<Item[]>('faban-calendar-calendars');
        return itemObject ? itemObject : []
    }
}
