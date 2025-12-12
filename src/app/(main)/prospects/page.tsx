'use client';
import { useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { ProspectsTable } from './components/prospects-table';
import { AddProspectDialog } from './components/add-prospect-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProspectsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const prospectsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/prospects`);
  }, [firestore, user]);

  const { data: prospects, loading: prospectsLoading } = useCollection(prospectsQuery);
  
  const isLoading = userLoading || prospectsLoading;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Prospects</h1>
        <div className="ml-auto flex items-center gap-2">
          <AddProspectDialog />
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <ProspectsTable data={prospects || []} />
      )}
    </div>
  );
}
