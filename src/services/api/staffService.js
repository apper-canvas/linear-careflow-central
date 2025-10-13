import { toast } from "react-toastify";

class StaffService {
  constructor() {
    this.tableName = "staff_c";
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "availability_status_c"}},
          {"field": {"Name": "working_hours_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching staff:", error?.response?.data?.message || error);
      toast.error("Failed to fetch staff");
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "availability_status_c"}},
          {"field": {"Name": "working_hours_c"}},
          {"field": {"Name": "join_date_c"}},
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
      console.error(`Error fetching staff member ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(staffMember) {
    try {
      const client = this.getApperClient();
      
      const params = {
        records: [{
          Name: `${staffMember.first_name_c} ${staffMember.last_name_c}`,
          first_name_c: staffMember.first_name_c,
          last_name_c: staffMember.last_name_c,
          role_c: staffMember.role_c,
          department_c: staffMember.department_c,
          specialization_c: staffMember.specialization_c || "",
          phone_c: staffMember.phone_c || "",
          email_c: staffMember.email_c || "",
          availability_status_c: staffMember.availability_status_c || "Available",
          working_hours_c: staffMember.working_hours_c || "",
          join_date_c: staffMember.join_date_c || new Date().toISOString().split('T')[0]
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
          console.error(`Failed to create ${failed.length} staff members: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Staff member created successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating staff member:", error?.response?.data?.message || error);
      toast.error("Failed to create staff member");
      return null;
    }
  }

  async update(id, staffData) {
    try {
      const client = this.getApperClient();
      
      // Only include updateable fields
      const updateData = {
        Id: parseInt(id)
      };
      
      if (staffData.first_name_c !== undefined) updateData.first_name_c = staffData.first_name_c;
      if (staffData.last_name_c !== undefined) updateData.last_name_c = staffData.last_name_c;
      if (staffData.role_c !== undefined) updateData.role_c = staffData.role_c;
      if (staffData.department_c !== undefined) updateData.department_c = staffData.department_c;
      if (staffData.specialization_c !== undefined) updateData.specialization_c = staffData.specialization_c;
      if (staffData.phone_c !== undefined) updateData.phone_c = staffData.phone_c;
      if (staffData.email_c !== undefined) updateData.email_c = staffData.email_c;
      if (staffData.availability_status_c !== undefined) updateData.availability_status_c = staffData.availability_status_c;
      if (staffData.working_hours_c !== undefined) updateData.working_hours_c = staffData.working_hours_c;
      if (staffData.join_date_c !== undefined) updateData.join_date_c = staffData.join_date_c;
      
      // Update Name if first or last name changed
      if (staffData.first_name_c || staffData.last_name_c) {
        updateData.Name = `${staffData.first_name_c || ''} ${staffData.last_name_c || ''}`.trim();
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
          console.error(`Failed to update ${failed.length} staff members: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Staff member updated successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating staff member:", error?.response?.data?.message || error);
      toast.error("Failed to update staff member");
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
          console.error(`Failed to delete ${failed.length} staff members: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Staff member deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting staff member:", error?.response?.data?.message || error);
      toast.error("Failed to delete staff member");
      return null;
    }
  }

  async getByDepartment(department) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "availability_status_c"}},
          {"field": {"Name": "working_hours_c"}},
          {"field": {"Name": "join_date_c"}}
        ],
        where: [
          {"FieldName": "department_c", "Operator": "EqualTo", "Values": [department]}
        ]
      };

      const response = await client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching staff by department:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByRole(role) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "availability_status_c"}},
          {"field": {"Name": "working_hours_c"}},
          {"field": {"Name": "join_date_c"}}
        ],
        where: [
          {"FieldName": "role_c", "Operator": "Contains", "Values": [role]}
        ]
      };

      const response = await client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching staff by role:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new StaffService();