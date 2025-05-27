
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const MetricsCard = ({ title, value, subtitle, icon, trend }: MetricsCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 border-purple-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</CardTitle>
        {icon && <div className="text-purple-600 dark:text-purple-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className={`text-xs mt-2 flex items-center ${
            trend.isPositive ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'
          }`}>
            <span className="mr-1">
              {trend.isPositive ? '↗' : '↘'}
            </span>
            {Math.abs(trend.value)}% vs mês anterior
          </div>
        )}
      </CardContent>
    </Card>
  );
};
