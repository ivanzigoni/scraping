import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://twitter.com/i/flow/login");

  await page.waitForSelector('[autocomplete="username"]');

  await page.type('[autocomplete="username"]', "flamingofeliz")

  await page.screenshot({ path: `./screenshots/${new Date().toISOString()}.jpg`});


  browser.close()
}

main()