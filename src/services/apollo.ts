import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { auth } from './firebase';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_API_URL || '/api/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const user = auth.currentUser;
  let token = '';

  if (user) {
    token = await user.getIdToken();
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          ingredients: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          stockMovements: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first', // Changed from 'cache-and-network' for faster loading
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});
