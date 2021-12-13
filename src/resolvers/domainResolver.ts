import { Arg, createUnionType, Query, Resolver } from "type-graphql";
import { DOMAINS } from "../data/domains";
import { DomainCategory } from "../schemas/domain";

const GetDomainCategoryUnion = createUnionType({
    name: "GetDomainCategory",
    types: () => [DomainCategory, String] as const,
});

@Resolver(DomainCategory)
export class DomainResolver {
    private domainCollection: DomainCategory[] = [];

    @Query((returns) => [DomainCategory])
    async getAllDomainCategory(): Promise<DomainCategory[]> {
        await Object.keys(DOMAINS).map((key) => {
            this.domainCollection.push(DOMAINS[key]);
        });
        return this.domainCollection;
    }

    @Query((returns) => DomainCategory)
    async getDomainCategory(
        @Arg("name") name: string,
    ): Promise<DomainCategory | string> {
        for (const key of Object.keys(DOMAINS)) {
            if (DOMAINS[key].name === name) {
                return DOMAINS[key];
            }
        }
        return "Does not exist!";
    }
}
