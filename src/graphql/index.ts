import { makeExecutableSchema } from '@graphql-tools/schema';

import typeDefs from './types';
import resolvers from './resolvers';
import { GraphQLSchema } from 'graphql';

const MergedSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default MergedSchema;
