/**
 * walkinScraper.js
 * ─────────────────────────────────────────────────────────────────
 * Scrapes LinkedIn for:
 *   • Walk-in interview jobs   (keyword search: "walk in interview" etc.)
 *   • Internship positions      (LinkedIn job-type filter f_JT=I)
 *
 * Also captures:
 *   • Poster / banner image from the job description
 *   • Company logo image
 *   • External apply link (read from LinkedIn's embedded JSON — never clicks)
 *
 * Shares the same auth.json session as jobscrapper.js.
 * Run:  node Backend/scraper/walkinScraper.js
 */

import dotenv from 'dotenv'
import fs     from 'fs'
import path   from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'
import { connectDB }                              from '../src/config/db.js'
import { cleanupOldJobs }                         from '../src/modules/jobs/jobs.service.js'
import { upsertWalkInJob, cleanupOldWalkInJobs }  from '../src/modules/walkin/walkin.service.js'
import { upsertInternshipJob, cleanupOldInternshipJobs } from '../src/modules/internship/internship.service.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

// ── Config ────────────────────────────────────────────────────────
const AUTH_FILE = path.join(__dirname, 'auth.json')
const CLOSE_AFTER_MINUTES = Number(process.env.SCRAPER_CLOSE_AFTER_MINUTES) || 120

// Walk-in keywords
const WALKIN_KEYWORDS = [
  'walk in interview',
  'walk-in hiring',
  'walkin jobs',
  'walk in drive',
  'walk in interview tomorrow',
  'immediate joining',
]

// Internship keywords
const INTERNSHIP_KEYWORDS = [
  'software intern',
  'data science intern',
  'frontend intern',
  'backend intern',
  'full stack intern',
  'android intern',
  'marketing intern',
  'business development intern',
  'UI UX intern',
]

// Indian cities for location-based walk-in/internship search
const WALKIN_LOCATIONS = [
  // Tamil Nadu
  'Chennai, Tamil Nadu, India',
  'Coimbatore, Tamil Nadu, India',
  'Madurai, Tamil Nadu, India',
  'Trichy, Tamil Nadu, India',
  'Salem, Tamil Nadu, India',
  'Tirunelveli, Tamil Nadu, India',
  'Vellore, Tamil Nadu, India',
  'Pondicherry, India',
  // Karnataka
  'Bengaluru, Karnataka, India',
  // Andhra & Telangana
  'Hyderabad, Telangana, India',
  'Visakhapatnam, Andhra Pradesh, India',
  // Maharashtra
  'Mumbai, Maharashtra, India',
  'Pune, Maharashtra, India',
  // Delhi NCR
  'New Delhi, Delhi, India',
  'Noida, Uttar Pradesh, India',
  'Gurgaon, Haryana, India',
  // Other metros
  'Kolkata, West Bengal, India',
  'Ahmedabad, Gujarat, India',
  'Kochi, Kerala, India',
  // Broad India search
  'India',
]

const delay = ms => new Promise(r => setTimeout(r, ms))

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

// ── Auth helpers (identical to main scraper) ──────────────────────
async function saveAuth(page) {
  const cookies = await page.cookies()
  const localStorageData = await page.evaluate(() => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      data[key] = localStorage.getItem(key)
    }
    return data
  })
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies, localStorageData }, null, 2))
  console.log('Session saved to auth.json')
}

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

async function waitForManualLogin(page) {
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' })
  await delay(2000)
  console.log('\n========================================')
  console.log('  Please sign in to LinkedIn now.')
  console.log('  Waiting for your login...')
  console.log('========================================\n')
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
  console.log('Sign-in detected! Settling...')
  await delay(5000)
  await saveAuth(page)
  console.log('Starting scraper...\n')
}

