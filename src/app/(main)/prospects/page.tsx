'use client';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { ProspectsTable } from './components/prospects-table';
import { AddProspectDialog } from './components/add-prospect-dialog';
import type { Prospect } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProspectsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const prospectsCollection = useMemoFirebase(
    () =>
      firestore && user
        ? collection(firestore, 'users', user.uid, 'prospects')
        : null,
    [firestore, user]
  );
  
  const { data: prospects, loading } = useCollection<Prospect>(prospectsCollection);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Prospects</h1>
        <div className="ml-auto flex items-center gap-2">
          <AddProspectDialog />
        </div>
      </div>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <ProspectsTable data={prospects || []} />
      )}
    </div>
  );
}
