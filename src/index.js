import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)

// Scalar types - String, Boolean, Int, FLoat, ID

const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
    }
`


// Resolvers

const resolvers = {
    Query: {
        id () {
            return 'abc123';
        },
        name () {
            return 'Pooja Shroff';
        },
        age () {
            return 27;
        },
        employed () {
            return true;
        },
        gpa () {
            return null;
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