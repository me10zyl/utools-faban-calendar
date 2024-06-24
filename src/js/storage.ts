function setItem(key: string, value: Object):void
function setItem(key: string, value: string):void {
    if (typeof value === 'string') {
        // @ts-ignore
        utools.dbStorage.setItem(key, value)
    } else {
        let jsonString = JSON.stringify(value);
        // @ts-ignore
        utools.dbStorage.setItem(key, jsonString)
    }
}
function getItem(key: string): string {
    // @ts-ignore
    return utools.dbStorage.getItem(key)
}
function getItemObject<T>(key: string): T {
    // @ts-ignore
    let item = utools.dbStorage.getItem(key);
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