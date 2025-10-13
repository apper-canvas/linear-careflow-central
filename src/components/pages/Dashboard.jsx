import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import patientService from "@/services/api/patientService";
import appointmentService from "@/services/api/appointmentService";
import departmentService from "@/services/api/departmentService";
import admissionService from "@/services/api/admissionService";
import staffService from "@/services/api/staffService";
import { format, isToday, parseISO } from "date-fns";
import { toast } from "react-toastify";

const Dashboard = ({ toggleSidebar, closeSidebar }) => {
  const [stats, setStats] = useState({});
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [activeAdmissions, setActiveAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patients, appointments, departments, admissions, staff] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        departmentService.getAll(),
        admissionService.getAll(),
        staffService.getAll()
      ]);

      // Calculate stats
      const totalPatients = patients.length;
      const todayAppointments = appointments.filter(apt => 
        isToday(parseISO(apt.date))
      ).length;
      const totalBeds = departments.reduce((sum, dept) => sum + dept.totalBeds, 0);
      const occupiedBeds = departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0);
      const emergencyCases = patients.filter(p => p.admissionStatus === "Emergency").length;
      const availableStaff = staff.filter(s => s.availabilityStatus === "Available").length;

      setStats({
        totalPatients,
        todayAppointments,
        bedOccupancy: Math.round((occupiedBeds / totalBeds) * 100),
        availableBeds: totalBeds - occupiedBeds,
        emergencyCases,
        availableStaff
      });

      // Get recent appointments
      const recent = appointments
        .filter(apt => apt.status === "Scheduled" || apt.status === "In Progress")
        .sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time))
        .slice(0, 5);
      setRecentAppointments(recent);

      // Get active admissions
      const active = admissions
        .filter(adm => adm.status === "Active" || adm.status === "Critical" || adm.status === "Stable")
        .slice(0, 5);
      setActiveAdmissions(active);

    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getPatientName = (patientId) => {
    // This would normally come from a patients lookup, but for now we'll simulate it
    const names = ["Sarah Johnson", "Robert Chen", "Maria Rodriguez", "James Wilson", "Emily Davis"];
    return names[parseInt(patientId) % names.length] || "Unknown Patient";
  };

  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      <Header 
        onMenuClick={toggleSidebar}
        title="Dashboard"
        actions={
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" icon="RefreshCw" onClick={loadDashboardData}>
              Refresh
            </Button>
            <Button size="sm" icon="Plus">
              Quick Actions
            </Button>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients || 0}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+12% this month"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments || 0}
          icon="Calendar"
          color="success"
          trend="up"
          trendValue="+8 from yesterday"
        />
        <StatCard
          title="Bed Occupancy"
          value={`${stats.bedOccupancy || 0}%`}
          icon="Bed"
          color="warning"
          trend="up"
          trendValue="+5% from last week"
        />
        <StatCard
          title="Available Beds"
          value={stats.availableBeds || 0}
          icon="BedDouble"
          color="success"
        />
        <StatCard
          title="Emergency Cases"
          value={stats.emergencyCases || 0}
          icon="Zap"
          color="error"
          trend="down"
          trendValue="-2 from yesterday"
        />
        <StatCard
          title="Available Staff"
          value={stats.availableStaff || 0}
          icon="UserCheck"
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Upcoming Appointments</h3>
            <Button variant="ghost" size="sm" icon="ArrowRight">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentAppointments.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <ApperIcon name="Calendar" className="w-8 h-8 mx-auto mb-2" />
                <p>No upcoming appointments</p>
              </div>
            ) : (
              recentAppointments.map((appointment) => (
                <div key={appointment.Id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                      <ApperIcon name="Clock" className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {getPatientName(appointment.patientId)}
                      </p>
                      <p className="text-sm text-slate-600">
                        {format(parseISO(appointment.date), "MMM d")} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={appointment.status} type="appointment" />
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Active Admissions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Active Admissions</h3>
            <Button variant="ghost" size="sm" icon="ArrowRight">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {activeAdmissions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <ApperIcon name="Bed" className="w-8 h-8 mx-auto mb-2" />
                <p>No active admissions</p>
              </div>
            ) : (
              activeAdmissions.map((admission) => (
                <div key={admission.Id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-accent/10 to-accent/20 rounded-full flex items-center justify-center">
                      <ApperIcon name="Bed" className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {getPatientName(admission.patientId)}
                      </p>
                      <p className="text-sm text-slate-600">
                        Room {admission.bedNumber} • {admission.diagnosis}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={admission.status} type="admission" />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col" icon="UserPlus">
            <span className="mt-2">Add Patient</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col" icon="Calendar">
            <span className="mt-2">Schedule Appointment</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col" icon="Bed">
            <span className="mt-2">Admit Patient</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col" icon="FileText">
            <span className="mt-2">View Reports</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;