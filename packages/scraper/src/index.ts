import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

import Fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import Pino from 'pino';
import axios from 'axios';
import puppeteer from 'puppeteer';
import { parse, formatISO } from 'date-fns';

const logger = Pino({ level: 'info' });
const fastify = Fastify({
  logger,
  ignoreTrailingSlash: true,
});

const env = {
  PORT: Number(process.env.PORT) || 3001,
  SCRAPER_URL: process.env.SCRAPER_URL,
};

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/public',
  prefixAvoidTrailingSlash: true,
});

fastify.get('/', async (request, reply) => reply.sendFile('index.html'));

fastify.listen(env.PORT, (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  } else {
    testScrape();
  }
});

const getDocumentRaw = async (): Promise<string> => {
  try {
    const response = await axios({
      method: 'get',
      url: env.SCRAPER_URL,
      responseType: 'text',
    });

    return response.data;
  } catch (error) {
    fastify.log.error(error);
    return '';
  }
};

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
  const [authors, songName] = song.split('-').map((s) => s.trim());
  const preparedAuthors = authors.split('&').map((a) => a.trim());

  return { authors: preparedAuthors, songName, displayName: song };
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
  const documentRaw = await getDocumentRaw();
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  const referenceDate = new Date();

  page.on('console', (consoleObj) => fastify.log.info(consoleObj.text()));

  try {
    await page.setContent(documentRaw);
    await page.waitForSelector('table');

    const entries = await page.evaluate(getSongEntriesFromPuppeteerContext);
    const preparedEntries = entries.map((entry) =>
      normaliseEntry(entry, referenceDate)
    );

    fastify.log.info(`Found ${preparedEntries.length} entries.`);
    console.log(preparedEntries[0]);
  } catch (error) {
    console.log(error);
  }
};
