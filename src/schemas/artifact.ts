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
