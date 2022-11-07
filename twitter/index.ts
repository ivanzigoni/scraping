import puppeteer from 'puppeteer';
import { credentials as c } from '../credentials';
import fs from 'fs';

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

  await page.waitForSelector('article')
  // await page.waitForSelector('[aria-label="Home timeline"]')

  const tweets = await page.evaluate(() => {
    // const tweets = [...document.querySelectorAll('div[data-testid="tweetText"]')]
    // .map(div => ({ text: [...div.children][0].textContent }))

    window.scrollBy(0, window.innerHeight)

    const tweets = [...document.querySelectorAll('article div[data-testid="tweetText"] span')]
      .reduce((acc: string[], element) => {
        
        if (element.textContent) acc.push(element.textContent)

        return acc;
      }, []);

    const users = [...document.querySelectorAll('article div[data-testid="User-Names"] a span')]
      .reduce((acc: string[], element) => {
      
      if (element.textContent && element.textContent.includes("@")) acc.push(element.textContent)

      return acc;
    }, []);

    return users.map((user, i) => {
      return {
        username: user,
        tweet: tweets[i]
      }
    });
  })

  fs.writeFileSync(`./twitter/report/${new Date().toISOString()}-report.json`, JSON.stringify(tweets));

  await page.screenshot({ path: `./screenshots/${new Date().toISOString()}.jpg` });


  browser.close()
}

main()