'use client';
import { useUser, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { OverviewCards } from './components/overview-cards';
import { ProspectsByStatusChart } from './components/prospects-by-status-chart';
import { ProspectsByIndustryChart } from './components/prospects-by-industry-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Prospect } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
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

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl">Tableau de bord</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[126px]" />
          <Skeleton className="h-[126px]" />
          <Skeleton className="h-[126px]" />
          <Skeleton className="h-[126px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="lg:col-span-4 h-[350px]" />
          <Skeleton className="lg:col-span-3 h-[350px]" />
        </div>
      </div>
    );
  }

  const safeProspects = prospects || [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Tableau de bord</h1>
      </div>
      <OverviewCards data={safeProspects} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Prospects par industrie</CardTitle>
          </CardHeader>
          <CardContent>
            <ProspectsByIndustryChart data={safeProspects} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Prospects par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ProspectsByStatusChart data={safeProspects} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
