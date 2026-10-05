import { useMemo } from 'react';
import { BaseChart } from '@/components/charts/base-chart';
import type { EChartsOption } from 'echarts';
import type { TransactionVolumeData } from '../types/command-center-types';
import { HoverBorderRay } from './HoverBorderRay';

interface TransactionVolumeChartProps {
  data: TransactionVolumeData;
}

export function TransactionVolumeChart({ data }: TransactionVolumeChartProps) {
  const option: EChartsOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'hsl(var(--background))',
        borderColor: 'hsl(var(--border))',
        textStyle: { color: 'hsl(var(--foreground))' },
      },
      legend: {
        data: ['Successful', 'Failed'],
        right: '5%',
        top: 0,
        textStyle: { color: '#e5e7eb', fontSize: 12 },
        icon: 'circle'
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '5%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.times,
        axisLine: { lineStyle: { color: 'hsl(var(--border))' } },
        axisLabel: { color: '#e5e7eb', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'hsl(var(--border))', type: 'dashed' } },
        axisLabel: { 
          color: '#e5e7eb', 
          fontSize: 10,
          formatter: (value: number) => value >= 1000 ? `${value / 1000}K` : value.toString()
        },
      },
      series: [
        {
          name: 'Successful',
          type: 'line',
          smooth: false,
          symbol: 'none',
          lineStyle: { color: '#22c55e', width: 2 },
          data: data.successful,
        },
        {
          name: 'Failed',
          type: 'line',
          smooth: false,
          symbol: 'none',
          lineStyle: { color: '#ef4444', width: 2 },
          data: data.failed,
        }
      ],
    };
  }, [data]);

  return (
    <div className="relative group overflow-hidden bg-background border border-border rounded-xl shadow-sm p-4 h-full flex flex-col min-h-[250px] transition-all duration-300 motion-safe:hover:-translate-y-[1px] motion-safe:hover:bg-foreground/[0.02] motion-safe:hover:border-foreground/15 motion-safe:hover:shadow-[-8px_0_24px_-4px_rgba(0,0,0,0.4)]">
      <HoverBorderRay />
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="font-semibold text-foreground">Transaction Volume (Last 24h)</h3>
        <button className="text-xs text-primary hover:underline font-medium">View all →</button>
      </div>
      <div className="flex-1 -mx-2 relative z-10">
        <BaseChart option={option} height="100%" />
      </div>
    </div>
  );
}
