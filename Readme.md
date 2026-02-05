# Scraper Tutorial (Puppeteer + Proxy)

A minimal Puppeteer setup that demonstrates browsing a target URL through an authenticated HTTP proxy. Includes helper utilities for normalizing proxy addresses and checking the outbound IP via a page request.

## Overview

- Uses Puppeteer to launch Chromium with `--proxy-server` and `page.authenticate()`.
- Supports simple `host:port` proxies with username/password.
- Includes optional `proxy-chain` flow (commented in code) for URL-style proxy auth.

## Requirements

- Node.js (LTS recommended)
- A reachable HTTP proxy with credentials

## Install

```bash
npm install
```

## Configure

Create a `.env` file in the project root with:

```
# Required
proxy_server=HOST:PORT
proxy_username=YOUR_USER
proxy_password=YOUR_PASSWORD

# Target page to open via the proxy (note: variable name expected by code)
targer_url=https://www.example.com   !! target format needs protocol and www !!

# Optional: URL-style auth used with proxy-chain (commented path in code)
# proxy_auth_url=http://USERNAME:PASSWORD@HOST:PORT
```

Or copy [.env.example](.env.example) to `.env` and edit values.

## Run

```bash
npm start
```

This launches Chromium non-headless, sets the proxy and authenticates the page, then navigates to the URL specified in `targer_url`.

## Verify Proxy IP (optional)

You can verify the outbound IP via the helper in [lib/proxy_helpers.js](lib/proxy_helpers.js):

- In [index.js](index.js), the import `getIpViaPage` already exists.
- After creating `page`, call `await getIpViaPage(page)` and log the result.
- There are commented examples in the file; simply uncomment to use.

## Project Structure

```
index.js
package.json
lib/
  proxy_helpers.js
```

- `index.js`: Main runner that configures Puppeteer, sets the proxy, authenticates, and opens the target page.
- `lib/proxy_helpers.js`: Utilities for proxy URL building and fetching current IP via a page.
- `package.json`: Scripts and dependencies.

## How It Works

1. Reads environment variables with `dotenv`.
2. Launches Puppeteer with `--proxy-server=HOST:PORT`.
3. Calls `page.authenticate({ username, password })` for HTTP proxy auth.
4. Navigates to `targer_url` and logs success or failure.

## Using proxy-chain (optional)

The code includes commented snippets showing how to anonymize a URL-auth proxy using `proxy-chain`:

- Provide `proxy_auth_url` in `.env` (e.g., `http://user:pass@host:port`).
- Uncomment the `ProxyChain.anonymizeProxy(...)` flow in `index.js` if you prefer this method.

## Troubleshooting

- Invalid proxy format: ensure `proxy_server` is `host:port`.
- Authentication failures: verify `proxy_username`/`proxy_password`.
- Target not loading: confirm `targer_url` is set and reachable.
- Common proxy errors: `ERR_TUNNEL_CONNECTION_FAILED`, `net::ERR_NO_SUPPORTED_PROXIES` often indicate wrong host/port or blocked protocol.
- Headless mode: change `headless: false` to `true` in `index.js` if needed.

## Scripts

- `npm start`: Runs the scraper (`node index.js`).

## Notes on `targer_url`

The environment variable in the current code is spelled `targer_url`. You can keep it as-is for compatibility, or rename to `target_url` and update [index.js](index.js) accordingly.

## License

ISC
