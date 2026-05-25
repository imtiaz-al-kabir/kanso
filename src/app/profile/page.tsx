import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import ProfileEditorClient from '@/components/store/ProfileEditorClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Profile | KANSO',
  description: 'Update your KANSO profile',
};

export default async function ProfilePage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/auth/login?callbackUrl=/profile');
  }

  return <ProfileEditorClient user={user} />;
}
