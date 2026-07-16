// const puppeteer = require("puppeteer");
// const fs = require("fs");

// const LOGIN_URL = "https://www.naukri.com/nlogin/login";
// const JOB_URL =
//   "https://www.naukri.com/software-developer-jobs-in-coimbatore?k=software%20developer&l=coimbatore&experience=2&nignbevent_src=jobsearchDeskGNB";

// const EMAIL = "YOUR_EMAIL";
// const PASSWORD = "YOUR_PASSWORD";

// const COOKIE_PATH = "./cookies.json";

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//     args: ["--start-maximized"],
//   });

//   const page = await browser.newPage();

//   if (fs.existsSync(COOKIE_PATH)) {
//     console.log("✅ Loading saved session...");
//     const cookies = JSON.parse(fs.readFileSync(COOKIE_PATH, "utf-8"));
//     await page.setCookie(...cookies);
//   }

//   await page.goto("https://www.naukri.com", { waitUntil: "networkidle2" });

//   const isLoggedIn = await page.$('a[href*="logout"]');

//   if (!isLoggedIn) {
//     console.log("🔑 Logging in...");
//     await page.goto(LOGIN_URL, { waitUntil: "networkidle2" });

//     await page.type("#usernameField", EMAIL, { delay: 50 });
//     await page.type("#passwordField", PASSWORD, { delay: 50 });

//     await page.click("button[type='submit']");
//     await page.waitForNavigation({ waitUntil: "networkidle2" });

//     const cookies = await page.cookies();
//     fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
//     console.log("💾 Session saved!");
//   } else {
//     console.log("✅ Already logged in");
//   }

//   console.log("📄 Opening job search page...");
//   await page.goto(JOB_URL, { waitUntil: "networkidle2" });
// })();









// const EMAIL = "gokultesting60@gmail.com";
// const PASSWORD = "Gokul@123";




// const puppeteer = require("puppeteer");
// const fs = require("fs");

// const LOGIN_URL = "https://www.naukri.com/nlogin/login";
// const JOB_URL =
//   "https://www.naukri.com/software-developer-jobs-in-coimbatore?k=software%20developer&l=coimbatore&experience=2&nignbevent_src=jobsearchDeskGNB";

// const EMAIL = "gokultesting60@gmail.com";
// const PASSWORD = "Gokul@123";

// const COOKIE_PATH = "./cookies.json";

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//     args: ["--start-maximized"],
//   });

//   const page = await browser.newPage();

//   // 1️⃣ Load cookies if exists
//   if (fs.existsSync(COOKIE_PATH)) {
//     console.log("🍪 Loading cookies...");
//     const cookies = JSON.parse(fs.readFileSync(COOKIE_PATH, "utf-8"));
//     await page.setCookie(...cookies);
//   }

//   // 2️⃣ Go to homepage
//   await page.goto("https://www.naukri.com", { waitUntil: "networkidle2" });

//   // 3️⃣ Check if logged in (profile icon exists)
//   const isLoggedIn = await page.evaluate(() => {
//     return !!document.querySelector('a[href*="logout"], div[class*="profile"]');
//   });

//   if (!isLoggedIn) {
//     console.log("🔐 Session expired → Logging in...");

//     await page.goto(LOGIN_URL, { waitUntil: "networkidle2" });

//     // wait for inputs
//     await page.waitForSelector('input[type="text"], input[type="email"]', {
//       timeout: 20000,
//     });

//     await page.type('input[type="text"], input[type="email"]', EMAIL, {
//       delay: 50,
//     });

//     await page.type('input[type="password"]', PASSWORD, {
//       delay: 50,
//     });

//     await page.click('button[type="submit"]');

//     // wait (OTP if needed)
//     await page.waitForTimeout(15000);

//     // save new cookies
//     const cookies = await page.cookies();
//     fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
//     console.log("💾 New session saved");
//   } else {
//     console.log("✅ Session still valid → Skipping login");
//   }

//   // 4️⃣ Now safely open job page
//   console.log("📄 Opening job page...");
//   await page.goto(JOB_URL, { waitUntil: "networkidle2" });

// })();












// const puppeteer = require("puppeteer");
// const fs = require("fs");

