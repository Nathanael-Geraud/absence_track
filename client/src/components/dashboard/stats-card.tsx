import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  loading?: boolean;
  title?: string;
  value?: number;
  icon?: ReactNode;
  iconColor?: string;
  trend?: {
    value: string;
    label: string;
    direction: 'up' | 'down';
  };
}

export default function StatsCard({ 
  loading = false, 
  title = "Statistique",
  value = 0,
  icon,
  iconColor = "bg-primary/10 text-primary",
  trend
}: StatsCardProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center">
          <Skeleton className="h-12 w-12 rounded-full mr-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-10" />
          </div>
        </div>
        <Skeleton className="h-4 w-32 mt-4" />
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconColor} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <p className="text-2xl font-bold text-neutral-800">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="mt-4 text-sm">
          <span className={`font-medium ${
            trend.direction === 'up' 
              ? 'text-red-500 flex items-center' 
              : 'text-green-500 flex items-center'
          }`}>
            {trend.direction === 'up' ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {trend.value}
          </span>{" "}
          {trend.label}
        </div>
      )}
    </Card>
  );
}
