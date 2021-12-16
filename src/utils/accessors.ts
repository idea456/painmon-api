export async function getterAll<T>(list: Object): Promise<T[]> {
    let collection: Array<T> = [];
    if (collection.length === 0) {
        await Object.keys(list).map((key) => {
            collection.push(list[key]);
        });
    }
    return collection;
}

export async function getter<T>(name: string, list: Object): Promise<T | null> {
    for (const key of Object.keys(list)) {
        if (list[key].name.toLowerCase() === name.toLowerCase()) {
            return list[key];
        }
    }
    return null;
}

export async function compare<T>(
    list: Object,
    comparator: Function,
): Promise<Array<T>> {
    let comparedCollection: Array<T> = [];
    return new Promise((resolve, reject) => {
        Object.keys(list).map((key) => {
            if (comparator(list[key])) {
                comparedCollection.push(list[key]);
            }
        });
        resolve(comparedCollection);
    });
}
