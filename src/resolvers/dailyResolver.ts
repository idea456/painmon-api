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

@Resolver(Daily)
export class DailyResolver {
    private daily: Daily;
    private farmableMaterials: Object = {};

    @Query((returns) => Daily)
    async getDaily(): Promise<Daily> {
        // dummy data for now

        const today = new Date(Date.now());
        const items = {};
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
        let materials: Array<ItemGroup>;
        // make sure to test this
        materials = await compare<ItemGroup>(
            ITEM_GROUP,
            (item) =>
                day && item.day && (item.day.includes(day.toLowerCase()) || day.toLowerCase() === "sunday"),
        );
        
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
                // } else if (day === 'Sunday') {
                //     break
                // }
            });
            return check;
        };

        let characters: Array<Character> = await compare(
            CHARACTERS,
            characterTodayComparator,
        );

        items["weapons"] = {}

        const weaponsTodayComparator = (weapon) => {
            let check = false;
            let material = weapon["ascension"][0].items[0].item;
            if (material.day.includes(day.toLowerCase()) || day.toLowerCase() === "sunday") {
                if (!(material.id in items["weapons"])) {
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
        let weapons: Array<Weapon> = await compare(
            WEAPONS,
            weaponsTodayComparator,
        );
        // console.log("daily items: ", items["weapons"]);

        // items["weapons"] = weapons.map(w => {
        //     return {
        //         id: w.id, rarity: w.rarity
        //     }
        // });

        var store = require('store')
        console.log(store.get('dailyImage'))
        let dailyImage = store.get('dailyImage')
        // store.set('user', { name:'Marcus' })
        if (dailyImage) {
            let cachedDate = new Date(dailyImage.date)
            let hourDifference = Math.abs(today.getTime() - cachedDate.getTime()) / 3600000;
            if (hourDifference >= 24) {
                dailyImage = {
                    date: today,
                    decodedImage: await generateScreenshot(
                        "http://localhost:8000/views/daily.html?items=",
                        items,
                    ),
                }
            }
        } else {
            dailyImage = {
                date: today,
                decodedImage: await generateScreenshot(
                    "http://localhost:8000/views/daily.html?items=",
                    items,
                ),
            }
        }
        store.set('dailyImage',  dailyImage)

        return {
            date: today,
            day,
            materials,
            characters,
            weapons,
            image: dailyImage.decodedImage,
        };
    }
}
