import dns from 'node:dns/promises'
import net from 'node:net'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { ApiError } from '../../utils/ApiError.js'

const BLOCKED_HOSTNAMES = new Set(['localhost'])

function isPrivateIp(ip) {
  const type = net.isIP(ip)
  if (type === 4) {
    const [a, b] = ip.split('.').map(Number)
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    )
  }
  if (type === 6) {
    return ip === '::1' || ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80')
  }
  return false
}

async function assertPublicUrl(url) {
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new ApiError(400, 'Only http/https links are supported')
  }
  const hostname = url.hostname.toLowerCase()
  if (BLOCKED_HOSTNAMES.has(hostname) || net.isIP(hostname) && isPrivateIp(hostname)) {
    throw new ApiError(400, 'This link cannot be fetched')
  }
  let addresses
  try {
    addresses = await dns.lookup(hostname, { all: true })
  } catch {
    throw new ApiError(400, 'Could not resolve this link')
  }
  if (addresses.some(a => isPrivateIp(a.address))) {
    throw new ApiError(400, 'This link cannot be fetched')
  }
}

function absolutize(maybeRelativeUrl, baseUrl) {
  if (!maybeRelativeUrl) return ''
  try {
    return new URL(maybeRelativeUrl, baseUrl).toString()
  } catch {
    return ''
  }
}

// Fetches a public URL and extracts Open Graph / Twitter Card metadata for the
// "fill from link" admin convenience feature. Many sites (notably LinkedIn) block
// unauthenticated scraping and will legitimately yield little or nothing here —
// callers should treat a sparse result as normal, not an error.
export async function fetchLinkPreview(rawUrl) {
  let url
  try {
    url = new URL(rawUrl)
  } catch {
    throw new ApiError(400, 'Enter a valid URL')
  }

  await assertPublicUrl(url)

  let html
  try {
    const { data } = await axios.get(url.toString(), {
      timeout: 8000,
      maxContentLength: 3 * 1024 * 1024,
      maxRedirects: 5,
      responseType: 'text',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HireverseLinkPreview/1.0; +https://hireverse.example/bot)',
        Accept: 'text/html,application/xhtml+xml',
      },
      validateStatus: status => status >= 200 && status < 400,
    })
    html = data
  } catch (err) {
    throw new ApiError(422, 'Could not fetch a preview for this link. Some sites (including LinkedIn) block this — please fill the details in manually.')
  }

  const $ = cheerio.load(html)
  const metaProp = prop => $(`meta[property="${prop}"]`).attr('content')?.trim() || ''
  const metaName = name => $(`meta[name="${name}"]`).attr('content')?.trim() || ''

  const title = metaProp('og:title') || metaName('twitter:title') || $('title').first().text().trim()
  const description = metaProp('og:description') || metaName('twitter:description') || metaName('description')
  const image = absolutize(metaProp('og:image') || metaName('twitter:image'), url)

  return {
    title: title.slice(0, 200),
    content: description.slice(0, 400),
    imageUrl: image,
  }
}
