var MongoClient = require('mongodb').MongoClient;

function DB() {}

DB.prototype.connectDB = function (urlDB) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(urlDB, function (err, db) {
            if (!err) {
                console.log('Connected...');
                resolve(db);
            } else {
                console.log('Error connection for DB: ', err);
                reject(err);
            }
        })
    });
};

DB.prototype.insertRecord = function (item, collectionName, db) {
    return new Promise(function (resolve, reject) {
        var collection = db.collection(collectionName);
        var hasRecord = collection.findOne({index: item.index});
        hasRecord.then(function (result) {
            if (!result) {
                collection.insertOne(item, function (err, result) {
                    if (!err) {
                        console.log("Inserted " + result.ops.length + " documents into the document collection");
                        resolve();
                    } else {
                        console.log('Error: ', err);
                        reject()
                    }
                });
            } else {
                resolve();
            }
        }, function (error) {
            console.log(error);
            reject();
        });
    })
};

DB.prototype.returnNews = function (item, collectionName, db, callback) {
    db.collection(collectionName).find(item).toArray(function (err, docs) {
        callback(docs, db);
    });
};

DB.prototype.createGeospatialIndex = function (collectionName, db) {
    var collection = db.collection(collectionName);
    collection.createIndex( { location: "2dsphere" } );
    console.log('Geospatial was created');
};

DB.prototype.createUniqueIndex = function (collectionName, db) {
    var collection = db.collection(collectionName);
    collection.createIndex({ date: 1, shortDescription: 1 }, { unique: true });
    console.log('Composite unique index by date / time and name was created');
};

module.exports = DB;