async function loadAuth(page) {
  const authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'))
  if (authData.cookies?.length) await page.setCookie(...authData.cookies)
  await page.goto('https://www.linkedin.com/feed', { waitUntil: 'domcontentloaded' })
  await delay(4000)
  await page.evaluate(data => {
    for (const key in data) localStorage.setItem(key, data[key])
  }, authData.localStorageData)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await delay(4000)
  const loggedIn = await checkLoggedIn(page)
  if (loggedIn) {
    console.log('Restored saved session.')
  } else {
    console.log('Session expired — need to log in again.')
    fs.unlinkSync(AUTH_FILE)
    await waitForManualLogin(page)
  }
}

// ── Auto-scroll to lazy-load all cards ───────────────────────────
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

// ── Collect job links from search results ────────────────────────
async function collectJobLinks(page) {
  return page.evaluate(() => {
    const hrefs = new Set()
    document.querySelectorAll('a.job-card-container__link').forEach(a => { if (a.href) hrefs.add(a.href) })
    document.querySelectorAll('a.base-card__full-link').forEach(a => { if (a.href) hrefs.add(a.href) })
    document.querySelectorAll('a.job-search-card__title-link').forEach(a => { if (a.href) hrefs.add(a.href) })
    document.querySelectorAll('a[href*="/jobs/view/"]').forEach(a => { if (a.href) hrefs.add(a.href) })
    return [...hrefs]
  })
}

// ── Scrape one job page — including poster image ──────────────────
async function scrapeJobDetail(page) {
  // Wait for JSON-LD structured data or page title to load
  await page.waitForFunction(
    () => {
      const ld    = document.querySelector('script[type="application/ld+json"]')
      const title = document.title
      return (ld && ld.textContent.length > 50) ||
             (title && title.length > 5 && !title.toLowerCase().startsWith('linkedin'))
    },
    { timeout: 15000, polling: 500 }
  ).catch(() => {})

  // Give description images extra time to lazy-load
  await delay(1500)

  return page.evaluate(() => {
    // ── JSON-LD (most reliable) ───────────────────────────────────
    let ld = null
    try {
      const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')]
      for (const s of scripts) {
        const parsed = JSON.parse(s.textContent)
        if (parsed['@type'] === 'JobPosting') { ld = parsed; break }
      }
    } catch {}

    // ── Title ─────────────────────────────────────────────────────
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

    // ── Company ───────────────────────────────────────────────────
    const ldCompany    = ld?.hiringOrganization?.name?.trim() || ''
    const companyAnchor =
      document.querySelector('.job-details-jobs-unified-top-card__company-name a') ||
      document.querySelector('.jobs-unified-top-card__company-name a') ||
      document.querySelector('a.topcard__org-name-link') ||
      document.querySelector('a[href*="/company/"]')
    const company     = companyAnchor?.innerText?.trim() || ldCompany
    const companyLink = companyAnchor?.href || ''

    // ── Company logo / image ──────────────────────────────────────
    const logoImg =
      document.querySelector('img.artdeco-entity-image') ||
      document.querySelector('img[alt*="logo" i]') ||
      document.querySelector('img[class*="EntityPhoto"]')
    const companyImage =
      logoImg?.getAttribute('data-delayed-url') ||
      logoImg?.getAttribute('data-ghost-url') ||
      logoImg?.src || ''

    // ── Poster / Banner image ─────────────────────────────────────
    // Walk-in jobs often include a job-flyer image inside the description.
    // Priority: description img → OG image → company logo
    let posterImage = ''

    // 1. Images embedded in the job description body
    const descSelectors = [
      '.jobs-description-content__text img',
      '.jobs-box__html-content img',
      '.jobs-description img',
      '[class*="jobs-description"] img',
      '.description__text img',
    ]
    for (const sel of descSelectors) {
      const imgs = [...document.querySelectorAll(sel)]
      for (const img of imgs) {
        const src = img.getAttribute('data-delayed-url') || img.getAttribute('src') || ''
        // Skip tiny tracking pixels (usually < 5×5) and LinkedIn ghost placeholders
        if (src && !src.includes('ghost') && !src.includes('pixel') && img.naturalWidth > 50) {
          posterImage = src
          break
        }
      }
      if (posterImage) break
    }

    // 2. LinkedIn often puts job images in their SPA data inside <code> blocks
    if (!posterImage) {
      try {
        for (const code of document.querySelectorAll('code')) {
          const text = code.textContent
          // Look for image URLs referenced in job SPA state
          const m = text.match(/"originalUrl"\s*:\s*"(https:\/\/media\.licdn\.com\/[^"]+\.(jpg|jpeg|png|webp)[^"]*)"/)
          if (m) {
            posterImage = m[1].replace(/\\u0026/g, '&')
            break
          }
        }
      } catch {}
    }

    // 3. OG image tag as fallback
    if (!posterImage) {
      posterImage = document.querySelector('meta[property="og:image"]')?.content || ''
    }

    // 4. Company image as last resort
    if (!posterImage) posterImage = companyImage

    // ── Location ──────────────────────────────────────────────────
    const ldCity    = ld?.jobLocation?.address?.addressLocality || ld?.jobLocation?.[0]?.address?.addressLocality || ''
    const ldCountry = ld?.jobLocation?.address?.addressCountry  || ld?.jobLocation?.[0]?.address?.addressCountry  || ''
    const ldPlace   = [ldCity, ldCountry].filter(Boolean).join(', ')
    const place =
      document.querySelector('.jobs-unified-top-card__bullet')?.innerText?.trim() ||
      document.querySelector('.job-details-jobs-unified-top-card__primary-description-without-tagline span')?.innerText?.trim() ||
      document.querySelector('.topcard__flavor--bullet')?.innerText?.trim() ||
      ldPlace || ''

    // ── Posted date ───────────────────────────────────────────────
    const lastDate =
      document.querySelector('.jobs-unified-top-card__posted-date')?.innerText?.trim() ||
      document.querySelector('span.posted-time-ago__text')?.innerText?.trim() ||
      document.querySelector('time')?.innerText?.trim() ||
      ld?.datePosted || ''

    // ── Apply link (read from LinkedIn's embedded <code> JSON — never click) ──
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

    if (!applyLink) {
      const applyAnchor =
        document.querySelector('.jobs-s-apply a[href]') ||
        document.querySelector('a.jobs-apply-button[href]') ||
        document.querySelector('a[data-view-name="job-apply-link"][href]') ||
        document.querySelector('a.apply-button--newDesign[href]')
      applyLink = applyAnchor?.href || window.location.href
    }

    // ── Employment type from page (Internship / On-site / Remote) ─
    const employmentType =
      ld?.employmentType || ''

    return {
      jobTitle, company, companyLink, companyImage,
      place, lastDate, applyLink, posterImage, employmentType,
    }
  })
}

