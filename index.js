var request = require("request");
var cheerio = require("cheerio");
var jsonfile = require('jsonfile');
var async = require('async');
var pCommandLine = require('optimist').argv;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var urlParse = "https://news.tut.by/";
var file = 'data.json';
var listOfNews = [];
var counterForParsing = 0;
var LIMIT = pCommandLine.limit || 5;
var dbName = 'news';
var urlDatabase = 'mongodb://localhost:27017/' + dbName;

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

request(urlParse, function (error, response, body) {
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
                        item.fullText = $('#article_body').text();
                    }
                    callback();
                });
            }
        }, function (err, result) {
            //save in json file
            jsonfile.writeFile(file, listOfNews, function() {
                console.log('............Ready!');
            });

            //save in MongoDB
            MongoClient.connect(urlDatabase, function(err, db) {
                assert.equal(null, err);
                console.log("Connected correctly to server");

                insertDocuments(db, listOfNews,function() {
                    db.close();
                });
            });
        });
    } else {
        console.log("Error: " + error);
    }
});

var insertDocuments = function(db, listOfObj, callback) {
    // Get the documents collection
    var collection = db.collection('news_doc');
    // Insert some documents
    collection.insertMany(listOfObj, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted " + result.ops.length +" documents into the document collection");
        callback(result);
    });
};