const Koa = require("koa")
//引入ejs模板引擎
const views = require("koa-views")
const path = require("path")
//引入koa-static静态资源
const staticPath = require('koa-static')

const bodyParser = require('koa-bodyparser')
const session = require("koa-session");

const app = new Koa()

const blog = require("./routes/blog")
const user = require("./routes/user")


app.use(bodyParser())
//加载模板引擎
app.use(
    views(path.join(__dirname, "./views"), {
        extension: "ejs"
    })
)
app.use(staticPath(
    path.join(__dirname, './public')
))


app.keys = ["myblog_session_key$$"];
app.use(session(app));


app.use(async (ctx, next) => {
    if (ctx.url == "/login" || ctx.url == "/regist") {
      await next();
    } else {
      let loginUser = ctx.session.loginUser;
      if (loginUser) {
        await next();
      } else {
        ctx.redirect("/login");
      }
    }
  });



app.use(user.routes()).use(user.allowedMethods());
app.use(blog.routes()).use(blog.allowedMethods());
app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')