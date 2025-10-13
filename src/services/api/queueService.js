import { toast } from "react-toastify";

class QueueService {
  constructor() {
    this.tableName = "queue_c";
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
          {"field": {"Name": "ticket_number_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "check_in_time_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "completed_time_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "department_id_c"}}
        ],
        where: [
          {"FieldName": "status_c", "Operator": "NotEqualTo", "Values": ["completed"], "Include": true},
          {"FieldName": "status_c", "Operator": "NotEqualTo", "Values": ["no_show"], "Include": true}
        ],
        orderBy: [{"fieldName": "position_c", "sorttype": "ASC"}]
      };

      const response = await client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching queue items:", error?.response?.data?.message || error);
      toast.error("Failed to fetch queue items");
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
          {"field": {"Name": "ticket_number_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "check_in_time_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "completed_time_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "department_id_c"}}
        ]
      };

      const response = await client.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching queue item ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByDepartment(departmentId) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "ticket_number_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "check_in_time_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "completed_time_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "department_id_c"}}
        ],
        where: [
          {"FieldName": "department_id_c", "Operator": "EqualTo", "Values": [parseInt(departmentId)]}
        ],
        orderBy: [{"fieldName": "position_c", "sorttype": "ASC"}]
      };

      const response = await client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching queue by department:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "ticket_number_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "check_in_time_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "completed_time_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "department_id_c"}}
        ],
        where: [
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}
        ],
        orderBy: [{"fieldName": "position_c", "sorttype": "ASC"}]
      };

      const response = await client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching queue by status:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(queueItem) {
    try {
      const client = this.getApperClient();
      
      // Generate ticket number
      const ticketNumber = this.generateTicketNumber();
      
      const params = {
        records: [{
          Name: queueItem.Name || `Queue - ${ticketNumber}`,
          ticket_number_c: ticketNumber,
          position_c: queueItem.position_c || 1,
          status_c: "waiting",
          check_in_time_c: new Date().toISOString(),
          estimated_time_c: queueItem.estimated_time_c || 30,
          priority_c: queueItem.priority_c || "normal",
          notes_c: queueItem.notes_c || "",
          patient_id_c: parseInt(queueItem.patient_id_c),
          department_id_c: parseInt(queueItem.department_id_c)
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
          console.error(`Failed to create ${failed.length} queue items: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Queue item created successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating queue item:", error?.response?.data?.message || error);
      toast.error("Failed to create queue item");
      return null;
    }
  }

  async updateStatus(id, status) {
    try {
      const client = this.getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status,
          updated_at_c: new Date().toISOString(),
          ...(status === "completed" && { completed_time_c: new Date().toISOString() })
        }]
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
          console.error(`Failed to update ${failed.length} queue items: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Queue status updated successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating queue status:", error?.response?.data?.message || error);
      toast.error("Failed to update queue status");
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
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} queue items: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Queue item deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting queue item:", error?.response?.data?.message || error);
      toast.error("Failed to delete queue item");
      return false;
    }
  }

  async search(query) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "ticket_number_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "check_in_time_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "completed_time_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "department_id_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "ticket_number_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "status_c", "operator": "Contains", "values": [query]}
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
      console.error("Error searching queue items:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getAnalytics() {
    try {
      const client = this.getApperClient();
      const today = new Date().toISOString().split('T')[0];

      // Get all queue items for analytics
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "check_in_time_c"}},
          {"field": {"Name": "completed_time_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };

      const response = await client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return {
          totalInQueue: 0,
          currentlyWaiting: 0,
          patientsServedToday: 0,
          avgWaitTime: 0,
          totalPatients: 0,
          noShowToday: 0
        };
      }

      const data = response.data || [];
      
      const totalInQueue = data.filter(q => 
        q.status_c === "waiting" || q.status_c === "in_progress"
      ).length;
      
      const currentlyWaiting = data.filter(q => q.status_c === "waiting").length;
      
      const completedToday = data.filter(q => {
        const completedDate = new Date(q.updated_at_c || q.check_in_time_c);
        return q.status_c === "completed" && completedDate.toISOString().split('T')[0] === today;
      }).length;
      
      const noShowToday = data.filter(q => {
        const date = new Date(q.updated_at_c || q.check_in_time_c);
        return q.status_c === "no_show" && date.toISOString().split('T')[0] === today;
      }).length;

      // Calculate average wait time
      const completedTodayItems = data.filter(q => {
        const completedDate = new Date(q.updated_at_c || q.check_in_time_c);
        return q.status_c === "completed" && completedDate.toISOString().split('T')[0] === today;
      });

      let avgWaitTime = 0;
      if (completedTodayItems.length > 0) {
        const totalWaitTime = completedTodayItems.reduce((sum, item) => {
          const checkIn = new Date(item.check_in_time_c);
          const completed = new Date(item.completed_time_c || item.updated_at_c);
          return sum + Math.abs(completed - checkIn) / (1000 * 60); // in minutes
        }, 0);
        avgWaitTime = Math.round(totalWaitTime / completedTodayItems.length);
      }

      return {
        totalInQueue,
        currentlyWaiting,
        patientsServedToday: completedToday,
        avgWaitTime,
        totalPatients: data.length,
        noShowToday
      };
    } catch (error) {
      console.error("Error fetching queue analytics:", error?.response?.data?.message || error);
      return {
        totalInQueue: 0,
        currentlyWaiting: 0,
        patientsServedToday: 0,
        avgWaitTime: 0,
        totalPatients: 0,
        noShowToday: 0
      };
    }
  }

  generateTicketNumber() {
    const prefix = "Q";
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  }
}

const queueService = new QueueService();
export default queueService;