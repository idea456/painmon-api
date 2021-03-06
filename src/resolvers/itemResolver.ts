import { Arg, Query, Resolver } from "type-graphql";
import { Item } from "../schemas/item";
import { ITEMS } from "../data/items";
import { getter, getterAll, compare } from "../utils/accessors";

@Resolver(Item)
export class ItemResolver {
    private itemCollection: Item[] = [];
    private itemDomainsCollection: Item[] = [];

    @Query((returns) => [Item])
    async getAllItems(): Promise<Item[]> {
        this.itemCollection = await getterAll<Item>(ITEMS);
        return this.itemCollection;
    }

    @Query((returns) => Item)
    async getItem(@Arg("name") name: string): Promise<Item | null> {
        return await getter<Item>(name, ITEMS);
    }

    @Query((returns) => [Item])
    async getAllItemDomains(): Promise<Item[]> {
        this.itemDomainsCollection = await compare(
            ITEMS,
            (item) => "day" in item,
        );
        return this.itemDomainsCollection;
    }

    @Query((returns) => [Item])
    async getItemDomain(
        @Arg("name", { nullable: true }) name?: string,
        @Arg("day", { nullable: true }) day?: string,
    ): Promise<Item[]> {
        return await compare<Item>(
            ITEMS,
            (item) =>
                (item.day && item.day.includes(day.toLowerCase())) ||
                (name && item.name === name),
        );
    }
}
