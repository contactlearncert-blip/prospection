'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Prospect } from '@/lib/types';
import { Users, Mail, ThumbsUp, Percent } from 'lucide-react';

type OverviewCardsProps = {
  data: Prospect[];
};

export function OverviewCards({ data }: OverviewCardsProps) {
  const totalProspects = data.length;
  const newProspects = data.filter((p) => p.status === 'new').length;
  const interestedProspects = data.filter((p) => p.status === 'interested').length;
  const contactedProspects = data.filter(
    (p) => p.status !== 'new' && p.status !== 'not_interested'
  ).length;

  const conversionRate =
    contactedProspects > 0
      ? ((interestedProspects / contactedProspects) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des prospects</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProspects}</div>
          <p className="text-xs text-muted-foreground">Tous les prospects de votre pipeline</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nouveaux prospects</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newProspects}</div>
          <p className="text-xs text-muted-foreground">Pistes qui doivent être contactées</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Intéressés</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{interestedProspects}</div>
          <p className="text-xs text-muted-foreground">Prospects qui ont montré de l'intérêt</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate}%</div>
          <p className="text-xs text-muted-foreground">De contacté à intéressé</p>
        </CardContent>
      </Card>
    </div>
  );
}
