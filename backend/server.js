var http = require("http");
var url = require("url");
var DB = require('./classes/db');
var jsonfile = require('jsonfile');
var finalhandler = require('finalhandler');
var Router = require('router');

var fileOfSettings = "./../config.json";
var settings = jsonfile.readFileSync(fileOfSettings);
var collectionName = settings.collectionName;
var urlDatabase = settings.mongoUrl + settings.dbName;

var dbNews = new DB();

var router = Router();

router.get('/', function (req, res) {
    res.end(JSON.stringify(settings));
});

router.get('/api', function (req, res) {
    res.end('API works....'); // will return help for API endpoint
});

//return all news
router.get('/api/all_news', function (req, res) {
    dbNews.connectDB(urlDatabase).then(function (selDb) {
        dbNews.returnNews({}, collectionName, selDb, function (result, db) {
            var outputJSON = JSON.stringify(result);
            res.end(outputJSON);
            console.log('Connection close');
            db.close();
        });
    });
});

//count words
router.get('/api/words', function (req, res) {
    dbNews.connectDB(urlDatabase).then(function (selDb) {
        dbNews.countWordsInCollection(collectionName, selDb, function (result, db) {
            var outputJSON = JSON.stringify(result);
            res.end(outputJSON);
            console.log('Connection close');
            db.close();
        });
    });
});

//return near news
router.get('/api/news', function (req, res) {
    var uri = url.parse(req.url, true);
    dbNews.connectDB(urlDatabase).then(function (selDb) {
        dbNews.returnNearNews(collectionName, selDb, uri.query.lat, uri.query.lng, uri.query.radius, function (result, db) {
            if (result) {
                var outputJSON = JSON.stringify(result);
                res.end(outputJSON);
            } else {
                res.end();
            }
            console.log('Connection close');
            db.close();
        });
    });
});

var server = http.createServer(function (request, response) {
    response.writeHead(200,
        {
            "Content-Type": "application/json, charset=windows-1251",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, " +
            "Access-Control-Allow-Origin, Authorization, X-Requested-With"
        });

    router(request, response, finalhandler(request, response));
});

server.listen(8080, function () {
    console.log("Server is listening port 8080...");
});
