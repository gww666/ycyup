const mysql = require("mysql2/promise");
const {db} = require("./config");
let _db = null;
const getDB = () => {
    return new Promise(async resolve => {
        if (_db) {
            resolve(_db);
        } else {
            _db = await mysql.createConnection(db);
            resolve(_db);
        }
    });
}
module.exports = getDB;