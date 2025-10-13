import React from "react";
import { Link } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertTriangle" className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Page Not Found
        </h2>
        
        <p className="text-slate-600 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to managing patient care.
        </p>
        
        <div className="space-y-3">
          <Link to="/">
            <Button className="w-full" icon="Home">
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex space-x-3">
            <Link to="/patients" className="flex-1">
              <Button variant="outline" size="sm" className="w-full" icon="Users">
                Patients
              </Button>
            </Link>
            <Link to="/appointments" className="flex-1">
              <Button variant="outline" size="sm" className="w-full" icon="Calendar">
                Appointments
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Need help? Contact your system administrator or try refreshing the page.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;