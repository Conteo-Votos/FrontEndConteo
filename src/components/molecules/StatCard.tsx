import React from 'react';
import { Typography } from '../atoms/Typography';
import { Badge } from '../atoms/Badge';
import { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
};

export const StatCard = ({ title, value, icon: Icon, trend, className = '' }: StatCardProps) => {
  return (
    <div className={`glass-panel p-6 rounded-2xl flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between text-gray-400">
        <Typography variant="small" className="font-medium text-gray-300">{title}</Typography>
        <div className="p-2 bg-carbon-900 rounded-lg">
          <Icon className="w-5 h-5 text-bronze-500" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <Typography variant="h2">{value}</Typography>
        {trend && (
          <Badge variant={trend.isPositive ? 'success' : 'error'} className="mb-1">
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </Badge>
        )}
      </div>
    </div>
  );
};
