const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        console.log('Navigating to page...');
        await page.goto('https://conesportabombom.netlify.app/', { waitUntil: 'networkidle0', timeout: 60000 });

        console.log('Scrolling to load lazy elements...');
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight - window.innerHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // Wait a bit for external resources
        await new Promise(r => setTimeout(r, 2000));

        console.log('Getting HTML content...');
        const html = await page.content();

        fs.writeFileSync('rendered.html', html);
        console.log('Saved to rendered.html');

        await browser.close();
    } catch (error) {
        console.error('Error:', error);
    }
})();
