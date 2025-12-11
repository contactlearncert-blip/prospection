import { prospects } from '@/lib/data';
import { OverviewCards } from './components/overview-cards';
import { ProspectsByStatusChart } from './components/prospects-by-status-chart';
import { ProspectsByIndustryChart } from './components/prospects-by-industry-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Tableau de bord</h1>
      </div>
      <OverviewCards data={prospects} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Prospects par industrie</CardTitle>
          </CardHeader>
          <CardContent>
            <ProspectsByIndustryChart data={prospects} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Prospects par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ProspectsByStatusChart data={prospects} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
