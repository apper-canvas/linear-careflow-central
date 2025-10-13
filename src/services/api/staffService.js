import staffData from "@/services/mockData/staff.json";

class StaffService {
  constructor() {
    this.staff = [...staffData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.staff];
  }

  async getById(id) {
    await this.delay(200);
    const member = this.staff.find(s => s.Id === parseInt(id));
    return member ? { ...member } : null;
  }

  async create(staffMember) {
    await this.delay(400);
    const newMember = {
      ...staffMember,
      Id: Math.max(...this.staff.map(s => s.Id)) + 1,
      joinDate: new Date().toISOString().split('T')[0]
    };
    this.staff.push(newMember);
    return { ...newMember };
  }

  async update(id, staffData) {
    await this.delay(350);
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      this.staff[index] = { ...this.staff[index], ...staffData };
      return { ...this.staff[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay(250);
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.staff.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  async getByDepartment(department) {
    await this.delay(200);
    return this.staff.filter(s => s.department === department);
  }

  async getByRole(role) {
    await this.delay(200);
    return this.staff.filter(s => s.role.toLowerCase().includes(role.toLowerCase()));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new StaffService();