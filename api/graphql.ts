import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { verifyToken, AuthContext } from './lib/auth';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }): Promise<AuthContext> => {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    
    if (!token) {
      return { user: null };
    }

    const user = await verifyToken(token);
    return { user };
  },
  introspection: true,
  cache: 'bounded',
});

const startServer = apolloServer.start();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
