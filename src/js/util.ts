export function now(): string {
    let date = new Date();

    function paddingLeft(str: string | number): string {
        return String(str).replace(/^\b(\d)\b$/, "0$1")
    }

    return date.getFullYear() + "-" + paddingLeft(date.getMonth() + 1) + "-"
        + paddingLeft(date.getDate()) + " " + paddingLeft(date.getHours()) + ":"
        + paddingLeft(date.getMinutes()) + ":" + paddingLeft(date.getSeconds());
}

export function generateRandomString(length: number = 32) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}