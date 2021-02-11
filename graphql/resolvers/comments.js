const {UserInputError, AuthenticationError} = require('apollo-server');
const chechAuth = require('../../util/chech-auth');
const Post = require('../../models/Post');

module.exports ={
    Mutation:{
    createComment: async(_, {postId, body}, context) =>{
    const {username} = chechAuth(context);
    if(body.trim()===''){
        throw new UserInputError('Empty comment',{
            errors:{
                body: 'Comment body must not be empty'
            }
        })
    }
    const post = await Post.findById(postId);
    if(post){
        post.comments.unshift({
            body,
            username,
            createdAt: new Date().toISOString()
        })
        await post.save();
        return post
        } else throw new UserInputError('Post not found');
    },
    async deleteComment(_, {postId, commentId}, context){
        const {username}= chechAuth(context);
        const post = await Post.findById(postId);
        if(post){
            const commentIndex = post.comments.findIndex((c) => c.id === commentId);
            if(post.comments[commentIndex].username ===username){
                post.comments.splice(commentIndex, 1);
                await post.save();
                return post;
            }else{
                throw new AuthenticationError('Action not allowed')
            }
        }else{
            throw new UserInputError('Post not found')
        }
    }
  }
};