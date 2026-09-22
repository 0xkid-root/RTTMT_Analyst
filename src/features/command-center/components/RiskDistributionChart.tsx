import { useMemo } from 'react';
import { BaseChart } from '@/components/charts/base-chart';
import type { EChartsOption } from 'echarts';

interface RiskDistributionChartProps {
  data: {
    totalTransactions: number;
    low: { count: number; percentage: number };
    medium: { count: number; percentage: number };
    high: { count: number; percentage: number };
    critical: { count: number; percentage: number };
  };
}

export function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  const option: EChartsOption = useMemo(() => {
    return {
      title: {
        text: `${data.totalTransactions.toLocaleString()}\nTotal Transactions`,
        left: '25%',
        top: 'center',
        textAlign: 'center',
        textVerticalAlign: 'middle',
        textStyle: {
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 'bold',
          lineHeight: 20
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'hsl(var(--background))',
        borderColor: 'hsl(var(--border))',
        textStyle: { color: 'hsl(var(--foreground))' },
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'middle',
        itemGap: 15,
        formatter: (name: string) => {
          const key = name.toLowerCase() as 'low' | 'medium' | 'high' | 'critical';
          const val = data[key];
          return `{name|${name}}  {count|${val.count.toLocaleString()}}  {pct|(${val.percentage.toFixed(1)}%)}`;
        },
        textStyle: {
          color: '#e5e7eb',
          fontSize: 12,
          rich: {
            name: { width: 50, color: '#ffffff' },
            count: { width: 60, align: 'right', color: '#ffffff', fontWeight: 'bold' },
            pct: { width: 40, align: 'right', color: '#e5e7eb', fontSize: 10 }
          }
        }
      },
      series: [
        {
          name: 'Risk Distribution',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['25%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: 'hsl(var(--background))',
            borderWidth: 2
          },
          label: { show: false },
          labelLine: { show: false },
          data: [
            { value: data.low.count, name: 'Low', itemStyle: { color: '#22c55e' } },
            { value: data.medium.count, name: 'Medium', itemStyle: { color: '#eab308' } },
            { value: data.high.count, name: 'High', itemStyle: { color: '#f97316' } },
            { value: data.critical.count, name: 'Critical', itemStyle: { color: '#ef4444' } },
          ]
        }
      ]
    };
  }, [data]);

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm p-4 flex flex-col h-full min-h-[220px]">
      <h3 className="font-semibold text-foreground mb-2">Risk Distribution</h3>
      <div className="flex-1 -mx-4">
        <BaseChart option={option} height="100%" />
      </div>
    </div>
  );
}
