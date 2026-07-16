/**
 * naukriScraper.js
 * ─────────────────────────────────────────────────────────────────
 * Scrapes Naukri.com for jobs and saves directly to MongoDB.
 *
 * - Reuses session cookies from nokery/cookies.json
 * - If session expires → opens Naukri login page and waits for you
 * - Reads data from Naukri's __NEXT_DATA__ JSON (no clicking needed)
 * - Captures company logo + apply link without clicking the button
 * - Saves to the same MongoDB jobs collection as the LinkedIn scrapers
 *
 * Run: node Backend/scraper/naukriScraper.js
 */

import dotenv  from 'dotenv'
import fs      from 'fs'
import path    from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'
import { connectDB }                              from '../src/config/db.js'
import { upsertJob, cleanupOldJobs }              from '../src/modules/jobs/jobs.service.js'
import { upsertWalkInJob, cleanupOldWalkInJobs }  from '../src/modules/walkin/walkin.service.js'
import { upsertInternshipJob, cleanupOldInternshipJobs } from '../src/modules/internship/internship.service.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

// ── Config ────────────────────────────────────────────────────────
// Cookie file is in the nokery subfolder (reuse existing session)
const COOKIE_FILE = path.join(__dirname, 'nokery', 'cookies.json')
const CLOSE_AFTER_MINUTES = Number(process.env.SCRAPER_CLOSE_AFTER_MINUTES) || 120

// Keywords — override via NAUKRI_KEYWORDS env var (comma-separated)
const KEYWORDS = process.env.NAUKRI_KEYWORDS
  ? process.env.NAUKRI_KEYWORDS.split(',').map(k => k.trim()).filter(Boolean)
  : [
      'software developer',
      'software engineer',
      'node js developer',
      'react developer',
      'java developer',
      'python developer',
      'full stack developer',
      'frontend developer',
      'backend developer',
      'data analyst',
      'devops engineer',
      'android developer',
      'php developer',
      'dot net developer',
      'ui ux designer',
    ]

// Indian locations — override via NAUKRI_LOCATIONS env var (comma-separated)
const LOCATIONS = process.env.NAUKRI_LOCATIONS
  ? process.env.NAUKRI_LOCATIONS.split(',').map(l => l.trim()).filter(Boolean)
  : [
      // Tamil Nadu
      'chennai',
      'coimbatore',
      'madurai',
      'trichy',
      'salem',
      'tirunelveli',
      'vellore',
      'erode',
      'tiruppur',
      'pondicherry',
      // Karnataka
      'bangalore',
      'mysore',
      'mangalore',
      // Andhra & Telangana
      'hyderabad',
      'visakhapatnam',
      'vijayawada',
      // Maharashtra
      'mumbai',
      'pune',
      'nagpur',
      // Delhi NCR
      'delhi',
      'noida',
      'gurgaon',
      // Other metros
      'kolkata',
      'ahmedabad',
      'jaipur',
      'kochi',
      'trivandrum',
      // Remote
      'remote',
    ]

// Max job links to visit per keyword+location combo
const MAX_PER_COMBO = Number(process.env.NAUKRI_MAX_PER_COMBO) || 8

const delay = ms => new Promise(r => setTimeout(r, ms))

// ── Browser path ──────────────────────────────────────────────────
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

// ── Cookie helpers ────────────────────────────────────────────────
async function saveCookies(page) {
  const cookies = await page.cookies()
  fs.mkdirSync(path.dirname(COOKIE_FILE), { recursive: true })
  fs.writeFileSync(COOKIE_FILE, JSON.stringify(cookies, null, 2))
  console.log('  Session cookies saved.')
}

async function loadCookies(page) {
  if (!fs.existsSync(COOKIE_FILE)) return false
  try {
    const cookies = JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf-8'))
    if (cookies?.length) {
      await page.setCookie(...cookies)
      return true
    }
  } catch {}
  return false
}

async function isLoggedIn(page) {
  return page.evaluate(() => {
    // Naukri shows a profile avatar / logout link when logged in
    return (
      !!document.querySelector('a[href*="logout"]') ||
      !!document.querySelector('div.nI-gNb-bar__right span.nI-gNb-bar__login') === false ||
      !!document.querySelector('.nI-gNb-bar__right a[href*="profile"]')
    )
  })
}

