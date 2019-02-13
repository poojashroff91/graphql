import { GraphQLServer } from 'graphql-yoga';

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
    id: 1000,
    title: 'My first post',
    body: 'I am learning Graph QL',
    published: true,
    author: '1'
}, {
    id: 1001,
    title: 'My second post',
    body: 'I like succulents',
    published: true,
    author: '1'
}, {
    id: 1002,
    title: 'My third post',
    body: 'I like to paint with watercolors',
    published: true,
    author: '2'
}]

const typeDefs = `

    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
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
        }
    },
    Post: {
        author (parent, args, ctx, info) { //Here parent is the post entity
            return users.find((user) => {
                return user.id === parent.author;
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