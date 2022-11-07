import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://pt.wikipedia.org/w/index.php?search=&title=Especial%3APesquisar&go=Ir');

  const [_, __, arg] = process.argv;
  if (!arg) throw new Error("lembra do arg");



  // Type into search box.
  await page.type('#ooui-php-1', arg);
  // await page.screenshot({ path: `./screenshots/${new Date().toISOString()}.jpg`});
  await page.click(".oo-ui-buttonElement-button");


  // Wait for the results page to load and display the results.
  const resultsSelector = '.mw-search-results';
  await page.waitForSelector(resultsSelector);



  // Extract the results from the page.
  // evaluate -> roda função no browser e retorna um resultado.
  const links = await page.evaluate(() => {
    return [...document.querySelectorAll('.mw-search-result-heading')].map(anchor => {

      const [href] = anchor.children;

      return {
        title: href.getAttribute("title"),
        url: `wikipedia.org${href.getAttribute("href")}`,
      };
    });
  });

  await browser.close();
})();