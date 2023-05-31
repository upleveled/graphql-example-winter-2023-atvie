'use server';
import { cookies } from 'next/headers';

export async function createFakeLoginSession(username: string) {
  // Createing a fake login session cookies
  await cookies().set('fakeSession', username, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}
