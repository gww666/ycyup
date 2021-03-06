const Koa = require("koa");
const {body, allowCORS} = require("./util");
const apiRouter = require("./router");
const getDB = require("./db/connect.js");
const redis = require("./db/redis");
const session = require("koa-session");
const app = new Koa();
//配置session
app.keys = ["todo list key"]
app.use(session({
    maxAge: 1000 * 60 * 5
}, app));
//初始化
app.use(async (ctx, next) => {
    //连接数据库
    try {
        ctx.db = await getDB();
        ctx.redis = redis;
    } catch (err) {
        console.log("连接数据库出错：", err);
    }
    await next();
})
//注册解析post参数的中间件，后续会把post类型的参数挂载到ctx.params上
app.use(body());
app.use(allowCORS);
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
let hostname = "172.18.249.80";
let port = "3343";
app.listen(port, hostname, () => {
    console.log("todo server is running"); 
});

