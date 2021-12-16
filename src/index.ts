import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import bodyParser from "body-parser";
import { buildSchema } from "type-graphql";
import initImageGenerator from "./plugins/image-generator";
import { testBrowser } from "./plugins/image-generator/utils/browser";
import Database from "./database";
import { BaseRedisCache } from "apollo-server-cache-redis";
const Redis = require("ioredis");

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
        // cache: new BaseRedisCache({
        //     client: new Redis({
        //         host: "redis-server",
        //     }),
        // }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    // const db = new Database({
    //     port: 6379,
    //     host: process.env.docker === "yes" ? "redis" : "localhost",
    // });

    await server.start();
    server.applyMiddleware({ app });

    await initImageGenerator();
    await testBrowser("http://localhost:8000/views/daily.html");

    // db.setString("test", "123");
    // const test = await db.getString("test");
    // console.log(test);
    // console.log(await db.existString("test"));

    // db.createIndex("idx:users", {
    //     "$.name": {
    //         type: SchemaFieldTypes.TEXT,
    //         SORTABLE: "UNF",
    //     },
    //     "$.age": {
    //         type: SchemaFieldTypes.NUMERIC,
    //         AS: "age",
    //     },
    //     "$.friends": {
    //         type: SchemaFieldTypes.,
    //         AS: "age",
    //     },

    // });

    // db.setJSON("noderedis:jsondata", [
    //     {
    //         name: "harlo",
    //         domains: [
    //             {
    //                 name: "bla",
    //                 count: 1,
    //             },
    //             {
    //                 name: "bl22a",
    //                 count: 112,
    //             },
    //         ],
    //     },
    //     {
    //         name: "harl2o",
    //         domains: [
    //             {
    //                 name: "bla22222",
    //                 count: 1,
    //             },
    //             {
    //                 name: "bl2222222a",
    //                 count: 112,
    //             },
    //         ],
    //     },
    // ]);

    // const domainsData: Array<Object> = [];
    // Object.keys(domains).map((key, i) => {
    //     domainsData.push(domains[key]);
    // });
    // console.log(domainsData);
    // db.setJSON("painmon:daily", domainsData);

    // Heroku dynamically assigns your app a port
    app.use(cors());
    app.use("/graphql", bodyParser.json());
    app.listen(process.env.PORT || 4000, () =>
        console.log("Express server started on http://localhost:4000:graphql"),
    );
}

main();
