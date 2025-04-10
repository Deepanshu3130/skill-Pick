// const puppeteer = require('puppeteer');
// //const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// //const randomUseragent = require('random-useragent');

  
// //puppeteer.use(StealthPlugin());

// async function scrapeUdemyCourse(url) {
//   let browser;
//   try {
//     browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     });

//     const page = await browser.newPage();

//     // Set a random user agent
//     // const userAgents = [
//     //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//     //     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.3945.117 Safari/537.36',
//     //     'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5999.89 Safari/537.36',
//     //     'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Mobile/15E148 Safari/604.1',
//     //     'Mozilla/5.0 (iPad; CPU OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Mobile/15E148 Safari/604.1'
//     //   ]; const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

//     // Randomize viewport size
//     // await page.setViewport({
//     //   width: Math.floor(Math.random() * 100) + 1200,
//     //   height: Math.floor(Math.random() * 100) + 800,
//     // });

//     // Navigate to the course page
//     await page.goto(url, { waitUntil: 'networkidle2' });
  
//     // Add a small random delay to avoid detection
//     //await page.waitForTimeout(Math.floor(Math.random() * 2000) + 1000);
//     //console.log(page);

//     // Scrape course details
// //     const title = await page.$eval('h1', el => el.textContent.trim());
// //     const description = await page.$eval('.clp-lead__headline', el => el.textContent.trim());

// //     // Scrape images
// //     const images = await page.$$eval('img', imgs =>
// //       imgs.map(img => img.src).filter(src => src.startsWith('http'))
// //     );

// //     // Scrape price
// //     const price = await page.$eval('.ud-clp-discount-price > span:nth-of-type(2) > span', el =>
// //       el.textContent.trim()
// //     );

// //     // Scrape multiple pages of reviews
// //     let reviews = [];
// //     let hasNextPage = true;

// //     while (hasNextPage) {
// //       const pageReviews = await page.$$eval('.review--review-container--gVw03', elems =>
// //         elems.map(elem => {
// //           const reviewer =
// //             elem.querySelector('.user-name')?.textContent.trim() || 'Anonymous';
// //           const rating =
// //             elem
// //               .querySelector('.ud-heading-md[aria-label]')
// //               ?.getAttribute('aria-label') || 'No Rating';
// //           const comment =
// //             elem
// //               .querySelector('.review--with-show-more-button--nSXQz > span')
// //               ?.textContent.trim() || '';
// //           return { reviewer, rating, comment };
// //         })
// //       );
// //       reviews.push(...pageReviews);

// //       // Check if there's a next page button and click it
// //       const nextPageButton = await page.$('.ud-pagination-item.ud-pagination-next');
// //       if (nextPageButton) {
// //         await nextPageButton.click();
// //         await page.waitForTimeout(Math.floor(Math.random() * 2000) + 1500);
// //       } else {
// //         hasNextPage = false;
// //       }
// //     }

//      await browser.close();

// //     return {
// //       title,
// //       description,
// //       images,
// //       price,
// //       reviews,
// //     };
//    } catch (error) {
//     if (browser) await browser.close();
//     console.error(`Data scraping error: ${error.message}`);
//     throw new Error(`Data scraping error: ${error.message}`);
//   }
// }

// // Example usage:
// const courseUrl = 'https://www.udemy.com/topic/python/';
// scrapeUdemyCourse(courseUrl);
// //   .then(courseData => {
// //     console.log(JSON.stringify(courseData, null, 2));
// //   })
// //   .catch(err => {
// //     console.error('Scraping failed:', err.message);
// //   });

// const puppeteer = require('puppeteer-extra');
// async function scrapeUdemyCourse(url) {
//   let browser;
//   try {
//     browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     });

//     const page = await browser.newPage();
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

//     // Navigate to the course page
//     await page.goto(url, { waitUntil: 'domcontentloaded' });

//     // Wait for courses or instructors section to load
//     try {
//       await page.waitForSelector('.course-card, .popular-instructors', { timeout: 10000 });
//       console.log('Courses or instructors section loaded');
//     } catch {
//       console.warn('Page content did not fully load, but continuing...');
//     }

//     // Add an extra delay to ensure images and other assets load
//     await page.waitForTimeout(5000);

//     // Save a screenshot
//     await page.screenshot({ path: 'udemy_course.png', fullPage: true });
//     console.log('Screenshot saved as udemy_course.png');

