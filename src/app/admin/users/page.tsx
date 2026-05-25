import React from 'react';
import { getAuthUser } from '@/lib/auth';
import { getUsersAction } from '@/actions/userActions';
import UsersManager from '@/components/admin/UsersManager';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const currentUser = await getAuthUser();
  const res = await getUsersAction();

  const users = res.success && res.users ? res.users : [];

  return (
    <UsersManager
      users={users}
      currentUser={currentUser}
    />
  );
}
