import express, { Application } from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js'; //import typedefs and resolvers from schemas folder
import db from './config/connection.js';
import routes from './routes/index.js';
import { contextMiddleware } from './services/auth.js'; //import contextMiddleware from auth.js
import { fileURLToPath } from 'node:url';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// create __dirname and __filename variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

async function startApolloServer() {
  // Set up Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start the Apollo Server
  await server.start();

  // Apply Apollo Server middleware to Express
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => contextMiddleware({ req }),
  }));

  // Start the Express server
  db.once('open', () => {
    app.listen(PORT, () => console.log(`Now listening on localhost:${PORT}/graphql`));
  });
}

// Call the async function to start the server
startApolloServer();