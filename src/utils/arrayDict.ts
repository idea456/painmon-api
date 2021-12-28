export interface ArrayDictionary<T> {
    table: Object;
    get(key: string): Array<T>;
    set(key: string, value: T): boolean;
}

class ArrayDict implements ArrayDictionary {
    readonly table: Object = {};

    public get();
}
