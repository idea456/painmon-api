import RedisClient from "@node-redis/client/dist/lib/client";
import { Logger } from "log4js";
import { createClient } from "redis";

export default class Database {
    public readonly client: RedisClient;

    constructor(port: number, host: string, logger: Logger) {
        this.client = createClient(port, host);
        this.client.on("connect", async () => {
            logger.info("[Database] Redis initialized!");
        });
    }

    public async getString(key: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.get(key, (error: Error | null, data: string | null) => {
                if (error !== null) {
                    reject(error);
                }
                resolve(data || "");
            });
        });
    }
}
