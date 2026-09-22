'use client';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useTheme } from 'next-themes';

interface BaseChartProps {
  option: EChartsOption;
  height?: number | string;
  className?: string;
}

export function BaseChart({ option, height = 300, className }: BaseChartProps) {
  const { resolvedTheme } = useTheme();

  return (
    <ReactECharts
      option={option}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      style={{ height, width: '100%' }}
      className={className}
      opts={{ renderer: 'svg' }}
    />
  );
}
