import { Field, ObjectType, Int } from "type-graphql";
import { Character } from "./character";
import { Item, ItemGroup } from "./item";

// @ObjectType()
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
    @Field()
    image: string;
}
