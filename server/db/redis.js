const redis = require("redis");
const client = redis.createClient();
// const client = null;
module.exports = client;
