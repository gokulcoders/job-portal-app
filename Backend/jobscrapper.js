// const puppeteer = require("puppeteer");
// const fs = require("fs");

// const AUTH_FILE = "auth.json";
// const OUTPUT_FILE = "jobs.json";

// function delay(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// // ================= SAVE AUTH =================
// async function saveAuth(page) {
//   const cookies = await page.cookies();

//   const localStorageData = await page.evaluate(() => {
//     let data = {};
//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       data[key] = localStorage.getItem(key);
//     }
//     return data;
//   });

//   fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies, localStorageData }, null, 2));
//   console.log("✅ Auth saved");
// }

// // ================= LOAD AUTH =================
// async function loadAuth(page) {
//   const authData = JSON.parse(fs.readFileSync(AUTH_FILE));

//   await page.setCookie(...authData.cookies);

//   await page.goto("https://www.linkedin.com", { waitUntil: "domcontentloaded" });

//   await page.evaluate((data) => {
//     for (const key in data) {
//       localStorage.setItem(key, data[key]);
//     }
//   }, authData.localStorageData);

//   await page.reload({ waitUntil: "domcontentloaded" });
//   console.log("✅ Logged in using saved session");
// }

// // ================= MAIN =================
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//   });

//   const page = await browser.newPage();
//   page.setDefaultNavigationTimeout(0);

//   // ---------- LOGIN ----------
//   if (!fs.existsSync(AUTH_FILE)) {
//     console.log("🔐 First time login required...");
//     await page.goto("https://www.linkedin.com/login", { waitUntil: "domcontentloaded" });
//     console.log("👉 Please login manually");
//     await page.waitForSelector("nav", { timeout: 0 });
//     console.log("✅ Login confirmed");
//     await saveAuth(page);
//   } else {
//     await loadAuth(page);
//   }

//   // ---------- JOB SEARCH ----------
//   const searchUrl =
//     "https://www.linkedin.com/jobs/search/?f_TPR=r86400&keywords=nodejs";

//   console.log("🔎 Opening job search...");
//   await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
//   await delay(8000);

//   // ---------- SCROLL ----------
//   await page.evaluate(async () => {
//     await new Promise((resolve) => {
//       let totalHeight = 0;
//       const distance = 600;
//       const timer = setInterval(() => {
//         window.scrollBy(0, distance);
//         totalHeight += distance;
//         if (totalHeight >= document.body.scrollHeight) {
//           clearInterval(timer);
//           resolve();
//         }
//       }, 800);
//     });
//   });

//   // ---------- GET JOB LINKS ----------
//   const jobLinks = await page.evaluate(() => {
//     return Array.from(document.querySelectorAll("a.job-card-container__link"))
//       .map(a => a.href);
//   });

//   console.log("📌 Found jobs:", jobLinks.length);

//   const results = [];

//   // ---------- OPEN EACH JOB ----------
//   for (const link of jobLinks.slice(0, 30)) {
//     console.log("➡ Opening:", link);
//     await page.goto(link, { waitUntil: "domcontentloaded" });
//     await delay(5000);

//     const jobData = await page.evaluate(() => {
//       const title = document.querySelector("h1")?.innerText || "";
//       const company =
//         document.querySelector(".job-details-jobs-unified-top-card__company-name a")
//           ?.innerText || "";

//       const posted =
//         document.querySelector(".job-details-jobs-unified-top-card__tertiary-description-container strong span")
//           ?.innerText || "";

//       const applyBtn =
//         document.querySelector("a.jobs-apply-button") ||
//         document.querySelector("button.jobs-apply-button");

//       let applyLink = "";
//       let applyType = "None";

//       if (applyBtn) {
//         if (applyBtn.tagName === "A") {
//           applyType = "External Apply";
//           applyLink = applyBtn.href;
//         } else {
//           applyType = "Easy Apply";
//           applyLink = "LinkedIn Easy Apply (no direct URL)";
//         }
//       }

//       return { title, company, posted, applyType, applyLink };
//     });

//     results.push({ url: link, ...jobData });
//     console.log(jobData);

//     await delay(3000);
//   }

//   // ---------- SAVE JSON ----------
//   fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
//   console.log("✅ Saved to jobs.json");

//   console.log("⏳ Browser will close in 10 minutes...");
//   setTimeout(async () => {
//     await browser.close();
//     process.exit(0);
//   }, 10 * 60 * 1000);
// })();


// const puppeteer = require("puppeteer");
// const fs = require("fs");

// const AUTH_FILE = "auth.json";
// const OUTPUT_FILE = "jobs.csv";

// function delay(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// // ================= SAVE AUTH =================
// async function saveAuth(page) {
//   const cookies = await page.cookies();

//   const localStorageData = await page.evaluate(() => {
//     let data = {};
//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       data[key] = localStorage.getItem(key);
//     }
//     return data;
//   });

//   fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies, localStorageData }, null, 2));
//   console.log("✅ Auth saved");
// }

// // ================= LOAD AUTH =================
// async function loadAuth(page) {
//   const authData = JSON.parse(fs.readFileSync(AUTH_FILE));

