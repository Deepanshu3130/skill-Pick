require('dotenv').config({ path: '../.env' });

const {getUdemyCourses} = require('../udemyScrapper');
const {getCourseraCourses} = require('../cousera');
const {youtubeCourses} = require('../youtubeData');

 const updateUdemyQuery = (query) =>{
    return query.trim().replace(/\s+/g,'-');
 }
const gatherData = async(query) =>{
    try{
        let result =[]
       
        //get the data from the udemy scrapper
        const udemyResult = await getUdemyCourses(updateUdemyQuery(query));
        // get from the coursera scrapper
        const courseraResult = await getCourseraCourses(query);
       //get from the youtube api
       const youtubeResult = await youtubeCourses(query);
     
        // combine the results

       result=[...udemyResult,...courseraResult, ...youtubeResult];
      console.log(result);
       return result;
    }catch(error){
        return error;
    }
}
gatherData();
