export const SESSION_COOKIE = 'tedi_auth'

const DEFAULT_MAX_AGE_SEC = 3600

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    // Fail closed: no secret means no valid session can ever be issued or accepted
    throw new Error('SESSION_SECRET is not set.')
  }
  return secret
}

export async function signSession(
  maxAgeSec: number = DEFAULT_MAX_AGE_SEC,
): Promise<string> {
  const { createHmac } = await import('node:crypto')
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + maxAgeSec * 1000 }),
  ).toString('base64url')
  const signature = createHmac('sha256', getSecret())
    .update(payload)
    .digest('base64url')
  return `${payload}.${signature}`
}

export async function verifySession(token: string): Promise<boolean> {
  const { createHmac, timingSafeEqual } = await import('node:crypto')
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  const expected = createHmac('sha256', getSecret()).update(payload).digest()
  let actual: Buffer
  try {
    actual = Buffer.from(signature, 'base64url')
  } catch {
    return false
  }
  if (actual.length !== expected.length) return false
  if (!timingSafeEqual(actual, expected)) return false

  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof exp === 'number' && Date.now() < exp
  } catch {
    return false
  }
}