// ── Manual login (waits until you log in and reach Naukri homepage) ──
async function waitForManualLogin(page) {
  await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'domcontentloaded' })
  await delay(2000)

  console.log('\n========================================')
  console.log('  Please sign in to Naukri.com now.')
  console.log('  Scraper is waiting...')
  console.log('  It will continue once you are logged in.')
  console.log('========================================\n')

  // Wait until the URL leaves the login page (redirect to home/feed)
  await page.waitForFunction(
    () => !window.location.href.includes('/nlogin/'),
    { timeout: 0, polling: 2000 }
  )

  console.log('  Login detected! Settling...')
  await delay(4000)
  await saveCookies(page)
  console.log('  Starting Naukri scraper...\n')
}

// ── Auto-scroll to lazy-load all job cards ────────────────────────
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let total = 0
      const timer = setInterval(() => {
        window.scrollBy(0, 500)
        total += 500
        if (total >= document.body.scrollHeight) { clearInterval(timer); resolve() }
      }, 500)
    })
  })
}

// ── Collect job links from a Naukri search results page ──────────
async function collectJobLinks(page) {
  return page.evaluate(() => {
    const links = new Set()

    // Strategy 1: __NEXT_DATA__ JSON (most reliable — doesn't depend on CSS classes)
    try {
      const raw = document.querySelector('#__NEXT_DATA__')?.textContent
      if (raw) {
        const nd = JSON.parse(raw)
        // Naukri stores job list at various paths across versions
        const jobList =
          nd?.props?.pageProps?.jobList ||
          nd?.props?.pageProps?.data?.jobList ||
          nd?.props?.pageProps?.srp?.jobList ||
          nd?.props?.pageProps?.jobs ||
          null
        if (Array.isArray(jobList)) {
          for (const job of jobList) {
            const url = job?.jobId
              ? `https://www.naukri.com/${job.slug || job.jobTitle?.toLowerCase().replace(/\s+/g,'-')}-${job.jobId}`
              : job?.jdURL || job?.url || job?.jobUrl || ''
            if (url) links.add(url)
          }
        }
      }
    } catch {}

    // Strategy 2: direct link anchors with job URL patterns
    document.querySelectorAll('a[href*="/job-listings-"]').forEach(a => {
      if (a.href) links.add(a.href)
    })
    // Strategy 3: older Naukri card classes
    document.querySelectorAll('.srp-jobtuple-wrapper a.title, article.jobTuple a.title').forEach(a => {
      if (a.href) links.add(a.href)
    })
    // Strategy 4: any Naukri domain link with -jd- in path
    document.querySelectorAll('a[href*="naukri.com"][href*="-jd-"]').forEach(a => {
      if (a.href) links.add(a.href)
    })
    // Strategy 5: broad anchor sweep — any Naukri job detail URL pattern
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.href || ''
      if (
        href.includes('naukri.com') &&
        /\d{6,}/.test(href) &&          // job IDs are numeric (6+ digits)
        !href.includes('/company/') &&
        !href.includes('/search/') &&
        !href.includes('/jobs?')
      ) {
        links.add(href)
      }
    })

    return [...links]
  })
}

