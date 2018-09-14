const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('https://scc.kokushin-u.jp/static/generator/shirimetsuretsu/',  { waitUntil: 'networkidle0' });    
    const base64 = await page.evaluate(async (message) => {
        const textarea = document.getElementById('content');
        textarea.value = message;
        textarea.dispatchEvent(new Event('change'));
        await new Promise((resolve) => setTimeout(() => resolve(), 50));
        return document.getElementById('canvas').toDataURL('img/png');
    }, process.argv[2]);
    browser.close();

    const content = base64.substring(22);
    const length = (n => n + (4 - n % 4) % 4)(Math.ceil(content.length * 0.75));
    const img = Buffer.alloc(length, content, 'base64');

    const filepath = process.argv[3] || path.join(process.cwd(), 'shirimetsuretsu.png');
    fs.writeFileSync(filepath, img);
})();

