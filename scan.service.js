const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function scanWebsite(url) {
    const res = await fetch(url);
    const html = await res.text();
    const dom = new JSDOM(html);
    
    const title = dom.window.document.querySelector('title')?.textContent || '';
    const metaDesc = dom.window.document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const h1 = dom.window.document.querySelector('h1')?.textContent || '';

    return { title, metaDesc, h1, url };
}

module.exports = { scanWebsite };
