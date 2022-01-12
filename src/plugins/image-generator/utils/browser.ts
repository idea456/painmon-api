import puppeteer from "puppeteer";
import { Base64 } from "js-base64";

let browser: puppeteer.Browser;

export async function initializeBrowser(): Promise<void> {
    browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
}

// testing renderer to debug components
export async function testBrowser(url: string): Promise<void> {
    const page: puppeteer.Page = await browser.newPage();
    await page.goto(url);
    const result = <string>await page.screenshot({
        type: "jpeg",
        quality: 100,
        path: "test.jpg",
    });
    await page.close();
}

async function getHeight(page: puppeteer.Page): Promise<number> {
    const height = await page.evaluate((_) => {
        return Math.max(document.body.scrollHeight, document.body.clientHeight);
    });
    return height;
}

async function getWidth(page: puppeteer.Page): Promise<number> {
    const width = await page.evaluate((_) => {
        return Math.max(document.body.clientWidth, document.body.scrollWidth);
    });
    return width;
}

export async function generateScreenshot(
    url: string,
    items: Object,
): Promise<string> {
    const page: puppeteer.Page = await browser.newPage();


    const pageWidth = 1440;
    const viewportHeight = 800;
    await page.setViewport({
        width: pageWidth,
        height: viewportHeight,
    });
    const encoded = Base64.btoa(JSON.stringify(items));
    await page.goto(url + `?items=${encoded}`); // pass information by url
    console.log("items: ", url + `?items=${encoded}`);
    await page.goto(url + `?items=${encoded}`);
    const htmlElement = await page.$("#app");

    const result = <string>await htmlElement?.screenshot({
        type: "jpeg",
        encoding: "base64",
        clip: {
            x: 0,
            y: 0,
            width: await getWidth(page),
            height: await getHeight(page),
        },
    });
    const base64: string = "base64://" + result; // convert image to base64 to pass to graphQL query

    await page.close();
    return base64;
}
