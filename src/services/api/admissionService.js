import { toast } from "react-toastify";

class AdmissionService {
  constructor() {
    this.tableName = "admission_c";
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
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "admission_type_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "estimated_discharge_c"}},
          {"field": {"Name": "actual_discharge_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "department_id_c"}},
          {"field": {"Name": "attending_doctor_id_c"}},
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
      console.error("Error fetching admissions:", error?.response?.data?.message || error);
      toast.error("Failed to fetch admissions");
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
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "admission_type_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "estimated_discharge_c"}},
          {"field": {"Name": "actual_discharge_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "department_id_c"}},
          {"field": {"Name": "attending_doctor_id_c"}},
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
      console.error(`Error fetching admission ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(admission) {
    try {
      const client = this.getApperClient();
      
      const params = {
        records: [{
          Name: `Admission - Room ${admission.bed_number_c}`,
          bed_number_c: admission.bed_number_c,
          admission_date_c: admission.admission_date_c || new Date().toISOString().split('T')[0],
          admission_type_c: admission.admission_type_c || "Regular",
          diagnosis_c: admission.diagnosis_c,
          status_c: admission.status_c || "Active",
          estimated_discharge_c: admission.estimated_discharge_c || "",
          patient_id_c: parseInt(admission.patient_id_c),
          department_id_c: parseInt(admission.department_id_c),
          attending_doctor_id_c: admission.attending_doctor_id_c ? parseInt(admission.attending_doctor_id_c) : null
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
          console.error(`Failed to create ${failed.length} admissions: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Admission created successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating admission:", error?.response?.data?.message || error);
      toast.error("Failed to create admission");
      return null;
    }
  }

  async update(id, admissionData) {
    try {
      const client = this.getApperClient();
      
      // Only include updateable fields
      const updateData = {
        Id: parseInt(id)
      };
      
      if (admissionData.bed_number_c !== undefined) updateData.bed_number_c = admissionData.bed_number_c;
      if (admissionData.admission_date_c !== undefined) updateData.admission_date_c = admissionData.admission_date_c;
      if (admissionData.admission_type_c !== undefined) updateData.admission_type_c = admissionData.admission_type_c;
      if (admissionData.diagnosis_c !== undefined) updateData.diagnosis_c = admissionData.diagnosis_c;
      if (admissionData.status_c !== undefined) updateData.status_c = admissionData.status_c;
      if (admissionData.estimated_discharge_c !== undefined) updateData.estimated_discharge_c = admissionData.estimated_discharge_c;
      if (admissionData.actual_discharge_c !== undefined) updateData.actual_discharge_c = admissionData.actual_discharge_c;
      if (admissionData.patient_id_c !== undefined) updateData.patient_id_c = parseInt(admissionData.patient_id_c);
      if (admissionData.department_id_c !== undefined) updateData.department_id_c = parseInt(admissionData.department_id_c);
      if (admissionData.attending_doctor_id_c !== undefined) {
        updateData.attending_doctor_id_c = admissionData.attending_doctor_id_c ? parseInt(admissionData.attending_doctor_id_c) : null;
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
          console.error(`Failed to update ${failed.length} admissions: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Admission updated successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating admission:", error?.response?.data?.message || error);
      toast.error("Failed to update admission");
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
          console.error(`Failed to delete ${failed.length} admissions: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Admission deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting admission:", error?.response?.data?.message || error);
      toast.error("Failed to delete admission");
      return null;
    }
  }

  async getActiveAdmissions() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "admission_type_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "estimated_discharge_c"}},
          {"field": {"Name": "actual_discharge_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "department_id_c"}},
          {"field": {"Name": "attending_doctor_id_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "status_c", "operator": "EqualTo", "values": ["Active"]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "status_c", "operator": "EqualTo", "values": ["Critical"]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "status_c", "operator": "EqualTo", "values": ["Stable"]}
              ]
            }
          ]
        }]
      };

      const response = await client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching active admissions:", error?.response?.data?.message || error);
      return [];
    }
  }

  async dischargePatient(id, dischargeData) {
    try {
      const updateData = {
        Id: parseInt(id),
        status_c: "Discharged",
        actual_discharge_c: new Date().toISOString().split('T')[0],
        ...dischargeData
      };

      return await this.update(id, updateData);
    } catch (error) {
      console.error("Error discharging patient:", error?.response?.data?.message || error);
      toast.error("Failed to discharge patient");
      return null;
    }
  }
}

export default new AdmissionService();