// ── Scrape one Naukri job detail page ────────────────────────────
async function scrapeNaukriJob(page) {
  // Wait for the job title (h1) to appear
  await page.waitForFunction(
    () => {
      const h1 = document.querySelector('h1')
      return h1 && h1.innerText && h1.innerText.trim().length > 2
    },
    { timeout: 15000, polling: 500 }
  ).catch(() => {})

  // Extra wait for lazy-loaded images
  await delay(1200)

  return page.evaluate(() => {
    // ── 1. Try Naukri's __NEXT_DATA__ JSON (most reliable) ──────
    let nd = null
    try {
      const raw = document.querySelector('#__NEXT_DATA__')?.textContent
      if (raw) {
        const parsed = JSON.parse(raw)
        // Try multiple paths Naukri uses across versions
        nd =
          parsed?.props?.pageProps?.jobDetails ||
          parsed?.props?.pageProps?.jobDetail  ||
          parsed?.props?.pageProps?.jdData     ||
          parsed?.props?.pageProps?.data?.jobDetails ||
          null
      }
    } catch {}

    // ── Title ────────────────────────────────────────────────────
    const jobTitle =
      nd?.title ||
      nd?.jobTitle ||
      document.querySelector('h1.jd-header-title')?.innerText?.trim() ||
      document.querySelector('h1[class*="jd-header"]')?.innerText?.trim() ||
      document.querySelector('h1')?.innerText?.trim() ||
      ''

    // ── Company ──────────────────────────────────────────────────
    const companyAnchor =
      document.querySelector('.jd-header-comp-name a') ||
      document.querySelector('a.comp-name') ||
      document.querySelector('[class*="header-comp-name"] a') ||
      document.querySelector('a[href*="/company/"]')

    const company =
      nd?.companyName ||
      companyAnchor?.innerText?.trim() ||
      document.querySelector('.jd-header-comp-name')?.innerText?.trim() ||
      ''

    const companyLink = companyAnchor?.href || nd?.companyUrl || ''

    // ── Company logo ─────────────────────────────────────────────
    const logoImg =
      document.querySelector('img.companyLogo') ||
      document.querySelector('img[class*="companyLogo"]') ||
      document.querySelector('img[class*="comp-logo"]') ||
      document.querySelector('.company-logo img') ||
      document.querySelector('img[alt*="logo" i]')

    const companyImage =
      nd?.companyLogo ||
      logoImg?.getAttribute('data-src') ||
      logoImg?.src ||
      ''

    // ── Location ─────────────────────────────────────────────────
    const place =
      nd?.placeholders?.find(p => p.type === 'location')?.label ||
      nd?.jobLocations?.map(l => l.label).join(', ') ||
      document.querySelector('.styles_jhc__location__W_pVs')?.innerText?.trim() ||
      document.querySelector('[class*="location"]')?.innerText?.trim() ||
      document.querySelector('.locWdth')?.innerText?.trim() ||
      ''

    // ── Experience ───────────────────────────────────────────────
    const experience =
      nd?.experienceText ||
      document.querySelector('.styles_jhc__exp__k_giM')?.innerText?.trim() ||
      document.querySelector('[class*="exp"]')?.innerText?.trim() ||
      ''

    // ── Posted date ──────────────────────────────────────────────
    const lastDate =
      nd?.footerPlaceholderLabel ||
      document.querySelector('.styles_jhc__posting-dt__fVmMf time')?.innerText?.trim() ||
      document.querySelector('span[class*="posting"]')?.innerText?.trim() ||
      document.querySelector('time')?.getAttribute('datetime') ||
      ''

    // ── Apply link ───────────────────────────────────────────────
    // Naukri's "Apply on company website" button — read href WITHOUT clicking
    let applyLink = ''

    // Direct anchor with company-site href
    const compSiteBtn = document.querySelector('#company-site-button')
    if (compSiteBtn) {
      if (compSiteBtn.tagName === 'A' && compSiteBtn.href) {
        applyLink = compSiteBtn.href
      }
    }

    // Try other apply anchors
    if (!applyLink) {
      const applyAnchor =
        document.querySelector('a[class*="apply-button"]') ||
        document.querySelector('a.apply-btn') ||
        document.querySelector('a[id*="apply"]')
      if (applyAnchor?.href) applyLink = applyAnchor.href
    }

    // Try __NEXT_DATA__ for externalApplyLink
    if (!applyLink && nd) {
      applyLink =
        nd?.externalApplyLink ||
        nd?.jdFooter?.externalApplyLink ||
        nd?.applyLink ||
        ''
    }

    // Fallback: use the current Naukri job page URL
    if (!applyLink) applyLink = window.location.href

    // ── Poster image ─────────────────────────────────────────────
    // Look for a promotional banner/image inside the job description
    let posterImage = ''
    const descImgs = [
      ...document.querySelectorAll('.job-desc img, [class*="job-desc"] img, [class*="jd-desc"] img')
    ]
    for (const img of descImgs) {
      const src = img.getAttribute('data-src') || img.src || ''
      if (src && !src.includes('pixel') && !src.includes('ghost')) {
        posterImage = src
        break
      }
    }
    if (!posterImage) posterImage = companyImage

    return {
      jobTitle, company, companyLink, companyImage,
      place, experience, lastDate, applyLink, posterImage,
    }
  })
}

