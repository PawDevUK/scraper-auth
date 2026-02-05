// Clean and validate server string
export function normalizeServer(server) {
	if (!server) throw new Error('proxy_server is missing');
	const s = server
		.trim()
		.replace(/^[<\s]*|[>\s]*$/g, '') // strip angle brackets and spaces around
		.replace(/^https?:\/\//, '') // strip protocol if present
		.replace(/\/.*/, ''); // strip any path
	const m = s.match(/^([^:\s]+):(\d+)$/);
	if (!m) throw new Error(`Invalid proxy_server. Expected "host:port", got "${server}"`);
	return { host: m[1], port: m[2] };
}

export function buildProxyUrl(serverRaw, user, pass) {
	const { host, port } = normalizeServer(serverRaw);
	if (user && pass) {
		const u = encodeURIComponent(user);
		const p = encodeURIComponent(pass);
		return `http://${u}:${p}@${host}:${port}`;
	}
	return `http://${host}:${port}`;
}

export async function getIpViaPage(page) {
	const resp = await page.goto('https://api.ipify.org?format=json', { waitUntil: 'networkidle2' });
	const text = await resp.text();
	try {
		return JSON.parse(text).ip;
	} catch {
		return text.trim();
	}
}
