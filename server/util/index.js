//编写一个中间件，用来获取post参数
const body = () => {
    return async (ctx, next) => {
        await new Promise((resolve, reject) => {
            let reg = /\/upload\/.+/;
            let isUpload = reg.test(ctx.path);
            if (ctx.method === "POST" && !isUpload) {
                let body = "";
                ctx.req.on("data", chunk => {
                    body += chunk;
                });
                ctx.req.on("end", async () => {
                    ctx.params = JSON.parse(body);
                    resolve();
                });
            } else {
                resolve();
            }
        });
        await next();
    }
}

//允许跨域
const allowCORS = async (ctx, next) => {
    // ctx.set("Access-Control-Allow-Origin", "120.78.221.14,localhost:8080");
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Headers", "X-Requested-With,X-PINGOTHER,Content-Type");
    ctx.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    await next();
}

//校验用户是否登录
const validateUser = async (ctx, next) => {
    if (!ctx.session.userInfo) {
        ctx.status = 401;
        ctx.body = "need sign in for todo!";
    } else {
        await next();
    }
}

module.exports = {
    body,
    validateUser,
    allowCORS
}