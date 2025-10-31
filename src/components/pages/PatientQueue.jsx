import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import StatusBadge from "@/components/molecules/StatusBadge";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import queueService from "@/services/api/queueService";
import patientService from "@/services/api/patientService";
import departmentService from "@/services/api/departmentService";
import { toast } from "react-toastify";
import { format, differenceInMinutes } from "date-fns";

const PatientQueue = () => {
const { toggleSidebar } = useOutletContext();
  const [queue, setQueue] = useState([]);
  const [filteredQueue, setFilteredQueue] = useState([]);
  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [queueData, patientsData, departmentsData, analyticsData] = await Promise.all([
        queueService.getAll(),
        patientService.getAll(),
        departmentService.getAll(),
        queueService.getAnalytics()
      ]);
      
      setQueue(queueData);
      setFilteredQueue(queueData);
      setPatients(patientsData);
      setDepartments(departmentsData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError("Failed to load queue data. Please try again.");
      toast.error("Failed to load queue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Set up real-time updates
    const interval = setInterval(loadData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = queue;

    // Filter by search query
    if (searchQuery.trim()) {
filtered = filtered.filter(item => {
        const patient = getPatientName(item.patient_id_c?.Id || item.patient_id_c);
        return patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item.ticket_number_c?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Filter by department
if (selectedDepartment !== "all") {
      filtered = filtered.filter(item => 
        (item.department_id_c?.Id || item.department_id_c) === parseInt(selectedDepartment)
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
filtered = filtered.filter(item => item.status_c === selectedStatus);
    }
    setFilteredQueue(filtered);
  }, [queue, searchQuery, selectedDepartment, selectedStatus]);

const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === patientId);
    return patient ? `${patient.first_name_c || patient.Name?.split(' ')[0] || ''} ${patient.last_name_c || patient.Name?.split(' ')[1] || ''}` : "Unknown Patient";
  };

  const getDepartmentName = (departmentId) => {
const department = departments.find(d => d.Id === departmentId);
    return department ? (department.name_c || department.Name) : "Unknown Department";
  };
  const calculateWaitTime = (checkInTime) => {
const now = new Date();
    const checkIn = new Date(checkInTime);
    return differenceInMinutes(now, checkIn);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "no_show": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCallNext = async (queueItem) => {
    try {
      await queueService.updateStatus(queueItem.Id, "in_progress");
      toast.success(`Called ${getPatientName(queueItem.patientId)} to consultation`);
      loadData();
    } catch (err) {
      toast.error("Failed to call patient");
    }
  };

  const handleMarkCompleted = async (queueItem) => {
    try {
      await queueService.updateStatus(queueItem.Id, "completed");
      toast.success(`Marked ${getPatientName(queueItem.patientId)} as completed`);
      loadData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleMarkNoShow = async (queueItem) => {
if (confirm(`Mark ${getPatientName(queueItem.patient_id_c?.Id || queueItem.patient_id_c)} as No Show?`)) {
      try {
        await queueService.updateStatus(queueItem.Id, "no_show");
        toast.warning(`Marked ${getPatientName(queueItem.patientId)} as No Show`);
        loadData();
      } catch (err) {
        toast.error("Failed to update status");
      }
    }
  };

  const handleRemoveFromQueue = async (queueItem) => {
if (confirm(`Remove ${getPatientName(queueItem.patient_id_c?.Id || queueItem.patient_id_c)} from queue?`)) {
      try {
        await queueService.delete(queueItem.Id);
        toast.success(`Removed ${getPatientName(queueItem.patientId)} from queue`);
        loadData();
      } catch (err) {
        toast.error("Failed to remove from queue");
      }
    }
  };

  if (loading) return <Loading variant="page" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      <Header 
        onMenuClick={toggleSidebar}
        title="Patient Queue"
        actions={
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" icon="RefreshCw" onClick={loadData}>
              Refresh
            </Button>
            <Button size="sm" icon="UserPlus">
              Add to Queue
            </Button>
          </div>
        }
      />

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total in Queue"
          value={analytics.totalInQueue || 0}
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Average Wait Time"
          value={`${analytics.avgWaitTime || 0} min`}
          icon="Clock"
          color="secondary"
        />
        <StatCard
          title="Patients Served Today"
          value={analytics.patientsServedToday || 0}
          icon="CheckCircle"
          color="success"
        />
        <StatCard
          title="Currently Waiting"
          value={analytics.currentlyWaiting || 0}
          icon="Timer"
          color="warning"
        />
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by patient name or ticket number..."
              onSearch={setSearchQuery}
              className="w-full"
            />
          </div>
          <div className="flex gap-3">
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-48"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.Id} value={dept.Id}>{dept.name}</option>
              ))}
            </Select>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-40"
            >
              <option value="all">All Status</option>
              <option value="waiting">Waiting</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="no_show">No Show</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Queue List */}
      {filteredQueue.length === 0 ? (
        <Empty 
          icon="Clock"
          title="No patients in queue"
          description="The queue is currently empty. Patients will appear here when they check in."
          actionLabel="Add Patient to Queue"
          onAction={() => toast.info("Add to queue feature coming soon")}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredQueue.map((queueItem, index) => {
const waitTime = calculateWaitTime(queueItem.check_in_time_c);
              const isNext = index === 0 && queueItem.status_c === "waiting";
              
              return (
                <div
                  key={queueItem.Id}
                  className={`p-6 transition-colors ${isNext ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          isNext ? 'bg-blue-500 text-white' : 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary'
                        }`}>
{queueItem.position_c}
                        </div>
                        {isNext && (
                          <span className="text-xs text-blue-600 font-medium mt-1">NEXT</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-slate-900">
{getPatientName(queueItem.patient_id_c?.Id || queueItem.patient_id_c)}
                          </h3>
<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(queueItem.status_c)}`}>
                            {queueItem.status_c?.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-slate-600">
                          <span className="flex items-center">
                            <ApperIcon name="Ticket" className="w-4 h-4 mr-1" />
{queueItem.ticket_number_c}
                          </span>
                          <span className="flex items-center">
                            <ApperIcon name="Building2" className="w-4 h-4 mr-1" />
{getDepartmentName(queueItem.department_id_c?.Id || queueItem.department_id_c)}
                          </span>
                          <span className="flex items-center">
                            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                            Wait: {waitTime} min
                          </span>
                          <span className="flex items-center">
<ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                            {format(new Date(queueItem.checkInTime), "HH:mm")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
{queueItem.status_c === "waiting" && (
                        <Button
                          size="sm"
                          variant="outline"
                          icon="Phone"
                          onClick={() => handleCallNext(queueItem)}
                        >
                          Call
                        </Button>
                      )}
                      
{queueItem.status_c === "in_progress" && (
                        <Button
                          size="sm"
                          variant="outline"
                          icon="CheckCircle"
                          onClick={() => handleMarkCompleted(queueItem)}
                        >
                          Complete
                        </Button>
                      )}
                      
{queueItem.status_c === "waiting" && (
                        <Button
                          size="sm"
                          variant="outline"
                          icon="UserX"
                          onClick={() => handleMarkNoShow(queueItem)}
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
                        >
                          No Show
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        icon="X"
                        onClick={() => handleRemoveFromQueue(queueItem)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PatientQueue;