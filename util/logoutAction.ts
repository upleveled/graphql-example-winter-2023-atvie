'use server';
import { cookies } from 'next/headers';

export async function deleteFakeLoginSession(sessionName: string | undefined) {
  // Deleting a fake login session token
  if (!sessionName) return undefined;
  await cookies().set(sessionName, '', {
    path: '/',
    maxAge: -1,
  });
}