// ── Scrape one category (walk-in or internship) ───────────────────
async function scrapeCategory(browser, page, { label, url, jobType, keyword }) {
  console.log(`\n[${label}] Searching: ${keyword}`)
  console.log(`  URL: ${url}`)

  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await delay(4000)

  console.log(`  Scrolling to load all cards...`)
  await autoScroll(page)
  await delay(2000)

  const rawLinks = await collectJobLinks(page)
  const jobLinks = [...new Set(rawLinks.map(getDirectLink))].filter(Boolean)
  console.log(`  ${jobLinks.length} job links found`)

  if (jobLinks.length === 0) {
    console.log('  No links found — page HTML may have changed.')
    return
  }

  for (let i = 0; i < jobLinks.length; i++) {
    const link = jobLinks[i]
    console.log(`  [${i + 1}/${jobLinks.length}] ${link}`)

    try {
      await page.goto(link, { waitUntil: 'domcontentloaded' })
      await delay(2500)

      // Dismiss any leftover modal
      await page.evaluate(() => {
        const btns = [...document.querySelectorAll('button')]
        const no = btns.find(b => b.textContent.trim() === 'No')
        if (no) no.click()
      }).catch(() => {})

      const jobData = await scrapeJobDetail(page)

      if (!jobData.jobTitle) {
        console.log('    No title — skipping.')
        continue
      }

      const jobRecord = {
        title:        jobData.jobTitle,
        company:      jobData.company,
        companyLink:  jobData.companyLink,
        companyImage: jobData.companyImage,
        posterImage:  jobData.posterImage,
        place:        jobData.place,
        jobLink:      link,
        applyLink:    jobData.applyLink,
        lastDate:     jobData.lastDate,
        keyword,
        source: 'linkedin',
      }
      if (jobType === 'internship') {
        await upsertInternshipJob(jobRecord)
      } else {
        await upsertWalkInJob(jobRecord)
      }

      const posterNote = jobData.posterImage && jobData.posterImage !== jobData.companyImage
        ? ' [poster captured]'
        : ''
      console.log(`    Saved: "${jobData.jobTitle}" @ ${jobData.company || '?'}${posterNote}`)
    } catch (err) {
      console.log(`    Failed on ${link}: ${err.message}`)
    }

    await delay(2000)
  }
}

