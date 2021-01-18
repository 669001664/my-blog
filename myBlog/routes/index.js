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
//登录

// function getBlogData(username, password) {
//     return new Promise((resolve, reject) => {
//         pool.getConnection(function (err, connection) {
//             if (err) {
//                 // not connected!
//                 reject(err);
//             } else {
//                 connection.query(
//                     `SELECT * FROM t_blog`,
//                     function (error, results) {
//                         connection.release(); //释放连接，放回pool中
//                         if (error) {
//                             reject(err);
//                         } else {
//                             resolve(results);
//                         }
//                     }
//                 );
//             }
//         });
//     });
// }

// function getUserData(username, password) {
//     return new Promise((resolve, reject) => {
//         pool.getConnection(function (err, connection) {
//             if (err) {
//                 reject(err)
//             } else {
//                 connection.query(
//                     //   "SELECT * FROM t_user where username='"+username+"' and password='"+password+"'",
//                     `SELECT * FROM t_user where username='${username}' and password='${password}'`,
//                     function (error, results) {
//                         connection.release(); //释放连接，放回pool中
//                         if (error) {
//                             reject(err);
//                         } else {
//                             resolve(results)
//                         }
//                     }
//                 );
//             }
//         });
//     });
// }

// function saveUser(user) {
//     return new Promise((resolve, reject) => {
//         pool.getConnection(function (err, connection) {
//             if (err) {
//                 // not connected!
//                 reject(err);
//             } else {
//                 connection.query(
//                     `insert into t_user set ?`,
//                     user,
//                     function (error, results) {
//                         connection.release(); //释放连接，放回pool中
//                         if (error) {
//                             reject(err);
//                         } else {
//                             resolve(results);
//                         }
//                     }
//                 );
//             }
//         });
//     });
// }

function getData(sql, user) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                // not connected!
                reject(err);
            } else {
                connection.query(
                    sql, user,
                    function (error, results) {
                        connection.release(); //释放连接，放回pool中
                        if (error) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    }
                );
            }
        });
    });
}
// router.get("/", async (ctx) => {
//     // 查询所有文章数据
//     let results = await getBlogData();
//     await ctx.render("index", {
//         blogs: results
//     });

// });
router.get("/login", async (ctx, next) => {
    await ctx.render("login");
})

router.post("/login", async (ctx) => {
    let { username, password } = ctx.request.body
    let sql = `SELECT * FROM t_user where username='${username}' and password='${password}'`
    // let results = await getUserData(username, password);
    let results = await getData(sql)
    if (results.length > 0) {
        let sql = `SELECT * FROM t_blog`
        // let results = await getBlogData();
        let results = await getData(sql)
        await ctx.render("index", {
            blogs: results
        });
    } else {
        await ctx.render("error", {
            message: "登陆失败，用户名或密码错误"
        })
    }
})

router.get("/regist", async (ctx) => {
    await ctx.render("regist");
});

router.post("/regist", async (ctx, next) => {
    let { username, password, nickname } = ctx.request.body
    if (username.trim().length == 0) {
        await ctx.render("error", {
            message: "用户名不能为空"
        })
    } else {
        let sql = `insert into t_user set ?`
        // let results = await saveUser({ username, password, nickname });
        let results = await getData(sql, { username, password, nickname })
        if (results.insertId) {
            await ctx.render("login")
        } else {
            await ctx.render("error", {
                message: "注册失败"
            })
        }
    }
})

module.exports = router