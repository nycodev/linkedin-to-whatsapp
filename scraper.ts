const { 
    LinkedinScraper,
    relevanceFilter,
    timeFilter,
    typeFilter,
    experienceLevelFilter,
    events,
} = require("linkedin-jobs-scraper");
const express = require('express');

const wbm = require('wbm');
const server = express();


server.get('/', (request, response)=> {
    response.send(jobs)
});

const port = 3000;
server.listen(port, () => {
    `running`
});

let jobs = [] ;

(async () => {
    // Each scraper instance is associated with one browser.
    // Concurrent queries will run on different pages within the same browser instance.
    const scraper = new LinkedinScraper({
        headless: true,
        slowMo: 1000,
        args: [
            "--lang=en-GB",
        ],
    });

    // Add listeners for scraper events
    scraper.on(events.scraper.data, (data) => {
        jobs.push(
            data.description.length,
            data.descriptionHTML.length,
            `Titulo='${data.title}'`,
            `Empresa='${data.company ? data.company : "N/A"}'`,
            `Local='${data.place}'`,
            `Data='${data.date}'`,
            `Link='${data.link}'`,
            `Aplicar='${data.applyLink ? data.applyLink : "N/A"}'`,
            `Nivel de senioridade='${data.senorityLevel}'`,
            `função='${data.jobFunction}'`,
            `Tipo de emprego='${data.employmentType}'`,
            `industria='${data.industries}'`,
        );
    });

    scraper.on(events.scraper.error, (err) => {
        console.error(err);
    });

    scraper.on(events.scraper.end, () => {
        console.log('All done!');
    });

    // Add listeners for puppeteer browser events
    scraper.on(events.puppeteer.browser.targetcreated, () => {
    });
    scraper.on(events.puppeteer.browser.targetchanged, () => {
    });
    scraper.on(events.puppeteer.browser.targetdestroyed, () => {
    });
    scraper.on(events.puppeteer.browser.disconnected, () => {
    });

    // Custom function executed on browser side to extract job description
    const descriptionFn = () => document.querySelector(".description__text")
        .innerText
        .replace(/[\s\n\r]+/g, " ")
        .trim();

    // Run queries concurrently    
    await Promise.all([
        // Run queries serially
        scraper.run([
            {
                query: "Programador node js junior",
                options: {
                    locations: [""], // This will be merged with the global options => ["United States", "Europe"]
                    filters: {
                        type: [typeFilter.FULL_TIME, typeFilter.CONTRACT],
                        time: timeFilter.DAY                           
                    },       
                }                                                       
            },
        ], { // Global options for this run, will be merged individually with each query options (if any)
            locations: ["Brazil"],
            optimize: true,
            limit: 5,
        }),
    ]);

    // Close browser
    await scraper.close();
})();


setTimeout(() => {
    let msg = jobs.toString()
    wbm.start().then(async () => {
        const contacts = [
            { phone: '556784424975', name: msg }
        ];
        const message = '{{name}}';
        // Hi Bruno, your age is 21
        // Hi Will, your age is 33
        await wbm.send(contacts, message);
        await wbm.end();
    }).catch(err => console.log(err));    
}, 90000);