//     // Log current page URL
//     console.log(`Scraping URL: ${page.url()}`);

//     // Close the browser
//     await browser.close();
//     console.log('Scraping completed successfully');
//   } catch (error) {
//     if (browser) await browser.close();
//     console.error(`Data scraping error: ${error.message}`);
//     throw new Error(`Data scraping error: ${error.message}`);
//   }
// }

// // Example usage
// const courseUrl = 'https://www.udemy.com/topic/python/';
// scrapeUdemyCourse(courseUrl)
//   .then(() => console.log('Done'))
//   .catch(err => console.error('Error:', err.message));


// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const ProxyPlugin = require('puppeteer-extra-plugin-proxy');
// require('dotenv').config();

// // Add stealth plugin to avoid detection
// puppeteer.use(StealthPlugin());

// // Add proxy plugin for Bright Data proxy
// puppeteer.use(
//   ProxyPlugin({
//     address: 'brd.superproxy.io',
//     port: 33335,
//     credentials: {
//       username: `${process.env.bright_username}-session-${Math.floor(100000 * Math.random())}`,
//       password: process.env.bright_password,
//     },
//   })
// );

// async function scrapeUdemyCourse(url) {
//   let browser;
//   try {
//     // Launch Puppeteer with proxy and headless mode
//     browser = await puppeteer.launch({
//       headless: false,
//       args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     });

//     const page = await browser.newPage();

//     // Set a realistic user agent
//     await page.setUserAgent(
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
//     );

//     // Navigate to the course page
//     console.log(`Navigating to: ${url}`);
//     await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

//     // Wait for the page to fully load (optional delay)
//     //await page.waitForTimeout(5000); // Adjust delay as needed

//     // Get the complete HTML of the page
//     const htmlContent = await page.content();
//     console.log('Page HTML content fetched successfully');

//     // Save the HTML to a file
//     const fs = require('fs');
//     fs.writeFileSync('udemy_page.html', htmlContent);
//     console.log('HTML saved to udemy_page.html');

//     // Close the browser
//     //await browser.close();
//     console.log('Scraping completed successfully');
//   } catch (error) {
//     console.error(`Data scraping error: ${error.message}`);
//     if (browser) await browser.close();
//     throw error;
//   }
// }

// // Example usage
// const courseUrl = 'https://www.udemy.com/topic/python/';
// scrapeUdemyCourse(courseUrl)
//   .then(() => console.log('Scraping completed!'))
//   .catch((err) => console.error('Error during scraping:', err.message));

//   const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// require('dotenv').config();

// // Add stealth plugin to avoid detection
// puppeteer.use(StealthPlugin());

// async function scrapeUdemyCourse(url) {
//   let browser;
//   try {
//     // Launch Puppeteer in headless mode
//     browser = await puppeteer.launch({
//       headless: false,
//       args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     });

//     const page = await browser.newPage();

//     // Set a realistic user agent
//     await page.setUserAgent(
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
//     );

//     // Navigate to the course page
//     console.log(`Navigating to: ${url}`);
//     await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000});
//     await page.waitForFunction(() => document.readyState === 'complete');
//     // Wait for the page to fully load (optional delay)
//     //await page.waitForTimeout(5000); // Adjust delay as needed
//     page.screenshot();
//     await page.evaluate(async () => {
//       await new Promise((resolve) => {
//         let totalHeight = 0;
//         const distance = 100;
//         const timer = setInterval(() => {
//           const scrollHeight = document.body.scrollHeight;
//           window.scrollBy(0, distance);
//           totalHeight += distance;
//           if (totalHeight >= scrollHeight) {
//             clearInterval(timer);
//             resolve();
//           }
//         }, 100);
//       });
//     });
//     page.screenshot();
//     // Get the complete HTML of the page
//     const htmlContent = await page.content();
//     console.log('Page HTML content fetched successfully');
//     console.log(htmlContent);

//     // Save the HTML to a file
//     const fs = require('fs');
//     fs.writeFileSync('udemy_page.html', htmlContent);
//     console.log('HTML saved to udemy_page.html');

//     // Close the browser
//     await browser.close();
//     console.log('Scraping completed successfully');
//   } catch (error) {
//     console.error(`Data scraping error: ${error.message}`);
//     if (browser) await browser.close();
//     throw error;
//   }
// }

// // Example usage
// const courseUrl = 'https://www.udemy.com/topic/python/';
// scrapeUdemyCourse(courseUrl)
//   .then(() => console.log('Scraping completed!'))
//   .catch((err) => console.error('Error during scraping:', err.message));




