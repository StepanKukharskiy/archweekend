import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'archweekend_access';
export const SESSION_SECONDS = 7 * 24 * 60 * 60;

/** @param {string} email */
export function normalizeEmail(email) { return email.trim().toLowerCase(); }

/** @param {Record<string, string | undefined>} env */
export function accessConfig(env) {
	const enabled = env.RECOVERY_ACCESS_ENABLED === 'true';
	const password = env.RECOVERY_PASSWORD || '';
	const secret = env.RECOVERY_SESSION_SECRET || '';
	const emails = new Set((env.RECOVERY_ALLOWED_EMAILS || '')
		.split(/[\s,;]+/).map(normalizeEmail).filter(Boolean));
	return { enabled, password, secret, emails,
		ready: enabled && password.length >= 8 && secret.length >= 32 && emails.size > 0 };
}
/** @typedef {ReturnType<typeof accessConfig>} AccessConfig */

/** @param {string} a @param {string} b */
function equal(a, b) {
	return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
}
/** @param {AccessConfig} config @param {string} email @param {string} password */
export function canSignIn(config, email, password) {
	const passwordMatches = equal(password, config.password);
	return config.ready && passwordMatches && config.emails.has(normalizeEmail(email));
}
/** @param {AccessConfig} config @param {string} payload */
function signature(config, payload) {
	// Rotating either the secret or password invalidates all existing sessions.
	return createHmac('sha256', config.secret).update(config.password).update('\0').update(payload).digest('base64url');
}
/** @param {AccessConfig} config @param {string} email @param {number} [now] */
export function createSession(config, email, now = Date.now()) {
	const normalized = normalizeEmail(email);
	if (!config.ready || !config.emails.has(normalized)) throw new Error('Recordings access unavailable');
	const payload = Buffer.from(JSON.stringify({ v: 1, email: normalized, exp: Math.floor(now / 1000) + SESSION_SECONDS })).toString('base64url');
	return `${payload}.${signature(config, payload)}`;
}
/** @param {AccessConfig} config @param {string | undefined} token @param {number} [now] */
export function readSession(config, token, now = Date.now()) {
	if (!config.ready || !token || token.length > 2048) return undefined;
	const [payload, mac, extra] = token.split('.');
	if (!payload || !mac || extra !== undefined || !equal(signature(config, payload), mac)) return undefined;
	try {
		const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
		const seconds = Math.floor(now / 1000);
		if (data.v !== 1 || typeof data.email !== 'string' || !Number.isInteger(data.exp) ||
			data.exp <= seconds || data.exp > seconds + SESSION_SECONDS || !config.emails.has(data.email)) return undefined;
		return {
			id: `recordings:${createHmac('sha256', config.secret).update(data.email).digest('hex').slice(0, 32)}`,
			email: /** @type {string} */ (data.email), access: 'recovery', credits: 0
		};
	} catch { return undefined; }
}

/** Per-process limiter; use an additional proxy limit for multi-instance deployments. */
export function createLoginLimiter(limit = 10, windowMs = 15 * 60 * 1000, capacity = 10000) {
	/** @type {Map<string, {count: number, until: number}>} */
	const attempts = new Map();
	return {
		/** @param {string} key @param {number} [now] */
		consume(key, now = Date.now()) {
			for (const [address, entry] of attempts) if (entry.until <= now) attempts.delete(address);
			let entry = attempts.get(key);
			if (!entry) {
				if (attempts.size >= capacity) return Math.ceil(windowMs / 1000);
				entry = { count: 0, until: now + windowMs };
				attempts.set(key, entry);
			}
			if (entry.count >= limit) return Math.ceil((entry.until - now) / 1000);
			entry.count += 1;
			return 0;
		},
		/** @param {string} key */
		clear(key) { attempts.delete(key); }
	};
}
