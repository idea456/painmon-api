import { Field, ObjectType, Int } from "type-graphql";
import { Character } from "./character";
import { Item, ItemGroup } from "./item";
import { Weapon } from "./weapon";

@ObjectType()
export class Daily {
    @Field((type) => Date)
    date: Date;
    @Field()
    day: string;
    @Field((type) => [ItemGroup])
    materials: ItemGroup[];
    // weapons: Weapon[];
    @Field((type) => [Character])
    characters: Character[];
    @Field((type) => [Weapon])
    weapons: Weapon[];
    @Field()
    image: string;
}
