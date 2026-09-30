export class Store {
    #items = [];

    add(item) {
        if (!item || !item.name || typeof item.price !== 'number' || typeof item.qty !== 'number') {
            throw new Error("Invalid item format");
        }
        this.#items.push(item);
    }

    remove(name) {
        this.#items = this.#items.filter(item => item.name !== name);
    }

    find(name) {
        return this.#items.find(item => item.name === name) || null;
    }

    get total() {
        return this.#items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    get items() {
        return [...this.#items];
    }

    static isStore(obj) {
        return obj instanceof Store;
    }
}

export class SortedStore extends Store {
    get items() {
        const unsorted = super.items;
        return unsorted.sort((a, b) => a.price - b.price);
    }
}