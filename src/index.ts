import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import bodyParser from "body-parser";
import { buildSchema } from "type-graphql";
import initImageGenerator from "./plugins/image-generator";
import cron from "cron";
import { generateDailyData } from "./resolvers/dailyResolver";

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
    const CronJob = cron.CronJob;
    const store = require("store");

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

    await initImageGenerator().then(() => {
        let job = new CronJob("* 5 4 * * *", async () => {
            console.log("[CRON] Generating new daily data...")
            await generateDailyData(false)
        }, null, true, "Asia/Kuala_Lumpur")

        app.use(cors());
        app.use("/graphql", bodyParser.json());
        job.start();
    });

    // Heroku dynamically assigns your app a port
    app.listen(process.env.PORT || 4000, () =>
        console.log("Express server started on http://localhost:4000:graphql"),
    );
}

main();