// const LOGIN_URL = "https://www.naukri.com/nlogin/login";
// const JOB_URL =
//   "https://www.naukri.com/software-developer-jobs-in-coimbatore?k=software%20developer&l=coimbatore&experience=2&nignbevent_src=jobsearchDeskGNB";

// const EMAIL = "gokultesting60@gmail.com";
// const PASSWORD = "Gokul@123";

// const COOKIE_PATH = "./cookies.json";

// // ✅ delay helper (replaces waitForTimeout)
// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//     args: ["--start-maximized"],
//   });

//   const page = await browser.newPage();

//   // 🍪 Load cookies if exists
//   if (fs.existsSync(COOKIE_PATH)) {
//     const cookies = JSON.parse(fs.readFileSync(COOKIE_PATH, "utf-8"));
//     await page.setCookie(...cookies);
//     console.log("🍪 Cookies loaded");
//   }

//   // Go to homepage
//   await page.goto("https://www.naukri.com", { waitUntil: "networkidle2" });

//   // Check login
//   const isLoggedIn = await page.evaluate(() => {
//     return !!document.querySelector('a[href*="logout"], div[class*="profile"]');
//   });

//   if (!isLoggedIn) {
//     console.log("🔐 Logging in...");

//     await page.goto(LOGIN_URL, { waitUntil: "networkidle2" });

//     await page.waitForSelector('input[type="text"], input[type="email"]', {
//       timeout: 20000,
//     });

//     await page.type('input[type="text"], input[type="email"]', EMAIL, {
//       delay: 50,
//     });

//     await page.type('input[type="password"]', PASSWORD, {
//       delay: 50,
//     });

//     await page.click('button[type="submit"]');

//     // wait for OTP / redirect
//     await delay(15000);

//     const cookies = await page.cookies();
//     fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
//     console.log("💾 Cookies saved");
//   } else {
//     console.log("✅ Already logged in");
//   }

//   // 📄 Open job listing page
//   console.log("📄 Opening job page...");
//   await page.goto(JOB_URL, { waitUntil: "networkidle2" });

//   await page.waitForSelector(".srp-jobtuple-wrapper");

//   // 🔹 Get all job links from listing page
//   const jobLinks = await page.evaluate(() => {
//     return Array.from(
//       document.querySelectorAll(".srp-jobtuple-wrapper a.title")
//     ).map(a => a.href);
//   });

//   console.log("Jobs found:", jobLinks.length);

//   let results = [];

//   for (let i = 0; i < jobLinks.length; i++) {
//     console.log(`➡ Opening job ${i + 1}/${jobLinks.length}`);

//     const jobPage = await browser.newPage();
//     await jobPage.goto(jobLinks[i], { waitUntil: "networkidle2" });

//     // wait for content to load
//     await delay(3000);

//     const jobData = await jobPage.evaluate(() => {
//       const title = document.querySelector("h1")?.innerText || null;

//       const company =
//         document.querySelector(".styles_jd-header-comp-name__rv9j7")?.innerText ||
//         document.querySelector("a.comp-name")?.innerText ||
//         null;

//       const location =
//         document.querySelector(".styles_jhc__location__W_pVs")?.innerText ||
//         document.querySelector(".locWdth")?.innerText ||
//         null;

//       const experience =
//         document.querySelector(".styles_jhc__exp__k_giM")?.innerText || null;

//       const applyBtn =
//         document.querySelector("#company-site-button") ||
//         document.querySelector("a.styles_apply-button__uJI3A");

//       return {
//         title,
//         company,
//         location,
//         experience,
//         applyLink: applyBtn ? applyBtn.href || "exists (no href)" : null,
//         jobUrl: window.location.href,
//       };
//     });

//     results.push(jobData);
//     await jobPage.close();
//   }

//   // 💾 Save data
//   fs.writeFileSync("jobs.json", JSON.stringify(results, null, 2));
//   console.log("✅ All jobs saved to jobs.json");

//   await browser.close();
// })();


// const puppeteer = require("puppeteer");
// const fs = require("fs");

// const LOGIN_URL = "https://www.naukri.com/nlogin/login";
// const JOB_URL =
//   "https://www.naukri.com/software-developer-jobs-in-coimbatore?k=software%20developer&l=coimbatore&experience=2&nignbevent_src=jobsearchDeskGNB";

