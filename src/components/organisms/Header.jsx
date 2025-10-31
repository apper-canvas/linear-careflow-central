import React from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title, actions }) => {
const { logout } = useAuth();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ApperIcon name="Menu" className="w-6 h-6 text-slate-600" />
          </button>
          
          {title && (
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {actions && actions}
          
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-lg">
              <ApperIcon name="Clock" className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric"
                })}
              </span>
            </div>

            {isAuthenticated && user && (
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium text-slate-900">
                    {user.firstName || user.name || 'User'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {user.emailAddress || user.email || ''}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon="LogOut"
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-error border-slate-200 hover:border-error"
                >
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
</div>
    </header>
  );
};

export default Header;