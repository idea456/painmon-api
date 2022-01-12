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
import Database from "../database";

function getResetDuration(): number {
    const currentDate = new Date();
    const resetDate = new Date();

    let currentHour =
        currentDate.getHours() === 0 ? 24 : currentDate.getHours();

    if (currentHour > 4 && currentHour <= 24) {
        resetDate.setHours(4);
        resetDate.setDate(resetDate.getDate() + 1);
    } else {
        resetDate.setHours(4);
    }
    return (resetDate.getTime() - currentDate.getTime()) / 1000;
}

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
        if (day === "Sunday") {
            materials = await getterAll<ItemGroup>(ITEM_GROUP);
        } else {
            materials = await compare<ItemGroup>(
                ITEM_GROUP,
                (item) =>
                    day && item.day && item.day.includes(day.toLowerCase()),
            );
        }
        const characterTodayComparator = (char) => {
            let check = false;
            char.material["book"].map((item) => {
                if (item.day.includes(day.toLowerCase())) {
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

        let characters: Array<Character> = await compare(
            CHARACTERS,
            characterTodayComparator,
        );

        const weaponsTodayComparator = (weapon) => {
            let check = false;
            weapon["ascension"].map((w) => {
                w["items"].map((obj) => {
                    if (
                        obj.item.day &&
                        obj.item.day.includes(day.toLowerCase())
                    ) {
                        check = true;
                    }
                });
            });
            return check;
        };
        let weapons: Array<Weapon> = await compare(
            WEAPONS,
            weaponsTodayComparator,
        );
        const cache = new Database();
        let image: string | null = await cache.getString("dailyImage");
        console.log(image)
        if (image === null) {
            image = await generateScreenshot(
                "http://localhost:8000/views/daily.html",
                items,
            );
            cache.setString("dailyImage", image, getResetDuration());
        }

        return {
            date: today,
            day,
            materials,
            characters,
            weapons,
            image: 'asd',
        };
    }
}
