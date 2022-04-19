var store = require('store');

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

// export async function compare<T>(
//     list: Object,
//     comparator: Function,
// ): Promise<Array<T>> {
//     let comparedCollection: Array<T> = [];
//     return new Promise((resolve, reject) => {
//         Object.keys(list).map((key) => {
//             if (comparator(list[key])) {
//                 comparedCollection.push(list[key]);
//             }
//         });
//         resolve(comparedCollection);
//     });
// }


export function compare<T>(
    list: Object,
    comparator: Function,
    cachedKey: string,
    useCache: boolean
): Function {
    let cache: Array<T> = useCache ? store.get(cachedKey) : null;
    let comparedCollection: Array<T> = [];
    let thunkCallback: Function | undefined = undefined;

    function filterCollection(): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            let collection: Array<T> = [];
            Object.keys(list).map((key) => {
                if (comparator(list[key])) {
                    collection.push(list[key]);
                }
            });
            resolve(collection)
        })
    }

    if (!useCache && cache && store.get('date')) {
        let cachedDate: Date = new Date(store.get('date'))
        let today: Date = new Date();
        if ((cachedDate.getDate() < today.getDate()) || (cachedDate.getDate() == today.getDate() && !(today.getHours() >= 0 && today.getHours() <= 4))) {
            filterCollection().then((collection) => {
                if (thunkCallback) {
                    console.log("[thunk] Ok im late...")
                    thunkCallback(collection)
                } else {
                    console.log("[thunk] Done already :)")
                    comparedCollection = collection
                }
            })
        } else {
            comparedCollection = cache;
        }
    } else {
        filterCollection().then((collection) => {
            if (thunkCallback) {
                console.log("[thunk] gOk im late...")
                thunkCallback(collection)
            } else {
                console.log("[thunk] Done already :)")
                comparedCollection = collection
            }
        })
    }

    return (callback) => {
        // if collection is filtered already when we call the thunk
        if (comparedCollection.length > 0) {
            console.log("[thunk] Result is ready!!!")
            callback(comparedCollection)
        } else {
            console.log("[thunk] Promise not done yet...")
            thunkCallback = callback;
        }
    }
}
