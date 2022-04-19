import { Query, Resolver } from "type-graphql";
import { Daily } from "../schemas/daily";
import { ItemGroup } from "../schemas/item";
import { generateScreenshot } from "../plugins/image-generator/utils/browser";
import { compare, getterAll } from "../utils/accessors";
import { ITEM_GROUP } from "../data/itemGroup";
import { Character } from "../schemas/character";
import { CHARACTERS } from "../data/characters";
import { Weapon } from "../schemas/weapon";
import { WEAPONS } from "../data/weapons";


export async function generateDailyData(useCache: boolean) : Promise<Daily> {
    var store = require('store')
    let items = {};
    let date = useCache ? store.get('date') : new Date();

    const today = new Date(Date.now());
    const callbacks: Array<Function> = [];

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const day = days[today.getDay()];
    callbacks.push(compare<ItemGroup>(
        ITEM_GROUP,
        (item) => day && item.day && (item.day.includes(day.toLowerCase()) || day.toLowerCase() === "sunday"),
        "materials",
        useCache
    ))
    
    const characterTodayComparator = (char) => {
        let check = false;
        char.material["book"].map((item) => {
            if (item.day.includes(day.toLowerCase()) || day.toLowerCase() === "sunday") {
                check = true;
                if (item.parent) {
                    // item already added in the items
                    if (!(item.parent in items)) {
                        items[item.parent] = [
                            {
                                name: char.id,
                                element: char.element.id,
                            },
                        ];
                    } else {
                        if (
                            items[item.parent].filter(
                                (c) => c.name === char.id,
                            ).length === 0
                        ) {
                            items[item.parent].push({
                                name: char.id,
                                element: char.element.id,
                            });
                        }
                    }
                }
            }
        });
        return check;
    };

    callbacks.push(compare<Character>(
        CHARACTERS,
        characterTodayComparator,
        "characters",
        useCache
    ))
    
    
    const weaponsTodayComparator = (weapon) => {
        let check = false;
        let material = weapon["ascension"][0].items[0].item;
        if (material.day.includes(day.toLowerCase()) || day.toLowerCase() === "sunday") {
            if (items["weapons"] && !(material.id in items["weapons"])) {
                items["weapons"][material.id] = [{
                    id: weapon.id,
                    rarity: weapon.rarity,
                }]
            } else {
                items["weapons"][material.id].push({
                    id: weapon.id,
                    rarity: weapon.rarity,
                })
            }
            return true;
        }
        return check;
    };

    items["weapons"] = {}
    callbacks.push(compare<Weapon>(
        WEAPONS,
        weaponsTodayComparator,
        "weapons",
        useCache
    ))

    await ["materials", "characters", "weapons"].map((key, i) => {
        callbacks[i]((collection) => {
            store.set(key, collection);
            items[key] = collection;
        })
    })

    let filteredItems = {}
    Object.keys(items).map(key => {
        if (key !== 'materials' && key !== 'characters') {
            filteredItems[key] = items[key]
        }
    })

    filteredItems['weapons'] = filteredItems['weapons'].map((weapon) => {
        return {
            id: weapon.id,
            name: weapon.name,
        }
    })

    let image = store.get('image')
    if (!useCache || !image) {
        console.log('image not found in cache, generating new one...')
        image = await generateScreenshot("http://localhost:8000/views/daily.html?items=", filteredItems)
    }
    store.set('image',  image)
    store.set('date', today)

    return {
        date: today,
        day,
        materials: items["materials"],
        characters: items["characters"],
        weapons: items["weapons"],
        image,
    };
}

@Resolver(Daily)
export class DailyResolver {
    private daily: Daily;
    private farmableMaterials: Object = {};


    @Query((returns) => Daily)
    async getDaily(): Promise<Daily> {
        return await generateDailyData(true)
    }
}
