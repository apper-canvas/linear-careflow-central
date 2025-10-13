import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import departmentService from "@/services/api/departmentService";
import { toast } from "react-toastify";

const Departments = ({ toggleSidebar, closeSidebar }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError("Failed to load department data. Please try again.");
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleAddDepartment = () => {
    toast.info("Add department feature will be implemented soon");
  };

  const getOccupancyColor = (percentage) => {
    if (percentage >= 90) return "error";
    if (percentage >= 70) return "warning";
    return "success";
  };

  const getDepartmentIcon = (name) => {
    const icons = {
      "Emergency Department": "Zap",
      "Cardiology": "Heart",
      "Internal Medicine": "Stethoscope",
      "Obstetrics & Gynecology": "Baby",
      "Pulmonology": "Wind",
      "Pediatrics": "Users"
    };
    return icons[name] || "Building2";
  };

  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadDepartments} />;

  return (
    <div className="space-y-8">
      <Header 
        onMenuClick={toggleSidebar}
        title="Departments"
        actions={
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" icon="BarChart3">
              Reports
            </Button>
            <Button size="sm" icon="Plus" onClick={handleAddDepartment}>
              Add Department
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Hospital Departments</h2>
            <p className="text-slate-600">Monitor department capacity and manage bed allocation</p>
          </div>
        </div>

        {departments.length === 0 ? (
          <Empty 
            icon="Building2"
            title="No departments found"
            description="Add departments to organize hospital services and manage bed capacity."
            actionLabel="Add First Department"
            onAction={handleAddDepartment}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {departments.map((department) => {
              const occupancyPercentage = Math.round((department.occupiedBeds / department.totalBeds) * 100);
              const availableBeds = department.totalBeds - department.occupiedBeds;
              
              return (
                <Card key={department.Id} className="p-6" hover gradient>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                        <ApperIcon 
                          name={getDepartmentIcon(department.name)} 
                          className="w-6 h-6 text-primary" 
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{department.name}</h3>
                        <p className="text-sm text-slate-600">{department.floor}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Bed Capacity */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">Bed Capacity</span>
                        <span className={`text-sm font-semibold ${
                          occupancyPercentage >= 90 ? "text-error" : 
                          occupancyPercentage >= 70 ? "text-warning" : "text-success"
                        }`}>
                          {occupancyPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            occupancyPercentage >= 90 ? "bg-gradient-to-r from-error to-red-600" : 
                            occupancyPercentage >= 70 ? "bg-gradient-to-r from-warning to-yellow-600" : 
                            "bg-gradient-to-r from-success to-green-600"
                          }`}
                          style={{ width: `${occupancyPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>{department.occupiedBeds} occupied</span>
                        <span>{availableBeds} available</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900">{department.totalBeds}</div>
                        <div className="text-xs text-slate-600">Total Beds</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-success">{availableBeds}</div>
                        <div className="text-xs text-slate-600">Available</div>
                      </div>
                    </div>

                    {/* Department Info */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center text-sm text-slate-600">
                        <ApperIcon name="UserCheck" className="w-4 h-4 mr-2 text-slate-500" />
                        {department.headOfDepartment}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <ApperIcon name="Phone" className="w-4 h-4 mr-2 text-slate-500" />
                        {department.phone}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" icon="Bed">
                        Manage Beds
                      </Button>
                      <Button variant="ghost" size="sm" icon="MoreHorizontal" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;