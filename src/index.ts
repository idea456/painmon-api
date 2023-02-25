import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import bodyParser from "body-parser";
import { buildSchema } from "type-graphql";

import {
    DomainResolver,
    ArtifactResolver,
    DailyResolver,
    ItemResolver,
    CharacterResolver,
    WeaponResolver,
} from "./resolvers";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";

async function main() {
    const schema = await buildSchema({
        resolvers: [
            DomainResolver,
            ArtifactResolver,
            DailyResolver,
            ItemResolver,
            CharacterResolver,
            WeaponResolver,
        ],
        emitSchemaFile: true,
        nullableByDefault: true,
    });

    const app = express();

    const server = new ApolloServer({
        schema,
        introspection: true,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    await server.start();
    server.applyMiddleware({ app });

    app.use(cors());
    app.use("/graphql", bodyParser.json());
    app.listen(process.env.PORT || 4000, () =>
        console.log("Express server started on http://localhost:4000:graphql"),
    );
}

main();
