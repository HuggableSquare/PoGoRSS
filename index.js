import RSS from 'rss';
import { writeFile } from 'fs/promises';
import { parse } from 'node-html-parser';

const baseUrl = 'https://pokemongo.com/en/news';
const page = await fetch(baseUrl);
const original = parse(await page.text());

const feed = new RSS({
  title: original.querySelector('title').textContent.trim(),
  site_url: baseUrl,
  language: 'en',
  image_url: new URL(original.querySelector('link[rel="icon"]').getAttribute('href'), baseUrl).toString()
});

const items = original.querySelectorAll('._newsCard_119ao_16');
items.forEach((item) => {
  feed.item({
    title: item.querySelector('._newsCardContent_119ao_59').textContent.trim(),
    url: new URL(item.getAttribute('href'), baseUrl).toString(),
    date: new Date(Number(item.querySelector('._newsCardDate_119ao_68').getAttribute('timestamp'))),
    description: `<img src="${item.querySelector('img').getAttribute('src')}">`
  });
});

await writeFile('./output/feed.rss', feed.xml());
