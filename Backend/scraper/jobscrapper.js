import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'
import { connectDB } from '../src/config/db.js'
import { upsertJob } from '../src/modules/jobs/jobs.service.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// Load .env from Backend root regardless of which directory node is run from
dotenv.config({ path: path.join(__dirname, '../.env') })

const AUTH_FILE          = path.join(__dirname, 'auth.json')
const KEYWORDS           = process.env.SCRAPER_KEYWORDS
  ? process.env.SCRAPER_KEYWORDS.split(',').map(k => k.trim()).filter(Boolean)
  : ['node', 'java', 'javascript']
const CLOSE_AFTER_MINUTES = Number(process.env.SCRAPER_CLOSE_AFTER_MINUTES) || 20

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function getDirectLink(url) {
  try {
    const u = new URL(url)
    return `${u.origin}${u.pathname}`
  } catch {
    return url.split('?')[0]
  }
}

function getBrowserExecutablePath() {
  const candidates = [
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env.LOCALAPPDATA}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${process.env.PROGRAMFILES}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${process.env['PROGRAMFILES(X86)']}\\Microsoft\\Edge\\Application\\msedge.exe`,
  ].filter(Boolean)
  return candidates.find(c => fs.existsSync(c)) || null
}

async function saveAuth(page) {
  const cookies          = await page.cookies()
  const localStorageData = await page.evaluate(() => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      data[key] = localStorage.getItem(key)
    }
    return data
  })
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies, localStorageData }, null, 2))
  console.log('✅ Session saved to auth.json')
}

// Returns true if the current page is the logged-in LinkedIn feed/home
async function checkLoggedIn(page) {
  try {
    const url = page.url()
    return (
      url.includes('linkedin.com/feed') ||
      url.includes('linkedin.com/mynetwork') ||
      url.includes('linkedin.com/messaging') ||
      url.includes('linkedin.com/notifications')
    )
  } catch {
    return false
  }
}

// Open the login page and WAIT until the user fully signs in
async function waitForManualLogin(page) {
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' })
  await delay(2000)

  console.log('\n========================================')
  console.log('🔐  Please sign in to LinkedIn now.')
  console.log('    The scraper is waiting for you...')
  console.log('    It will start automatically once')
  console.log('    you are on the LinkedIn feed page.')
  console.log('========================================\n')

  // Poll every 3 seconds — only proceed once the URL is the logged-in feed
  await page.waitForFunction(
    () => {
      const url = window.location.href
      return (
        url.includes('linkedin.com/feed') ||
        url.includes('linkedin.com/mynetwork') ||
        url.includes('linkedin.com/messaging')
      )
    },
    { timeout: 0, polling: 3000 }
  )

  // Give the page a moment to fully settle after login
  console.log('✅ Sign-in detected! Waiting for page to settle...')
  await delay(5000)
  await saveAuth(page)
  console.log('🚀 Starting scraper now...\n')
}

async function loadAuth(page) {
  const authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'))
  if (authData.cookies?.length) {
    await page.setCookie(...authData.cookies)
  }
  await page.goto('https://www.linkedin.com/feed', { waitUntil: 'domcontentloaded' })
  await delay(4000)

  await page.evaluate(data => {
    for (const key in data) localStorage.setItem(key, data[key])
  }, authData.localStorageData)

  await page.reload({ waitUntil: 'domcontentloaded' })
  await delay(4000)

  const loggedIn = await checkLoggedIn(page)
  if (loggedIn) {
    console.log('✅ Restored saved session — already logged in.')
  } else {
    console.log('⚠️  Saved session expired. Need to log in again.')
    // Delete stale auth and ask for manual login
    fs.unlinkSync(AUTH_FILE)
    await waitForManualLogin(page)
  }
}

// ── Auto-scroll to load all job cards ─────────────────────────────────────
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let total = 0
      const timer = setInterval(() => {
        window.scrollBy(0, 600)
        total += 600
        if (total >= document.body.scrollHeight) { clearInterval(timer); resolve() }
      }, 600)
    })
  })
}

// ── Collect all job links from the search results page ────────────────────
async function collectJobLinks(page) {
  return page.evaluate(() => {
    const hrefs = new Set()

    // ① Authenticated LinkedIn: job card links
    document.querySelectorAll('a.job-card-container__link').forEach(a => {
      if (a.href) hrefs.add(a.href)
    })

    // ② Public LinkedIn: full card anchor (guest view)
    document.querySelectorAll('a.base-card__full-link').forEach(a => {
      if (a.href) hrefs.add(a.href)
    })

    // ③ Public LinkedIn: job title anchor inside card
    document.querySelectorAll('a.job-search-card__title-link').forEach(a => {
      if (a.href) hrefs.add(a.href)
    })

    // ④ Any anchor whose href contains /jobs/view/
    document.querySelectorAll('a[href*="/jobs/view/"]').forEach(a => {
      if (a.href) hrefs.add(a.href)
    })

    return [...hrefs]
  })
}

// ── Scrape a single job detail page ──────────────────────────────────────
async function scrapeJobDetail(page) {
  // Wait until JSON-LD or page title is ready (LinkedIn 2025 SPA uses <p> not <h1> for titles)
  await page.waitForFunction(
    () => {
      const ld = document.querySelector('script[type="application/ld+json"]')
      const title = document.title
      return (ld && ld.textContent.length > 50) ||
             (title && title.length > 5 && !title.toLowerCase().startsWith('linkedin'))
    },
    { timeout: 15000, polling: 500 }
  ).catch(() => {})

  return page.evaluate(() => {
    // ── JSON-LD structured data (most reliable on LinkedIn) ────────────
    let ld = null
    try {
      const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')]
      for (const s of scripts) {
        const parsed = JSON.parse(s.textContent)
        if (parsed['@type'] === 'JobPosting') { ld = parsed; break }
      }
    } catch {}

    // ── Job title ──────────────────────────────────────────────────────
    // LinkedIn 2025: title in <p> with obfuscated classes — use JSON-LD or page <title>
    const titleFromPage = (document.title || '')
      .replace(/\s*\|\s*LinkedIn.*$/i, '')
      .replace(/\s*[-–]\s*LinkedIn.*$/i, '')
      .trim()

    const jobTitle =
      ld?.title?.trim() ||
      document.querySelector('h1.jobs-unified-top-card__job-title')?.innerText?.trim() ||
      document.querySelector('h1.t-24')?.innerText?.trim() ||
      document.querySelector('h1')?.innerText?.trim() ||
      titleFromPage || ''

    // ── Company ────────────────────────────────────────────────────────
    const ldCompany = ld?.hiringOrganization?.name?.trim() || ''

    const companyAnchor =
      document.querySelector('.job-details-jobs-unified-top-card__company-name a') ||
      document.querySelector('.jobs-unified-top-card__company-name a') ||
      document.querySelector('a.topcard__org-name-link') ||
      document.querySelector('a[href*="/company/"]')

    const company     = companyAnchor?.innerText?.trim() || ldCompany
    const companyLink = companyAnchor?.href || ''

    // ── Logo ───────────────────────────────────────────────────────────
    const logoImg =
      document.querySelector('img.artdeco-entity-image') ||
      document.querySelector('img[alt*="logo" i]') ||
      document.querySelector('img[class*="EntityPhoto"]')

    const companyImage =
      logoImg?.getAttribute('data-delayed-url') ||
      logoImg?.getAttribute('data-ghost-url') ||
      logoImg?.src || ''

    // ── Location ───────────────────────────────────────────────────────
    const ldCity    = ld?.jobLocation?.address?.addressLocality || ld?.jobLocation?.[0]?.address?.addressLocality || ''
    const ldCountry = ld?.jobLocation?.address?.addressCountry  || ld?.jobLocation?.[0]?.address?.addressCountry  || ''
    const ldPlace   = [ldCity, ldCountry].filter(Boolean).join(', ')

    const place =
      document.querySelector('.jobs-unified-top-card__bullet')?.innerText?.trim() ||
      document.querySelector('.job-details-jobs-unified-top-card__primary-description-without-tagline span')?.innerText?.trim() ||
      document.querySelector('.topcard__flavor--bullet')?.innerText?.trim() ||
      ldPlace || ''

    // ── Posted date ────────────────────────────────────────────────────
    const lastDate =
      document.querySelector('.jobs-unified-top-card__posted-date')?.innerText?.trim() ||
      document.querySelector('span.posted-time-ago__text')?.innerText?.trim() ||
      document.querySelector('time')?.innerText?.trim() ||
      ld?.datePosted || ''

    // ── Apply link — extract from LinkedIn's embedded JSON (never click the button) ──
    // LinkedIn bootstraps its SPA with JSON data in <code> elements;
    // companyApplyUrl holds the external application URL without any clicks needed.
    let applyLink = ''
    try {
      for (const code of document.querySelectorAll('code')) {
        const text = code.textContent
        if (!text.includes('companyApplyUrl')) continue
        const m = text.match(/"companyApplyUrl"\s*:\s*"([^"]+)"/)
        if (m) {
          applyLink = m[1]
            .replace(/\\u0026/g, '&')
            .replace(/\\u003d/g, '=')
            .replace(/\\u003a/g, ':')
          break
        }
      }
    } catch {}

    // Fallback: look for an <a> that wraps the apply action
    if (!applyLink) {
      const applyAnchor =
        document.querySelector('.jobs-s-apply a[href]') ||
        document.querySelector('a.jobs-apply-button[href]') ||
        document.querySelector('a[data-view-name="job-apply-link"][href]') ||
        document.querySelector('a.apply-button--newDesign[href]')
      applyLink = applyAnchor?.href || window.location.href
    }

    return { jobTitle, company, companyLink, companyImage, place, lastDate, applyLink }
  })
}

// ── Click "Apply on company website" and capture the URL it opens ─────────
async function captureExternalApplyLink(page, browser) {
  try {
    // Find by aria-label first, then fall back to the external-link SVG inside a button
    let btn = await page.$('[aria-label="Apply on company website"]')
    if (!btn) {
      const svgHandle = await page.$('button svg#link-external-medium')
      if (svgHandle) {
        btn = await page.evaluateHandle(el => el.closest('button'), svgHandle)
        const isBtn = await page.evaluate(el => el && el.tagName === 'BUTTON', btn)
        if (!isBtn) btn = null
      }
    }
    if (!btn) return null

    let resolveUrl
    const urlPromise = new Promise(resolve => { resolveUrl = resolve })
    const tid = setTimeout(() => resolveUrl(null), 6000)

    browser.once('targetcreated', async target => {
      clearTimeout(tid)
      await delay(800)
      resolveUrl(target.url())
    })

    await btn.click()
    const applyUrl = await urlPromise

    // Close any extra tabs that were opened
    for (const target of browser.targets()) {
      if (target !== page.target() && target.type() === 'page') {
        const p = await target.page().catch(() => null)
        if (p) await p.close().catch(() => {})
      }
    }

    return applyUrl || null
  } catch {
    return null
  }
}

// ── Scrape all jobs for a keyword ─────────────────────────────────────────
async function scrapeKeyword(browser, page, keyword) {
  const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&f_TPR=r86400`
  console.log(`\n🔍 Searching: ${keyword}`)
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' })
  await delay(4000)

  // Scroll to lazy-load all cards
  console.log('📜 Scrolling to load all cards...')
  await autoScroll(page)
  await delay(2000)

  // Collect all job links
  const rawLinks = await collectJobLinks(page)
  const jobLinks = [...new Set(rawLinks.map(getDirectLink))].filter(Boolean)
  console.log(`🔗 ${jobLinks.length} job links found for: ${keyword}`)

  if (jobLinks.length === 0) {
    console.log('⚠️  No links found. The page HTML may have changed.')
    return
  }

  // Visit each job and scrape details
  for (let i = 0; i < jobLinks.length; i++) {
    const link = jobLinks[i]
    console.log(`➡ [${i + 1}/${jobLinks.length}] ${link}`)

    try {
      await page.goto(link, { waitUntil: 'domcontentloaded' })
      await delay(2500)

      // Dismiss any "Did you finish applying?" modal left over from previous visits
      await page.evaluate(() => {
        const btns = [...document.querySelectorAll('button')]
        const no = btns.find(b => b.textContent.trim() === 'No')
        if (no) no.click()
      }).catch(() => {})

      const jobData = await scrapeJobDetail(page)

      if (!jobData.jobTitle) {
        console.log('  ⚠️  No title found, skipping.')
        continue
      }

      await upsertJob({
        title:        jobData.jobTitle,
        company:      jobData.company,
        companyLink:  jobData.companyLink,
        companyImage: jobData.companyImage,
        place:        jobData.place,
        jobLink:      link,
        applyLink:    jobData.applyLink,
        lastDate:     jobData.lastDate,
        keyword,
        source:       'linkedin',
      })

      console.log(`  💾 Saved: "${jobData.jobTitle}" @ ${jobData.company || '?'}`)
    } catch (err) {
      console.log(`  ❌ Failed on ${link}: ${err.message}`)
    }

    await delay(2000)
  }
}

