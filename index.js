var request = require("request"),
    cheerio = require("cheerio"),
    url = "https://news.tut.by/";

request(url, function (error, response, body) {
    if (!error) {
        var $ = cheerio.load(body);
        var news = [];
        $('.b-section').each(function() {
            $('.b-lists').each(function() {
                $('.media img').each(function() {
                    console.log($(this).attr('src'));
                });
                $('li.lists__li > a').each(function() {
                    console.log($(this).text());
                    console.log('\n');
                    console.log($(this).attr('href'))
                });
            });
        });
    } else {
        console.log("Error: " + error);
    }
});