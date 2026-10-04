import { useMemo } from 'react';
import { BaseChart } from '@/components/charts/base-chart';
import { HoverBorderRay } from './HoverBorderRay';
import type { EChartsOption } from 'echarts';
import type { MaliScoreDistribution } from '../types/command-center-types';

interface MaliScoreChartProps {
  data: MaliScoreDistribution[];
}

export function MaliScoreChart({ data }: MaliScoreChartProps) {
  const option: EChartsOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'hsl(var(--background))',
        borderColor: 'hsl(var(--border))',
        textStyle: { color: 'hsl(var(--foreground))' },
        formatter: '{b}: {c}%'
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: '5%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.range),
        axisLine: { lineStyle: { color: 'hsl(var(--border))' } },
        axisLabel: { color: '#e5e7eb', fontSize: 10 },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        max: 60,
        interval: 20,
        splitLine: { show: false },
        axisLabel: {
          formatter: '{value}%',
          color: '#e5e7eb',
          fontSize: 10
        }
      },
      series: [
        {
          name: 'MALi Score',
          type: 'bar',
          barWidth: '40%',
          data: data.map((d, index) => ({
            value: d.percentage,
            itemStyle: {
              color: index === 0 ? '#22c55e' : 
                     index === 1 ? '#3b82f6' : 
                     index === 2 ? '#eab308' : 
                     index === 3 ? '#f97316' : '#ef4444'
            }
          })),
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: 'hsl(var(--foreground))',
            fontSize: 10,
            fontWeight: 'bold'
          }
        }
      ]
    };
  }, [data]);

  return (
    <div className="relative group overflow-hidden bg-background border border-border rounded-xl p-4 flex flex-col h-full min-h-[200px] transition-all duration-300 motion-safe:hover:-translate-y-[1px] motion-safe:hover:bg-foreground/[0.02] motion-safe:hover:border-foreground/15 shadow-sm motion-safe:hover:shadow-[-8px_0_24px_-4px_rgba(0,0,0,0.4)]">
      <HoverBorderRay />
      <h3 className="font-semibold text-foreground mb-2 relative z-10">MALi Score Distribution</h3>
      <div className="flex-1 -mx-2 relative z-10">
        <BaseChart option={option} height="100%" />
      </div>
    </div>
  );
}
