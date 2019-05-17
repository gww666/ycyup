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

module.exports = {
    body
}