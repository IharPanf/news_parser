var NodeGeocoder = require('node-geocoder');

function News() {
}

News.prototype.getNews = function () {
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

News.prototype.getCoordinates = function (infoTag, geoKey) {
    var address = '';
    if (infoTag) {
        for (var prop in infoTag) {
            if (prop === 'Страны' || prop === 'Области' || prop === 'Города') {
                address += infoTag[prop] ? (infoTag[prop] + '+').trim() : '';
            }
        }
    }
    if (!address) {
        address = infoTag['Страны'] = 'Беларусь';
    }

    var options = {
        provider: 'google',
        httpAdapter: 'https',
        apiKey: geoKey,
        formatter: null
    };

    var geocoder = NodeGeocoder(options);
    return geocoder.geocode(address)
};

module.exports = News;
