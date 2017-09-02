var http = require("http");
var url = require("url");
var DB = require('./classes/db');
var jsonfile = require('jsonfile');

//Todo need resolve duplicate
var fileOfSettings = "./../config.json";
var settings = jsonfile.readFileSync(fileOfSettings);
var collectionName = settings.collectionName;
var urlDatabase = settings.mongoUrl + settings.dbName;

var dbNews = new DB();

var server = http.createServer(function (request, response) {
    var uri = url.parse(request.url, true);
    response.writeHead(200,
        {
            "Content-Type": "application/json, charset=windows-1251",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With"
        });
    //return all news
    dbNews.connectDB(urlDatabase).then(function (selDb) {
        dbNews.returnNews({}, collectionName, selDb, function (result, db) {
            var outputJSON = JSON.stringify(result);
            response.end(outputJSON);
            console.log('Connection close');
            db.close();
        });
    });


}).listen(8080, function () {
    console.log("Server is listening port 8080...");
});
