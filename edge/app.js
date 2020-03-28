const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const app = new ApolloGateway({
  serviceList: [
    // { name: "users", url: `http://${process.env.API_MANAGER_HOST}:3001/graphql` },
    // { name: "reviews", url: `http://${process.env.API_MANAGER_HOST}:3002/graphql` },
    // { name: "products", url: `http://${process.env.API_MANAGER_HOST}:3003/graphql` },
    { name: "users", url: `http://localhost:3001/graphql` },
    { name: "reviews", url: `http://localhost:3002/graphql` },
    { name: "products", url: `http://localhost:3003/graphql` },
  ],
});

(async () => {
  const server = new ApolloServer({
    gateway: app,
    engine: false,
    subscriptions: false,
  });

  server.listen({ port: 8080 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
