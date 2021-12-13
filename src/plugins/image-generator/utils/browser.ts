import puppeteer from "puppeteer";

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
        fullPage: true,
    });
    await page.close();
}

export async function generateScreenshot(url: string): Promise<string> {
    const page: puppeteer.Page = await browser.newPage();
    await page.goto(url);
    const htmlElement = await page.$("#app");
    const result = <string>await htmlElement?.screenshot({
        encoding: "base64",
    });
    const base64: string = "base64://" + result; // convert image to base64 to pass to graphQL query

    await page.close();

    return base64;
}
