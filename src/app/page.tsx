'use client';
import { useUser } from '@/firebase';
import { redirect } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function RootPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-10 w-48" />
      </div>
    );
  }

  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
