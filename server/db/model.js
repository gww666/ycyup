//定义公共遍历方法
const each = (array) => {
    let list = [];
    let trans = key => {
        // 将下划线改为小驼峰式命名法则
        let temp = key.split("_");
        if (temp.length === 1) return key;
        temp.map((item, index) => {
            if (index !== 0) {
                return item = item.slice(0, 0).toUpperCase() + item.slice(1);
            } else {
                return item;
            }
        });
    }
    array.forEach((item, index) => {
        Object.entries(item).forEach(kv => {
            if (!list[index]) list[index] = {};
            list[index][trans(kv[0])] = kv[1];
        });
    });
    return list;
}
//获取用户信息
const getUserInfo = async (ctx) => {
    let mysql = ctx.db;
    let {account, password} = ctx.params;
    let sql = "select id,nickname,photo from user where account = ? and password = ?";
    let [rows] = await mysql.execute(sql, [account, password]);
    return each(rows);
}

module.exports = {
    getUserInfo
}