import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  label,
  error,
  helperText,
  children,
  className, 
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full px-4 py-3 border-2 border-slate-200 rounded-lg transition-all duration-200",
            "focus:border-primary focus:ring-4 focus:ring-primary/10",
            "text-slate-900 bg-white appearance-none cursor-pointer",
            error && "border-error focus:border-error focus:ring-error/10",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ApperIcon 
          name="ChevronDown" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
        />
      </div>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;