import RedisClient from "@node-redis/client/dist/lib/client";
import { Logger } from "log4js";
import { DatabaseConfig } from "./config";
import { createClient } from "redis";

export default class Database {
    public readonly client: RedisClient;

    constructor(config: DatabaseConfig, logger: Logger) {
        const { port, host } = config;

        // initialize redis
        this.client = createClient({
            config.port, config.host
        });
        this.client.on("connect", async () => {
            logger.info("Redis initialized!");
        });
    }

    public async setString(
        key: string,
        value: string,
        timeout?: number,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.set(key, value);
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
