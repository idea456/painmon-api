import { Query, Resolver } from "type-graphql";
import { Daily } from "../schemas/daily";
import { ITEMS } from "../data/items";
import { Item, ItemGroup } from "../schemas/item";
import { generateScreenshot } from "../plugins/image-generator/utils/browser";
import { compare, getterAll } from "../utils/accessors";
import { ITEM_GROUP } from "../data/itemGroup";
import { Character } from "../schemas/character";
import { CHARACTERS } from "../data/characters";

@Resolver(Daily)
export class DailyResolver {
    private daily: Daily;
    private farmableMaterials: Array<Object>;

    @Query((returns) => Daily)
    async getDaily(): Promise<Daily> {
        // dummy data for now

        const today = new Date(Date.now());
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
        if (day === "Sunday") {
            materials = await getterAll<ItemGroup>(ITEM_GROUP);
        } else {
            materials = await compare<ItemGroup>(
                ITEM_GROUP,
                (item) =>
                    day && item.day && item.day.includes(day.toLowerCase()),
            );
            // materials.map(
            //     (material) => (this.farmableMaterials[material.name] = {}),
            // );
        }
        const characterTodayComparator = (char) => {
            let check = false;
            char.material["book"].map((item) => {
                if (item.day.includes(day.toLowerCase())) {
                    // this.farmableMaterials[item.name] = char;
                    check = true;
                }
            });
            return check;
        };
        let characters: Array<Character> = await compare(
            CHARACTERS,
            characterTodayComparator,
        );

        return {
            date: today,
            day,
            materials,
            characters,
            image: await generateScreenshot(
                "http://localhost:8000/views/daily.html",
            ),
        };
    }
}

// export class Daily {
//     @Field((type) => Date)
//     date: Date;
//     @Field()
//     day: string;
//     @Field((type) => [DomainCategory])
//     domainCategories: DomainCategory[];
//     @Field((type) => [Artifact])
//     artifacts: Artifact[];
//     @Field()
//     image: string;
// }
