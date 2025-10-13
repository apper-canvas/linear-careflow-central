import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Button from "@/components/atoms/Button";
import Header from "@/components/organisms/Header";
import PatientList from "@/components/organisms/PatientList";

const Patients = () => {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleAddPatient = () => {
    navigate("/patients/add");
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    toast.success(`Selected patient: ${patient.firstName} ${patient.lastName}`);
  };
  return (
    <div className="space-y-8">
      <Header 
        onMenuClick={toggleSidebar}
        title="Patients"
        actions={
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" icon="Download">
              Export
            </Button>
            <Button size="sm" icon="Plus" onClick={handleAddPatient}>
              Add Patient
            </Button>
          </div>
        }
      />

      <PatientList 
        onSelectPatient={handleSelectPatient}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
};

export default Patients;