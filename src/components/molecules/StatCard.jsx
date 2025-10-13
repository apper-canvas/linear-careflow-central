import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  color = "primary",
  className 
}) => {
  const colorConfigs = {
    primary: {
      gradient: "from-primary to-secondary",
      bg: "from-primary/10 to-secondary/10",
      text: "text-primary"
    },
    success: {
      gradient: "from-success to-green-600",
      bg: "from-success/10 to-green-100",
      text: "text-success"
    },
    warning: {
      gradient: "from-warning to-yellow-600",
      bg: "from-warning/10 to-yellow-100",
      text: "text-warning"
    },
    error: {
      gradient: "from-error to-red-600",
      bg: "from-error/10 to-red-100",
      text: "text-error"
    }
  };

  const config = colorConfigs[color];

  return (
    <Card className={cn("p-6", className)} hover gradient>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center text-sm font-medium",
              trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-slate-600"
            )}>
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                className="w-4 h-4 mr-1" 
              />
              {trendValue}
            </div>
          )}
        </div>
        <div className={cn(
          "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center",
          config.bg
        )}>
          <ApperIcon name={icon} className={cn("w-8 h-8", config.text)} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;