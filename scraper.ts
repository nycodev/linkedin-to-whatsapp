import { sendMsg } from "./sendMessage";



const { 
    LinkedinScraper,
    relevanceFilter,
    timeFilter,
    typeFilter,
    experienceLevelFilter,
    events,
} = require("linkedin-jobs-scraper");



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
            `\n\n*${data.title}* `,
            `\n*Empresa:*  '${data.company ? data.company : "N/A"}'`,
            `\n*Local:*  '${data.place}'`,
            `\n*Data:*  '${data.date}'`,
            `\n*Link:*  '${data.link}'`,
            `\n*Nivel de senioridade:*  '${data.senorityLevel}'`,
            `\n*Função:*  '${data.jobFunction}'`,
            `\n*Tipo de emprego:*  '${data.employmentType}'`,
            `\n*Industria:*  \n '${data.industries}'\n\n -----------------------------------------------\n `,
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

sendMsg(jobs)