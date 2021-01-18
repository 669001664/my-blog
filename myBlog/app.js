const Koa = require("koa")
//引入ejs模板引擎
const views = require("koa-views")
const path = require("path")
//引入koa-static静态资源
const staticPath = require('koa-static')

const bodyParser = require('koa-bodyparser')

const app = new Koa()

const router = require("./routes")

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


app.use(router.routes()).use(router.allowedMethods());
app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')