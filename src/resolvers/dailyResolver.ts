import { Query, Resolver } from "type-graphql";
import { Daily } from "../schemas/daily";
import { ItemGroup } from "../schemas/item";
import { Base64 } from "js-base64";
import axios from "axios";
import { compare } from "../utils/accessors";
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
                day &&
                item.day &&
                (item.day.includes(day.toLowerCase()) ||
                    day.toLowerCase() === "sunday"),
        );

        const characterTodayComparator = (char) => {
            let check = false;
            char.material["book"].map((item) => {
                if (
                    item.day.includes(day.toLowerCase()) ||
                    day.toLowerCase() === "sunday"
                ) {
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

        items["weapons"] = {};

        const weaponsTodayComparator = (weapon) => {
            let check = false;
            let material = weapon["ascension"][0].items[0].item;
            if (
                material.day.includes(day.toLowerCase()) ||
                day.toLowerCase() === "sunday"
            ) {
                if (!(material.id in items["weapons"])) {
                    items["weapons"][material.id] = [
                        {
                            id: weapon.id,
                            rarity: weapon.rarity,
                        },
                    ];
                } else {
                    items["weapons"][material.id].push({
                        id: weapon.id,
                        rarity: weapon.rarity,
                    });
                }
                return true;
            }
            return check;
        };
        let weapons: Array<Weapon> = await compare(
            WEAPONS,
            weaponsTodayComparator,
        );

        var store = require("store");
        console.log(store.get("dailyImage"));
        let dailyImage = store.get("dailyImage");
        // store.set('user', { name:'Marcus' })
        if (dailyImage) {
            let cachedDate = new Date(dailyImage.date);
            // let hourDifference = Math.abs(today.getTime() - cachedDate.getTime()) / 3600000;
            // if the daily image is no longer relevant for today
            if (
                cachedDate.getDate() < today.getDate() ||
                (cachedDate.getDate() == today.getDate() &&
                    !(today.getHours() >= 0 && today.getHours() <= 4))
            ) {
                console.log("generating");
                // generate new daily image for the new day
                const { data } = await axios.get(
                    `http://localhost:8000/daily?items=${Base64.btoa(
                        JSON.stringify(items),
                    )}`,
                );
                dailyImage = {
                    date: today,
                    decodedImage: data,
                };
            }
        } else {
            console.log("generating 2");
            const { data } = await axios.get(
                `http://localhost:8000/daily?items=${Base64.btoa(
                    JSON.stringify(items),
                )}`,
            );
            dailyImage = {
                date: today,
                decodedImage: data,
            };
        }
        store.set("dailyImage", dailyImage);

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
