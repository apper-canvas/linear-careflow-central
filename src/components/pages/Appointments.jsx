import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import AppointmentCalendar from "@/components/organisms/AppointmentCalendar";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";

const Appointments = () => {
  const { toggleSidebar } = useOutletContext() || { toggleSidebar: () => {} };

  const handleAddAppointment = () => {
    toast.info("Schedule appointment feature will be implemented soon");
  };

  return (
    <div className="space-y-8">
      <Header 
        onMenuClick={toggleSidebar}
        title="Appointments"
        actions={
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" icon="Calendar">
              View List
            </Button>
            <Button size="sm" icon="Plus" onClick={handleAddAppointment}>
              Schedule Appointment
            </Button>
          </div>
        }
      />

      <AppointmentCalendar onAddAppointment={handleAddAppointment} />
    </div>
  );
};

export default Appointments;