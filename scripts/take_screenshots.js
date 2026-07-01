const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function run() {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const docsDir = path.join(__dirname, 'docs', 'images');
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
    }

    console.log("Navigating to login page...");
    await page.goto('https://fleettrack-web.vercel.app/login', { waitUntil: 'networkidle2' });

    console.log("Filling login form...");
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'superadmin@acf.org');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    console.log("Waiting 8s for dashboard to load...");
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    console.log("Taking dashboard screenshot...");
    await page.screenshot({ path: path.join(docsDir, 'dashboard.png') });

    console.log("Navigating to template manager...");
    await page.goto('https://fleettrack-web.vercel.app/admin/settings?tab=system', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 8000));
    console.log("Taking templates screenshot...");
    await page.screenshot({ path: path.join(docsDir, 'settings_system.png') });

    console.log("Navigating to general settings...");
    await page.goto('https://fleettrack-web.vercel.app/admin/settings?tab=brand', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 8000));
    console.log("Taking settings screenshot...");
    await page.screenshot({ path: path.join(docsDir, 'settings_brand.png') });

    await browser.close();
    console.log("Screenshots captured successfully!");
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
