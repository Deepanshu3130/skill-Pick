// require('dotenv').config();
// const axios = require('axios');

// const API_BASE_URL = 'https://api.coursera.org/api';

// /**
//  * Fetch courses from the Coursera API.
//  * The API call requests specific fields (name, description, instructorIds, photoUrl)
//  * and limits the results to 10 courses.
//  */
// async function fetchCourses() {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/courses.v1`, {
//       params: {
//         fields: 'name,description,instructorIds,photoUrl',
//         limit: 10,
//       }
//     });
//     // Log the full response for debugging if needed:
//     // console.log('API Response:', response.data);
//     return response.data.elements || [];
//   } catch (error) {
//     console.error('Error fetching courses:', error.response ? error.response.data : error.message);
//     return [];
//   }
// }

// /**
//  * Filter courses based on a search query.
//  * Since the API doesn’t support direct text search via parameters,
//  * we filter the returned courses client-side.
//  */
// async function searchCourses(query) {
//   const courses = await fetchCourses();
//   return courses.filter(course =>
//     course.name && course.name.toLowerCase().includes(query.toLowerCase())
//   );
// }

// // Example usage:
// (async () => {
//   const query = 'cloud'; // Replace with your desired search term
//   const courses = await searchCourses(query);

//   if (courses.length === 0) {
//     console.log(`No courses found for the query: "${query}"`);
//   } else {
//     console.log('Courses found:');
//     courses.forEach(course => {
//       console.log(`Course Name: ${course.name}`);
//       console.log(`Course ID: ${course.id}`);
//       console.log(`Course Slug: ${course.slug}`);
//       console.log('-------------------');
//     });
//   }
// })();

// require('dotenv').config();
// const axios = require('axios');

// const API_BASE_URL = 'https://api.coursera.org/api';

// /**
//  * Fetch courses from the Coursera API.
//  * You can increase the limit to fetch more courses.
//  */
// async function fetchCourses(limit = 50) {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/courses.v1`, {
//       params: {
//         fields: 'name,description,instructorIds,photoUrl',
//         limit, // Increase the limit to get more courses
//       }
//     });
//     return response.data.elements || [];
//   } catch (error) {
//     console.error('Error fetching courses:', error.response ? error.response.data : error.message);
//     return [];
//   }
// }

// /**
//  * Filter courses based on a search query.
//  * If no query is provided, return all fetched courses.
//  */
// async function searchCourses(query, limit) {
//   const courses = await fetchCourses(limit);
//   if (query) {
//     return courses.filter(course =>
//       course.name && course.name.toLowerCase().includes(query.toLowerCase())
//     );
//   }
//   return courses;
// }

// // Example usage:
// (async () => {
//   // Option 1: Get all courses without filtering
//   const allCourses = await searchCourses('', 50); // Try increasing limit if needed
//   console.log('Total Courses Fetched:', allCourses.length);
//   // Optionally, list the course names
//   allCourses.forEach(course => {
//     console.log(`Course Name: ${course.name}`);
//   });
  
//   console.log('\n====================\n');
  
//   // Option 2: Filter courses by a specific query
//   const query = 'cloud'; // Use a query that might match multiple courses
//   const filteredCourses = await searchCourses(query, 50);
//   console.log(`Courses found for "${query}":`, filteredCourses.length);
//   filteredCourses.forEach(course => {
//     console.log(`Course Name: ${course.name}`);
//     console.log(`Course ID: ${course.id}`);
//     console.log(`Course Slug: ${course.slug}`);
//     console.log('-------------------');
//   });
// })();


// require('dotenv').config();
// const axios = require('axios');

// const API_BASE_URL = 'https://api.coursera.org/api';

// /**
//  * Fetch courses from Coursera API.
//  * Returns basic details: name, description, courseType, id, and photoUrl.
//  */
// async function fetchCourses(limit = 50) {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/courses.v1`, {
//       params: {
//         fields: 'name,description,courseType,photoUrl', // Basic course details
//         limit, // Number of courses to return
//       }
//     });
//     return response.data.elements || [];
//   } catch (error) {
//     console.error('Error fetching courses:', error.response ? error.response.data : error.message);
//     return [];
//   }
// }

// // Example usage:
// (async () => {
//   const courses = await fetchCourses(50);
//   console.log(courses) // Adjust the limit as needed
// //   courses.forEach(course => {
// //     console.log(`Name: ${course.name}`);
// //     console.log(`Description: ${course.description}`);
// //     console.log(`Course Type: ${course.courseType}`);
// //     console.log(`ID: ${course.id}`);
// //     console.log(`Thumbnail URL: ${course.photoUrl}`);
// //     console.log(`courseLink " ${course.url}`  )
// //     console.log('----------------------');
    
// //   });
// })();

// require('dotenv').config();
// const axios = require('axios');

// const API_BASE_URL = 'https://api.coursera.org/api';

// /**
//  * Fetch courses with basic details including primaryLanguages and slug.
//  */
// async function fetchCourses(limit = 50) {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/courses.v1`, {
//       params: {
//         fields: 'name,description,courseType,photoUrl,primaryLanguages,slug', // Include language info and slug for link
//         limit, // Number of courses to fetch
//       }
//     });
//     return response.data.elements || [];
//   } catch (error) {
//     console.error('Error fetching courses:', error.response ? error.response.data : error.message);
//     return [];
//   }
// }

// /**
//  * Filter courses to only include those with English as a primary language.
//  */
// async function fetchEnglishCourses(limit = 50) {
//   const courses = await fetchCourses(limit);
//   return courses.filter(course =>
//     course.primaryLanguages && course.primaryLanguages.includes('en')
//   );
// }

