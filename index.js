import puppeteer from "puppeteer";
import ProxyChain from "proxy-chain";
import 'dotenv/config'

const proxyServerRaw = process.env.proxy_server; // e.g. host:port
const proxyUser = process.env.proxy_username;
const proxyPass = process.env.proxy_password;
const proxyAuthUrl = process.env.proxy_auth_url; // e.g. http://user:pass@host:port
const url = process.env.targer_url;

import { normalizeServer, buildProxyUrl, getIpViaPage } from "./lib/proxy_helpers.js";

// // Clean and validate server string
// function normalizeServer(server) {
//     if (!server) throw new Error("proxy_server is missing");
//     const s = server
//         .trim()
//         .replace(/^[<\s]*|[>\s]*$/g, "") // strip angle brackets and spaces around
//         .replace(/^https?:\/\//, "")     // strip protocol if present
//         .replace(/\/.*/, "");            // strip any path
//     const m = s.match(/^([^:\s]+):(\d+)$/);
//     if (!m) throw new Error(`Invalid proxy_server. Expected "host:port", got "${server}"`);
//     return { host: m[1], port: m[2] };
// }

// function buildProxyUrl(serverRaw, user, pass) {
//     const { host, port } = normalizeServer(serverRaw);
//     if (user && pass) {
//         const u = encodeURIComponent(user);
//         const p = encodeURIComponent(pass);
//         return `http://${u}:${p}@${host}:${port}`;
//     }
//     return `http://${host}:${port}`;
// }

// async function getIpViaPage(page) {
//     const resp = await page.goto("https://api.ipify.org?format=json", { waitUntil: "networkidle2" });
//     const text = await resp.text();
//     try {
//         return JSON.parse(text).ip;
//     } catch {
//         return text.trim();
//     }
// }

async function run() {
    // let args = [];
    // let anonymized;
    // try {
    //     if (proxyServerRaw && proxyUser && proxyPass) {
    //         // const authProxy = buildProxyUrl(proxyServerRaw, proxyUser, proxyPass);

    //         anonymized = await ProxyChain.anonymizeProxy(proxyAuthUrl); // Thats the part which allows to authorise the proxy with credentials passed to url as chrome ignores params passed to urls


    //         // If you want to inspect as an object-like dump
    //         console.dir({ anonymized }, { depth: null });

    //         args.push(`--proxy-server=${anonymized}`);
    //         console.log("Using proxy (auth):", `http://${proxyUser}:***@${normalizeServer(proxyServerRaw).host}:${normalizeServer(proxyServerRaw).port}`);
    //     } else {
    //         console.log("No proxy configured. Set env: proxy_server, proxy_username, proxy_password.");
    //         return;
    //     }
    // } catch (e) {
    //     console.error("Invalid proxy configuration:", e.message);
    //     return;
    // }

    const browser = await puppeteer.launch({ headless: false, args: [`--proxy-server=${proxyServerRaw}`] });
    try {
        const page = await browser.newPage();
        await page.authenticate({ username: proxyUser, password: proxyPass });
        page.on("close", () => console.warn("Proxy page closed"));
        page.on("error", (e) => console.error("Proxy page error:", e));
        // const proxyIp = await getIpViaPage(pageProxy);
        // console.log("IP via proxy:", proxyIp);

        await page.goto(url, { waitUntil: "domcontentloaded" });
        console.log("Target reachable via proxy:", url);
    } catch (err) {
        console.error("Proxy test failed:", err);
    } finally {
        await browser.close();
    }

    // const browserProxy = await puppeteer.launch({ headless: false, args });
    // try {
    //     const pageProxy = await browserProxy.newPage();
    //     pageProxy.on("close", () => console.warn("Proxy page closed"));
    //     pageProxy.on("error", (e) => console.error("Proxy page error:", e));

    //     // const proxyIp = await getIpViaPage(pageProxy);
    //     // console.log("IP via proxy:", proxyIp);

    //     await pageProxy.goto(url, { waitUntil: "domcontentloaded" });
    //     console.log("Target reachable via proxy:", url);
    // } catch (err) {
    //     console.error("Proxy test failed:", err);
    // } finally {
    //     await browserProxy.close();
    //     if (anonymized) await ProxyChain.closeAnonymizedProxy(anonymized, true);
    // }
}

run();