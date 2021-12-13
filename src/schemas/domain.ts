import { Field, ObjectType, ID, Int } from "type-graphql";

@ObjectType()
export class Monster {
    @Field((type) => ID)
    id: string;
    @Field()
    name: string;
    @Field((type) => Int)
    count: number;
}

@ObjectType()
export class Reward {
    @Field()
    adventureExp: string;
    @Field()
    mora: string;
    @Field()
    friendshipExp: string;
}

@ObjectType()
export class Domain {
    @Field((type) => Int, { nullable: true })
    s?: number;
    @Field((type) => ID)
    id: string;
    @Field()
    name: string;
    @Field((type) => Int)
    ar: number;
    @Field((type) => Int)
    level: number;
    @Field((type) => Reward)
    reward: Reward;
    @Field((type) => [Monster], { nullable: true })
    monsters: Monster[];
    @Field((type) => [String])
    disorder: string[];
}

@ObjectType()
export class DomainCategory {
    @Field()
    name: string;
    @Field((type) => [Domain])
    domains: Domain[];
    // @Field((type) => [Artifact])
    // artifacts: Artifact[];
    @Field((type) => [String])
    artifacts: string[];
}
