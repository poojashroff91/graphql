import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
// Type definitions (schema)

// Scalar types - String, Boolean, Int, FLoat, ID

// Demo user data

const users = [{
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

const posts = [{
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

const comments = [{
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
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
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
                return user.email === args.email;
            });
            if(emailTaken){
                throw new Error ('Email has already been taken');
            } 
            const user = {
                id: uuidv4(),
                name: args.name,
                email: args.email,
                age: args.age
            };
            users.push(user);
            return user;
        },
        createPost(parent, args, ctx, info) {
            console.log(args);
            const userExists = users.some((user) => {
                return user.id === args.author;
            });
            if(!userExists){
                throw new Error('Author does not exist')
            }

            const post = {
                id: uuidv4(),
                title: args.title,
                body: args.body,
                published: args.published,
                author: args.author
            }
            posts.push(post);
            console.log('Successfully created');
            console.log(posts);
            console.log(post);
            return post;
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