//   await page.setCookie(...authData.cookies);

//   await page.goto("https://www.linkedin.com", { waitUntil: "domcontentloaded" });

//   await page.evaluate((data) => {
//     for (const key in data) {
//       localStorage.setItem(key, data[key]);
//     }
//   }, authData.localStorageData);

//   await page.reload({ waitUntil: "domcontentloaded" });
//   console.log("✅ Logged in using saved session");
// }

// // ================= MAIN =================
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//   });

//   const page = await browser.newPage();
//   page.setDefaultNavigationTimeout(0);

//   // ---------- LOGIN ----------
//   if (!fs.existsSync(AUTH_FILE)) {
//     console.log("🔐 First time login required...");
//     await page.goto("https://www.linkedin.com/login", { waitUntil: "domcontentloaded" });
//     console.log("👉 Please login manually");
//     await page.waitForSelector("nav", { timeout: 0 });
//     console.log("✅ Login confirmed");
//     await saveAuth(page);
//   } else {
//     await loadAuth(page);
//   }

//   // ---------- JOB SEARCH ----------
//   const searchUrl =
//     "https://www.linkedin.com/jobs/search/?f_TPR=r86400&keywords=nodejs";

//   console.log("🔎 Opening job search...");
//   await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
//   await delay(8000);

//   // ---------- SCROLL ----------
//   await page.evaluate(async () => {
//     await new Promise((resolve) => {
//       let totalHeight = 0;
//       const distance = 600;
//       const timer = setInterval(() => {
//         window.scrollBy(0, distance);
//         totalHeight += distance;
//         if (totalHeight >= document.body.scrollHeight) {
//           clearInterval(timer);
//           resolve();
//         }
//       }, 800);
//     });
//   });

//   // ---------- GET JOB LINKS ----------
//   const jobLinks = await page.evaluate(() => {
//     return Array.from(document.querySelectorAll("a.job-card-container__link"))
//       .map(a => a.href);
//   });

//   console.log("📌 Found jobs:", jobLinks.length);

//   const results = [];

//   // ---------- OPEN EACH JOB ----------
//   for (const link of jobLinks.slice(0, 30)) {
//     console.log("➡ Opening:", link);
//     await page.goto(link, { waitUntil: "domcontentloaded" });
//     await delay(5000);

//     const jobData = await page.evaluate(() => {
//       const company =
//         document.querySelector(".job-details-jobs-unified-top-card__company-name a")
//           ?.innerText || "";

//       const place =
//         document.querySelector(".job-details-jobs-unified-top-card__tertiary-description-container span")
//           ?.innerText || "";

//       const lastDate =
//         document.querySelector(".job-details-jobs-unified-top-card__tertiary-description-container strong span")
//           ?.innerText || "";

//       return { company, place, lastDate };
//     });

//     results.push({
//       company: jobData.company,
//       place: jobData.place,
//       link: link,
//       last_date: jobData.lastDate
//     });

//     console.log(jobData);
//     await delay(3000);
//   }

//   // ---------- SAVE CSV ----------
//   let csv = "company_name,place,link,last_date\n";

//   results.forEach(job => {
//     csv += `"${job.company}","${job.place}","${job.link}","${job.last_date}"\n`;
//   });

//   fs.writeFileSync(OUTPUT_FILE, csv);
//   console.log("✅ Saved to jobs.csv");

//   console.log("⏳ Browser will close in 10 minutes...");
//   setTimeout(async () => {
//     await browser.close();
//     process.exit(0);
//   }, 10 * 60 * 1000);
// })();

const puppeteer = require("puppeteer");
const fs = require("fs");
const { saveJob, closeDb } = require("./db.js");

const AUTH_FILE = "auth.json";
const KEYWORDS = ["node", "java", "javascript"];
const CLOSE_AFTER_MINUTES = 20;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Strip LinkedIn's tracking query params (eBP/refId/trackingId/trk) so the
// same job always resolves to the same URL across scraper runs — this is
// what we dedupe on in MongoDB.
function getDirectLink(url) {
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    return url.split("?")[0];
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
  ].filter(Boolean);

  for (const executablePath of candidates) {
    if (fs.existsSync(executablePath)) {
      return executablePath;
    }
  }

  return null;
}

// ================= SAVE AUTH =================
async function saveAuth(page) {
  const cookies = await page.cookies();

  const localStorageData = await page.evaluate(() => {
    let data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    return data;
  });

  fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies, localStorageData }, null, 2));
  console.log("✅ Auth saved");
}

// ================= LOAD AUTH =================
async function loadAuth(page) {
  const authData = JSON.parse(fs.readFileSync(AUTH_FILE));

  await page.setCookie(...authData.cookies);
  await page.goto("https://www.linkedin.com", { waitUntil: "domcontentloaded" });

  await page.evaluate((data) => {
    for (const key in data) {
      localStorage.setItem(key, data[key]);
    }
  }, authData.localStorageData);

  await page.reload({ waitUntil: "domcontentloaded" });
  console.log("✅ Logged in using saved session");
}

