import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import PatientList from "@/components/organisms/PatientList";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";

const Patients = () => {
  const { toggleSidebar } = useOutletContext();
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    toast.success(`Selected patient: ${patient.firstName} ${patient.lastName}`);
  };

  const handleAddPatient = () => {
    toast.info("Add patient feature will be implemented soon");
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