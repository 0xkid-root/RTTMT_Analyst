import { useMemo } from 'react';
import { BaseChart } from '@/components/charts/base-chart';
import type { EChartsOption } from 'echarts';

interface RiskActivityChartProps {
  data: {
    times: string[];
    values: number[];
  };
}

export function RiskActivityChart({ data }: RiskActivityChartProps) {
  const option: EChartsOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'hsl(var(--background))',
        borderColor: 'hsl(var(--border))',
        textStyle: { color: 'hsl(var(--foreground))' },
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.times,
        axisLine: { lineStyle: { color: 'hsl(var(--border))' } },
        axisLabel: { color: 'hsl(var(--muted-foreground))', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'hsl(var(--border))', type: 'dashed' } },
        axisLabel: { color: 'hsl(var(--muted-foreground))', fontSize: 10 },
      },
      series: [
        {
          name: 'Risk Events',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: 'hsl(var(--primary))',
            width: 2,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'hsla(var(--primary), 0.3)' },
                { offset: 1, color: 'hsla(var(--primary), 0.0)' }
              ]
            }
          },
          data: data.values,
        },
      ],
    };
  }, [data]);

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm p-4 h-full flex flex-col">
      <h3 className="font-semibold text-foreground mb-4">Risk Activity</h3>
      <div className="flex-1 min-h-[200px]">
        <BaseChart option={option} height="100%" />
      </div>
    </div>
  );
}
