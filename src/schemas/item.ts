import { Field, ObjectType, Int, ID } from "type-graphql";

@ObjectType()
export class Item {
    @Field((type) => ID)
    id?: string;
    @Field()
    name: string;
    @Field((type) => [String])
    day?: string[];
    @Field((type) => Int)
    rarity?: number;
    @Field()
    parent?: string;
}

@ObjectType()
export class ItemGroup {
    @Field()
    name: string;
    @Field({ nullable: true })
    day?: string;
    @Field({ nullable: true })
    domain?: string;
    @Field((type) => [Item])
    items: Item[];
    @Field()
    type: string;
}
