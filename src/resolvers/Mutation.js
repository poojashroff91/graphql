import uuidv4 from 'uuid/v4';
import { type } from 'os';
import { PubSub } from 'graphql-yoga';

const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some((user)=>{
            return user.email === args.data.email;
        });
        if(emailTaken){
            throw new Error ('Email has already been taken');
        } 
        const user = {
            id: uuidv4(),
            ...args.data
        };
        db.users.push(user);
        return user;
    },
    createPost(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => {
            return user.id === args.data.author;
        });
        if(!userExists){
            throw new Error('Author does not exist')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }
        db.posts.push(post);

        if(args.data.published) {
            pubsub.publish('post', { 
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        }

        return post;
    },
    createComment(parent, args, { db , pubsub }, info){
        const userExists = db.users.some((user)=>{
            return user.id === args.data.author;
        });
        if(!userExists){
            throw new Error('Author does not exist');
        }
        const postExists = db.posts.some((post)=>{
            return post.id === args.data.post;
        });
        if(!postExists){
            throw new Error('Post does not exist');
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment);
        pubsub.publish(`comment ${args.data.post}`, { comment });
        return comment;
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) =>{
            return user.id === args.id
        });
        if(userIndex === -1){
            throw new Error('User not found');
        }
        const deletedUsers = db.users.splice(userIndex, 1);
        // Remove all posts this user wrote
        db.posts = db.posts.filter((post)=> {
            const match = post.author === args.id;
            // Remove all comments on this post
            db.comments = db.comments.filter((comment) => {
                return comment.post !== post.id
            });
            return !match;
        })
        return deletedUsers[0];
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex((post)=>{
            return post.id === args.id;
        });

        if(postIndex === -1){
            throw new Error('Post not found');
        }

        const [post] = db.posts.splice(postIndex, 1);
        // Delete all comments on that post
        db.comments.filter((comment)=>{
            return comment.post !== args.id
        });

        if(post.published){
            pubsub.publish('post', { 
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            });
            
        }

        return post;
    },
    deleteComment(parent, args, { db }, info) {
        const commentIndex = db.comments.findIndex((comment) => {
            return comment.id === args.id;
        });
        if(commentIndex === -1){
            throw new Error('Comment not found');
        }
        const deletedComments = db.comments.splice(commentIndex, 1);
        return deletedComments[0];
    },
    updateUser(parent, args, { db }, info){
        const { id, data } = args;
        const user = db.users.find((user)=> user.id === id);
        if(!user) {
            throw new Error ('User not found.');
        }
        if(typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === data.email);
            if(emailTaken) {
                throw new Error ('Email already taken');
            }
            user.email = data.email;
        }
        if(typeof data.name === 'string') {
            user.name = data.name;
        }
        if(typeof data.age !== undefined) {
            user.age = data.age;
        }
        return user;
    },
    updatePost(parent, args, { db, pubsub }, info){
        const { id, data } = args;
        const post = db.posts.find((post) => post.id === id);
        const originalPost = {...post};

        if (!post) {
            throw new Error('Post not found');
        }
        if(typeof data.title === 'string'){
            post.title = data.title;
        }
        if(typeof data.body === 'string') {
            post.body = data.body;
        }
        if(typeof data.published === 'boolean') {
            post.published = data.published;

            if(originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                });
            } else if(!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                });
            } else if (post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'UPDATED',
                        data: post
                    }
                });
            }

        }
        return post;
    },
    updateComment(parent, args, { db }, info) {
        const { id, data } = args;
        const comment = db.comments.find((comment) => comment.id === id);
        if(!comment) {
            throw new Error ('Comment not found');
        }

        if(typeof data.text === 'string') {
            comment.text = data.text;
        }
        return comment;
    }
};

export { Mutation as default };