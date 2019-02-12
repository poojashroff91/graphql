import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)

// Scalar types - String, Boolean, Int, FLoat, ID

const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`


// Resolvers

const resolvers = {
    Query: {
        hello(){
            return 'This is my first query';
        },
        name(){
            return 'Pooja Shroff';
        },
        location(){
            return 'San Jose';
        },
        bio(){
            return 'Likes vanilla icecream'
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