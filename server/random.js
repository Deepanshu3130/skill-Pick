// const express = require('express');
// const app = express();
// const port = 3000;

// app.get('/', (req, res) => {
//    res.json({
//     success: true,
//     message: 'app is running'
//    })
// } );

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

// app.get

//nrequire('dotenv').config();
//const axios = require("axios");

// Load environment variables
// const GOOGLE_API_KEY = "AIzaSyBoSIm8rmUFSfIg0uZb7hg2WOs8oEMgE0o";
// const SEARCH_ENGINE_ID ='9246b78f0eca3484c'

// // Search Query
// const query = "web development course";
// // const siteFilter = "udemy.com OR teachable.com OR gumroad.com";

// const googleSearch = async () => {
//   const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&sort=date`;

//   try {
//     const response = await axios.get(url);
//     const results = response.data.items || [];
//     console.log(results);
//     // results.forEach((item, index) => {
//     //   console.log(`${index + 1}. ${item.title} - ${item.link}`);
//     // });
//   } catch (error) {
//     console.error("Error fetching Google Search results:", error.response?.data || error.message);
//   }
// };

// googleSearch();


//const axios = require("axios");

// Load environment variables
// const GOOGLE_API_KEY = "AIzaSyBoSIm8rmUFSfIg0uZb7hg2WOs8oEMgE0o";
// const SEARCH_ENGINE_ID = "9246b78f0eca3484c";
// const query = 'python course site:udemy.com -inurl:blog -inurl:topics';
// // Search Query
// //const query = "web development course";

// // Function to fetch search results
// const googleSearch = async (startIndex = 1, numResults = 10) => {
//   const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&start=${startIndex}&num=${numResults}`;

//   try {
//     const response = await axios.get(url);
//     const results = response.data.items || [];

//     if (results.length === 0) {
//       console.log("No results found.");
//       return;
//     }

//     // Display search results with thumbnails
//     results.forEach((item, index) => {
//       const thumbnail = item.pagemap?.cse_thumbnail?.[0]?.src || "No thumbnail available";
//       console.log(`\n${index + startIndex}. ${item.title}`);
//       console.log(`URL: ${item.link}`);
//       console.log(`Thumbnail: ${thumbnail}`);
//       console.log(`Description: ${item.snippet}`);
//       console.log("-".repeat(50));
//     });
//   } catch (error) {
//     console.error("Error fetching Google Search results:", error.response?.data || error.message);
//   }
// };

// // Fetch 30 results (3 pages with 10 results each)
// (async () => {
//   const resultsPerPage = 10;
//   const totalPages = 3;

//   for (let i = 0; i < totalPages; i++) {
//     const startIndex = i * resultsPerPage + 1;
//     console.log(`\nPage ${i + 1} Results:`);
//     await googleSearch(startIndex, resultsPerPage);
//   }
// })();


// const axios = require("axios");
// const cheerio = require('cheerio');
// require("dotenv").config();

// const scrapper = async () => {
//   const url = "https://www.udemy.com/courses/search/?src=ukw&q=python";
  
//   const username = process.env.bright_username;
//   const password = process.env.bright_password;
//   const port = 22224;
//   const sessionId = Math.floor(100000 * Math.random());

//   const options = {
//     proxy: {
//       host: 'brd.superproxy.io',
//       port: 33335,
//       auth: {
//         username: `${username}-session-${sessionId}`,
//         password: password,
//       }
//     },
//     // headers: {
//     //   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0 Safari/537.36'
//     // }
//   };

//   try {
//     const response = await axios.get(url, options);
//     const $ = cheerio.load(response.data);

//     console.log("Page loaded successfully");
//     console.log($.html().substring(0, 500)); // Show first 500 chars for verification
//   } catch (error) {
//     console.error("Failed to extract page:", error.message);
//   }
// };

// // scrapper() main;
// const axios = require("axios");
// const cheerio = require('cheerio');
// const { log } = require("console");
// require("dotenv").config();

// // Bright Data Access Credentials
// const username = process.env.bright_username;
// const password = process.env.bright_password;
// console.log(username);
// console.log(password);
// const sessionId = Math.floor(100000 * Math.random());

// // Axios Proxy Configuration with Bypass SSL Errors
// const options = {
//   auth: {
//     host: 'brd.superproxy.io.33335',
//     port: 22225,
//     auth: {
//       username: `${username}-session-${sessionId}`,
//       password: password,
//     }
//   },
//   httpsAgent: new (require('https').Agent)({
//     rejectUnauthorized: false // Bypass SSL verification
//   }),
//   headers: {
//     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0 Safari/537.36',
//     'Accept-Language': 'en-US,en;q=0.9',
//     'Accept-Encoding': 'gzip, deflate, br',
//     'Connection': 'keep-alive',
//     'Referer': 'https://www.udemy.com/',
//     'Upgrade-Insecure-Requests': '1'
//   },
//   timeout: 15000, // Increase timeout to handle delays
//   maxRedirects: 5, // Handle multiple redirects
//   validateStatus: (status) => status < 500 // Ignore client errors for debugging
//  // timeout: 10000, // Add a timeout to handle delays
// };

