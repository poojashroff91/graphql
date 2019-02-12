import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)

// Scalar types - String, Boolean, Int, FLoat, ID

const typeDefs = `

    type Query {
        greeting(name: String, position: String): String!
        add(a: Float!, b: Float!): Float
        me: User!
        post: Post!
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
    }
`


// Resolvers

const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            if(args.name && args.position){
                return `Hello ${args.name}! You are my favorite ${args.position}`;  
            } else {
                return `Hello!`;  
            }
            
        },
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
        add(parent, args, ctx, info) {
            if(args.a && args.b) {
                return args.a + args.b;
            } else {
                return 0;
            }
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