// ── Main ──────────────────────────────────────────────────────────────────
async function runScraper() {
  await connectDB()

  const browserOptions = { headless: false, defaultViewport: null }
  const executablePath = getBrowserExecutablePath()
  if (executablePath) {
    browserOptions.executablePath = executablePath
    console.log(`🌐 Browser: ${executablePath}`)
  }

  const browser = await puppeteer.launch(browserOptions)
  const page    = await browser.newPage()
  page.setDefaultNavigationTimeout(0)

  // Force-close safety timer
  const closeTimer = setTimeout(async () => {
    console.warn(`⏱ ${CLOSE_AFTER_MINUTES}min limit reached — closing browser.`)
    if (!browser.isClosed()) await browser.close()
  }, CLOSE_AFTER_MINUTES * 60 * 1000)

  try {
    if (!fs.existsSync(AUTH_FILE)) {
      await waitForManualLogin(page)
    } else {
      await loadAuth(page)
    }

    for (const keyword of KEYWORDS) {
      if (!keyword) continue
      await scrapeKeyword(browser, page, keyword)
    }

    console.log('\n✅ Scraper finished successfully!')
  } catch (err) {
    console.error('⚠️ Scraper error:', err)
    throw err
  } finally {
    clearTimeout(closeTimer)
    if (!browser.isClosed()) await browser.close()
  }
}

// ── Entry point ───────────────────────────────────────────────────────────
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runScraper().catch(err => {
    console.error('Scraper terminated:', err)
    process.exit(1)
  })
}

export { runScraper }
