// "blizzard_strayer": {
//     "id": "blizzard_strayer",
//     "name": "Blizzard Strayer",
//     "setPiece": [2, 4],
//     "sets": {
//         "goblet": "Frost-Weaved Dignity",
//         "plume": "Icebreaker's Resolve",
//         "circlet": "Broken Rime's Echo",
//         "flower": "Snowswept Memory",
//         "sands": "Frozen Homeland's Demise"
//     },
//     "bonuses": [
//         "Cryo DMG Bonus +15%",
//         "When a character attacks an opponent affected by Cryo, their CRIT Rate is increased by 20%. If the opponent is Frozen, CRIT Rate is increased by an additional 20%."
//     ],
//     "rarity": [4, 5],
//     "domain": "peak_of_vindagnyr"
// },

import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Artifact {
    @Field((type) => ID)
    id: string;
    @Field()
    name: string;
    @Field((type) => [Int])
    setPiece: number[];
    @Field((type) => [String])
    sets: string[];
    @Field((type) => [String])
    bonuses: string[];
    @Field((type) => [Int])
    rarity: number[];
    @Field()
    domain: string;
}
