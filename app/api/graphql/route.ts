import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { NextRequest } from 'next/server';
import {
  createAnimal,
  deleteAnimalById,
  getAnimalByFirstName,
  getAnimalById,
  getAnimals,
  updateAnimalById,
} from '../../../database/animals';
import { createFakeLoginSession } from '../../../util/loginAction';
import { deleteFakeLoginSession } from '../../../util/logoutAction';

type AnimalInput = {
  firstName: string;
  type: string;
  accessory: string;
};

type Args = {
  id: string;
};

type LoginArgument = {
  username: string;
  password: string;
};

type LogoutArgument = { fakeSessionToken: string | undefined };

const typeDefs = gql`
  type Animal {
    id: ID!
    firstName: String!
    type: String!
    accessory: String
  }

  type Query {
    animals: [Animal]
    animal(id: ID): Animal
    loggedInAnimalByFirstName(firstName: String!): Animal
  }

  type Mutation {
    createAnimal(firstName: String!, type: String!, accessory: String): Animal

    deleteAnimalById(id: ID!): Animal

    updateAnimalById(
      id: ID!
      firstName: String!
      type: String!
      accessory: String
    ): Animal

    login(username: String!, password: String!): Animal

    logout(fakeSessionToken: String): Animal
  }
`;

const resolvers = {
  Query: {
    animals: async () => await getAnimals(),

    animal: (parent: null, args: { id: string }) => {
      return getAnimalById(parseInt(args.id));
    },

    loggedInAnimalByFirstName: async (
      parent: null,
      args: { firstName: string },
    ) => {
      return await getAnimalByFirstName(args.firstName);
    },
  },

  Mutation: {
    createAnimal: async (parent: null, args: AnimalInput) => {
      if (
        typeof args.firstName !== 'string' ||
        typeof args.type !== 'string' ||
        (args.accessory && typeof args.type !== 'string') ||
        !args.firstName ||
        !args.type
      ) {
        throw new GraphQLError('Required filed is missing');
      }
      return await createAnimal(args.firstName, args.type, args.accessory);
    },

    deleteAnimalById: async (parent: null, args: Args) => {
      return await deleteAnimalById(parseInt(args.id));
    },

    updateAnimalById: async (parent: null, args: AnimalInput & Args) => {
      if (
        typeof args.firstName !== 'string' ||
        typeof args.type !== 'string' ||
        (args.accessory && typeof args.type !== 'string') ||
        !args.firstName ||
        !args.type
      ) {
        throw new GraphQLError('Required filed is missing');
      }
      return await updateAnimalById(
        parseInt(args.id),
        args.firstName,
        args.type,
        args.accessory,
      );
    },

    login: async (parent: null, args: LoginArgument, context: any) => {
      // FIXME: Implement secure authentication
      if (
        typeof args.username !== 'string' ||
        typeof args.password !== 'string' ||
        !args.username ||
        !args.password
      ) {
        throw new GraphQLError('Required field missing');
      }

      if (args.username !== 'freddy' || args.password !== 'asdf') {
        throw new GraphQLError('Invalid username or password');
      }

      await createFakeLoginSession(args.username);

      return await getAnimalByFirstName(args.username);
    },

    logout: async (parent: null, args: LogoutArgument) => {
      await deleteFakeLoginSession(args.fakeSessionToken);
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context: async (req, res) => {
    return { req, res };
  },
});

export async function GET(req: NextRequest) {
  return await handler(req);
}

export async function POST(req: NextRequest) {
  return await handler(req);
}
