const Weibo = require('./models/weibo')
const Comment = require('./models/comment')
const User = require('./models/user')

const {
    currentUser,
} = require('./routes')

const {formattedTime} = require('./utils')

const index = {
    path: '/weibo/index',
    method: 'get',
    func: (request,response) => {
        const weibos = Weibo.all().slice(-3).reverse()
        const args = {
            weibos
        }
        response.render('weibo_index.html', args)
    }
}
const more = {
    path: '/weibo/more',
    method: 'get',
    func: (request,response) => {
        const weibos = Weibo.all().reverse()
        const args = {
            weibos
        }
        response.render('weibo_more.html', args)
    }
}
const create = {
    path: '/weibo/new',
    method: 'get',
    func: (request,response) => {
        response.render ('weibo_index.html')
    }
}
const info = {
    path: '/weibo/content/:id',
    method: 'get',
    func: (request,response) => {
        const weiboId = Number(request.params.id)
        const w = Weibo.get(weiboId)
        const c = w.comments()
        console.log('w',w,c)
        const args = {
            w,c
        }
        response.render('weibo_content.html', args)
    }
}
const add = {
    path: '/weibo/add',
    method: 'post',
    func: (request,response) => {
        const u = currentUser(request)
        const form = request.body
        const w = Weibo.create(form)
        w.createTime = formattedTime(new Date().getTime())
        w.updateTime = formattedTime(new Date().getTime())
        w.userId = u.id
        w.save()
        response.redirect('/weibo/index')
    }
}

const remove = {
    path: '/weibo/delete/:id',
    method: 'get',
    func: (request,response) => {
        const weiboId = Number(request.params.id)
        Weibo.remove(weiboId)
        response.redirect('/weibo/index')
    }
}

const update = {
    path: '/weibo/update',
    method: 'post',
    func: (request, response) => {
        const u = currentUser(request)
        const form = request.body
        const content = form.content || ''
        const weiboId = Number(form.id || -1)
        const w = Weibo.get(weiboId)
    console.log(form,'ssss')
        if(w.userId === u.id){
            w.content = content
            w.updateTime = formattedTime(new Date().getTime())
            w.save()
        }
        response.redirect('/weibo/index')
    }
}
const edit = {
    path: '/weibo/edit/:id',
    method: 'get',
    func: (request,response) => {
        const u = currentUser(request)
        const weiboId = Number(request.params.id || -1)
        const w = Weibo.get(weiboId)
    console.log('eidt',w)
        if (u.id === w.userId){
            const args = {
                w
            }
            response.render('weibo_edit.html', args)
        }else{
        response.redirect('/weibo/index')
        }
    }
}
const commentAdd = {
    path: '/comment/add',
    method: 'post',
    func: (request,response) => {
        const u = currentUser(request)
        const form = request.body
        const c = Comment.create(form)
    console.log(c,'ccc')
        c.userId = u.id
        c.createTime = formattedTime(new Date().getTime())
        c.updateTime = formattedTime(new Date().getTime())
        c.save()
        const weiboId = Number(form.weiboId)
        const w = Weibo.get(weiboId)
        response.redirect(`/weibo/content/${weiboId}`)
    }
}
const commentUpdate = {
    path: '/comment/update',
    method: 'post',
    func: (request,response) =>{
        const u = currentUser(request)
        const form = request.body
        const commentId = Number(form.id)
        const c = Comment.get(commentId)
        console.log(c,'coment')
        if (c.userId == u.id){
            Comment.update(form)
        }
        response.redirect(`/weibo/content/${c.weiboId}`)
    }
}
const commentEdit = {
    path: '/comment/edit/:id',
    method: 'get',
    func: (request,response) => {
        const u = currentUser(request)
        const commentId = Number(request.params.id || -1)
        const c = Comment.get(commentId)
        if (u.id === c.userId){
            const args = {
                comment:c
            }
            response.render('comment_edit.html', args)
        }else{
            response.redirect('/weibo/index')
        }
    }
}
const commentDelete = {
    path: '/comment/delete/:id',
    method: 'get',
    func: (request,response) => {
        const u = currentUser(request)
        const commentId = Number(request.params.id)
        const c = Comment.get(commentId)
    console.log(c,'delete')
        const w = Weibo.get(c.weiboId)
        if (c.id === u.id || w.id === u.id){
            Comment.remove(commentId)
        }
        response.redirect('/weibo/index')
    }
}
const routeMapper = [
    index,
    create,
    add,
    update,
    more,
    edit,
    remove,
    info,
    commentAdd,
    commentDelete,
    commentEdit,
    commentUpdate,
]


module.exports.routeMapper = routeMapper
