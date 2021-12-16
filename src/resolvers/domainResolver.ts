import { Arg, createUnionType, Query, Resolver } from "type-graphql";
import { DOMAINS } from "../data/domains";
import { DomainCategory } from "../schemas/domain";
import { getter, getterAll } from "../utils/accessors";

const GetDomainCategoryUnion = createUnionType({
    name: "GetDomainCategory",
    types: () => [DomainCategory, String] as const,
});

@Resolver(DomainCategory)
export class DomainResolver {
    private domainCollection: DomainCategory[] = [];

    @Query((returns) => [DomainCategory])
    async getAllDomainCategory(): Promise<DomainCategory[]> {
        this.domainCollection = await getterAll<DomainCategory>(DOMAINS);
        return this.domainCollection;
    }

    @Query((returns) => DomainCategory)
    async getDomainCategory(
        @Arg("name") name: string,
    ): Promise<DomainCategory | null> {
        return getter<DomainCategory>(name, DOMAINS);
    }
}
