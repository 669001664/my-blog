const Router = require("@koa/router")
const router = new Router()

var mysql = require("mysql");
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "123456",
    database: "myblog",
});

//首页
router.get("/", async (ctx, next) => {
    await ctx.render("index");
})
//登录
router.get("/login", async (ctx, next) => {
    await ctx.render("login");
})

function getUserData(username, password) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(
                    //   "SELECT * FROM t_user where username='"+username+"' and password='"+password+"'",
                    `SELECT * FROM t_user where username='${username}' and password='${password}'`,
                    function (error, results) {
                        connection.release(); //释放连接，放回pool中
                        if (error) {
                            reject(err);
                        } else {
                            resolve(results)
                        }
                    }
                );
            }
        });
    });
}

router.post("/login", async (ctx, next) => {
    let { username, password } = ctx.request.body
    let results = await getUserData(username, password);
    if (results.legth > 0) {
     await ctx.render("index")
    } else {
        await ctx.render("error", {
            message: "登陆失败，用户名或密码错误"
        })
    }
})

module.exports = router