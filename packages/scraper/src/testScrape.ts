import puppeteer from 'puppeteer';
import { parse, formatISO } from 'date-fns';
import getHtmlString from 'getHtmlString';

const getSongEntriesFromPuppeteerContext = () => {
  return Array.from(document.querySelectorAll('table tr')).map((node) => {
    const [timeNode, songNode] = Array.from(node.children);

    return {
      time: timeNode.textContent,
      song: songNode.textContent,
    };
  });
};

const getSongDetails = (song: string) => {
  const [authors, name] = song.split('-').map((s) => s.trim());
  const preparedAuthors = authors.split('&').map((a) => a.trim());

  return { authors: preparedAuthors, name, displayName: song };
};

const normaliseEntry = ({ time, song, ...rest }, referenceDate: Date) => {
  const preparedEntry = {
    time: {
      aired: parse(time, 'HH:mm', referenceDate),
      referenceDate: formatISO(referenceDate),
    },
    song: getSongDetails(song),
  };

  return {
    ...preparedEntry,
    ...rest,
  };
};

const testScrape = async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  const htmlString = await getHtmlString(process.env.SCRAPER_URL as string);
  const referenceDate = new Date();

  page.on('console', (consoleObj) => console.log(consoleObj.text()));

  try {
    await page.setContent(htmlString);
    await page.waitForSelector('table');

    const entries = await page.evaluate(getSongEntriesFromPuppeteerContext);
    const preparedEntries = entries.map((entry) =>
      normaliseEntry(entry, referenceDate)
    );

    console.log(preparedEntries[0]);

    return preparedEntries;
  } catch (error) {
    console.log(error);
  } finally {
    page.close();
  }
};

export default testScrape;
