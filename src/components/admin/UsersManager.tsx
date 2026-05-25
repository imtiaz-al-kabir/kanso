'use client';

import React, { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Shield, ShieldAlert, Trash2, Check, UserCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';
import { updateUserRoleAction, deleteUserAction } from '@/actions/userActions';
import Button from '../ui/Button';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string | null;
}

interface UsersManagerProps {
  users: UserItem[];
  currentUser: { id: string; name: string; email: string; role: string } | null;
}

export function UsersManager({ users, currentUser }: UsersManagerProps) {
  const router = useRouter();
  const toast = useToast();

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    
    // Safeguard: prevent self demotion
    if (currentUser && currentUser.id === userId && currentRole === 'admin') {
      toast('You cannot demote your own admin account. Please have another admin do this.', 'error');
      return;
    }

    if (!confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) {
      return;
    }

    setIsUpdating(userId);
    const res = await updateUserRoleAction(userId, newRole as 'customer' | 'admin');
    setIsUpdating(null);

    if (res.success) {
      toast(`User role updated to ${newRole} successfully`, 'success');
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast(res.error || 'Failed to update user role', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Safeguard: prevent self deletion
    if (currentUser && currentUser.id === userId) {
      toast('You cannot delete your own admin account.', 'error');
      return;
    }

    if (!confirm('Are you sure you want to delete this user? This action is permanent and cannot be undone.')) {
      return;
    }

    setIsUpdating(userId);
    const res = await deleteUserAction(userId);
    setIsUpdating(null);

    if (res.success) {
      toast('User deleted successfully', 'success');
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast(res.error || 'Failed to delete user', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Top bar */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-2xl font-light text-charcoal">Studio Users</h2>
          <p className="text-xs text-stone-500 font-light">
            Manage your store members, assign admin privileges, and audit credentials.
          </p>
        </div>
      </div>

      {/* Users table */}
      {users.length > 0 ? (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-xs border border-charcoal/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sand border-b border-charcoal/5 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  <th className="p-4 pl-6">User Details</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status / Role</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-stone-600 divide-y divide-charcoal/5">
                {users.map((user) => {
                  const isSelf = currentUser && currentUser.id === user.id;
                  
                  return (
                    <tr key={user.id} className={`hover:bg-sand/35 transition-colors ${isSelf ? 'bg-primary/5' : ''}`}>
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-sans text-xs ${
                            user.role === 'admin' 
                              ? 'bg-charcoal text-sand border border-sand/20' 
                              : 'bg-stone-100 text-charcoal'
                          }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-charcoal font-serif text-sm font-semibold truncate max-w-[200px]">
                              {user.name}
                              {isSelf && (
                                <span className="ml-2 font-sans text-[8px] bg-charcoal text-sand px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                                  You
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-sans text-xs font-medium text-stone-500">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 bg-charcoal text-sand text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                              <Shield className="w-3 h-3 text-primary" />
                              <span>Administrator</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-500 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                              <span>Customer</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-xs font-medium text-stone-400 font-sans">
                        {user.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'Pre-seeded'}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end items-center gap-2">
                          {/* Role Toggle Button */}
                          <button
                            onClick={() => handleRoleToggle(user.id, user.role)}
                            disabled={isSelf || isUpdating === user.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 ${
                              user.role === 'admin'
                                ? 'border-charcoal/15 text-stone-600 hover:bg-stone-50'
                                : 'border-primary/30 text-charcoal hover:bg-primary/10'
                            }`}
                            title={isSelf ? 'Cannot modify your own role' : `Change user role`}
                          >
                            {user.role === 'admin' ? (
                              <>
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>Demote</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Make Admin</span>
                              </>
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isSelf || isUpdating === user.id}
                            className="flex items-center justify-center p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                            title={isSelf ? 'Cannot delete your own account' : 'Delete user'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel p-16 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
          <Users className="w-8 h-8 text-stone-400" />
          <h3 className="font-serif text-sm font-semibold text-charcoal">No Users Found</h3>
          <p className="text-xs text-stone-400 font-light max-w-xs leading-relaxed">
            There are currently no users registered in your Japandi store databases.
          </p>
        </div>
      )}
    </div>
  );
}

export default UsersManager;
