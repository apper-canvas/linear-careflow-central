import admissionsData from "@/services/mockData/admissions.json";

class AdmissionService {
  constructor() {
    this.admissions = [...admissionsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.admissions];
  }

  async getById(id) {
    await this.delay(200);
    const admission = this.admissions.find(a => a.Id === parseInt(id));
    return admission ? { ...admission } : null;
  }

  async create(admission) {
    await this.delay(400);
    const newAdmission = {
      ...admission,
      Id: Math.max(...this.admissions.map(a => a.Id)) + 1,
      admissionDate: new Date().toISOString().split('T')[0]
    };
    this.admissions.push(newAdmission);
    return { ...newAdmission };
  }

  async update(id, admissionData) {
    await this.delay(350);
    const index = this.admissions.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.admissions[index] = { ...this.admissions[index], ...admissionData };
      return { ...this.admissions[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay(250);
    const index = this.admissions.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.admissions.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  async getActiveAdmissions() {
    await this.delay(200);
    return this.admissions.filter(a => a.status === "Active" || a.status === "Critical" || a.status === "Stable");
  }

  async dischargePatient(id, dischargeData) {
    await this.delay(300);
    const index = this.admissions.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.admissions[index] = { 
        ...this.admissions[index], 
        ...dischargeData,
        status: "Discharged",
        actualDischarge: new Date().toISOString().split('T')[0]
      };
      return { ...this.admissions[index] };
    }
    return null;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AdmissionService();