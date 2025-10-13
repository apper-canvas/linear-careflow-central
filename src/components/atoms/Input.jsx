import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  label,
  error,
  helperText,
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
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 border-2 border-slate-200 rounded-lg transition-all duration-200",
          "focus:border-primary focus:ring-4 focus:ring-primary/10",
          "placeholder-slate-400 text-slate-900",
          error && "border-error focus:border-error focus:ring-error/10",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;