import { InterfaceType, Field, ID, ObjectType } from "type-graphql";
import { IResource } from "./resource";

@InterfaceType({ resolveType: (value) => value.constructor.name })
class IReward implements IResource {
    id: string;
    adventureExp: number;
    mora: number;
    friendshipExp: number;
}

@ObjectType({ implements: IReward })
export class Reward implements IReward {
    @Field()
    id: string;

    @Field()
    adventureExp: number;

    @Field()
    mora: number;

    @Field()
    friendshipExp: number;
}
