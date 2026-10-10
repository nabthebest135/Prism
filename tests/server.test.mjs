import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { createServer } from '../server/index.mjs'
async function listening(server) {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  return 'http://127.0.0.1:' + server.address().port
}
test('local proxy chooses server model, passes images, caps tokens, and blocks foreign origins', async () => {
  let received
  const upstream = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    if (req.url === '/models') return res.end(JSON.stringify({ data: [{ id: 'local-vision' }] }))
    let raw = ''
    for await (const c of req) raw += c
    received = JSON.parse(raw)
    res.end(JSON.stringify({ choices: [{ message: { content: 'a blue shirt' } }] }))
  })
  const base = await listening(upstream),
    server = createServer({ aiUrl: base, tryOnUrl: base }),
    url = await listening(server)
  try {
    const body = {
      model: 'cloud-model',
      max_tokens: 9999,
      messages: [
        {
          role: 'user',
          content: [{ type: 'image_url', image_url: { url: 'data:image/jpeg;base64,abc' } }],
        },
      ],
    }
    let response = await fetch(url + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    assert.equal(response.status, 200)
    assert.equal(received.model, 'local-vision')
    assert.equal(received.max_tokens, 1200)
    assert.equal(received.messages[0].content[0].image_url.url, 'data:image/jpeg;base64,abc')
    response = await fetch(url + '/api/chat', {
      method: 'POST',
      headers: { Origin: 'https://evil.example' },
      body: JSON.stringify(body),
    })
    assert.equal(response.status, 403)
    response = await fetch(url + '/api/chat', { method: 'POST', body: 'invalid' })
    assert.equal(response.status, 400)
    response = await fetch(url + '/api/tryon', {
      method: 'POST',
      body: JSON.stringify({ person: 'abc' }),
    })
    assert.equal(response.status, 400)
  } finally {
    server.closeAllConnections()
    upstream.closeAllConnections()
    await Promise.all([new Promise((r) => server.close(r)), new Promise((r) => upstream.close(r))])
  }
})
test('unavailable model produces actionable error, not a fabricated analysis', async () => {
  const server = createServer({ aiUrl: 'http://127.0.0.1:1', tryOnUrl: 'http://127.0.0.1:1' }),
    url = await listening(server)
  try {
    const response = await fetch(url + '/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
    })
    assert.equal(response.status, 503)
    assert.match((await response.json()).error, /SSH/)
    const health = await (await fetch(url + '/api/health')).json()
    assert.equal(health.ai, false)
    assert.equal(health.tryon.ready, false)
  } finally {
    server.closeAllConnections()
    await new Promise((r) => server.close(r))
  }
})
