export function textCleanup(text: string):string {
    if (!text) {
        return ""
    }
    return text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').replace(/\t+/g, ' ').trim();
}