// /**
//  * Construct a course link using the course slug.
//  * Coursera course links are typically in the format:
//  * https://www.coursera.org/learn/<course-slug>
//  */
// function getCourseLink(slug) {
//   return `https://www.coursera.org/learn/${slug}`;
// }

// // Example usage:
// (async () => {
//   const englishCourses = await fetchEnglishCourses(50);
//   console.log('Web Devlopment');
//   englishCourses.forEach(course => {
//     console.log(`Name: ${course.name}`);
//     console.log(`Description: ${course.description}`);
//     console.log(`Course Type: ${course.courseType}`);
//     console.log(`Thumbnail URL: ${course.photoUrl}`);
//     console.log(`Languages: ${course.primaryLanguages}`);
//     console.log(`Course Link: ${getCourseLink(course.slug)}`);
//     console.log('----------------------');
//   });
// })();

require('dotenv').config();
const puppeteer = require('puppeteer-core')
const puppeteerExtra  = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

//const cheerio = require('cheerio');

exports. getCourseraCourses = async (query) => {
  // Add stealth plugin to avoid detection
  puppeteerExtra.use(StealthPlugin());

async function scrapeCourseraCourse(url) {
  // async function fetchImgUrl(html) {
  //   const $ = cheerio.load(html);
  //   const img = $('.cds-ProductCard-listPreviewImage img').attr('src');
  //   console.log(img)
  //   return img;
  
  // }
  let browser;
  try {

    // Launch Puppeteer in headless mode
    browser = await puppeteerExtra .launch({
      headless: false,
      dumpio: true,
          // executablePath:
          // process.env.NODE_ENV ==="production"? process.env.PUPPETEER_EXECUTABLE_PATH:puppeteer.executablePath(),
          //headless: true, // Set to false to see the browser window
          args: [    '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--single-process',
            '--disable-accelerated-2d-canvas',
            '--disable-features=WebContentsForceDark',
            '--disable-software-rasterizer',
            '--disable-webgl',
            '--mute-audio',],
        });

    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Navigate to the course page
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });

    // Wait for the DOM to be fully ready
    await page.waitForFunction(() => document.readyState === 'complete');

    // Take a screenshot after the page loads
    // await page.screenshot({ path: 'after_load.png', fullPage: true });
    // console.log('Screenshot saved as after_load.png');
    
    await page.waitForSelector('ul.cds-9 li.cds-11', { timeout: 10000 });
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
    // const htmlContent = await page.content();
    //const $ = cheerio.load(htmlContent);
    //await page.waitForTimeout(3000);
    //await page.waitForSelector('.cds-ProductCard-listPreviewImage', { timeout: 5000 });
    // const imageUrl = await page.evaluate(() => {
    //   const img = document.querySelector('.cds-ProductCard-listPreviewImage img');
    //   return img ? img.src : 'N/A';
    // });
    // console.log(imageUrl);
    const courses = await page.$$eval('ul.cds-9 li.cds-11', (courseElements) => {
        return courseElements.map((course) => {
          const type= "paid"
          const platform = "Coursera"
          const title = course.querySelector('.cds-CommonCard-title')?.textContent.trim() || 'N/A';
          const provider = course.querySelector('.cds-ProductCard-partnerNames')?.textContent.trim() || 'N/A';
          const rating = course.querySelector('.cds-RatingStat-meter span')?.textContent.trim() || 'N/A';
          const reviews = course.querySelector('.cds-CommonCard-ratings .css-vac8rf:nth-child(3)')?.textContent.trim() || 'N/A';
          const description = course.querySelector('.cds-CommonCard-bodyContent p')?.textContent.trim() || 'N/A';
          const level = course.querySelector('.cds-CommonCard-metadata p')?.textContent.trim() || 'N/A';
          const duration = level.split('.').pop().trim();
          // const imageElement = course.querySelector('.cds-ProductCard-listPreviewImage img');
          // const imageUrl = fetchImgUrl(course.outerHTML)
          const imageUrl = course.querySelector('.cds-ProductCard-gridPreviewContainer img')?.getAttribute('srcset') || 'N/A';
          const link = "https://www.coursera.org"+course.querySelector('a[data-click-key="seo_entity_page.search.click.search_card"]')?.getAttribute('href') || 'N/A';
          return {
            type,
            platform,
            provider,
            title,
            description,
            rating,
            reviews,
            duration,
            level,
            imageUrl,
            link
           

            
          };
        });
      });
   
      //console.log('Extracted Course Data:', JSON.stringify(courses, null, 2));
    // console.log('Page HTML content fetched successfully result is ', htmlContent);

    //Save the HTML to a file
    // const fs = require('fs');
    // fs.writeFileSync('coursera.html', htmlContent);
    // console.log('HTML saved to udemy_page.html');
    // console.log(htmlContent);
    //const htmlContent = await page.content();

    // Close the browser
    await browser.close();
    console.log('getting the coursesm completed successfully');
    return courses;
  } catch (error) {
    console.error(`Data scraping error: ${error.message}`);
    if (browser) await browser.close();
    throw error;
  }
}

// Example usage
const courseUrl = `https://www.coursera.org/courses?query=${query}&skill=${query}&page=1`;
const result =await scrapeCourseraCourse(courseUrl);
//console.log(result)
return result
  // .then(() => console.log('Scraping completed!'))
  // .catch((err) => console.error('Error during scraping:', err.message));
    
}
//  getCourseraCourses("data structures and algorithms");

