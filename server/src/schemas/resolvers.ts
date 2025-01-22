// define the query and mutation functionality to work with mongoose models
import { getSingleUser, createUser, login, saveBook, deleteBook } from '../controllers/user-controller.js';
import { AuthenticationError } from 'apollo-server-express';

const resolvers = {
  Query: {
    // Get a single user by id or username
    me: async (_parent: unknown, _args: unknown, context: any) => {
      if (context.user) {
        return getSingleUser(context.req, context.res);
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    // Create a user, sign a token, and send back
    addUser: async (_parent: unknown, _args: unknown, context: any) => {
      return createUser(context.req, context.res);
    },
    // Login a user, sign a token, and send back
    login: async (_parent: unknown, args: any, context: any) => {
      context.req.body = args;
      return login(context.req, context.res);
    },
    // Save a book to a user's `savedBooks` field by adding it to the set
    saveBook: async (_parent: unknown, args: any, context: any) => {
      if (context.user) {
        context.req.body = args;
        return saveBook(context.req, context.res);
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Remove a book from `savedBooks`
    deleteBook: async (_parent: unknown, args: any, context: any) => {
      if (context.user) {
        context.req.body = args;
        return deleteBook(context.req, context.res);
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers;