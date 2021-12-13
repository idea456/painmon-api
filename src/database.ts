import { DatabaseConfig } from "./config";
import { createClient } from "redis";
import { promisify } from "util";

export default class Database {
    public readonly client: any;
    public readonly config: DatabaseConfig;

    constructor(config: DatabaseConfig) {
        this.config = config;
        const { port, host } = config;

        // initialize redis
        this.client = createClient();
        // Required by node-redis V4 to connect first
        this.client.connect();

        this.client.del("noderedis:jsondata");
        this.client.del("painmon:daily");

        this.client.on("connect", async () => {
            console.log("Redis initialized!");
        });
    }

    public async setString(key: string, value: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.set(key, value);
            console.log("Set!");
        });
    }

    public async getString(key: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err: Error | null, data: string | null) => {
                if (err !== null) {
                    reject(err);
                }
                resolve(data || "");
            });
        });
    }

    public async existString(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.client.exists(key, (err, ok) => {
                if (err !== null) {
                    reject(err);
                }
                resolve(ok);
            });
        });
    }

    public async createIndex(idx: string, data: Object) {
        try {
            await this.client.ft.create(idx, data);
        } catch (err) {
            if (err.message === "Index already exists") {
                console.log("Index already exists!");
            } else {
                console.error(err);
                process.exit(1);
            }
        }
    }

    public async setJSON(key: string, data: Object) {
        return new Promise((resolve, reject) => {
            this.client.json.set(key, "$", data);
            console.log(key, "has been set!");
        });
    }
}
