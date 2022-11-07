import puppeteer from 'puppeteer';
import { credentials as c } from '../credentials';

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://twitter.com/i/flow/login");

  await page.waitForSelector('[autocomplete="username"]');

  await page.type('[autocomplete="username"]', c.username);

  await page.evaluate(() => {
    [...document.getElementsByTagName("div")]
      .filter(div => div.getAttribute("role") === "button")
      .find(div => [...div.children].find(element => element.textContent === "Next"))
      ?.setAttribute("nextButton", "true");

    return true
  })

  await page.click('[nextButton="true"]');

  await page.waitForSelector('[autocomplete="current-password"]');

  await page.type('[autocomplete="current-password"]', c.password);

  await page.evaluate(() => {
    [...document.getElementsByTagName("div")]
      .filter(div => div.getAttribute("role") === "button")
      .find(div => [...div.children].find(element => element.textContent === "Log in"))
      ?.setAttribute("loginButton", "true");

    return true
  })
  
  await page.click('[loginButton="true"]');

  await page.waitForSelector('[aria-label="Home timeline"]')

  await page.screenshot({ path: `./screenshots/${new Date().toISOString()}.jpg`});


  browser.close()
}

main()