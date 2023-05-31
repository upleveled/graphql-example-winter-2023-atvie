import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default function page() {
  const fakeSessionToken = cookies().get('fakeSession');

  if (fakeSessionToken?.value) {
    redirect('/animals');
  }
  return <LoginForm />;
}
