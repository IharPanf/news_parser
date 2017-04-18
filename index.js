var request = require("request");
var cheerio = require("cheerio");
var url = "https://news.tut.by/";
var jsonfile = require('jsonfile');
var async = require('async');
var pCommandLine = require('optimist').argv;

var file = 'data.json';
var listOfNews = [];
var counterForParsing = 0;
var LIMIT = pCommandLine.limit || 5;

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

            if (counterForParsing < LIMIT) {
                $(".lists__li", this).each(function () {
                    if (counterForParsing < LIMIT) {
                        counterForParsing++;
                        var currentNews = new News();
                        currentNews.rubric = currentCategoryNews;
                        currentNews.date = $(this).attr('data-tm');
                        currentNews.index = $(this).attr('data-id');
                        currentNews.imageUrl = $("img", this).attr('src');
                        currentNews.fullNewsUrl = $(" > a", this).attr('href');
                        currentNews.shortDescription = $(" > a", this).text();
                        listOfNews.push(currentNews);
                    }
                });
            }
        });

        //parse full text for news
        async.each(listOfNews, function (item, callback) {
            if (item.fullNewsUrl) {
                request(item.fullNewsUrl, function (error, response, body) {
                    if (!error) {
                        var $ = cheerio.load(body);
                    }
                    item.fullText = "test";
                    callback();
                });
            }
        }, function (err, result) {
               console.log(listOfNews);
        });
    } else {
        console.log("Error: " + error);
    }
});
