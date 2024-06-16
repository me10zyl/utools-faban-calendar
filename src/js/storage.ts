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
function getItemObject(key: string): object {
    return JSON.parse(localStorage.getItem(key))
}
export default {
    setItem: setItem,
    getItem: getItem,
    getItemObject: getItemObject
}