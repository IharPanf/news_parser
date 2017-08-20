const https = require('https');

function News() {}

News.prototype.getNews = function() {
    return {
        "index": null,
        "rubric": "",
        "fullNewsUrl": null,
        "imageUrl": null,
        "shortDescription": "",
        "fullText": "",
        "info_tag": {}
    }
};

News.prototype.setCountry = function(infoTag) {
    if (infoTag && !infoTag['Страны']) {
        infoTag['Страны'] = 'Беларусь';
    }
    return infoTag;
};

News.prototype.getCoordinates = function(infoTag, geocodeUrl) {
    var address = '';
    if (infoTag) {
        for(var prop in infoTag) {
            if (prop === 'Страны' || prop === 'Области' || prop === 'Города') {
                address += infoTag[prop] ? infoTag[prop] : '';
            }
        }
    }
    console.log(address);
};

module.exports = News;