// const url = "https://www.udemy.com/topic/python/";

// const scrapper = async () => {
//   try {
//     const response = await axios.get(url, options);
//    // console.log(response)
//      const $ = cheerio.load(response.data);


//     const courses = $(".course-list_container__yXli8.course-card_image-container__sVClg");
//    console.log(courses)
//     // console.log("Page loaded successfully");
//     // console.log($.html().substring(0, 500)); // Show first 500 chars for verification
//   } catch (error) {
//     console.error("Failed to extract page:", error.response ? error.response.status : error.message);
//   }
// };

// scrapper();




// const fs = require('fs');
// const ssl = require("./New SSL certifcate - MUST BE USED WITH PORT 33335")

// // Load SSL Certificate
// const ca = fs.readFileSync('');

// // Bright Data Access Credentials
// const brd_user = 'hl_3efb9c43';
// const brd_zone = 'pricewise';
// const brd_passwd = 'v1w2tfaj5d48';
// const brd_superproxy = 'brd.superproxy.io:33335';

// // Connection String
// const brd_connectStr = `brd-customer-${brd_user}-zone-${brd_zone}:${brd_passwd}@${brd_superproxy}`;

// // Test URL (JSON or Text Response)
// const brd_test_url = 'https://geo.brdtest.com/welcome.txt';

// // Send Request with Proxy and SSL Certificate
// require('request-promise')({
//     url: brd_test_url,
//     proxy: `http://${brd_connectStr}`,
//     ca: ca,
// }).then(
//     (data) => console.log(data),
//     (err) => console.error(err)
// );

// // 6️⃣ Run the scraper
// scrape();

// const axios = require("axios");
// const cheerio = require('cheerio');
// require("dotenv").config();
// const {extractPrice} = require("./extractPrice")

// exports.scrapper = async(url) =>{
     
//     const username = process.env.bright_username;
//     const password = process.env.bright_password;
//     const port   = 22225;
//     const sessionId = (100000 * Math.random()) || 0;
//     const options = {
//         auth : {
//         username : `${username}-session-${sessionId}`,
//         password,
//         },

//         host : `brd.superproxy.io:33335`,
//         port,
//         rejectUnauthorized: false,
//     }
    
//         // fetching the product page
//         const response = await axios.get(url , options);
//         console.log("response is " , response.data);
//   }


// const axios = require("axios");
// const cheerio = require('cheerio');
// require("dotenv").config();

// const scraper = async () => {
//   const url = 'https://www.udemy.com/topic/python/';
  
//   const username = process.env.bright_username;
//   const password = process.env.bright_password;
//   const sessionId = Math.floor(100000 * Math.random());
  
//   const options = {
//     headers: {
//       'Authorization': `Basic ${Buffer.from(`${username}-session-${sessionId}:${password}`).toString('base64')}`,
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
//     },
//     proxy: {
//       host: 'brd.superproxy.io',
//       port: 33335,
//     },
//     httpsAgent: new (require('https').Agent)({
//       rejectUnauthorized: false,
//     }),
//   };

//   try {
//     const response = await axios.get(url, options);
//     console.log("Response received:", response.data);
//   } catch (error) {
//     console.error("Error fetching page:", error.message);
//   }
// };

// scraper();


// const axios = require("axios");
// const cheerio = require('cheerio');
// require("dotenv").config();

// const scraper = async () => {
//   const url = 'https://www.udemy.com/topic/python/';
  
//   const username = process.env.bright_username; // Your Bright Data username
//   const password = process.env.bright_password; // Your Bright Data password
//   const sessionId = Math.floor(100000 * Math.random());
  
//   const options = {
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
//     },
//     proxy: {
//       protocol: 'http',
//       host: 'brd.superproxy.io',
//       port: 33335,
//       auth: {
//         username: `${username}-session-${sessionId}`, // Add session ID to username
//         password: password
//       }
//     },
//     httpsAgent: new (require('https').Agent)({
//       rejectUnauthorized: false,
//     }),
//   };

//   try {
//     const response = await axios.get(url, options);
//     console.log("Response received:", response.data);
//   } catch (error) {
//     console.error("Error fetching page:", error.message);
//   }
// };

// scraper();
// const puppeteer = require('puppeteer');

