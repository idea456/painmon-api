import { DatabaseConfig } from "./config";
import { createClient } from "redis";
import { promisify } from "util";

export default class Database {
    public static client: any = null;
    public readonly config: DatabaseConfig;

    constructor(config?: DatabaseConfig) {
        if (config !== undefined) {
            this.config = config;
            const { port, host } = config;

            // initialize redis
            if (Database.client === null) {
                Database.client = createClient();
                // Required by node-redis V4 to connect first
                Database.client.connect();

                Database.client.del("painmon:daily:image");

                Database.client.on("connect", async () => {
                    console.log("Redis initialized!");
                });
            }
        }
    }

    public async setString(
        key: string,
        value: string,
        expiration?: number,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            if (expiration !== undefined) {
                Database.client.set(key, value, "EX", expiration);
            } else {
                Database.client.set(key, value);
            }
            console.log(`Key ${key} has been successfully set!`);
        });
    }

    public async getString(key: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const value = Database.client.get(
                key,
                (err: Error | null, data: string | null) => {
                    if (err !== null) {
                        reject(null);
                    }
                },
            );
            resolve(value || "");
        });
    }

    public async existString(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Database.client.exists(key, (err, ok) => {
                if (err !== null) {
                    reject(err);
                }
                resolve(ok);
            });
        });
    }

    //     public async createIndex(idx: string, data: Object) {
    //         try {
    //             await this.client.ft.create(idx, data);
    //         } catch (err) {
    //             if (err.message === "Index already exists") {
    //                 console.log("Index already exists!");
    //             } else {
    //                 console.error(err);
    //                 process.exit(1);
    //             }
    //         }
    //     }

    //     public async setJSON(key: string, data: Object) {
    //         return new Promise((resolve, reject) => {
    //             this.client.json.set(key, "$", data);
    //             console.log(key, "has been set!");
    //         });
    //     }
}