// ================= SCRAPE FUNCTION =================
async function scrapeKeyword(page, keyword) {
  console.log(`\n🔍 Searching keyword: ${keyword}`);

  const OUTPUT_FILE = `${keyword}.csv`;

  let csvHeader = "company_name,company_image,place,job_title,company_link,job_link,apply_link,last_date\n";
  fs.writeFileSync(OUTPUT_FILE, csvHeader);

  const searchUrl = `https://www.linkedin.com/jobs/search/?f_TPR=r86400&keywords=${keyword}`;
  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
  await delay(8000);

  console.log("📜 Scrolling...");
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 600;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 800);
    });
  });

  console.log("🔗 Collecting job links...");
  const jobLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a.job-card-container__link"))
      .map(a => a.href);
  });

  console.log(`📌 ${jobLinks.length} jobs found for ${keyword}`);

  for (let i = 0; i < jobLinks.length; i++) {
    const link = jobLinks[i];
    console.log(`➡ [${i + 1}/${jobLinks.length}] Opening job`);

    await page.goto(link, { waitUntil: "domcontentloaded" });
    await delay(6000);

    const directLink = getDirectLink(link);

    const jobData = await page.evaluate(() => {
      const companyAnchor = document.querySelector('a[href*="/company/"]');

      const company = companyAnchor?.innerText.trim() || "";
      const companyLink = companyAnchor?.href || "";

      // Confirmed against LinkedIn's live markup: the logo is
      // img.org-top-card-primary-content__logo, a sibling of the anchor
      // (not nested inside it). Some lazy images only populate the real
      // URL in data-delayed-url until scrolled into view, so check that too.
      const logoImg =
        document.querySelector("img.org-top-card-primary-content__logo") ||
        document.querySelector('img[alt*="logo" i]') ||
        companyAnchor?.querySelector("img") ||
        document.querySelector(".job-details-jobs-unified-top-card__company-logo img") ||
        document.querySelector("img.artdeco-entity-image") ||
        document.querySelector('img[class*="EntityPhoto"]');

      const companyImage =
        logoImg?.getAttribute("data-delayed-url") ||
        logoImg?.src ||
        "";

      const jobTitle =
        document.querySelector("h1")?.innerText || "";

      const place =
        document.querySelector("span.jobs-unified-top-card__bullet")?.innerText || "";

      const lastDate =
        document.querySelector("time")?.innerText || "";

      const applyLink =
        document.querySelector('a[data-view-name="job-apply-button"]')?.href || "";

      return { company, companyLink, companyImage, jobTitle, place, lastDate, applyLink };
    });

    console.log("✅ Scraped:", jobData.jobTitle);

    const row = `"${jobData.company.replace(/"/g, '""')}",` +
                `"${jobData.companyImage}",` +
                `"${jobData.place.replace(/"/g, '""')}",` +
                `"${jobData.jobTitle.replace(/"/g, '""')}",` +
                `"${jobData.companyLink}",` +
                `"${directLink}",` +
                `"${jobData.applyLink}",` +
                `"${jobData.lastDate.replace(/"/g, '""')}"\n`;

    fs.appendFileSync(OUTPUT_FILE, row);
    console.log(`💾 Saved to ${OUTPUT_FILE}`);

    try {
      await saveJob({
        title: jobData.jobTitle,
        company: jobData.company,
        companyLink: jobData.companyLink,
        companyImage: jobData.companyImage,
        place: jobData.place,
        jobLink: directLink,
        applyLink: jobData.applyLink,
        lastDate: jobData.lastDate,
        keyword,
        source: "linkedin",
      });
      console.log("🗄️  Saved to MongoDB");
    } catch (err) {
      console.error("⚠️ Failed to save job to MongoDB:", err.message);
    }

    await delay(3000);
  }

  console.log(`✅ Finished keyword: ${keyword}`);
}

// ================= MAIN =================
(async () => {
  const browserOptions = {
    headless: false,
    defaultViewport: null,
  };

  const executablePath = getBrowserExecutablePath();
  if (executablePath) {
    browserOptions.executablePath = executablePath;
    console.log(`Launching browser from executable: ${executablePath}`);
  } else {
    console.warn("No local Chrome/Edge executable found. Puppeteer will attempt to launch its bundled browser.");
  }

  const browser = await puppeteer.launch(browserOptions);

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  // ---------- LOGIN ----------
  if (!fs.existsSync(AUTH_FILE)) {
    console.log("🔐 First time login required...");
    await page.goto("https://www.linkedin.com/login", { waitUntil: "domcontentloaded" });
    console.log("👉 Please login manually in browser");
    await page.waitForSelector("nav", { timeout: 0 });
    console.log("✅ Login confirmed");
    await saveAuth(page);
  } else {
    await loadAuth(page);
  }

  // ---------- LOOP KEYWORDS ----------
  for (const keyword of KEYWORDS) {
    await scrapeKeyword(page, keyword);
  }

  console.log(`⏳ Browser will close in ${CLOSE_AFTER_MINUTES} minutes...`);

  setTimeout(async () => {
    await browser.close();
    await closeDb();
    process.exit(0);
  }, CLOSE_AFTER_MINUTES * 60 * 1000);

})();
