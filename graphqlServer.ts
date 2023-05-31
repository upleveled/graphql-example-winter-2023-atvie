import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

type Args = {
  id: string;
};

const typeDefs = `#graphql
  type Animal {
    id: ID!
    firstName: String
    type: String
    accessory: String
  }

type Query {
  animals: [Animal]
  animal(id: ID!): Animal
}
`;

// Hardcoded data source
export const animals = [
  { id: 1, firstName: 'gigi', type: 'cat', accessory: 'rat' },
  { id: 2, firstName: 'freddy', type: 'dog', accessory: 'biscuit' },
  { id: 3, firstName: 'bob', type: 'trashpanda', accessory: 'candy' },
  { id: 4, firstName: 'nagini', type: 'snake', accessory: 'band' },
  { id: 5, firstName: 'kunfu', type: 'panda', accessory: 'food' },
];

const resolvers = {
  Query: {
    animals: () => {
      return animals;
    },

    animal: (parent: string, args: Args) => {
      return animals.find((animal) => animal.id === parseInt(args.id));
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  const { url } = await startStandaloneServer(server, {
    listen: {
      port: 8000,
    },
  });
  console.log(`Server is running at: ${url} `);
}

startApolloServer().catch((error) => {
  console.log(error);
});
