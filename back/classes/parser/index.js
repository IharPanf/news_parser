var request = require("request");
var cheerio = require("cheerio");
var jsonfile = require('jsonfile');

var fileOfSettings = "./../config.json";
var settings = jsonfile.readFileSync(fileOfSettings);
var News = require('./../../classes/news');

function Parser (limit) {
    this.promisesParseFullText = [];
    this.selectedNews = new News();
    this.counterForParsing = 0;
    this.listOfNews = [];
    this.limit = limit;
}

Parser.prototype.parseFullText = function (selNews) {
    var self = this;
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
                self.parseCoordinate(selNews).then(function () {
                    resolve()
                })
            } else {
                reject();
            }
        });
    });
};

Parser.prototype.parseCoordinate = function (selNews) {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.selectedNews.getCoordinates(selNews.info_tag, settings.googleApiKey)
            .then(function (res) {
                selNews.location = {
                    type: "Point",
                    coordinates: [res[0].longitude, res[0].latitude]
                };
                resolve();
            })
            .catch(function (err) {
                reject();
                console.log('Error getting coordinates:' + err);
            });
        resolve();
    })
};

Parser.prototype.parseInformation = function (url) {
    var self = this;
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (!error) {
                var $ = cheerio.load(body);
                $('.b-section').each(function () {
                    if (self.counterForParsing < self.limit) {
                        var currentCategoryNews = $(".b-lists-rubric .b-label", this).text();
                        $(".lists__li", this).each(function () {
                            if (self.counterForParsing < self.limit) {
                                self.counterForParsing++;
                                var currentNews = self.selectedNews.getNews();
                                currentNews.rubric = currentCategoryNews;
                                var currentDate = $(this).attr('data-tm');
                                currentNews.date = new Date(currentDate * 1000);
                                currentNews.index = $(this).attr('data-id');
                                currentNews.imageUrl = $("img", this).attr('src');
                                currentNews.fullNewsUrl = $(" > a", this).attr('href');
                                currentNews.shortDescription = $(" > a", this).text();

                                //parse full text for every news
                                if (currentNews.fullNewsUrl) {
                                    self.promisesParseFullText.push(self.parseFullText(currentNews).then(function () {
                                        self.listOfNews.push(currentNews);

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
            resolve(self.listOfNews);
        });
    })
};

module.exports = Parser;