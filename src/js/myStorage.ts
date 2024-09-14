import storage from "./storage";
import {Options} from "./options";
import {Item} from "./calendar";


export default {
    saveOptions(options: Options): void {
        storage.setItem('faban-calendar-options', options)
        if(options.defaultOptions.bakPath) {
            //@ts-ignore
            window.services.saveBackupFiles('options', options.defaultOptions.bakPath, JSON.stringify(options))
        }
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
    saveCalendarById(item: Item, bakUp: boolean) :void  {
        console.log('save calendar by id', item)
        if(item.id) {
            storage.setItem('faban-calendar-calendars-id/' + item.id, item)
            console.log('save calendar by id', item)
            let opts = this.getOptions();
            //@ts-ignore
            if (bakUp && opts?.defaultOptions?.bakPath) {
                //@ts-ignore
                window.services.saveBackupFiles('calendars', opts.defaultOptions.bakPath, JSON.stringify(this.getCalendars()))
            }
        }
    },
    saveCalendar(items: Item[]) :void  {
        storage.setItem('faban-calendar-calendars', items)
        let opts = this.getOptions();
        //@ts-ignore
        if(opts?.defaultOptions?.bakPath) {
            //@ts-ignore
            window.services.saveBackupFiles('calendars', opts.defaultOptions.bakPath, JSON.stringify(items))
        }
    },
    getCalendars(): Item[]{
        let itemObject = storage.getItemObject<Item[]>('faban-calendar-calendars');
        if(itemObject){
            itemObject.forEach(e=>{
                this.saveCalendarById(e, false);
            })
            storage.removeItem('faban-calendar-calendars')
        }
        //@ts-ignore
        let allDocs = utools.db.allDocs('faban-calendar-calendars-id/');
        itemObject = allDocs.map(e=>{
            return JSON.parse(e.value);
        })
        itemObject.sort((a:Item,b:Item)=>{
            return -a.createTime.localeCompare(b.createTime)
        })
        return itemObject ? itemObject : []
    }
}