require('dotenv').config();
const  puppeteer = require('puppeteer-core');
const puppeteerExtra  = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');



// Add stealth plugin to avoid detection
exports.getUdemyCourses =async(query)=>{
  puppeteerExtra.use(StealthPlugin());

async function scrapeUdemyCourse(url) {
  let browser;
  try {
    // Launch Puppeteer in headless mode
    browser = await puppeteerExtra.launch({
      headless: true,
      dumpio: true,
      // executablePath:
      // process.env.NODE_ENV ==="production"? process.env.PUPPETEER_EXECUTABLE_PATH:puppeteer.executablePath(),
      // headless: false, // Set to false to see the browser window
      args: [    '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Navigate to the course page
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { timeout: 60000, waitUntil: 'load' });

    // Wait for the DOM to be fully ready
    await page.waitForFunction(() => document.readyState === 'complete');

    // Take a screenshot after the page loads
    // await page.screenshot({ path: 'after_load.png', fullPage: true });
    // console.log('Screenshot saved as after_load.png');

    // Scroll to the bottom of the page to trigger lazy loading
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    
    // Extract course data
    const courses = await page.$$eval('.course-list_card__jWLES', (courseElements) => {
      return  courseElements.map((course) => {
        const platform = "Udemy";
         const type= "paid";
        const description = course.querySelector('.course-card_course-headline__BBr5m')?.textContent.trim() || 'N/A';
        const title = course.querySelector('h3[data-purpose="course-title-url"] a').firstChild.textContent.trim()|| 'N/A';
        const provider = course.querySelector('.course-card-instructors_instructor-list__helor')?.textContent.trim() || 'N/A';
        const rating = course.querySelector('.star-rating_rating-number__nHi2B')?.textContent.trim() || 'N/A';
        const reviews = course.querySelector('.course-card-ratings_reviews-text__rx1CN')?.textContent.trim() || 'N/A';
        const currentPrice = course.querySelector('[data-purpose="course-price-text"]')?.textContent.trim() || 'N/A';
        const originalPrice = course.querySelector('[data-purpose="course-old-price-text"]')?.textContent.trim() || 'N/A';
        const duration = course.querySelector('.course-card-details_row__sWQ8g:nth-child(1)')?.textContent.trim() || 'N/A';
        const lectures = course.querySelector('.course-card-details_row__sWQ8g:nth-child(2)')?.textContent.trim() || 'N/A';
        const level = course.querySelector('.course-card-details_row__sWQ8g:nth-child(3)')?.textContent.trim() || 'N/A';
        const imageUrl = course.querySelector('.course-card_image-container__sVClg img')?.src || 'N/A';
        const link = 'https://www.udemy.com' + course.querySelector('.prefetching-wrapper_prefetching-wrapper__flGra link')?.getAttribute('href') || 'N/A';

        return {
          type,
          platform,
          provider,
          title,
          description,
          rating,
          reviews,
          currentPrice,
          originalPrice,
          duration,
          lectures,
          level,
          imageUrl,
          link,
          
          
        };
      });
    });
   
   //console.log('Extracted Course Data:', JSON.stringify(courses, null, 2));


    // Take a screenshot after scrolling
    // await page.screenshot({ path: 'after_scroll.png', fullPage: true });
    // console.log('Screenshot saved as after_scroll.png');

    // Get the complete HTML of the page
    // const htmlContent = await page.content();
    // console.log('Page HTML content fetched successfully');

    // Save the HTML to a file
    // const fs = require('fs');
    // fs.writeFileSync('udemy_page.html', htmlContent);
    // console.log('HTML saved to udemy_page.html');
    //console.log(htmlContent);

    // Close the browser
    await browser.close();
    console.log('Scraping completed successfully');
     console.log(courses)
    return courses;
  } catch (error) {
    console.error(`Data scraping error: ${error.message}`);
    if (browser) await browser.close();
    throw error;
  }
}

// Example usage
const courseUrl = `https://www.udemy.com/topic/${query}/?p=1&sort=popularity`;
const result =await scrapeUdemyCourse(courseUrl);
console.log(result);
return result;
// scrapeUdemyCourse(courseUrl)
  // .then(() => console.log('Scraping completed!'))
  // .catch((err) => console.error('Error during scraping:', err.message));
}
  // getUdemyCourses("web-development")


