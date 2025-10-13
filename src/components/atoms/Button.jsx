import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  className, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:-translate-y-0.5",
    secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:shadow-lg hover:-translate-y-0.5",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:-translate-y-0.5",
    outline: "border-2 border-slate-300 text-slate-700 hover:border-primary hover:text-primary",
    ghost: "text-slate-600 hover:text-primary hover:bg-slate-50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        loading && "opacity-70 cursor-wait",
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;