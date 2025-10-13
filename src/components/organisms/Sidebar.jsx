import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: "", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "patients", label: "Patients", icon: "Users" },
    { path: "appointments", label: "Appointments", icon: "Calendar" },
    { path: "staff", label: "Staff", icon: "UserCheck" },
    { path: "departments", label: "Departments", icon: "Building2" },
{ path: "admissions", label: "Admissions", icon: "Bed" },
    { path: "patient-queue", label: "Patient Queue", icon: "Clock" }
  ];

  const isActivePath = (path) => {
    if (path === "") {
      return location.pathname === "/";
    }
    return location.pathname.includes(path);
  };

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-slate-200 lg:h-screen lg:sticky lg:top-0">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="Heart" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CareFlow Central
            </h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path === "" ? "/" : `/${item.path}`}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              isActivePath(item.path)
                ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <ApperIcon 
              name={item.icon} 
              className={cn(
                "w-5 h-5 transition-colors",
                isActivePath(item.path) ? "text-primary" : "text-slate-500 group-hover:text-slate-700"
              )} 
            />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );

  // Mobile sidebar
  const MobileSidebar = () => (
    <div className="lg:hidden">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-out shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Heart" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  CareFlow Central
                </h1>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path === "" ? "/" : `/${item.path}`}
              onClick={onClose}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActivePath(item.path)
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActivePath(item.path) ? "text-primary" : "text-slate-500 group-hover:text-slate-700"
                )} 
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;