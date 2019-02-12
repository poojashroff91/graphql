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
        author: String
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
        },
        author () {
            return 'Pooja Shroff';
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