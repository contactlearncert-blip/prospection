'use client';
import { useMemo } from 'react';
import type { Prospect } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type ProspectsByIndustryChartProps = {
  data: Prospect[];
};

export function ProspectsByIndustryChart({ data }: ProspectsByIndustryChartProps) {
  const chartData = useMemo(() => {
    const industryCounts = data.reduce((acc, prospect) => {
      acc[prospect.industry] = (acc[prospect.industry] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(industryCounts).map(([industry, count]) => ({
      industry,
      count,
    }));
  }, [data]);
  
  const chartConfig = {
    count: {
      label: 'Prospects',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="industry"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
