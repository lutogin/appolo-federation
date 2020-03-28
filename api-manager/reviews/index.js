const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const reviews = [
  {
    id: '1',
    authorID: '1',
    product: { id: '1' },
    body: 'Love it!'
  },
  {
    id: '2',
    authorID: '1',
    product: { id: '2' },
    body: 'Too expensive.'
  },
  {
    id: '3',
    authorID: '2',
    product: { id: '3' },
    body: 'Could be better.'
  },
  {
    id: '4',
    authorID: '2',
    product: { id: '1' },
    body: 'Prefer something else.'
  }
];

const typeDefs = gql`
  type Review @key(fields: "id") {
    id: ID!
    body: String
    author: User @provides(fields: "login")
    product: Product
  }
  
  extend type Query {
    Reviews: [Review]
    Review(id: ID!): Review
  }
  
  extend type User @key(fields: "id") {
    id: ID! @external
    login: String @external
    reviews: [Review]
  }

  extend type Product @key(fields: "id") {
    id: ID! @external
    reviews: [Review]
  }
`;

const resolvers = {
  Query: {
    Reviews: async () => reviews,
    Review: async (_, { id }) => reviews.find(review => review.id === id)
  },
  Review: {
    author(review) {
      return { __typename: 'User', id: review.authorID };
    }
  },
  User: {
    reviews(user) {
      return reviews.filter(review => review.authorID === user.id);
    },
    numberOfReviews(user) {
      return reviews.filter(review => review.authorID === user.id).length;
    },
  },
  Product: {
    reviews(product) {
      return reviews.filter(review => review.product.id === product.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 3002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
