var request = require("request");
var cheerio = require("cheerio");
var url = "https://news.tut.by/";
var jsonfile = require('jsonfile');
var async = require('async');

var file = 'data.json';
var listOfNews = [];
var counterForParsing = 0;
var LIMIT = 5;
var n = 0;

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
async.waterfall([
    function parseMainPage(callback) {
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
            } else {
                console.log("Error: " + error);
            }
            callback(null, listOfNews);
        });
    },
    function parseSubParse(listOfNews, callback) {
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
        callback(null, listOfNews);
    },
    function showNews(listOfNews) {
        console.log(listOfNews);
    }
]);



/*
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
});*/
