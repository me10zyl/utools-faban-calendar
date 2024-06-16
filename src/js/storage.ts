function setItem(key: string, value: Object):void
function setItem(key: string, value: string):void {
    if (typeof value === 'string') {
        localStorage.setItem(key, value)
    } else {
        let jsonString = JSON.stringify(value);
        localStorage.setItem(key, jsonString)
    }
}
function getItem(key: string): string {
    return localStorage.getItem(key)
}
function getItemObject<T>(key: string): T {
    let item = localStorage.getItem(key);
    if(item == null){
        return null;
    }
    return JSON.parse(item)
}
export default {
    setItem: setItem,
    getItem: getItem,
    getItemObject: getItemObject
}