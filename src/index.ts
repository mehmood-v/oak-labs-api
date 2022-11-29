import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './graphql/types';
import resolvers from './graphql/resolvers';

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`🚀 Server listening at: ${url}`);
};

startServer();
