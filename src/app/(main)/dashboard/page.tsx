'use client';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OverviewCards } from './components/overview-cards';
import { ProspectsByStatusChart } from './components/prospects-by-status-chart';
import { ProspectsByIndustryChart } from './components/prospects-by-industry-chart';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const prospectsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/prospects`);
  }, [firestore, user]);

  const { data: prospects, loading: prospectsLoading } = useCollection(prospectsQuery);

  const isLoading = userLoading || prospectsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
            <h1 className="font-semibold text-lg md:text-2xl">Tableau de bord</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Prospects par industrie</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <Skeleton className="h-[250px]" />
                </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Prospects par statut</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[250px]" />
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Tableau de bord</h1>
      </div>
      <OverviewCards data={prospects || []} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Prospects par industrie</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ProspectsByIndustryChart data={prospects || []} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Prospects par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ProspectsByStatusChart data={prospects || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
