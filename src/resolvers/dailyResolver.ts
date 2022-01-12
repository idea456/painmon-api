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
        console.log("daily items: ", items);

        items["weapons"] = weapons.map(w => {
            return {
                id: w.id, rarity: w.rarity
            }
        });

        return {
            date: today,
            day,
            materials,
            characters,
            weapons,
            image: await generateScreenshot(
                "http://localhost:8000/views/daily.html?items=",
                items,
            ),
        };
    }
}
