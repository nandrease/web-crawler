const axios = require('axios');
const cheerio = require('cheerio');
const url = "http://akadeemia.aripaev.ee/koolitajad";

const koolitajadData = []

fetchData(url).then( (res) => {
    const html = res.data;
    const $ = cheerio.load(html);
    const koolitajad = $('.trainer');
    koolitajad.each(function() {
        let link = $(this).attr('href');
        koolitajadData.push(link);
    });
    return koolitajadData;
}).then(data => {
    data.forEach(koolitaja => {
        fetchData(koolitaja).then(res => {
            const html = res.data;
            const $ = cheerio.load(html);
            const image = $('.portrait').attr('style')
            let clean = /\(.*?\)*$/.exec(image)[0];
            const name = $('.details > h2').text();
            console.log(name + ' ' + clean);
        })
    })
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