// const EMAIL = "gokultesting60@gmail.com";
// const PASSWORD = "Gokul@123";

// const COOKIE_PATH = "./cookies.json";

// const delay = ms => new Promise(res => setTimeout(res, ms));

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//     args: ["--start-maximized"],
//   });

//   const page = await browser.newPage();

//   // 🍪 Load cookies
//   if (fs.existsSync(COOKIE_PATH)) {
//     const cookies = JSON.parse(fs.readFileSync(COOKIE_PATH, "utf-8"));
//     await page.setCookie(...cookies);
//   }

//   await page.goto("https://www.naukri.com", { waitUntil: "networkidle2" });

//   const isLoggedIn = await page.evaluate(() => {
//     return !!document.querySelector('a[href*="logout"], div[class*="profile"]');
//   });

//   if (!isLoggedIn) {
//     await page.goto(LOGIN_URL, { waitUntil: "networkidle2" });

//     await page.waitForSelector('input[type="text"], input[type="email"]');
//     await page.type('input[type="text"], input[type="email"]', EMAIL, { delay: 50 });
//     await page.type('input[type="password"]', PASSWORD, { delay: 50 });
//     await page.click('button[type="submit"]');

//     await delay(15000);

//     const cookies = await page.cookies();
//     fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
//   }

//   console.log("📄 Opening job page...");
//   await page.goto(JOB_URL, { waitUntil: "networkidle2" });
//   await page.waitForSelector(".srp-jobtuple-wrapper");

//   const jobLinks = await page.evaluate(() => {
//     return Array.from(document.querySelectorAll(".srp-jobtuple-wrapper a.title"))
//       .map(a => a.href);
//   });

//   console.log("Jobs found:", jobLinks.length);

//   let results = [];

//   for (let i = 0; i < jobLinks.length; i++) {
//   console.log(`➡ Job ${i + 1}/${jobLinks.length}`);

//   const jobPage = await browser.newPage();
//   await jobPage.goto(jobLinks[i], { waitUntil: "networkidle2" });
//   await delay(2000);

//   const jobInfo = await jobPage.evaluate(() => {
//     const title = document.querySelector("h1")?.innerText || null;
//     const company =
//       document.querySelector(".styles_jd-header-comp-name__rv9j7")?.innerText ||
//       document.querySelector("a.comp-name")?.innerText || null;
//     const location =
//       document.querySelector(".styles_jhc__location__W_pVs")?.innerText ||
//       document.querySelector(".locWdth")?.innerText || null;
//     const experience =
//       document.querySelector(".styles_jhc__exp__k_giM")?.innerText || null;

//     return { title, company, location, experience };
//   });

//   let applyUrl = null;
//   const applyBtn = await jobPage.$("#company-site-button");

//   if (applyBtn) {
//     console.log("   🔗 Clicking apply button...");

//     const targetPromise = browser.waitForTarget(
//       target => target.opener() === jobPage.target()
//     );

//     await applyBtn.click();

//     const target = await targetPromise;
//     const newTab = await target.page();

//     await newTab.waitForSelector("body", { timeout: 15000 }).catch(() => {});

//     applyUrl = newTab.url();
//     await newTab.close();
//   }

//   results.push({
//     ...jobInfo,
//     applyLink: applyUrl,
//     jobUrl: jobLinks[i],
//   });

//   await jobPage.close();
// }


//   fs.writeFileSync("jobs.json", JSON.stringify(results, null, 2));
//   console.log("✅ All jobs saved to jobs.json");

//   await browser.close();
// })();


const puppeteer = require("puppeteer");
const fs = require("fs");

const LOGIN_URL = "https://www.naukri.com/nlogin/login";
const HOME_URL = "https://www.naukri.com";

const EMAIL = "YOUR_EMAIL";
const PASSWORD = "YOUR_PASSWORD";

const COOKIE_PATH = "./cookies.json";

// 10 Job Roles
const roles = [
  "software developer",
  "node js developer",
//   "java developer",
//   "python developer",
//   "frontend developer",
//   "backend developer",
//   "full stack developer",
//   "react developer",
//   "devops engineer",
//   "data analyst",
];

// 10 Locations
const locations = [
//   "coimbatore",
//   "chennai",
//   "bangalore",
//   "hyderabad",
//   "pune",
//   "mumbai",
//   "delhi",
//   "kochi",
  "trivandrum",
  "madurai",
];

