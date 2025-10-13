import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import appointmentService from "@/services/api/appointmentService";
import patientService from "@/services/api/patientService";
import staffService from "@/services/api/staffService";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { toast } from "react-toastify";

const AppointmentCalendar = ({ onAddAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [appointmentsData, patientsData, staffData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        staffService.getAll()
      ]);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setStaff(staffData);
    } catch (err) {
      setError("Failed to load appointment data. Please try again.");
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => 
      isSameDay(parseISO(apt.date), date)
    );
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === parseInt(patientId));
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
  };

  const getDoctorName = (doctorId) => {
    const doctor = staff.find(s => s.Id === parseInt(doctorId));
    return doctor ? `${doctor.firstName} ${doctor.lastName}` : "Unknown Doctor";
  };

  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Appointment Calendar</h2>
          <p className="text-slate-600">Schedule and manage patient appointments</p>
        </div>
        <Button onClick={onAddAppointment} icon="Plus">
          Schedule Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              {format(currentDate, "MMMM yyyy")}
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                icon="ChevronLeft"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                icon="ChevronRight"
              />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((date) => {
              const dayAppointments = getAppointmentsForDate(date);
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());

              return (
                <div
                  key={date.toISOString()}
                  className={`calendar-day min-h-[80px] p-2 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : isToday
                      ? "border-accent bg-accent/10"
                      : "border-slate-200 hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="text-sm font-medium text-slate-900 mb-1">
                    {format(date, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.Id}
                        className={`text-xs px-1 py-0.5 rounded truncate ${
                          apt.status === "Completed" ? "bg-success/20 text-success" :
                          apt.status === "In Progress" ? "bg-warning/20 text-warning" :
                          apt.status === "Cancelled" ? "bg-error/20 text-error" :
                          "bg-info/20 text-info"
                        }`}
                      >
                        {apt.time}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-slate-500">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Selected Day Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {format(selectedDate, "MMMM d, yyyy")}
          </h3>

          {(() => {
            const dayAppointments = getAppointmentsForDate(selectedDate);
            
            if (dayAppointments.length === 0) {
              return (
                <Empty
                  icon="Calendar"
                  title="No appointments"
                  description="No appointments scheduled for this date."
                  actionLabel="Schedule Appointment"
                  onAction={onAddAppointment}
                />
              );
            }

            return (
              <div className="space-y-4">
                {dayAppointments.map((appointment) => (
                  <div key={appointment.Id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-medium text-slate-900">
                        {appointment.time} - {getDoctorName(appointment.doctorId)}
                      </div>
                      <StatusBadge status={appointment.status} type="appointment" />
                    </div>
                    
                    <div className="text-sm text-slate-600 mb-2">
                      <div className="flex items-center mb-1">
                        <ApperIcon name="User" className="w-4 h-4 mr-2" />
                        {getPatientName(appointment.patientId)}
                      </div>
                      <div className="flex items-center mb-1">
                        <ApperIcon name="Building2" className="w-4 h-4 mr-2" />
                        {appointment.department}
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                        {appointment.reason}
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                        {appointment.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </Card>
      </div>
    </div>
  );
};

export default AppointmentCalendar;