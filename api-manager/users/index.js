const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

let users = [
  {
    id: '1',
    name: 'Ada Lovelace',
    login: '@lovelace'

  },
  {
    id: '2',
    name: 'Alan Turing',
    login: '@turing'
  }
];

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String
    login: String
  }
  
  extend type Query {
    Users: [User]
    User(id: ID!): User
  }
  
  type Mutation {
    createUser(name: String!, login: String!): User,
    updateUser(id: ID!, name: String!, login: String!): User,
    deleteUser(id: ID!): User,
  }
`;

const resolvers = {
  Query: {
    Users: async () => users,
    User: async (_, { id }) => users.find(user => user.id === id),
  },

  Mutation: {
    createUser: async (_, {name, login}) => {
      const newUser = {id: (users.length + 1).toString(), name, login};
      users.push(newUser);

      return newUser;
    },
    updateUser: async (_, { id, name, login }) => {
      const index = users.findIndex(user => user.id === id);
      users[index] = { id, name, login };

      return users[index];
    },
    deleteUser: async (_, { id }) => {
      const index = users.findIndex(user => user.id === id);
      const removedUser = users[index];
      users = users.splice(index, 1);

      return removedUser;
    }
  },

  User: {
    __resolveReference(options) {
      return users.find(user => user.id === options.id);
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

server.listen({ port: 3001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
