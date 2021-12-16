import { Arg, Query, Resolver } from "type-graphql";
import { CHARACTERS } from "../data/characters";
import { Character } from "../schemas/character";
import { getter, getterAll } from "../utils/accessors";

@Resolver(Character)
export class CharacterResolver {
    private characterCollection: Character[] = [];

    @Query((returns) => [Character])
    async getAllCharacters(): Promise<Character[]> {
        this.characterCollection = await getterAll<Character>(CHARACTERS);
        return this.characterCollection;
    }

    @Query((returns) => Character)
    async getCharacter(@Arg("name") name: string): Promise<Character | null> {
        return await getter<Character>(name, CHARACTERS);
    }
}
