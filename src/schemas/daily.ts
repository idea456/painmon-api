import { Field, ObjectType, Int } from "type-graphql";
import { DomainCategory } from "./domain";
import { Artifact } from "./artifact";

@ObjectType()
export class Daily {
    @Field((type) => Date)
    date: Date;
    @Field()
    day: string;
    @Field((type) => [DomainCategory])
    domainCategories: DomainCategory[];
    @Field((type) => [Artifact])
    artifacts: Artifact[];
    @Field()
    image: string;
}
