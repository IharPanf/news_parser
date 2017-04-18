var request = require("request");
var cheerio = require("cheerio");
var url = "https://news.tut.by/";
var jsonfile = require('jsonfile');

var file = 'data.json';
var listOfNews = [];
var counterForParsing = 0;
var LIMIT = 5;
//Class for creating news object
function News() {
    return {
        "index": null,
        "rubric": "",
        "fullNewsUrl": null,
        "imageUrl": null,
        "shortDescription": "",
        "fullText": ""
    }
}

request(url, function (error, response, body) {
    if (!error) {
        var $ = cheerio.load(body);

        $('.b-section').each(function () {
            var currentCategoryNews = $(".b-lists-rubric .b-label", this).text();

            $(".lists__li", this).each(function () {
                counterForParsing++;
                var currentNews = new News();
                currentNews.rubric = currentCategoryNews;
                currentNews.date = $(this).attr('data-tm');
                currentNews.index = $(this).attr('data-id');
                currentNews.imageUrl = $("img", this).attr('src');
                currentNews.fullNewsUrl = $(" > a", this).attr('href');
                currentNews.shortDescription = $(" > a", this).text();
                listOfNews.push(currentNews);
            });
        });
        var n = 0;
        listOfNews.forEach(function (item) {
            if (n < LIMIT) {
                request(item.fullNewsUrl, function (error, response, body) {
                    if (!error) {
                        var $ = cheerio.load(body);
                    }
                    item.fullText = "124";
                });
            }
            n++;
        });
    } else {
        console.log("Error: " + error);
    }
});

/*for (var i = 0; i < listOfNews.length; i++) {
    var currentFullUrl = listOfNews[0]['fullNewsUrl'];
    console.log(currentFullUrl);
    if (i < 5) {
        request(currentFullUrl, function (error, response, body) {
            if (!error) {
                var $ = cheerio.load(body);
                //currentNews.fullText = $(".js-mediator-article").text();
                console.log($(".js-mediator-article").text());
            } else {
                console.log("Error: " + error);
            }
        })
    }
}*/

/*
 if (counterForParsing < 5) {
 request(currentNews.fullNewsUrl, function (error, response, body) {
 if (!error) {
 var $ = cheerio.load(body);
 currentNews.fullText = $(".js-mediator-article").text();
 console.log(currentNews.fullText);
 } else  {
 console.log("Error: " + error);
 }
 })
 }

 */