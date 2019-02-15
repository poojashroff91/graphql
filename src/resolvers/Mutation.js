import uuidv4 from 'uuid/v4';
import { type } from 'os';

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
    createPost(parent, args, { db }, info) {
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
        return post;
    },
    createComment(parent, args, { db }, info){
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
    deletePost(parent, args, { db }, info) {
        const postIndex = db.posts.findIndex((post)=>{
            return post.id === args.id;
        });

        if(postIndex === -1){
            throw new Error('Post not found');
        }

        const deletedPosts = db.posts.splice(postIndex, 1);
        // Delete all comments on that post
        db.comments.filter((comment)=>{
            return comment.post !== args.id
        });

        return deletedPosts[0];
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
    }
};

export { Mutation as default };