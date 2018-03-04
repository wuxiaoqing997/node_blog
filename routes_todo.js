const Todo = require('./models/todo')

const {
    headerFromMapper,
    redirect,
    currentUser,
    error,
    loginRequired,
    htmlResponse,
} = require('./routes')

const {template, log} = require('./utils')

const index = {
    path: '/todo/index',
    method: 'get',
    func: (request,response) => {
        const u = currentUser(request)
        const todos = Todo.findAll('userId', u.id)
        const args = {
            todos
        }
        console.log(todos,'sss')
        response.render('todo_index.html',args)
    }
}

const add = {
    path: '/todo/add',
    method: 'post',
    func: (request,response) => {
        const u = currentUser(request)
        const form = request.body
    console.log(form,'form')
        const t = Todo.add(form, u.id)
        // 浏览器发送数据过来, 处理后重定向到首页
        // 浏览器在请求新首页的时候就能看到新增的数据了
        response.redirect('/todo/index')
    }
}

const remove = {
    path: '/todo/delete/:todoId',
    method: 'get',
    func: (request,response) => {
        const todoId = Number(request.params.todoId)
        Todo.remove(todoId)
        response.redirect('/todo/index')
    }
}
const complete = {
    path: '/todo/complete/:todoId',
    method: 'get',
    func: (request, response) => {
        const id = Number(request.params.todoId)
        Todo.complete(id, true)
        response.redirect('/todo/index')
    }
}
const edit = {
    path: '/todo/edit/:todoId',
    method: 'get',
    func: (request,response) => {
        const todoId = Number(request.params.todoId)
        const t = Todo.findBy('id', todoId)
        const args = {
            todo: t,
        }
        response.render('todo_edit.html', args)
    }
}

const update = {
    path: '/todo/update',
    method: 'post',
    func: (request,response) => {
        const form = request.body
        console.log(form,'update')
        Todo.update(form)
        response.redirect('/todo/index')
    }
}

const routeMapper = [
    index,
    add,
    remove,
    edit,
    update,
    complete,
]

module.exports.routeMapper = routeMapper
