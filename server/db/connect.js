const mysql = require("mysql2");
const {db} = require("./config");
let pool = null;
const getDB = () => {
    return new Promise(async resolve => {
        if (pool) {
            resolve(pool);
        } else {
            pool = mysql.createPool(db);
            pool = pool.promise();
            resolve(pool);
        }
    });
}
module.exports = getDB;