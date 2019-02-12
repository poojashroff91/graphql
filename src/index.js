import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)

// Scalar types - String, Boolean, Int, FLoat, ID

const typeDefs = `

    type Query {
        greeting(name: String, position: String): String!
        add(numbers: [Float!]!): Float!
        grades: [Int!]!
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
            const numbers = args.numbers;
            if(numbers.length === 0){
                return 0;
            } else {
                const reducer = (accumulator, currentValue) => accumulator + currentValue;
                return numbers.reduce(reducer);
            }
        },
        grades(parent, args, ctx, info){
            return [99, 80, 93];
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