// ── Main ──────────────────────────────────────────────────────────
async function runWalkinScraper() {
  await connectDB()

  const browserOptions = { headless: false, defaultViewport: null }
  const executablePath = getBrowserExecutablePath()
  if (executablePath) {
    browserOptions.executablePath = executablePath
    console.log(`Browser: ${executablePath}`)
  }

  const browser = await puppeteer.launch(browserOptions)
  const page    = await browser.newPage()
  page.setDefaultNavigationTimeout(0)

  // Safety close timer
  const closeTimer = setTimeout(async () => {
    console.warn(`Time limit reached (${CLOSE_AFTER_MINUTES}min) — closing browser.`)
    if (!browser.isClosed()) await browser.close()
  }, CLOSE_AFTER_MINUTES * 60 * 1000)

  try {
    // Auth — reuse existing session or ask for login
    if (!fs.existsSync(AUTH_FILE)) {
      await waitForManualLogin(page)
    } else {
      await loadAuth(page)
    }

    // Clean expired jobs before adding new ones
    try {
      const [d1, d2] = await Promise.all([
        cleanupOldWalkInJobs(24),
        cleanupOldInternshipJobs(24),
      ])
      if (d1 + d2 > 0) console.log(`Cleanup: removed ${d1} walk-in, ${d2} internship expired jobs.`)
    } catch {}

    console.log(`\n--- Walk-in & Internship scrape ---`)
    console.log(`Walk-in keywords  : ${WALKIN_KEYWORDS.length}`)
    console.log(`Internship keywords: ${INTERNSHIP_KEYWORDS.length}`)
    console.log(`Locations : ${WALKIN_LOCATIONS.length}`)
    console.log('-----------------------------------\n')

    // ── Walk-in searches × locations ─────────────────────────────
    for (const keyword of WALKIN_KEYWORDS) {
      for (const location of WALKIN_LOCATIONS) {
        const params = new URLSearchParams({ keywords: keyword, f_TPR: 'r86400', location })
        const url = `https://www.linkedin.com/jobs/search/?${params.toString()}`
        await scrapeCategory(browser, page, { label: 'WALK-IN', url, jobType: 'walk-in', keyword })
        await delay(1500)
      }
    }

    // ── Internship searches × locations ──────────────────────────
    for (const keyword of INTERNSHIP_KEYWORDS) {
      for (const location of WALKIN_LOCATIONS) {
        const params = new URLSearchParams({ keywords: keyword, f_JT: 'I', f_TPR: 'r604800', location })
        const url = `https://www.linkedin.com/jobs/search/?${params.toString()}`
        await scrapeCategory(browser, page, { label: 'INTERNSHIP', url, jobType: 'internship', keyword })
        await delay(1500)
      }
    }

    console.log('\nWalk-in & Internship scraper finished successfully!')
  } catch (err) {
    console.error('Scraper error:', err)
    throw err
  } finally {
    clearTimeout(closeTimer)
    if (!browser.isClosed()) await browser.close()
  }
}

// ── Entry point ───────────────────────────────────────────────────
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runWalkinScraper().catch(err => {
    console.error('Scraper terminated:', err)
    process.exit(1)
  })
}

export { runWalkinScraper }
