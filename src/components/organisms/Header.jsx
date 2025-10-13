import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ onMenuClick, title, actions }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" className="w-6 h-6" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {actions}
          
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;