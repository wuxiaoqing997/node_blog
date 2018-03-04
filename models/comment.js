const Model = require('./main')
const User = require('./user')
const {formattedTime} = require('../utils')
class Comment extends Model {
    constructor(form={}, userId=-1) {
        super(form)
        this.content = form.content || ''
        // 和别的数据关联的方式, 用 userId 表明拥有它的 user 实例
        this.userId = Number('userId' in form ? form.userId : userId)
        this.weiboId = Number('weiboId' in form ? form.weiboId : -1)
        this.createTime = form.createTime|| formattedTime(new Date().getTime())
        this.updateTime = form.updateTime || formattedTime(new Date().getTime())
    }

    user() {
        const u = User.get(this.userId)
        return u
    }
    static update(form) {
        const weiboId = Number(form.id)
        const t = this.get(weiboId)
        console.log(form.content,'formsss')
        t.updateTime =  formattedTime(new Date().getTime())
        t.content = form.content
        t.save()
    }
}

module.exports = Comment
