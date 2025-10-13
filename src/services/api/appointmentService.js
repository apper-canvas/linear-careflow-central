import { toast } from "react-toastify";

class AppointmentService {
  constructor() {
    this.tableName = "appointment_c";
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
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments:", error?.response?.data?.message || error);
      toast.error("Failed to fetch appointments");
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
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
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
      console.error(`Error fetching appointment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(appointment) {
    try {
      const client = this.getApperClient();
      
      const params = {
        records: [{
          Name: `Appointment - ${appointment.date_c} ${appointment.time_c}`,
          patient_id_c: parseInt(appointment.patient_id_c),
          doctor_id_c: parseInt(appointment.doctor_id_c),
          date_c: appointment.date_c,
          time_c: appointment.time_c,
          duration_c: parseInt(appointment.duration_c) || 30,
          department_c: appointment.department_c || "",
          reason_c: appointment.reason_c || "",
          status_c: appointment.status_c || "Scheduled",
          notes_c: appointment.notes_c || "",
          created_at_c: new Date().toISOString().split('T')[0]
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
          console.error(`Failed to create ${failed.length} appointments: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Appointment created successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating appointment:", error?.response?.data?.message || error);
      toast.error("Failed to create appointment");
      return null;
    }
  }

  async update(id, appointmentData) {
    try {
      const client = this.getApperClient();
      
      // Only include updateable fields
      const updateData = {
        Id: parseInt(id)
      };
      
      if (appointmentData.patient_id_c !== undefined) updateData.patient_id_c = parseInt(appointmentData.patient_id_c);
      if (appointmentData.doctor_id_c !== undefined) updateData.doctor_id_c = parseInt(appointmentData.doctor_id_c);
      if (appointmentData.date_c !== undefined) updateData.date_c = appointmentData.date_c;
      if (appointmentData.time_c !== undefined) updateData.time_c = appointmentData.time_c;
      if (appointmentData.duration_c !== undefined) updateData.duration_c = parseInt(appointmentData.duration_c);
      if (appointmentData.department_c !== undefined) updateData.department_c = appointmentData.department_c;
      if (appointmentData.reason_c !== undefined) updateData.reason_c = appointmentData.reason_c;
      if (appointmentData.status_c !== undefined) updateData.status_c = appointmentData.status_c;
      if (appointmentData.notes_c !== undefined) updateData.notes_c = appointmentData.notes_c;
      
      // Update Name if date or time changed
      if (appointmentData.date_c || appointmentData.time_c) {
        updateData.Name = `Appointment - ${appointmentData.date_c || ''} ${appointmentData.time_c || ''}`.trim();
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
          console.error(`Failed to update ${failed.length} appointments: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Appointment updated successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating appointment:", error?.response?.data?.message || error);
      toast.error("Failed to update appointment");
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
          console.error(`Failed to delete ${failed.length} appointments: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Appointment deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting appointment:", error?.response?.data?.message || error);
      toast.error("Failed to delete appointment");
      return null;
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [
          {"FieldName": "date_c", "Operator": "GreaterThanOrEqualTo", "Values": [startDate]},
          {"FieldName": "date_c", "Operator": "LessThanOrEqualTo", "Values": [endDate]}
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
      console.error("Error fetching appointments by date range:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByPatient(patientId) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [
          {"FieldName": "patient_id_c", "Operator": "EqualTo", "Values": [parseInt(patientId)]}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments by patient:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new AppointmentService();