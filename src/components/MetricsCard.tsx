
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
    <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon && <div className="text-purple-600">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className={`text-xs mt-2 flex items-center ${
            trend.isPositive ? 'text-purple-600' : 'text-red-600'
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
