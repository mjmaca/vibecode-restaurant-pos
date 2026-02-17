import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers/index.js';
import { verifyToken, AuthContext } from './lib/auth.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// #region agent log
console.log('[DEBUG] API Handler Loading - Hypothesis A/B/C', { timestamp: Date.now() });
// #endregion

let apolloServer: ApolloServer;
let serverStarted = false;

try {
  // #region agent log
  console.log('[DEBUG] Creating Apollo Server - Hypothesis B', { timestamp: Date.now() });
  // #endregion
  
  apolloServer = new ApolloServer({
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
  
  // #region agent log
  console.log('[DEBUG] Apollo Server created successfully - Hypothesis B', { timestamp: Date.now() });
  // #endregion
} catch (error) {
  // #region agent log
  console.error('[DEBUG] Apollo Server creation failed - Hypothesis B', { 
    timestamp: Date.now(), 
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined
  });
  // #endregion
  throw error;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // #region agent log
    console.log('[DEBUG] Handler invoked - Hypothesis C/D', { 
      timestamp: Date.now(), 
      method: req.method,
      url: req.url,
      hasAuth: !!req.headers.authorization
    });
    // #endregion

    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
      // #region agent log
      console.log('[DEBUG] OPTIONS request handled - Hypothesis E', { timestamp: Date.now() });
      // #endregion
      res.status(200).end();
      return;
    }

    if (!serverStarted) {
      // #region agent log
      console.log('[DEBUG] Starting Apollo Server - Hypothesis B', { timestamp: Date.now() });
      // #endregion
      await apolloServer.start();
      serverStarted = true;
      // #region agent log
      console.log('[DEBUG] Apollo Server started successfully - Hypothesis B', { timestamp: Date.now() });
      // #endregion
    }

    // #region agent log
    console.log('[DEBUG] Calling Apollo handler - Hypothesis D', { timestamp: Date.now() });
    // #endregion
    await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
    
    // #region agent log
    console.log('[DEBUG] Apollo handler completed - Hypothesis D', { timestamp: Date.now() });
    // #endregion
  } catch (error) {
    // #region agent log
    console.error('[DEBUG] Handler error - All Hypotheses', { 
      timestamp: Date.now(), 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    // #endregion
    
    // Return error response
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
