'use client';
import { useMemo } from 'react';
import type { Prospect, ProspectStatus } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';
import { LabelList } from 'recharts';

type ProspectsByStatusChartProps = {
  data: Prospect[];
};

const statusColors: { [key: string]: string } = {
  new: 'hsl(var(--chart-1))',
  contacted: 'hsl(var(--chart-2))',
  replied: 'hsl(var(--chart-3))',
  interested: 'hsl(var(--chart-4))',
  not_interested: 'hsl(var(--chart-5))',
};

const statusTranslations: Record<ProspectStatus, string> = {
  new: 'Nouveau',
  contacted: 'Contacté',
  replied: 'A répondu',
  interested: 'Intéressé',
  not_interested: 'Pas intéressé',
};


export function ProspectsByStatusChart({ data }: ProspectsByStatusChartProps) {
  const chartData = useMemo(() => {
    const statusCounts = data.reduce((acc, prospect) => {
      acc[prospect.status] = (acc[prospect.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: statusTranslations[status as ProspectStatus] || status,
      count,
      fill: statusColors[status] || '#ccc',
    }));
  }, [data]);

  const chartConfig = useMemo(() => {
    return chartData.reduce((acc, item) => {
        acc[item.status] = { label: item.status, color: item.fill };
        return acc;
    }, {} as any)
  }, [chartData]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
        <Pie data={chartData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
           <LabelList
            dataKey="count"
            className="fill-background font-semibold"
            stroke="none"
            fontSize={12}
            formatter={(value: string) => (parseInt(value, 10) > 0 ? value : '')}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent />}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </PieChart>
    </ChartContainer>
  );
}