// (async () => {
//   let browser;
//   try {
//     browser = await puppeteer.launch({
//       headless: true,
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--proxy-server=http://brd.superproxy.io:33335',
//       ],
//     });

//     const page = await browser.newPage();

//     // Set User-Agent and Headers to Bypass Bot Detection
//     await page.setUserAgent(
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
//     );
//     await page.setExtraHTTPHeaders({
//       'Accept-Language': 'en-US,en;q=0.9',
//     });

//     // Authenticate with Bright Data proxy
//     await page.authenticate({
//       username: 'brd-customer-hl_3efb9c43-zone-pricewise',
//       password: 'v1w2tfaj5d48',
//     });

//     // Load Udemy page with error handling
//     try {
//       await page.goto('https://www.coursera.org/search?query=professional%20certificates&sortBy=NEW', {
//         waitUntil: 'networkidle2',
//         timeout: 60000,
//       });

//       // Check for CAPTCHA
//       if (await page.$('iframe[title="CAPTCHA"]')) {
//         console.error('CAPTCHA detected. Manual intervention needed.');
//       } else {
//         await page.screenshot({ path: 'udemy_screenshot.png', fullPage: true });
//         console.log('Page loaded successfully');
//         const content = await page.content();
//         console.log(content);
//       }
//     } catch (error) {
//       console.error('Failed to load page:', error.message);
//     }
//   } catch (error) {
//     console.error('Puppeteer error:', error.message);
//   } finally {
//     if (browser) await browser.close();
//   }
// })();




// const puppeteer = require('puppeteer');

// const scrapeCourses = async () => {
//   // Launch a browser
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   // Navigate to the Udemy Python courses page
//   const url = 'https://www.udemy.com/courses/search/?q=python';
//   await page.goto(url, { waitUntil: 'load', timeout: 0 });

//   // Wait for course cards to load
//   await page.waitForSelector('.course-card--container--3w8Zm');

//   // Scrape course titles and URLs
//   const courses = await page.evaluate(() => {
//     const courseElements = document.querySelectorAll('.course-card--container--3w8Zm');
//     const courseList = [];
    
//     courseElements.forEach(course => {
//       const title = course.querySelector('.udlite-focus-visible-target.udlite-heading-md.course-card--course-title--2f7tE')?.innerText;
//       const url = course.querySelector('a.udlite-custom-focus-visible')?.href;

//       if (title && url) {
//         courseList.push({ title, url });
//       }
//     });
    
//     return courseList;
//   });

//   console.log('Scraped Courses:', courses);

//   // Close the browser
//   await browser.close();
// };

// // Run the scraper
// scrapeCourses().catch(console.error);



// const axios = require("axios");
// const cheerio = require('cheerio');
// require("dotenv").config();
// //const {extractPrice} = require("./extractPrice")

// const scrapper = async() =>{
//   url ="https://www.udemy.com/topic/python/";
     
//     const username = process.env.bright_username;
//     const password = process.env.bright_password;
//     const port   = 22225;
//     const sessionId = (100000 * Math.random()) || 0;
//     const options = {
      
//       proxy: {
//         host: "brd.superproxy.io",
//         port: port,
//         auth: {
//           username: `${username}-session-${sessionId}`,
//           password: password,
//         },
//       },
        
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
//           Accept:
//             "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
//           "Accept-Language": "en-US,en;q=0.5",
//           "Accept-Encoding": "gzip, deflate, br",
//           Connection: "keep-alive",
//         },

//         host : `brd.superproxy.io:33335`,
//         port,
//         rejectUnauthorized: false,
//     }
//     try{
//         // fetching the product page
//         console.log("hi")
//         const response = await axios.get(url , options);
//         console.log("response is " , response.data);
//         const $ = cheerio.load(response.data);
//       }catch(error){
//         return {
//            message : "fail to extract  product ",
//            success: false,
//            error: error.message,     
//          }
//     }
//   }

// scrapper();

// const axios = require("axios");
// const { HttpsProxyAgent } = require('https-proxy-agent');
// require("dotenv").config();

// const scraper = async () => {
//   const url = 'https://www.udemy.com/topic/python/';
  
//   const username = process.env.bright_username;
//   const password = process.env.bright_password;
//   const sessionId = Math.floor(100000 * Math.random());
  
//   const proxyUrl = `http://${username}-session-${sessionId}:${password}@brd.superproxy.io:33335`;

//   const options = {
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
//     },
//     httpsAgent: new HttpsProxyAgent(proxyUrl),
//     agent: new (require('https').Agent)({ 
//       rejectUnauthorized: false 
//     }),
//   };

//   try {
//     const response = await axios.get(url, options);
//     console.log("Response received:", response.data);
//   } catch (error) {
//     console.error("Error fetching page:", error.message);
//   }
// };

// scraper();