// ── Scrape one keyword + location combination ─────────────────────
async function scrapeCombo(browser, page, keyword, location) {
  // Slug: replace spaces with hyphens only — never use encodeURIComponent for slug URLs
  const slug = keyword.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
  const loc  = location.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')

  // Main Naukri jobs URL (NOT Naukri Campus — no experience=0 param that routes to Campus)
  const searchUrl = loc === 'remote'
    ? `https://www.naukri.com/${slug}-jobs?wfhType=1`
    : `https://www.naukri.com/${slug}-jobs-in-${loc}`

  console.log(`\n[NAUKRI] ${keyword} | ${location}`)
  console.log(`  URL: ${searchUrl}`)

  try {
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 })
  } catch {
    console.log('  Navigation timeout — skipping.')
    return
  }

  // Wait for React hydration — Naukri's SSR pages need extra time
  await delay(7000)

  // Diagnostic: log title + what __NEXT_DATA__ keys look like
  const diag = await page.evaluate(() => {
    let ndKeys = ''
    let jobCount = 0
    try {
      const raw = document.querySelector('#__NEXT_DATA__')?.textContent
      if (raw) {
        const nd = JSON.parse(raw)
        ndKeys = JSON.stringify(Object.keys(nd?.props?.pageProps || {}))
        const jobList =
          nd?.props?.pageProps?.jobList ||
          nd?.props?.pageProps?.data?.jobList ||
          nd?.props?.pageProps?.srp?.jobList ||
          nd?.props?.pageProps?.jobs
        jobCount = Array.isArray(jobList) ? jobList.length : -1
      }
    } catch {}
    return {
      title: document.title,
      ndKeys,
      jobCount,
      bodyLen: document.body?.innerText?.length || 0,
      hasArticle: !!document.querySelector('article'),
      hasJobLink: !!document.querySelector('a[href*="/job-listings-"]'),
    }
  })
  console.log(`  [diag] title="${diag.title.slice(0,60)}" body=${diag.bodyLen} ndKeys=${diag.ndKeys} ndJobs=${diag.jobCount} art=${diag.hasArticle} jLink=${diag.hasJobLink}`)

  // Detect Naukri Campus redirect (fresher section — wrong site)
  const currentUrl = page.url()
  if (currentUrl.includes('campus') || diag.title.toLowerCase().includes('campus')) {
    console.log('  Redirected to Naukri Campus — skipping (wrong section).')
    return
  }

  const hasCards = diag.jobCount > 0 || diag.hasArticle || diag.hasJobLink || (diag.bodyLen > 5000 && diag.jobCount === -1)
  if (!hasCards) {
    console.log('  No jobs found — page blocked or captcha required.')
    return
  }

  await autoScroll(page)
  await delay(1500)

  const rawLinks = await collectJobLinks(page)
  const jobLinks = [...new Set(rawLinks)].filter(Boolean).slice(0, MAX_PER_COMBO)
  console.log(`  ${jobLinks.length} job links found`)

  if (jobLinks.length === 0) return

  for (let i = 0; i < jobLinks.length; i++) {
    const link = jobLinks[i]
    console.log(`  [${i + 1}/${jobLinks.length}] ${link}`)

    try {
      await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await delay(2500)

      const jobData = await scrapeNaukriJob(page)

      if (!jobData.jobTitle) {
        console.log('    No title — skipping.')
        continue
      }

      await upsertJob({
        title:        jobData.jobTitle,
        company:      jobData.company,
        companyLink:  jobData.companyLink,
        companyImage: jobData.companyImage,
        posterImage:  jobData.posterImage,
        place:        jobData.place || location,
        jobLink:      link,
        applyLink:    jobData.applyLink,
        lastDate:     jobData.lastDate,
        keyword:      keyword,
        jobType:      '',
        source:       'naukri',
      })

      console.log(`    Saved: "${jobData.jobTitle}" @ ${jobData.company || '?'} [${jobData.place || location}]`)
    } catch (err) {
      console.log(`    Error on ${link}: ${err.message}`)
    }

    // Polite delay between jobs to avoid rate-limiting
    await delay(2500)
  }
}

