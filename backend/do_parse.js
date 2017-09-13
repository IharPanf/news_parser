var request = require("request");
var cheerio = require("cheerio");
var jsonfile = require('jsonfile');
var async = require('async');
var pCommandLine = require('optimist').argv;

var fileOfSettings = "./../config.json";
var settings = jsonfile.readFileSync(fileOfSettings);
var collectionName = settings.collectionName;
var urlDatabase = settings.mongoUrl + settings.dbName;
var LIMIT = pCommandLine.limit || settings.limit;

var DB = require('./classes/db');
var Parser = require('./classes/parser');

var dbNews = new DB();
var parser = new Parser(LIMIT);

// Parser
parser.parseInformation(settings.urlParse).then(function (res) {
    if (res) {
        Promise.all(parser.promisesParseFullText).then(function () {
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
