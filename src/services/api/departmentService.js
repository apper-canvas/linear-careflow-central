import departmentsData from "@/services/mockData/departments.json";

class DepartmentService {
  constructor() {
    this.departments = [...departmentsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.departments];
  }

  async getById(id) {
    await this.delay(200);
    const department = this.departments.find(d => d.Id === parseInt(id));
    return department ? { ...department } : null;
  }

  async create(department) {
    await this.delay(400);
    const newDepartment = {
      ...department,
      Id: Math.max(...this.departments.map(d => d.Id)) + 1
    };
    this.departments.push(newDepartment);
    return { ...newDepartment };
  }

  async update(id, departmentData) {
    await this.delay(350);
    const index = this.departments.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      this.departments[index] = { ...this.departments[index], ...departmentData };
      return { ...this.departments[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay(250);
    const index = this.departments.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.departments.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new DepartmentService();