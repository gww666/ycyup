//定义公共遍历方法
const each = (array) => {
    let list = [];
    let trans = key => {
        // 将下划线改为小驼峰式命名法则
        let temp = key.split("_");
        if (temp.length === 1) return key;
        return temp[0] + temp[1].slice(0, 1).toUpperCase() + temp[1].slice(1);
    }
    array.forEach((item, index) => {
        Object.entries(item).forEach(kv => {
            if (!list[index]) list[index] = {};
            // console.log("转换后的key", trans(kv[0]));
            list[index][trans(kv[0])] = kv[1];
        });
    });
    return list;
}
//获取用户信息
const getUserInfo = async (ctx) => {
    let mysql = ctx.db;
    let {account, password} = ctx.params;
    let sql = "select id, nickname, photo, account from user where account = ? and password = ?";
    let [rows] = await mysql.execute(sql, [account, password]);
    return each(rows);
}

//查询todo-list
const selectTodoList = async ctx => {
    let {state, userId} = ctx.query;
    let mysql = ctx.db;
    let sql = "";
    let p = [];
    if (state && userId) {
        sql = "select * from list where user_id = ? and state = ? order by create_date desc";
        p = [userId, state];
    } else if (state) {
        sql = "select * from list where state = ? order by create_date desc";
        p = [state];
    } else if (userId) {
        sql = "select * from list where user_id = ? order by create_date desc";
        p = [userId];
    } else {
        sql = "select * from list order by create_date desc";
    }
    let [rows] = await mysql.execute(sql, p);
    return each(rows);
} 

//新增一条todo-item
//state 0删除 1正常 2完成 3逾期
const insertTodoItem = async ctx => {
    let mysql = ctx.db;
    let {title, content, createDate, endDate, userId} = ctx.params;
    console.log("params", ctx.params);
    let sql = "insert into list(id, user_id, title, content, create_date, end_date, state, sort) values(?, ?, ?, ?, ?, ?, ?, ?)";
    await mysql.execute(sql, [null, userId, title, content, createDate, endDate, 1, 0]);
}

//更新一条todo-item
//state 0删除 1正常 2逾期
const updateTodoItem = async ctx => {
    let mysql = ctx.db;
    let {id, title, content, endDate, state, sort} = ctx.params;
    //状态变更，比如删除操作
    if (state !== undefined) {
        let sql = "update list set state = ? where id = ?";
        await mysql.execute(sql, [state, id]);
    } else if (sort) {

    } else {
        let sql = "update list set title = ?, content = ?, end_date = ? where id = ?";
        await mysql.execute(sql, [title, content, endDate, id]);
    }
}

module.exports = {
    getUserInfo,
    insertTodoItem,
    updateTodoItem,
    selectTodoList
}