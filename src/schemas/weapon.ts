import { Field, ObjectType, Int, ID } from "type-graphql";
import { Item } from "./item";

@ObjectType()
export class WeaponAscension {
    @Field((type) => [Item])
    items: Item[];
    @Field((type) => Int)
    mora: number;
}

@ObjectType()
export class WeaponType {
    @Field((type) => ID)
    id: string;
    @Field()
    name: string;
}

@ObjectType()
export class Weapon {
    @Field()
    name: string;
    @Field((type) => ID)
    id: string;
    @Field((type) => Int)
    rarity: number;
    @Field((type) => Int)
    atk: number;
    @Field()
    secondary: string;
    @Field((type) => WeaponType)
    type: WeaponType;
    @Field()
    source: string;
    @Field((type) => [WeaponAscension])
    ascension: WeaponAscension[];
}
