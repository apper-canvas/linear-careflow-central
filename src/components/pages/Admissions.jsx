import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import admissionService from "@/services/api/admissionService";
import patientService from "@/services/api/patientService";
import departmentService from "@/services/api/departmentService";
import staffService from "@/services/api/staffService";
import { format, parseISO, differenceInDays } from "date-fns";
import { toast } from "react-toastify";

const Admissions = () => {
const { toggleSidebar } = useOutletContext();
  const [admissions, setAdmissions] = useState([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [admissionsData, patientsData, departmentsData, staffData] = await Promise.all([
        admissionService.getAll(),
        patientService.getAll(),
        departmentService.getAll(),
        staffService.getAll()
      ]);
      
      setAdmissions(admissionsData);
      setFilteredAdmissions(admissionsData);
      setPatients(patientsData);
      setDepartments(departmentsData);
      setStaff(staffData);
    } catch (err) {
      setError("Failed to load admission data. Please try again.");
      toast.error("Failed to load admissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (query) => {
if (!query.trim()) {
      setFilteredAdmissions(admissions);
      return;
    }

    const filtered = admissions.filter(admission => {
      const patient = getPatientById(admission.patient_id_c?.Id || admission.patient_id_c);
      const department = getDepartmentById(admission.department_id_c?.Id || admission.department_id_c);
      
      return (
        admission.bed_number_c?.toLowerCase().includes(query.toLowerCase()) ||
        admission.diagnosis_c?.toLowerCase().includes(query.toLowerCase()) ||
        (patient && `${patient.first_name_c} ${patient.last_name_c}`.toLowerCase().includes(query.toLowerCase())) ||
        (department && department.name_c?.toLowerCase().includes(query.toLowerCase()))
      );
    });
    setFilteredAdmissions(filtered);
  };

  const getPatientById = (patientId) => {
    return patients.find(p => p.Id === parseInt(patientId));
  };

  const getDepartmentById = (departmentId) => {
    return departments.find(d => d.Id === parseInt(departmentId));
  };

  const getStaffById = (staffId) => {
    return staff.find(s => s.Id === parseInt(staffId));
  };

  const handleAddAdmission = () => {
    toast.info("Admit patient feature will be implemented soon");
  };

const handleDischarge = (admission) => {
    const patient = getPatientById(admission.patient_id_c?.Id || admission.patient_id_c);
    toast.success(`Discharge process started for ${patient?.first_name_c || patient?.Name?.split(' ')[0] || ''} ${patient?.last_name_c || patient?.Name?.split(' ')[1] || ''}`);
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      <Header 
        onMenuClick={toggleSidebar}
        title="Admissions"
        actions={
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" icon="Filter">
              Filter
            </Button>
            <Button size="sm" icon="Plus" onClick={handleAddAdmission}>
              Admit Patient
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Active Admissions</h2>
            <p className="text-slate-600">Monitor patient admissions and manage bed assignments</p>
          </div>
        </div>

        <SearchBar 
          placeholder="Search by patient name, bed number, department, or diagnosis..."
          onSearch={handleSearch}
        />

        {filteredAdmissions.length === 0 ? (
          <Empty 
            icon="Bed"
            title="No active admissions"
            description="All beds are currently available. Admit patients as needed."
            actionLabel="Admit Patient"
            onAction={handleAddAdmission}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
{filteredAdmissions.map((admission) => {
              const patient = getPatientById(admission.patient_id_c?.Id || admission.patient_id_c);
              const department = getDepartmentById(admission.department_id_c?.Id || admission.department_id_c);
              const attendingDoctor = getStaffById(admission.attending_doctor_id_c?.Id || admission.attending_doctor_id_c);
              const daysAdmitted = admission.admission_date_c ? differenceInDays(new Date(), parseISO(admission.admission_date_c)) : 0;
              
              return (
                <Card key={admission.Id} className="p-6" hover>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-accent/10 to-accent/20 rounded-full flex items-center justify-center">
                        <ApperIcon name="Bed" className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {patient ? `${patient.first_name_c || patient.Name?.split(' ')[0] || ''} ${patient.last_name_c || patient.Name?.split(' ')[1] || ''}` : "Unknown Patient"}
                        </h3>
                        <p className="text-sm text-slate-600">Room {admission.bed_number_c}</p>
                      </div>
                    </div>
                    <StatusBadge status={admission.status_c} type="admission" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <ApperIcon name="Building2" className="w-4 h-4 mr-2 text-slate-500" />
                      {department?.name_c || department?.Name || "Unknown Department"}
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-600">
                      <ApperIcon name="UserCheck" className="w-4 h-4 mr-2 text-slate-500" />
                      {attendingDoctor ? `${attendingDoctor.first_name_c || attendingDoctor.Name?.split(' ')[0] || ''} ${attendingDoctor.last_name_c || attendingDoctor.Name?.split(' ')[1] || ''}` : "Unassigned"}
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-600">
                      <ApperIcon name="FileText" className="w-4 h-4 mr-2 text-slate-500" />
                      {admission.diagnosis_c}
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-600">
                      <ApperIcon name="Calendar" className="w-4 h-4 mr-2 text-slate-500" />
                      Admitted {admission.admission_date_c ? format(parseISO(admission.admission_date_c), "MMM d, yyyy") : "Unknown"}
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-600">
                      <ApperIcon name="Clock" className="w-4 h-4 mr-2 text-slate-500" />
                      {daysAdmitted} day{daysAdmitted !== 1 ? "s" : ""} admitted
                    </div>

                    {admission.estimated_discharge_c && (
                      <div className="flex items-center text-sm text-slate-600">
                        <ApperIcon name="LogOut" className="w-4 h-4 mr-2 text-slate-500" />
                        Est. discharge: {format(parseISO(admission.estimated_discharge_c), "MMM d, yyyy")}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      {admission.admission_type_c} admission
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" icon="FileText">
                        Chart
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon="LogOut"
                        onClick={() => handleDischarge(admission)}
                      >
                        Discharge
                      </Button>
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

export default Admissions;