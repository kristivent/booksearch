import express, { Application } from 'express';
import path from 'node:path';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas/index.js'; //import typedefs and resolvers from schemas folder
import db from './config/connection.js';
import routes from './routes/index.js';
import { contextMiddleware } from './services/auth.js'; //import contextMiddleware from auth.js

const app: Application = express();
const PORT = process.env.PORT || 3001;

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
    context: contextMiddleware,
  });

  // Start the Apollo Server
  await server.start();

  // Apply Apollo Server middleware to Express
  server.applyMiddleware({ app });

  // Start the Express server
  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`));
  });
}

// Call the async function to start the server
startApolloServer();