// ─────────────────────────────────────────────────────────────────
// Special category config — Urgent Hiring / Internship / Walk-in
// Each entry has: label, slug (used in Naukri URL), jobType (stored in DB)
// ─────────────────────────────────────────────────────────────────
const SPECIAL_CATEGORIES = [
  {
    label:   'Urgent Hiring',
    slugs:   ['urgent-jobs', 'urgent-hiring'],   // try both Naukri slugs
    jobType: 'urgent',
  },
  {
    label:   'Internship',
    slugs:   ['internship-jobs', 'intern-jobs'],
    jobType: 'internship',
  },
  {
    label:   'Walk-in',
    slugs:   ['walkin-jobs', 'walk-in-jobs'],
    jobType: 'walk-in',
  },
]

// Locations used for special category scraping (top cities — keeps runtime manageable)
const SPECIAL_LOCATIONS = [
  'chennai', 'coimbatore', 'madurai', 'trichy', 'salem', 'tirunelveli',
  'vellore', 'erode', 'tiruppur', 'pondicherry',
  'bangalore', 'hyderabad', 'mumbai', 'pune', 'delhi', 'noida', 'kolkata', 'kochi',
]

// ── Scrape one special-category + location ────────────────────────
async function scrapeSpecialCategory(page, category, location) {
  const loc = location.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')

  // Try each slug variant until one returns results
  let jobLinks = []
  let usedUrl  = ''

  for (const slug of category.slugs) {
    const url = loc === 'remote'
      ? `https://www.naukri.com/${slug}?wfhType=1`
      : `https://www.naukri.com/${slug}-in-${loc}`

    console.log(`\n[${category.label.toUpperCase()}] ${location}`)
    console.log(`  URL: ${url}`)

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    } catch {
      console.log('  Timeout — trying next slug.')
      continue
    }
    await delay(6000)

    const diag = await page.evaluate(() => {
      return {
        title:      document.title.slice(0, 60),
        bodyLen:    document.body?.innerText?.length || 0,
        hasJobLink: !!document.querySelector('a[href*="/job-listings-"]'),
        isBlocked:  document.title.toLowerCase().includes('access denied') ||
                    document.title.toLowerCase().includes('403') ||
                    document.body?.innerText?.includes('are you a robot'),
      }
    })
    console.log(`  [diag] title="${diag.title}" body=${diag.bodyLen} jLink=${diag.hasJobLink}`)

    if (diag.isBlocked) {
      console.log('  Blocked — trying next slug.')
      continue
    }
    if (page.url().includes('campus') || diag.title.toLowerCase().includes('campus')) {
      console.log('  Naukri Campus redirect — trying next slug.')
      continue
    }

    const hasContent = diag.hasJobLink || diag.bodyLen > 4000
    if (!hasContent) {
      console.log('  No content — trying next slug.')
      continue
    }

    await autoScroll(page)
    await delay(1500)

    const raw = await collectJobLinks(page)
    jobLinks = [...new Set(raw)].filter(Boolean).slice(0, MAX_PER_COMBO)
    usedUrl  = url

    if (jobLinks.length > 0) break
    console.log('  0 links from this slug — trying next.')
  }

  if (jobLinks.length === 0) {
    console.log(`  No jobs found for [${category.label}] in ${location}.`)
    return
  }

  console.log(`  ${jobLinks.length} job links found`)

  for (let i = 0; i < jobLinks.length; i++) {
    const link = jobLinks[i]
    console.log(`  [${i + 1}/${jobLinks.length}] ${link}`)

    try {
      await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await delay(2500)

      const jobData = await scrapeNaukriJob(page)
      if (!jobData.jobTitle) { console.log('    No title — skipping.'); continue }

      const jobRecord = {
        title:        jobData.jobTitle,
        company:      jobData.company,
        companyLink:  jobData.companyLink,
        companyImage: jobData.companyImage,
        posterImage:  jobData.posterImage,
        place:        jobData.place || location,
        jobLink:      link,
        applyLink:    jobData.applyLink,
        lastDate:     jobData.lastDate,
        keyword:      category.label.toLowerCase(),
        source:       'naukri',
      }

      if (category.jobType === 'walk-in') {
        await upsertWalkInJob(jobRecord)
      } else if (category.jobType === 'internship') {
        await upsertInternshipJob(jobRecord)
      } else {
        // urgent and any other type stays in main jobs collection
        await upsertJob({ ...jobRecord, jobType: category.jobType })
      }

      console.log(`    Saved [${category.jobType}]: "${jobData.jobTitle}" @ ${jobData.company || '?'}`)
    } catch (err) {
      console.log(`    Error: ${err.message}`)
    }
    await delay(2500)
  }
}

