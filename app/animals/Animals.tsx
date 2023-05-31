'use client';
import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';

export type AnimalResponse = {
  animals: {
    id: number;
    firstName: string;
    type: string;
    accessory: string;
  }[];
};

const getAnimal = gql`
  query GetAnimals {
    animals {
      id
      firstName
    }
  }
`;

export default function Animals() {
  const { loading, error, data, refetch } = useQuery<AnimalResponse>(
    getAnimal,
    {
      onCompleted: async () => {
        await refetch;
      },
    },
  );

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data?.animals.map((animal) => {
        return (
          <div key={`animal-${animal.id}`}>
            <h2>{animal.firstName}</h2>
            <br />
            <Link href={`/animals/${animal.id}`}>
              <Image
                src={`/images/${animal.firstName.toLowerCase()}.png`}
                alt={`${animal.firstName} profile picture`}
                width={300}
                height={300}
              />
            </Link>

            <br />

            <Link href={`/animals/${animal.id}`}>View Animal</Link>

            <br />
            <br />
          </div>
        );
      })}
    </>
  );
}
