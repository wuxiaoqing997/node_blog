const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const path = require('path')

const routeTodo = require('./routes_todo')
const routeUser = require('./routes_user')
const routeWeibo = require('./routes_weibo')
const {log} = require('./utils')
const { secretKey } = require('./config')

const app = express()

// 设置 bodyParser
app.use(bodyParser.urlencoded({
    extended: true,
}))
// 设置 session, 这里的 secretKey 是从 config.js 文件中拿到的
app.use(session({
    secret: secretKey,
}))

// 配置 nunjucks 模板, 第一个参数是模板文件的路径
nunjucks.configure('templates', {
    autoescape: true,
    express: app,
    noCache: true,
})

// 配置静态资源文件, 比如 js css 图片
const asset = path.join(__dirname, 'static')
app.use('/static', express.static(asset))

const registerRoutes = function(app, routes) {
    for (let i = 0; i < routes.length; i++) {
        let route = routes[i]
        app[route.method](route.path, route.func)
    }
}
const routeLists = [routeTodo,routeUser,routeWeibo]
for(let i = 0;i < routeLists.length; i++){
    let route = routeLists[i].routeMapper
    registerRoutes(app, route)
}

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
