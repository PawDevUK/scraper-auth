import puppeteer from "puppeteer";
import 'dotenv/config'

const proxyServerRaw = process.env.proxy_server; // e.g. host:port
const proxyUser = process.env.proxy_username;
const proxyPass = process.env.proxy_password;
const url = process.env.targer_url;

async function run() {

    const browser = await puppeteer.launch({ headless: false, args: [`--proxy-server=${proxyServerRaw}`] });
    try {
        const page = await browser.newPage();
        await page.authenticate({ username: proxyUser, password: proxyPass });
        page.on("close", () => console.warn("Proxy page closed"));
        page.on("error", (e) => console.error("Proxy page error:", e));

        await page.goto(url, { waitUntil: "domcontentloaded" });
        console.log("Target reachable via proxy:", url);
    } catch (err) {
        console.error("Proxy test failed:", err);
    } finally {
        await browser.close();
    }

}

run();