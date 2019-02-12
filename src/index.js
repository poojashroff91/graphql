import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)

// Scalar types - String, Boolean, Int, FLoat, ID

const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`


// Resolvers

const resolvers = {
    Query: {
        title () {
            return 'Perfect Storm';
        },
        price () {
            return 9.99;
        },
        releaseYear () {
            return 1990;
        },
        rating () {
            return null;
        },
        inStock () {
            return false;
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