import { Arg, Query, Resolver } from "type-graphql";
import { WEAPONS } from "../data/weapons";
import { Weapon } from "../schemas/weapon";
import { getter, getterAll } from "../utils/accessors";

@Resolver(Weapon)
export class WeaponResolver {
    private weaponCollection: Weapon[] = [];

    @Query((returns) => [Weapon])
    async getAllWeapons(): Promise<Weapon[]> {
        this.weaponCollection = await getterAll<Weapon>(WEAPONS);
        return this.weaponCollection;
    }

    @Query((returns) => Weapon)
    async getWeapon(@Arg("name") name: string): Promise<Weapon | null> {
        return await getter<Weapon>(name, WEAPONS);
    }
}
