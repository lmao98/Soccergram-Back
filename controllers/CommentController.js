const { Comment } = require('../models')

const GetComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            attributes: ['body', 'likes'],
            order: [['updatedAt', 'DESC']]
        })
        res.send(comments)
    } catch (error) {
        throw error
    }
}

const GetPostComments = async (req, res) => {
    try {
        const postComments = await Comment.findAll({
            attributes: ['body', 'likes'],
            order: [['updatedAt', 'DESC']],
            where: {
                post_id: req.params.post_id
            }
        })
        res.send(postComments)
    } catch (error) {
        throw error
    }
}

const AddComment = async (req, res) => {
    try {
        let postId = parseInt(req.params.post_id)
        let userId = parseInt(req.params.user_id)
        let buildBody = {
            ...req.body,
            userId,
            postId
        }
        const postComment = await Comment.create({
            ...buildBody
        })
        res.send(postComment)
    } catch (error) {
        throw error
    }
}

module.exports = {
    GetComments,
    GetPostComments,
    AddComment
}