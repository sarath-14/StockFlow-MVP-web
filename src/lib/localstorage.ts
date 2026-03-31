export enum LOCAL_STORAGE_KEYS {
    TOKEN = 'token',
    USER = 'user'
}

class LocalStorage {

    public static instance: LocalStorage;

    public static getInstance() {
        return this.instance ?? new LocalStorage();
    }

    getItem(key: string) {
        return localStorage.getItem(key);
    }

    setItem(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }

    clearItems() {
        localStorage.clear();
    }
}

export const localstorage = LocalStorage.getInstance();