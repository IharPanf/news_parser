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

module.exports = DB;
