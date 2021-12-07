import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import initImageGenerator from "./plugins/image-generator";
import { testBrowser } from "./plugins/image-generator/utils/browser";

import { TodoResolver } from "./resolvers/todoResolver";

async function main() {
    const schema = await buildSchema({
        resolvers: [TodoResolver],
        emitSchemaFile: true,
    });

    const app = express();

    const server = new ApolloServer({
        schema,
    });

    await server.start();
    server.applyMiddleware({ app });

    await initImageGenerator();
    await testBrowser("http://localhost:8000/views/daily.html");

    await app.listen(4000, () =>
        console.log("Express server started on http://localhost:4000:graphql"),
    );
}

main();
