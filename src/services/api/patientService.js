import patientsData from "@/services/mockData/patients.json";

class PatientService {
  constructor() {
    this.patients = [...patientsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.patients];
  }

async getById(id) {
    await this.delay(200);
    const patient = this.patients.find(p => p.Id === parseInt(id));
    return patient ? { ...patient } : null;
  }

  async create(patient) {
    await this.delay(400);
    const newPatient = {
      ...patient,
      Id: Math.max(...this.patients.map(p => p.Id)) + 1,
      registrationDate: new Date().toISOString().split('T')[0]
    };
    this.patients.push(newPatient);
    return { ...newPatient };
  }

  async update(id, patientData) {
    await this.delay(350);
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      this.patients[index] = { ...this.patients[index], ...patientData };
      return { ...this.patients[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay(250);
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.patients.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  async searchPatients(query) {
    await this.delay(200);
    const lowercaseQuery = query.toLowerCase();
    return this.patients.filter(patient => 
      patient.firstName.toLowerCase().includes(lowercaseQuery) ||
      patient.lastName.toLowerCase().includes(lowercaseQuery) ||
      patient.phone.includes(query) ||
      patient.email.toLowerCase().includes(lowercaseQuery)
    );
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new PatientService();