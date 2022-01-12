import { initializeBrowser, testBrowser } from "./utils/browser";
import express from "express";
import path from "path";

export default async function initImageGenerator() {
    const app = express();

    await initializeBrowser();
    // await testBrowser("http://localhost:4000/views/daily.html");

    // app.get("/views/daily.html", (req, res) => {
    //     res.sendFile(path.join(__dirname, "/views/daily.html"));
    // });
    app.use("/views", express.static(__dirname + "/views"));
    app.use("/components", express.static(__dirname + "/components"));
    app.use("/fonts", express.static(__dirname + "/fonts"));
    app.use("/static", express.static(__dirname + "/static"));
    app.use("/styles", express.static(__dirname + "/styles"));
    app.use(express.static(__dirname + "/public"));

    app.listen(8000, "painmon-api", () => {
        console.log(
            "Image generator browser initialized at http://localhost:8000",
        );
    });
}
