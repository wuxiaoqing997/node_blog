const Session = require('./models/session')
const User = require('./models/user')
const {currentUser} = require('./routes')

// const {a, b, c, d, e, f, g, h, i} = require('./xx')

const {log, template} = require('./utils')
const routeIndex = {
    path: '/',
    method: 'get',
    func: (request,response) => {
        const u = currentUser(request)
        const body = {
            username: u.username
        }
        response.render('index.html', body)
    }
}
const loginView = {
    path: '/login',
    method: 'get',
    func: (request, response) => {
        response.render('login.html')
    }
}
const login = {
    path: '/user/login',
    method: 'post',
    func: (request,response) => {
        const form = request.body
        if(User.validateLogin(form)){
        const u = User.findBy('username', form.username)
        request.session.uid = u.id
        response.redirect('/')
        }else{
            console.log(request.body)
            response.render('login.html', {
                message: '用户名或者密码错误'
            })
        }
    }
}

const registerView = {
    path: '/register',
    method: 'get',
    func: (request,response) => {
        response.render('register.html')
    }
}

// 注册的处理函数
const register = {
    path: '/user/register',
    method: 'post',
    func: (request, response) => {
        let result = ''
        const form = request.body
        if (User.validateRegister(form)) {
            result = '注册成功'
            let username = form.username
            response.render('index.html',{username})
        } else {
            result = '用户名或者密码长度必须大于2或用户名已存在'
            response.render('register.html', { result, })
        }
    }
}

const routeMapper = [
    routeIndex,
    loginView,
    login,
    register,
    registerView,
]

module.exports.routeMapper = routeMapper