const delay = ms => new Promise(res => setTimeout(res, ms));

async function saveCookies(page) {
  const cookies = await page.cookies();
  fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
}

async function loadCookies(page) {
  if (fs.existsSync(COOKIE_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIE_PATH));
    await page.setCookie(...cookies);
    console.log("🍪 Cookies loaded");
  }
}

async function loginIfNeeded(page) {
  await page.goto(HOME_URL, { waitUntil: "networkidle2" });

  const isLoggedIn = await page.evaluate(() => {
    return !!document.querySelector('a[href*="logout"], div[class*="profile"]');
  });

  if (isLoggedIn) {
    console.log("✅ Already logged in");
    return;
  }

  console.log("🔐 Logging in...");
  await page.goto(LOGIN_URL, { waitUntil: "networkidle2" });

  await page.waitForSelector('input[type="text"], input[type="email"]', { timeout: 20000 });
  await page.type('input[type="text"], input[type="email"]', EMAIL, { delay: 50 });
  await page.type('input[type="password"]', PASSWORD, { delay: 50 });
  await page.click('button[type="submit"]');

  console.log("⏳ Waiting for OTP / redirect...");
  await delay(15000);

  await saveCookies(page);
  console.log("💾 Cookies saved");
}

async function getJobLinks(page, role, location) {
  const url = `https://www.naukri.com/${role.replace(/ /g, "-")}-jobs-in-${location}?experience=2`;
  console.log(`📄 Searching: ${role} in ${location}`);

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await page.waitForSelector(".srp-jobtuple-wrapper", { timeout: 15000 });

    return await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".srp-jobtuple-wrapper a.title"))
        .slice(0, 5)
        .map(a => a.href);
    });
  } catch (err) {
    console.log("⚠ No jobs / blocked:", role, location);
    return [];
  }
}

async function scrapeJob(browser, jobUrl, role, place) {
  const jobPage = await browser.newPage();

  try {
    await jobPage.goto(jobUrl, { waitUntil: "networkidle2", timeout: 30000 });
    await delay(2000);

    const jobInfo = await jobPage.evaluate(() => {
      const title = document.querySelector("h1")?.innerText || null;
      const company =
        document.querySelector(".styles_jd-header-comp-name__rv9j7")?.innerText ||
        document.querySelector("a.comp-name")?.innerText || null;
      const location =
        document.querySelector(".styles_jhc__location__W_pVs")?.innerText ||
        document.querySelector(".locWdth")?.innerText || null;
      const experience =
        document.querySelector(".styles_jhc__exp__k_giM")?.innerText || null;

      return { title, company, location, experience };
    });

    let applyUrl = null;

    const applyBtn = await jobPage.$("#company-site-button, a.styles_apply-button__uJI3A");

    if (applyBtn) {
      console.log("   🔗 Clicking apply");

      const targetPromise = browser.waitForTarget(
        t => t.opener() === jobPage.target(),
        { timeout: 15000 }
      ).catch(() => null);

      await applyBtn.click();

      const target = await targetPromise;
      if (target) {
        const newTab = await target.page();
        await newTab.waitForSelector("body", { timeout: 10000 }).catch(() => {});
        applyUrl = newTab.url();
        await newTab.close();
      }
    }

    await jobPage.close();

    return {
      role,
      searchedLocation: place,
      ...jobInfo,
      applyLink: applyUrl,
      jobUrl,
    };

  } catch (err) {
    console.log("❌ Job error:", jobUrl);
    await jobPage.close();
    return null;
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();

  await loadCookies(page);
  await loginIfNeeded(page);

  let results = [];

  for (const role of roles) {
    for (const place of locations) {

      const jobLinks = await getJobLinks(page, role, place);

      for (let i = 0; i < jobLinks.length; i++) {
        console.log(`➡ ${role} | ${place} | Job ${i + 1}/${jobLinks.length}`);

        const data = await scrapeJob(browser, jobLinks[i], role, place);
        if (data) results.push(data);
      }
    }
  }

  fs.writeFileSync("jobs.json", JSON.stringify(results, null, 2));
  console.log("✅ ALL DATA SAVED");

  await browser.close();
})();
