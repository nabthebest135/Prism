import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist')
const aiBase = (process.env.LOCAL_AI_URL || 'http://127.0.0.1:18011/v1').replace(/\/$/, '')
const tryOnBase = process.env.TRYON_URL || 'http://127.0.0.1:18012'
const allowedHosts = new Set(['127.0.0.1', 'localhost', '[::1]'])
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.webmanifest': 'application/manifest+json',
}
const json = (res, status, value) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(value))
}
export function createServer({ aiUrl = aiBase, tryOnUrl = tryOnBase } = {}) {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost')
      if (!allowedHosts.has(new URL('http://' + req.headers.host).hostname))
        return json(res, 403, { error: 'Use localhost to access Prism.' })
      if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host)
        return json(res, 403, { error: 'Origin not allowed' })
      if (url.pathname === '/api/health') {
        if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })
        const [ai, tryon] = await Promise.allSettled([
          fetch(aiUrl + '/models', { signal: AbortSignal.timeout(5000) }).then(async (r) => {
            if (!r.ok) throw new Error()
            return r.json()
          }),
          fetch(tryOnUrl + '/health', { signal: AbortSignal.timeout(5000) }).then(async (r) => {
            if (!r.ok) throw new Error()
            return r.json()
          }),
        ])
        return json(res, 200, {
          ai: ai.status === 'fulfilled',
          model: ai.status === 'fulfilled' ? ai.value.data?.[0]?.id : null,
          tryon:
            tryon.status === 'fulfilled' && tryon.value.model === 'CatVTON'
              ? tryon.value
              : { ready: false },
        })
      }
      if (url.pathname.startsWith('/api/')) {
        if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
        let size = 0,
          chunks = []
        for await (const chunk of req) {
          size += chunk.length
          if (size > 12 * 1024 * 1024)
            return json(res, 413, { error: 'Image too large. Choose a smaller photo.' })
          chunks.push(chunk)
        }
        let body
        try {
          body = JSON.parse(Buffer.concat(chunks).toString())
        } catch {
          return json(res, 400, { error: 'Invalid JSON' })
        }
        let endpoint, payload
        if (url.pathname === '/api/chat') {
          if (
            !Array.isArray(body.messages) ||
            body.messages.length < 1 ||
            body.messages.length > 20
          )
            return json(res, 400, { error: 'Messages required' })
          const modelsResponse = await fetch(aiUrl + '/models', {
            signal: AbortSignal.timeout(5000),
          })
          if (!modelsResponse.ok) throw new Error('Local AI unavailable')
          const models = await modelsResponse.json()
          const model = process.env.LOCAL_AI_MODEL || models.data?.[0]?.id
          if (!model) throw new Error('No local model loaded')
          endpoint = aiUrl + '/chat/completions'
          payload = {
            model,
            messages: body.messages,
            max_tokens: Math.min(Math.max(Number(body.max_tokens) || 600, 1), 1200),
            temperature: 0.3,
            stream: false,
            chat_template_kwargs: { enable_thinking: false },
          }
          if (body.json) payload.response_format = { type: 'json_object' }
        } else if (url.pathname === '/api/tryon') {
          if (
            ![body.person, body.garment, body.mask].every(
              (x) => typeof x === 'string' && x.startsWith('data:image/')
            )
          )
            return json(res, 400, { error: 'Person, garment, and painted mask required' })
          endpoint = tryOnUrl + '/tryon'
          payload = {
            person: body.person,
            garment: body.garment,
            mask: body.mask,
            seed: Number.isInteger(body.seed) ? body.seed : 42,
          }
        } else return json(res, 404, { error: 'Unknown endpoint' })
        const upstream = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(url.pathname === '/api/tryon' ? 600000 : 180000),
        })
        return json(res, upstream.status, await upstream.json())
      }
      if (req.method !== 'GET' && req.method !== 'HEAD')
        return json(res, 405, { error: 'Method not allowed' })
      const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '')
      let target = path.resolve(root, relative || 'index.html')
      if (!target.startsWith(root + path.sep) && target !== path.join(root, 'index.html'))
        return json(res, 403, { error: 'Invalid path' })
      let content
      try {
        content = await readFile(target)
      } catch {
        if (path.extname(target)) return json(res, 404, { error: 'File not found' })
        target = path.join(root, 'index.html')
        content = await readFile(target)
      }
      res.writeHead(200, {
        'Content-Type': mime[path.extname(target)] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
      })
      res.end(req.method === 'HEAD' ? undefined : content)
    } catch (error) {
      json(res, 503, {
        error:
          error.name === 'TimeoutError'
            ? 'Local model timed out. Retry with a smaller image.'
            : 'Local model unavailable. Check Bladefall and the SSH connection, then retry.',
      })
    }
  })
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000)
  createServer().listen(port, '127.0.0.1', () =>
    console.log('Prism ready at http://localhost:' + port)
  )
}
