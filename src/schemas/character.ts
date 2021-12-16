import { Field, ObjectType, Int, ID } from "type-graphql";
import { Item } from "./item";

@ObjectType()
export class Elemental {
    @Field()
    id: string;
    @Field()
    name: string;
    @Field()
    simpleName: string;
}

// hp: 12296, atk: 233, def: 815

@ObjectType()
export class Stats {
    @Field((type) => Int)
    hp: number;
    @Field((type) => Int)
    atk: number;
    @Field((type) => Int)
    def: number;
}

@ObjectType()
export class CharacterAscension {
    @Field((type) => [CharacterAscensionItem])
    items: CharacterAscensionItem[];
    @Field((type) => Int)
    mora: number;
}

@ObjectType()
export class CharacterAscensionItem {
    @Field((type) => Item)
    item: Item;
    @Field((type) => Int)
    amount: number;
}

@ObjectType()
export class CharacterMaterial {
    @Field((type) => [Item])
    book: Item[];
    @Field((type) => [Item])
    material: Item[];
    @Field((type) => [Item])
    boss: Item[];
}

@ObjectType()
export class Character {
    @Field()
    name: string;
    @Field((type) => ID)
    id: string;
    @Field((type) => Int)
    rarity: number;
    @Field((type) => Elemental)
    element?: Elemental;
    @Field()
    sex: string;
    @Field()
    nation: string;
    @Field((type) => [CharacterAscension])
    ascension: CharacterAscension[];
    @Field((type) => Stats)
    stats: Stats;
    @Field((type) => CharacterMaterial)
    material: CharacterMaterial;
}

// stats: { hp: 12296, atk: 233, def: 815 },
// //     material: {
// //         book: [
// //             itemList.teachings_of_ballad,
// //             itemList.guide_to_ballad,
// //             itemList.philosophies_of_ballad,
// //         ],
// //         material: [
// //             itemList.divining_scroll,
// //             itemList.sealed_scroll,
// //             itemList.forbidden_curse_scroll,
// //         ],
// //         boss: itemList.tusk_of_monoceros_caeli,
// //     },

// albedo: {
//     name: "Albedo",
//     id: "albedo",
//     rarity: 5,
//     element: elements.geo,
//     weapon: weapons.sword,
//     sex: "male",
//     nation: "mondstadt",
//     ascension: [
//         {
//             items: [
//                 { item: itemList.prithiva_topaz_sliver, amount: 1 },
//                 { item: itemList.none, amount: null },
//                 { item: itemList.cecilia, amount: 3 },
//                 { item: itemList.divining_scroll, amount: 3 },
//             ],
//             mora: 20000,
//         },
//         {
//             items: [
//                 { item: itemList.prithiva_topaz_fragment, amount: 3 },
//                 { item: itemList.basalt_pillar, amount: 2 },
//                 { item: itemList.cecilia, amount: 10 },
//                 { item: itemList.divining_scroll, amount: 15 },
//             ],
//             mora: 40000,
//         },
//         {
//             items: [
//                 { item: itemList.prithiva_topaz_fragment, amount: 6 },
//                 { item: itemList.basalt_pillar, amount: 4 },
//                 { item: itemList.cecilia, amount: 20 },
//                 { item: itemList.sealed_scroll, amount: 12 },
//             ],
//             mora: 60000,
//         },
//         {
//             items: [
//                 { item: itemList.prithiva_topaz_chunk, amount: 3 },
//                 { item: itemList.basalt_pillar, amount: 8 },
//                 { item: itemList.cecilia, amount: 30 },
//                 { item: itemList.sealed_scroll, amount: 18 },
//             ],
//             mora: 80000,
//         },
//         {
//             items: [
//                 { item: itemList.prithiva_topaz_chunk, amount: 6 },
//                 { item: itemList.basalt_pillar, amount: 12 },
//                 { item: itemList.cecilia, amount: 45 },
//                 { item: itemList.forbidden_curse_scroll, amount: 12 },
//             ],
//             mora: 100000,
//         },
//         {
//             items: [
//                 { item: itemList.prithiva_topaz_gemstone, amount: 6 },
//                 { item: itemList.basalt_pillar, amount: 20 },
//                 { item: itemList.cecilia, amount: 60 },
//                 { item: itemList.forbidden_curse_scroll, amount: 24 },
//             ],
//             mora: 120000,
//         },
//     ],
//     stats: { hp: 12296, atk: 233, def: 815 },
//     material: {
//         book: [
//             itemList.teachings_of_ballad,
//             itemList.guide_to_ballad,
//             itemList.philosophies_of_ballad,
//         ],
//         material: [
//             itemList.divining_scroll,
//             itemList.sealed_scroll,
//             itemList.forbidden_curse_scroll,
//         ],
//         boss: itemList.tusk_of_monoceros_caeli,
//     },
// },
