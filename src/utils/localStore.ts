
const storeData = (key: string, value: string) => {
    localStorage.setItem(key, value);
}

const getData = (key: string): string | null => {
    return localStorage.getItem(key);
}

const removeData = (key: string) => {
    localStorage.setItem(key,'false');
}

export { storeData , getData , removeData };