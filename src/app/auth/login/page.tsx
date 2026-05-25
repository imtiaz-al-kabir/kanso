import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { getPostLoginPath, safeCallbackUrl } from '@/lib/authUrls';
import { LoginForm } from './LoginForm';

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);

  const user = await getAuthUser();
  if (user) {
    redirect(getPostLoginPath(callbackUrl === '/' ? '/profile' : callbackUrl, user.role));
  }

  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-16 px-4 h-96 animate-pulse bg-sand/40 rounded-2xl" />}>
      <LoginForm callbackUrl={callbackUrl} />
    </Suspense>
  );
}
