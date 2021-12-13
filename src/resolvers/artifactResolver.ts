import { Arg, createUnionType, Query, Resolver } from "type-graphql";
import { ARTIFACTS } from "../data/artifacts";
import { Artifact } from "../schemas/artifact";

@Resolver(Artifact)
export class ArtifactResolver {
    private artifactCollection: Artifact[] = [];

    @Query((returns) => [Artifact])
    async getAllArtifacts(): Promise<Artifact[]> {
        if (this.artifactCollection.length === 0) {
            await Object.keys(ARTIFACTS).map((key) => {
                const artifact = ARTIFACTS[key];
                artifact.sets = Object.keys(artifact.sets).map(
                    (key) => artifact.sets[key],
                );
                this.artifactCollection.push(ARTIFACTS[key]);
            });
        }

        return this.artifactCollection;
    }

    @Query((returns) => Artifact)
    async getArtifact(@Arg("name") name: string): Promise<Artifact | string> {
        for (const key of Object.keys(ARTIFACTS)) {
            if (ARTIFACTS[key].name === name) {
                return ARTIFACTS[key];
            }
        }

        return "Does not exist!";
    }
}
