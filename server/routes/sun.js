const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();

async function fetchSunData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://theskylive.com/sun-info');

    // Wait for the parent div to load
    await page.waitForSelector('.pure-skin-mine');

    // Extract the content of each div
    const data = await page.evaluate(() => {
        const img = document.querySelector('.sun_container img');
        const rise = document.querySelector('.rise time');
        const set = document.querySelector('.set time');
        const rightAscension =  document.getElementsByClassName('keyinfobox')[0].querySelector('ar');
        const declination = document.getElementsByClassName('keyinfobox')[1].querySelector('ar');
        const constellation = document.getElementsByClassName('keyinfobox')[2].querySelector('ar a');
        const magnitude = document.getElementsByClassName('keyinfobox')[3].querySelector('ar');

        return {
            img: img.src,
            rise: rise.innerText,
            set: set.innerText,
            rightAscension: rightAscension.innerText,
            declination: declination.innerText,
            constellation: constellation.innerText,
            magnitude: magnitude.innerText,
        };
    });

    // Close the browser
    await browser.close();

    return data;
}

router.get('/', async function (req, res, next) {
    try {
        const sunData = await fetchSunData();
        res.send(sunData);
    } catch (e) {
        res.status(500).end();
    }
});

module.exports = router;
