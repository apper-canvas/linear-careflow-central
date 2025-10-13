import { toast } from "react-toastify";

class PatientService {
  constructor() {
    this.tableName = "patient_c";
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
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "emergency_phone_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "medications_c"}},
          {"field": {"Name": "medical_history_c"}},
          {"field": {"Name": "admission_status_c"}},
          {"field": {"Name": "registration_date_c"}},
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
      console.error("Error fetching patients:", error?.response?.data?.message || error);
      toast.error("Failed to fetch patients");
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
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "emergency_phone_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "medications_c"}},
          {"field": {"Name": "medical_history_c"}},
          {"field": {"Name": "admission_status_c"}},
          {"field": {"Name": "registration_date_c"}},
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
      console.error(`Error fetching patient ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(patient) {
    try {
      const client = this.getApperClient();
      
      const params = {
        records: [{
          Name: `${patient.first_name_c} ${patient.last_name_c}`,
          first_name_c: patient.first_name_c,
          last_name_c: patient.last_name_c,
          date_of_birth_c: patient.date_of_birth_c,
          gender_c: patient.gender_c,
          blood_group_c: patient.blood_group_c,
          phone_c: patient.phone_c,
          email_c: patient.email_c || "",
          address_c: patient.address_c || "",
          emergency_contact_c: patient.emergency_contact_c,
          emergency_phone_c: patient.emergency_phone_c,
          allergies_c: patient.allergies_c || "",
          medications_c: patient.medications_c || "",
          medical_history_c: patient.medical_history_c || "",
          admission_status_c: patient.admission_status_c || "Outpatient",
          registration_date_c: new Date().toISOString().split('T')[0]
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
          console.error(`Failed to create ${failed.length} patients: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Patient created successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating patient:", error?.response?.data?.message || error);
      toast.error("Failed to create patient");
      return null;
    }
  }

  async update(id, patientData) {
    try {
      const client = this.getApperClient();
      
      // Only include updateable fields
      const updateData = {
        Id: parseInt(id)
      };
      
      if (patientData.first_name_c !== undefined) updateData.first_name_c = patientData.first_name_c;
      if (patientData.last_name_c !== undefined) updateData.last_name_c = patientData.last_name_c;
      if (patientData.date_of_birth_c !== undefined) updateData.date_of_birth_c = patientData.date_of_birth_c;
      if (patientData.gender_c !== undefined) updateData.gender_c = patientData.gender_c;
      if (patientData.blood_group_c !== undefined) updateData.blood_group_c = patientData.blood_group_c;
      if (patientData.phone_c !== undefined) updateData.phone_c = patientData.phone_c;
      if (patientData.email_c !== undefined) updateData.email_c = patientData.email_c;
      if (patientData.address_c !== undefined) updateData.address_c = patientData.address_c;
      if (patientData.emergency_contact_c !== undefined) updateData.emergency_contact_c = patientData.emergency_contact_c;
      if (patientData.emergency_phone_c !== undefined) updateData.emergency_phone_c = patientData.emergency_phone_c;
      if (patientData.allergies_c !== undefined) updateData.allergies_c = patientData.allergies_c;
      if (patientData.medications_c !== undefined) updateData.medications_c = patientData.medications_c;
      if (patientData.medical_history_c !== undefined) updateData.medical_history_c = patientData.medical_history_c;
      if (patientData.admission_status_c !== undefined) updateData.admission_status_c = patientData.admission_status_c;
      
      // Update Name if first or last name changed
      if (patientData.first_name_c || patientData.last_name_c) {
        updateData.Name = `${patientData.first_name_c || ''} ${patientData.last_name_c || ''}`.trim();
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
          console.error(`Failed to update ${failed.length} patients: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Patient updated successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating patient:", error?.response?.data?.message || error);
      toast.error("Failed to update patient");
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
          console.error(`Failed to delete ${failed.length} patients: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Patient deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting patient:", error?.response?.data?.message || error);
      toast.error("Failed to delete patient");
      return null;
    }
  }

  async searchPatients(query) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "emergency_phone_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "medications_c"}},
          {"field": {"Name": "medical_history_c"}},
          {"field": {"Name": "admission_status_c"}},
          {"field": {"Name": "registration_date_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "first_name_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "last_name_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "phone_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "email_c", "operator": "Contains", "values": [query]}
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
      console.error("Error searching patients:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new PatientService();