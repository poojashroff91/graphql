import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
// Type definitions (schema)

// Scalar types - String, Boolean, Int, FLoat, ID

// Demo user data

let users = [{
    id: '1',
    name: 'Pooja Shroff',
    email: 'pooja@example.com',
    age: 27
}, {
    id: '2',
    name: 'Santosh Prabhu',
    email: 'santosh@example.com',
    age: 27
}, {
    id: '3',
    name: 'Deepa Shroff',
    email: 'deepa@example.com'
}];

// Demo posts data

let posts = [{
    id: '1000',
    title: 'My first post',
    body: 'I am learning Graph QL',
    published: true,
    author: '1'
}, {
    id: '1001',
    title: 'My second post',
    body: 'I like succulents',
    published: true,
    author: '1'
}, {
    id: '1002',
    title: 'My third post',
    body: 'I like to paint with watercolors',
    published: true,
    author: '2'
}]

// Comments

let comments = [{
    id: '2000',
    text: 'This is my first comment',
    author: '1',
    post: '1000'
},{
    id: '2001',
    text: 'This is a nice comment',
    author: '2',
    post: '1000'
},{
    id: '2002',
    text: 'This is a mean comment',
    author: '2',
    post: '1001'
},{
    id: '2003',
    text: 'This comment is on YouTube',
    author: '3',
    post: '1002'
}]

const typeDefs = `

    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }
    type Mutation {
        createUser(data: CreateUserInput!): User!
        createPost(data: CreatePostInput!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteUser(id: ID!): User!
        deletePost(id: ID!): Post!
        deleteComment(id: ID!): Comment!
    }
    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }
    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`


// Resolvers

const resolvers = {
    Query: {
        me () {
            return {
                id: '123098',
                name: 'Mike',
                email: 'mike@example.com',
                age: null
            }
        },
        post () {
            return {
                id: '123098',
                title: 'Hello world',
                body: 'This is my first post ever!',
                published: true
            }
        },
        users (parent, args, ctx, info) {
            if(args.query){
                return users.filter((user) => {
                    return user.name.toLowerCase().includes(args.query.toLowerCase());
                });
            } else {
                return users;
            }
        },
        posts (parent, args, ctx, info) {
            if(args.query){
                return posts.filter((post) => {
                    const titleMatch =  post.title.toLowerCase().includes(args.query.toLowerCase());
                    const bodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                    return titleMatch || bodyMatch;
                });
            } else {
                return posts;
            }
        },
        comments (parent, args, ctx, info) {
            return comments;
        }
    },
    Post: {
        author (parent, args, ctx, info) { //Here parent is the post entity
            return users.find((user) => {
                return user.id === parent.author;
            })
        },
        comments (parent, args, ctx, info) {
            return comments.filter((comment)=>{
                return comment.post === parent.id;
            })
        }

    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user)=>{
                return user.email === args.data.email;
            });
            if(emailTaken){
                throw new Error ('Email has already been taken');
            } 
            const user = {
                id: uuidv4(),
                ...args.data
            };
            users.push(user);
            return user;
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => {
                return user.id === args.data.author;
            });
            if(!userExists){
                throw new Error('Author does not exist')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }
            posts.push(post);
            return post;
        },
        createComment(parent, args, ctx, info){
            const userExists = users.some((user)=>{
                return user.id === args.data.author;
            });
            if(!userExists){
                throw new Error('Author does not exist');
            }
            const postExists = posts.some((post)=>{
                return post.id === args.data.post;
            });
            if(!postExists){
                throw new Error('Post does not exist');
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment);
            return comment;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) =>{
                return user.id === args.id
            });
            if(userIndex === -1){
                throw new Error('User not found');
            }
            const deletedUsers = users.splice(userIndex, 1);
            // Remove all posts this user wrote
            posts = posts.filter((post)=> {
                const match = post.author === args.id;
                // Remove all comments on this post
                comments = comments.filter((comment) => {
                    return comment.post !== post.id
                });
                return !match;
            })
            return deletedUsers[0];
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post)=>{
                return post.id === args.id;
            });

            if(postIndex === -1){
                throw new Error('Post not found');
            }

            const deletedPosts = posts.splice(postIndex, 1);
            // Delete all comments on that post
            comments.filter((comment)=>{
                return comment.post !== args.id
            });

            return deletedPosts[0];
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex((comment) => {
                return comment.id === args.id;
            });
            if(commentIndex === -1){
                throw new Error('Comment not found');
            }
            const deletedComments = comments.splice(commentIndex, 1);
            return deletedComments[0];
        }
    },
    User: {
        posts (parent, args, ctx, info) { //Here we have access to User via parent
            return posts.filter((post) => {
                return post.author === parent.id;
            })
        },
        comments (parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id;
            })
        }
    },
    Comment: {
        author (parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author;
            })
        },
        post (parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post;
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('The server is starting');
})