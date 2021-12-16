import { Arg, Query, Resolver } from "type-graphql";
import { ARTIFACTS } from "../data/artifacts";
import { Artifact } from "../schemas/artifact";
import { getter, getterAll } from "../utils/accessors";

@Resolver(Artifact)
export class ArtifactResolver {
    private artifactCollection: Artifact[] = [];

    @Query((returns) => [Artifact])
    async getAllArtifacts(): Promise<Artifact[]> {
        this.artifactCollection = await getterAll<Artifact>(ARTIFACTS);
        return this.artifactCollection;
    }

    @Query((returns) => Artifact)
    async getArtifact(@Arg("name") name: string): Promise<Artifact | null> {
        return getter<Artifact>(name, ARTIFACTS);
    }
}
