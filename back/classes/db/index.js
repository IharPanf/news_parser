var MongoClient = require('mongodb').MongoClient;

function DB() {}

DB.prototype.insertRecord = function (item, collectionName, urlDB) {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(urlDB, function (err, db) {
            if (err) {
                console.log('Error connection for DB: ', err);
            } else {
                console.log('Connected...');
                var collection = db.collection(collectionName);
                var hasRecord = collection.findOne({index: item.index});
                hasRecord.then(function(result) {
                    if(!result) {
                        collection.insertOne(item, function (err, result) {
                            if (err) {
                                console.log('Error: ', err);
                            }
                            console.log("Inserted " + result.ops.length + " documents into the document collection");
                            db.close();
                            resolve();
                        });
                    }
                    db.close();
                }, function (error) {
                    console.log(error);
                    console.log('Connection closed');
                    db.close();
                    reject();
                });
            }
        }); 
    })
};

DB.prototype.returnNews = function(item, collectionName, urlDB, callback) {
    MongoClient.connect(urlDB, function (err, db) {
        if (err) {
            console.log('Error connection for DB: ', err);
        } else {
            db.collection(collectionName).find(item).toArray(function(err, docs) {
                callback(docs);
                db.close();
            });
        }
    });
};

module.exports = DB;
