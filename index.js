var request = require("request");
var cheerio = require("cheerio");
var jsonfile = require('jsonfile');
var async = require('async');
var pCommandLine = require('optimist').argv;
var assert = require('assert');

var News = require('./classes/news');
var DB = require('./classes/db');

var fileOfSettings = "./settings.json";
var settings = jsonfile.readFileSync(fileOfSettings);
var collectionName = settings.collectionName;
var urlDatabase = settings.mongoUrl + settings.dbName;
const LIMIT = pCommandLine.limit || settings.limit;

var counterForParsing = 0;
var listOfNews = [];

var dbNews  = new DB();

request(settings.urlParse, function (error, response, body) {
    if (!error) {
        var $ = cheerio.load(body);
        $('.b-section').each(function () {
            if (counterForParsing < LIMIT) {
                var currentCategoryNews = $(".b-lists-rubric .b-label", this).text();
                $(".lists__li", this).each(function () {
                    if (counterForParsing < LIMIT) {
                        counterForParsing++;
                        var currentNews = new News();
                        currentNews.rubric = currentCategoryNews;
                        var currentDate = $(this).attr('data-tm');
                        currentNews.date = new Date(currentDate * 1000);
                        currentNews.index = $(this).attr('data-id');
                        currentNews.imageUrl = $("img", this).attr('src');
                        currentNews.fullNewsUrl = $(" > a", this).attr('href');
                        currentNews.shortDescription = $(" > a", this).text();

                        //parse full text for every news
                        if (currentNews.fullNewsUrl) {
                            request(currentNews.fullNewsUrl, function (error, response, body) {
                                if (!error) {
                                    var $ = cheerio.load(body);
                                    currentNews.fullText = $('#article_body').text();
                                    currentNews.fullText = currentNews.fullText.replace(/(?:\\[rn]|[\r\n]+)+/g, "");

                                    $('.b-article-info-tags li').each(function () {
                                        var tags = $(this).text().split(':');
                                        currentNews.info_tag[tags[0]] = tags[1];
                                    });

                                    dbNews.insertRecord(currentNews, collectionName, urlDatabase);
                                }
                            });
                        }
                        listOfNews.push(currentNews);
                    }
                });
            }
        });
        //@Todo need wait while all request will be done
/*        jsonfile.writeFile(settings.fileTempData, listOfNews, function () {
            console.log('............Ready!');
        });*/
    } else {
        console.log("Error: " + error);
    }
});

