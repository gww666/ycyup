const redis = require("redis");
const {promisify} = require("util");
const bluebird = require("bluebird");
// bluebird.promisifyAll(redis);
const client = redis.createClient();
const get = promisify(client.get).bind(client);
// client.set("a", "1212", "EX", 20);
(async () => {
    let v1 = await get("a");
    // let v2 = await client.get("a2");
    let v2 = await get("a2");
    console.log(v1, v2);
    // client.get("a2", (err, res) => {
    //     console.log(res);
    // });
    // console.log(v2);
})();