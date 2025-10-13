import appointmentsData from "@/services/mockData/appointments.json";

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.appointments];
  }

  async getById(id) {
    await this.delay(200);
    const appointment = this.appointments.find(a => a.Id === parseInt(id));
    return appointment ? { ...appointment } : null;
  }

  async create(appointment) {
    await this.delay(400);
    const newAppointment = {
      ...appointment,
      Id: Math.max(...this.appointments.map(a => a.Id)) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await this.delay(350);
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.appointments[index] = { ...this.appointments[index], ...appointmentData };
      return { ...this.appointments[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay(250);
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.appointments.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  async getByDateRange(startDate, endDate) {
    await this.delay(250);
    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= new Date(startDate) && appointmentDate <= new Date(endDate);
    });
  }

  async getByPatient(patientId) {
    await this.delay(200);
    return this.appointments.filter(a => a.patientId === patientId);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AppointmentService();