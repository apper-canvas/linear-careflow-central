import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="animate-shimmer h-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="animate-shimmer h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded mb-3"></div>
              <div className="animate-shimmer h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded mb-2"></div>
              <div className="animate-shimmer h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="animate-shimmer h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-48"></div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-slate-50 flex items-center space-x-4">
              <div className="animate-shimmer w-12 h-12 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-full"></div>
              <div className="flex-1">
                <div className="animate-shimmer h-5 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded mb-2"></div>
                <div className="animate-shimmer h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-2/3"></div>
              </div>
              <div className="animate-shimmer h-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-full w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="relative">
        <div className="w-12 h-12 border-4 border-slate-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>
      <span className="ml-3 text-slate-600 font-medium">Loading...</span>
    </div>
  );
};

export default Loading;