// ── Main ──────────────────────────────────────────────────────────
async function runNaukriScraper() {
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

  // Set a realistic user-agent so Naukri doesn't detect headless
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  )

  // Safety close timer
  const closeTimer = setTimeout(async () => {
    console.warn(`Time limit reached (${CLOSE_AFTER_MINUTES}min) — closing.`)
    if (!browser.isClosed()) await browser.close()
  }, CLOSE_AFTER_MINUTES * 60 * 1000)

  try {
    // Load existing cookies
    const hasCookies = await loadCookies(page)
    console.log(hasCookies ? 'Loaded existing Naukri session.' : 'No saved session found.')

    // Check if still logged in
    await page.goto('https://www.naukri.com', { waitUntil: 'domcontentloaded' })
    await delay(3000)

    const loggedIn = await isLoggedIn(page)

    if (!loggedIn) {
      // Naukri doesn't actually require login to scrape job listings.
      // But if you have an account, login improves data quality.
      // Comment the next line out if you don't have a Naukri account.
      console.log('Not logged in — proceeding without login (Naukri allows public job viewing).')
      // await waitForManualLogin(page)   // Uncomment this to force login
    } else {
      console.log('Naukri session is active.')
      await saveCookies(page)
    }

    // Clean expired jobs before adding new ones
    try {
      const [d1, d2, d3] = await Promise.all([
        cleanupOldJobs(24),
        cleanupOldWalkInJobs(24),
        cleanupOldInternshipJobs(24),
      ])
      console.log(`Cleanup: jobs=${d1}, walk-in=${d2}, internship=${d3} expired removed.`)
    } catch {}

    console.log('\n--- Starting Naukri scrape ---')
    console.log(`Keywords  : ${KEYWORDS.length}`)
    console.log(`Locations : ${LOCATIONS.length}`)
    console.log(`Max/combo : ${MAX_PER_COMBO}`)
    console.log('-----------------------------\n')

    // ── 1. Keyword × location combos ─────────────────────────────
    for (const keyword of KEYWORDS) {
      for (const location of LOCATIONS) {
        await scrapeCombo(browser, page, keyword, location)
        await delay(3000)
      }
    }

    // ── 2. Special categories: Urgent Hiring / Internship / Walk-in ──
    console.log('\n--- Special categories (Urgent / Internship / Walk-in) ---\n')
    for (const category of SPECIAL_CATEGORIES) {
      for (const location of SPECIAL_LOCATIONS) {
        await scrapeSpecialCategory(page, category, location)
        await delay(3000)
      }
    }

    console.log('\nNaukri scraper finished successfully!')
  } catch (err) {
    console.error('Naukri scraper error:', err)
    throw err
  } finally {
    clearTimeout(closeTimer)
    if (!browser.isClosed()) await browser.close()
  }
}

// ── Entry point ───────────────────────────────────────────────────
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runNaukriScraper().catch(err => {
    console.error('Scraper terminated:', err)
    process.exit(1)
  })
}

export { runNaukriScraper }
