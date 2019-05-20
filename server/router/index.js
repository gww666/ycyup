const KoaRouter = require("koa-router");
const {getUserInfo} = require("../db/model");
const {SucModel, ErrModel} = require("../util/resModel");
const router = new KoaRouter({
    prefix: "/api"
});
router.post("/login", async (ctx, next) => {
    try {
        let userInfo = await getUserInfo(ctx);
        ctx.body = new SucModel(userInfo, "success");
    } catch (err) {
        ctx.body = new ErrModel([], "获取用户信息失败——" + JSON.stringify(err));
    }
});
module.exports = router;