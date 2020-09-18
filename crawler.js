const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const Path = require('path');
const logger = fs.createWriteStream('myData.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
  })
  
const URLs = [
    "https://www.google.com",
    "https://www.youtube.com"
];

URLs.map((url) => {
    fetchData(url).then( (res) => {
        const html = res.data;
        const $ = cheerio.load(html);
        const container = $('.container').text();
        logger.write(`Container Contents : ${container}`);

        //downloadImage(imgURL, folderToSave, imgName);
    })
    .catch(err => console.log(err));
})

async function fetchData(url){
    console.log("Crawling data...")
    // make http call to url
    let response = await axios(url).catch((err) => console.log(err));

    if(response.status !== 200){
        console.log("Error occurred while fetching data");
        return;
    }
    return response;
}

async function downloadImage (url, folder, imgName) { 
    let dir = `${__dirname}/${folder}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    imgName = imgName.replace(/(\r\n|\n|\r)/gm,"");
    const path = Path.resolve(__dirname, folder, imgName);
    const writer = fs.createWriteStream(path);
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
  
    response.data.pipe(writer)
  
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }