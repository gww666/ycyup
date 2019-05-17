const Koa = require("koa");
const {body} = require("./util");
const apiRouter = require("./router");
const getDB = require("./db/connect.js");
const app = new Koa();
//初始化
(async () => {
    //连接数据库
    app.db = await getDB();
    //注册解析post参数的中间件，后续会把post类型的参数挂载到ctx.params上
    app.use(body());
    app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
})();

