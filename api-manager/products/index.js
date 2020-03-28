const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

let products = [
  {
    id: '1',
    title: 'Table',
    price: 899,
  },
  {
    id: '2',
    title: 'Couch',
    price: 1299,
  },
  {
    id: '3',
    title: 'Chair',
    price: 54,
  }
];

const typeDefs = gql`
  type Product @key(fields: "id") {
    id: ID!
    title: String
    price: Int
  }
  
  extend type Query {
    Products: [Product]
    Product(id: ID!): Product
  }
  
  type Mutation {
    createProduct(title: String!, price: Int!): Product,
    updateProduct(id: ID!, title: String, price: Int): Product,
    deleteProduct(id: ID!): Product,
  }
`;

const resolvers = {
  Query: {
    Products: async () => products,
    Product: async (_, {id}) => products.find(product => product.id === id),
  },

  Mutation: {
    createProduct: async (_, {title, price}) => {
      const newProduct = {id: (products.length + 1).toString(), title, price};
      products.push(newProduct);

      return newProduct;
    },
    updateProduct: async (_, { id, title, price }) => {
      const index = products.findIndex(user => user.id === id);
      products[index] = { id, title, price };

      return products[index];
    },
    deleteProduct: async (_, { id }) => {
      const index = products.findIndex(user => user.id === id);
      const removedProduct = products[index];
      products = products.splice(index, 1);

      return removedProduct;
    }
  },

  Product: {
    __resolveReference(option) {
      return products.find(product => product.id === option.id);
    }
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 3003 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
