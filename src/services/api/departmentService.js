import { toast } from "react-toastify";

class DepartmentService {
  constructor() {
    this.tableName = "department_c";
    this.apperClient = null;
  }

  getApperClient() {
    if (!this.apperClient && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    return this.apperClient;
  }

  async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "total_beds_c"}},
          {"field": {"Name": "occupied_beds_c"}},
          {"field": {"Name": "head_of_department_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}]
      };

      const response = await client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching departments:", error?.response?.data?.message || error);
      toast.error("Failed to fetch departments");
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "total_beds_c"}},
          {"field": {"Name": "occupied_beds_c"}},
          {"field": {"Name": "head_of_department_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await client.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(department) {
    try {
      const client = this.getApperClient();
      
      const params = {
        records: [{
          Name: department.name_c,
          name_c: department.name_c,
          total_beds_c: parseInt(department.total_beds_c) || 0,
          occupied_beds_c: parseInt(department.occupied_beds_c) || 0,
          head_of_department_c: department.head_of_department_c || "",
          phone_c: department.phone_c || "",
          floor_c: department.floor_c || ""
        }]
      };

      const response = await client.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} departments: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Department created successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating department:", error?.response?.data?.message || error);
      toast.error("Failed to create department");
      return null;
    }
  }

  async update(id, departmentData) {
    try {
      const client = this.getApperClient();
      
      // Only include updateable fields
      const updateData = {
        Id: parseInt(id)
      };
      
      if (departmentData.name_c !== undefined) updateData.name_c = departmentData.name_c;
      if (departmentData.total_beds_c !== undefined) updateData.total_beds_c = parseInt(departmentData.total_beds_c);
      if (departmentData.occupied_beds_c !== undefined) updateData.occupied_beds_c = parseInt(departmentData.occupied_beds_c);
      if (departmentData.head_of_department_c !== undefined) updateData.head_of_department_c = departmentData.head_of_department_c;
      if (departmentData.phone_c !== undefined) updateData.phone_c = departmentData.phone_c;
      if (departmentData.floor_c !== undefined) updateData.floor_c = departmentData.floor_c;
      
      // Update Name field if department name changed
      if (departmentData.name_c !== undefined) {
        updateData.Name = departmentData.name_c;
      }

      const params = {
        records: [updateData]
      };

      const response = await client.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} departments: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Department updated successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating department:", error?.response?.data?.message || error);
      toast.error("Failed to update department");
      return null;
    }
  }

  async delete(id) {
    try {
      const client = this.getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await client.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} departments: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Department deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting department:", error?.response?.data?.message || error);
      toast.error("Failed to delete department");
      return null;
    }
  }
}

export default new DepartmentService();