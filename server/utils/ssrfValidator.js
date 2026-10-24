const dns = require('dns').promises;
const net = require('net');

function isPrivateIp(ip) {
    if (!ip) return true;

    // IPv4 private & loopback ranges
    if (net.isIPv4(ip)) {
        const parts = ip.split('.').map(Number);
        if (parts[0] === 0) return true; // 0.0.0.0/8
        if (parts[0] === 127) return true; // 127.0.0.0/8 (localhost)
        if (parts[0] === 10) return true; // 10.0.0.0/8
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16.0.0/12
        if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.0.0/16
        if (parts[0] === 169 && parts[1] === 254) return true; // 169.254.0.0/16 (link-local / AWS metadata)
        if (parts[0] >= 224) return true; // Multicast & broadcast
        return false;
    }

    // IPv6 private & loopback
    if (net.isIPv6(ip)) {
        const normalized = ip.toLowerCase();
        if (normalized === '::1' || normalized === '::') return true;
        if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // Unique local address (fc00::/7)
        if (normalized.startsWith('fe80')) return true; // Link-local
        return false;
    }

    return true;
}

/**
 * Validates a URL against SSRF threats.
 * Throws an Error if protocol is invalid or host resolves to a private/internal IP.
 */
async function validateUrlForSsrf(inputUrl) {
    let parsed;
    try {
        parsed = new URL(inputUrl);
    } catch {
        throw new Error("Invalid URL format");
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error("Only http and https protocols are supported");
    }

    const hostname = parsed.hostname;
    if (!hostname || hostname === 'localhost' || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
        throw new Error("Blocked internal hostname");
    }

    // If host is already an IP address
    if (net.isIP(hostname)) {
        if (isPrivateIp(hostname)) {
            throw new Error("Access to private/internal IP address is forbidden");
        }
        return parsed;
    }

    // Resolve DNS
    const addresses = await dns.lookup(hostname, { all: true });
    if (!addresses || addresses.length === 0) {
        throw new Error("Could not resolve hostname");
    }

    for (const record of addresses) {
        if (isPrivateIp(record.address)) {
            throw new Error("Access to private or local network is forbidden");
        }
    }

    return parsed;
}

/**
 * Strips UTM parameters, marketing query params, fragments, www., and trailing slashes.
 */
function normalizeUrl(inputUrl) {
    try {
        const parsed = new URL(inputUrl);
        // Strip fragment
        parsed.hash = '';

        // Strip www. from hostname
        if (parsed.hostname.startsWith('www.')) {
            parsed.hostname = parsed.hostname.slice(4);
        }

        // Strip utm_* params and marketing params
        const paramsToDelete = [];
        for (const [key] of parsed.searchParams) {
            if (key.toLowerCase().startsWith('utm_') || ['fbclid', 'gclid', 'ref', 'source', 'igshid'].includes(key.toLowerCase())) {
                paramsToDelete.push(key);
            }
        }
        paramsToDelete.forEach(p => parsed.searchParams.delete(p));

        let normalized = parsed.toString();
        // Strip trailing slash
        if (normalized.endsWith('/')) {
            normalized = normalized.slice(0, -1);
        }
        return normalized;
    } catch {
        return inputUrl;
    }
}

module.exports = {
    validateUrlForSsrf,
    isPrivateIp,
    normalizeUrl
};
