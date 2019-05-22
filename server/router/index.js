const KoaRouter = require("koa-router");
const {
    getUserInfo, 
    insertTodoItem, 
    updateTodoItem,
    selectTodoList
} = require("../db/model");
const {SucModel, ErrModel} = require("../util/resModel");
const router = new KoaRouter({
    prefix: "/api"
});

//自动登录接口
router.get("/autoLogin", async ctx => {
    let userInfo = ctx.session.userInfo;
    if (userInfo) {
        ctx.body = new SucModel([userInfo], "success");
    } else {
        ctx.body = new ErrModel([], "登录信息失效");
    }
});

//登录接口
router.post("/login", async (ctx, next) => {
    try {
        let userInfo = await getUserInfo(ctx);
        if (!userInfo.length) {
            ctx.body = new ErrModel([], "用户名或密码错误");
            return;
        }
        // 存储session
        ctx.session.userInfo = userInfo[0];
        ctx.body = new SucModel(userInfo, "success");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "获取用户信息失败——" + JSON.stringify(err));
    }
});
//todo接口
router.post("/todo", async (ctx, next) => {
    let {id} = ctx.params;
    try {
        if (id) {
            //编辑操作
            await updateTodoItem(ctx);
        } else {
            //新增操作
            await insertTodoItem(ctx);
        }
        ctx.body = new SucModel([], "success");
    } catch (err) {
        console.log("err", err);
        let tag = id ? "更新todo-item出错：" : "新增todo-item出错：";
        ctx.body = new ErrModel([], tag + JSON.stringify(err));
    }
});

//查询todo-list接口
router.get("/todoList", async (ctx, next) => {
    try {
        let data = await selectTodoList(ctx);
        ctx.body = new SucModel(data, "success");
    } catch (err) {
        ctx.body = new ErrModel([], "查询todoList出错：" + JSON.stringify(err));
    }
});

module.exports = router;