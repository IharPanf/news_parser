var request = require("request");
var cheerio = require("cheerio");
var jsonfile = require('jsonfile');
var async = require('async');
var pCommandLine = require('optimist').argv;
var assert = require('assert');

var News = require('./classes/news');
var DB = require('./classes/db');

var fileOfSettings = "./../config.json";
var settings = jsonfile.readFileSync(fileOfSettings);
var collectionName = settings.collectionName;
var urlDatabase = settings.mongoUrl + settings.dbName;
var LIMIT = pCommandLine.limit || settings.limit;

var counterForParsing = 0;
var listOfNews = [];

var dbNews = new DB();
var selectedNews = new News();

var promisesParseFullText = [];

function parseFullText(selNews) {
    return new Promise(function (resolve, reject) {
        request(selNews.fullNewsUrl, function (error, response, body) {
            if (!error) {
                var $ = cheerio.load(body);
                selNews.fullText = $('#article_body').text();
                selNews.fullText = selNews.fullText.replace(/(?:\\[rn]|[\r\n]+)+/g, "");

                $('.b-article-info-tags li').each(function () {
                    var tags = $(this).text().split(':');
                    tags[0] = tags[0].replace('.', ' ');
                    selNews.info_tag[tags[0]] = tags[1];
                });
                parseCoordinate(selNews).then(function () {
                    resolve()
                })
            } else {
                reject();
            }
        });
    });
}

function parseCoordinate(selNews) {
    return new Promise(function (resolve, reject) {
        selectedNews.getCoordinates(selNews.info_tag, settings.googleApiKey)
            .then(function (res) {
                selNews.location = {
                    type: "Point",
                    coordinates: [res[0].latitude, res[0].longitude - 90] // 90 - convert longitude 
                };
                resolve();
            })
            .catch(function (err) {
                reject();
                console.log('Error getting coordinates:' + err);
            });
    })
}

function parseShortInformation(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (!error) {
                var $ = cheerio.load(body);
                $('.b-section').each(function () {
                    if (counterForParsing < LIMIT) {
                        var currentCategoryNews = $(".b-lists-rubric .b-label", this).text();
                        $(".lists__li", this).each(function () {
                            if (counterForParsing < LIMIT) {
                                counterForParsing++;
                                var currentNews = selectedNews.getNews();
                                currentNews.rubric = currentCategoryNews;
                                var currentDate = $(this).attr('data-tm');
                                currentNews.date = new Date(currentDate * 1000);
                                currentNews.index = $(this).attr('data-id');
                                currentNews.imageUrl = $("img", this).attr('src');
                                currentNews.fullNewsUrl = $(" > a", this).attr('href');
                                currentNews.shortDescription = $(" > a", this).text();

                                //parse full text for every news
                                if (currentNews.fullNewsUrl) {
                                    promisesParseFullText.push(parseFullText(currentNews).then(function () {
                                        listOfNews.push(currentNews);

                                    }));
                                }
                            }
                        });
                    }
                });
            } else {
                reject();
                console.log("Error: " + error);
            }
            resolve(listOfNews);
        });
    })
}

// Parser
parseShortInformation(settings.urlParse).then(function (res) {
    if (res) {
        Promise.all(promisesParseFullText).then(function () {
            var promisesInsertInDatabase = [];
            dbNews.connectDB(urlDatabase).then(function (selDb) {
                for (var i = 0; i < res.length; i++) {
                    promisesInsertInDatabase.push(dbNews.insertRecord(res[i], collectionName, selDb));
                }
                Promise.all(promisesInsertInDatabase).then(function () {
                    dbNews.createGeospatialIndex(collectionName, selDb);
                    dbNews.createUniqueIndex(collectionName, selDb);
                    selDb.close();
                    console.log(promisesInsertInDatabase.length + ' documents were parsed. Connection close. Finish parsing...');
                });
            });
        })
    }
});
