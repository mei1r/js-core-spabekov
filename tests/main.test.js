import { describe, it, expect } from 'vitest';
import { unique, groupBy, chunk, deepClone, memoize, counter } from '../src/functions.js';
import { Store, SortedStore } from '../src/Store.js';

describe('Часть 1: Функции', () => {
    it('1. unique: удаляет дубликаты и обрабатывает неверный тип', () => {
        expect(unique([1, 1, 2, 3, 3])).toEqual([1, 2, 3]);
        expect(unique('not array')).toEqual([]);
    });

    it('2. groupBy: группирует по ключу', () => {
        const arr = ['one', 'two', 'three'];
        expect(groupBy(arr, w => w.length)).toEqual({ 3: ['one', 'two'], 5: ['three'] });
        expect(groupBy(null, w => w)).toEqual({});
    });

    it('3. chunk: разбивает массив на части, включая размер <= 0', () => {
        expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
        expect(chunk([1, 2], 0)).toEqual([]);
    });

    it('4. deepClone: глубоко копирует объекты и даты без сохранения ссылок', () => {
        const obj = { a: 1, b: { c: 2 }, d: new Date('2026-09-30') };
        const cloned = deepClone(obj);
        expect(cloned).toEqual(obj);
        expect(cloned).not.toBe(obj);
        expect(cloned.b).not.toBe(obj.b);
    });

    it('5. memoize: кэширует результаты через замыкание', () => {
        let calls = 0;
        const add = (a, b) => { calls++; return a + b; };
        const memoizedAdd = memoize(add);
        expect(memoizedAdd(2, 3)).toBe(5);
        expect(memoizedAdd(2, 3)).toBe(5); // берет из кэша
        expect(calls).toBe(1);
    });

    it('6. counter: управляет независимым состоянием через замыкание', () => {
        const c = counter();
        expect(c.value()).toBe(0);
        c.inc(); c.inc();
        expect(c.value()).toBe(2);
        c.dec();
        expect(c.value()).toBe(1);
    });
});

describe('Часть 2: Классы (Store и SortedStore)', () => {
    it('7. Store: выбрасывает ошибку при неверном формате товара', () => {
        const store = new Store();
        expect(() => store.add({ name: 'Apple' })).toThrow("Invalid item format");
    });

    it('8. Store: корректно считает total (price * qty)', () => {
        const store = new Store();
        store.add({ name: 'Apple', price: 10, qty: 2 });
        store.add({ name: 'Banana', price: 5, qty: 4 });
        expect(store.total).toBe(40);
    });

    it('9. Store: находит и удаляет товары', () => {
        const store = new Store();
        store.add({ name: 'Apple', price: 10, qty: 1 });
        store.remove('Apple');
        expect(store.find('Apple')).toBeNull();
    });

    it('10. Store: приватные поля изолированы', () => {
        const store = new Store();
        store.add({ name: 'Apple', price: 10, qty: 1 });
        const items = store.items;
        items.push({ name: 'Hack', price: 0, qty: 0 });
        expect(store.items.length).toBe(1);
    });

    it('11. Store: статический метод правильно определяет класс', () => {
        expect(Store.isStore(new Store())).toBe(true);
        expect(Store.isStore({})).toBe(false);
    });

    it('12. SortedStore: наследует и сортирует элементы, используя super', () => {
        const sStore = new SortedStore();
        sStore.add({ name: 'Expensive', price: 100, qty: 1 });
        sStore.add({ name: 'Cheap', price: 10, qty: 1 });
        expect(sStore.items[0].name).toBe('Cheap');
    });
});