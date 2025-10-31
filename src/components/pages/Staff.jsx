import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import staffService from "@/services/api/staffService";
import { toast } from "react-toastify";

const Staff = () => {
const { toggleSidebar } = useOutletContext();
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await staffService.getAll();
      setStaff(data);
      setFilteredStaff(data);
    } catch (err) {
      setError("Failed to load staff data. Please try again.");
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredStaff(staff);
      return;
    }

    const filtered = staff.filter(member => 
      member.firstName.toLowerCase().includes(query.toLowerCase()) ||
      member.lastName.toLowerCase().includes(query.toLowerCase()) ||
      member.role.toLowerCase().includes(query.toLowerCase()) ||
      member.department.toLowerCase().includes(query.toLowerCase()) ||
      member.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStaff(filtered);
  };

  const handleAddStaff = () => {
    toast.info("Add staff member feature will be implemented soon");
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadStaff} />;

  return (
    <div className="space-y-8">
      <Header 
        onMenuClick={toggleSidebar}
        title="Staff Directory"
        actions={
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" icon="Users">
              By Department
            </Button>
            <Button size="sm" icon="Plus" onClick={handleAddStaff}>
              Add Staff
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Staff Members</h2>
            <p className="text-slate-600">Manage hospital staff and their information</p>
          </div>
        </div>

        <SearchBar 
          placeholder="Search staff by name, role, department, or email..."
          onSearch={handleSearch}
        />

        {filteredStaff.length === 0 ? (
          <Empty 
            icon="Users"
            title="No staff members found"
            description="Try adjusting your search criteria or add new staff members."
            actionLabel="Add Staff Member"
            onAction={handleAddStaff}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <Card key={member.Id} className="p-6" hover>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                      <ApperIcon 
                        name={member.role.includes("Dr.") ? "Stethoscope" : "User"} 
                        className="w-6 h-6 text-primary" 
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-sm text-slate-600">{member.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={member.availabilityStatus} type="staff" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="Building2" className="w-4 h-4 mr-2 text-slate-500" />
                    {member.department}
                  </div>
                  
                  {member.specialization && (
                    <div className="flex items-center text-sm text-slate-600">
                      <ApperIcon name="Award" className="w-4 h-4 mr-2 text-slate-500" />
                      {member.specialization}
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="Phone" className="w-4 h-4 mr-2 text-slate-500" />
                    {member.phone}
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="Mail" className="w-4 h-4 mr-2 text-slate-500" />
                    {member.email}
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="Clock" className="w-4 h-4 mr-2 text-slate-500" />
                    {member.workingHours}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      Joined {new Date(member.joinDate).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" icon="Phone" />
                      <Button variant="ghost" size="sm" icon="Mail" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;