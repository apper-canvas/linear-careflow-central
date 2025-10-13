import queueData from "@/services/mockData/queue.json";

class QueueService {
  constructor() {
    this.queue = [...queueData];
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay(300);
    // Sort by position for proper queue order
    return this.queue
      .filter(item => item.status !== "completed" && item.status !== "no_show")
      .sort((a, b) => a.position - b.position)
      .map(item => ({ ...item }));
  }

  async getById(id) {
    await this.delay(200);
    const queueItem = this.queue.find(q => q.Id === parseInt(id));
    return queueItem ? { ...queueItem } : null;
  }

  async getByDepartment(departmentId) {
    await this.delay(250);
    return this.queue
      .filter(item => item.departmentId === parseInt(departmentId))
      .sort((a, b) => a.position - b.position)
      .map(item => ({ ...item }));
  }

  async getByStatus(status) {
    await this.delay(200);
    return this.queue
      .filter(item => item.status === status)
      .sort((a, b) => a.position - b.position)
      .map(item => ({ ...item }));
  }

  async create(queueItem) {
    await this.delay(400);
    const maxId = Math.max(...this.queue.map(q => q.Id), 0);
    const maxPosition = Math.max(
      ...this.queue
        .filter(q => q.departmentId === queueItem.departmentId && q.status === "waiting")
        .map(q => q.position),
      0
    );
    
    const newQueueItem = {
      Id: maxId + 1,
      ...queueItem,
      position: maxPosition + 1,
      checkInTime: new Date().toISOString(),
      status: "waiting",
      ticketNumber: this.generateTicketNumber()
    };
    
    this.queue.push(newQueueItem);
    return { ...newQueueItem };
  }

  async updateStatus(id, status) {
    await this.delay(300);
    const index = this.queue.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Queue item not found");
    }
    
    this.queue[index] = {
      ...this.queue[index],
      status,
      updatedAt: new Date().toISOString()
    };

    // If completed or no_show, update positions for remaining queue
    if (status === "completed" || status === "no_show") {
      this.reorderPositions(this.queue[index].departmentId);
    }
    
    return { ...this.queue[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.queue.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Queue item not found");
    }
    
    const deletedItem = this.queue[index];
    this.queue.splice(index, 1);
    
    // Reorder positions after deletion
    this.reorderPositions(deletedItem.departmentId);
    
    return true;
  }

  async search(query) {
    await this.delay(250);
    const lowercaseQuery = query.toLowerCase();
    return this.queue
      .filter(item =>
        item.ticketNumber.toLowerCase().includes(lowercaseQuery) ||
        item.status.toLowerCase().includes(lowercaseQuery)
      )
      .map(item => ({ ...item }));
  }

  async getAnalytics() {
    await this.delay(400);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const totalInQueue = this.queue.filter(q => 
      q.status === "waiting" || q.status === "in_progress"
    ).length;
    
    const currentlyWaiting = this.queue.filter(q => q.status === "waiting").length;
    
    const completedToday = this.queue.filter(q => {
      const completedDate = new Date(q.updatedAt || q.checkInTime);
      return q.status === "completed" && completedDate >= today;
    }).length;
    
    // Calculate average wait time for completed patients today
    const completedTodayItems = this.queue.filter(q => {
      const completedDate = new Date(q.updatedAt || q.checkInTime);
      return q.status === "completed" && completedDate >= today;
    });
    
    let avgWaitTime = 0;
    if (completedTodayItems.length > 0) {
      const totalWaitTime = completedTodayItems.reduce((sum, item) => {
        const checkIn = new Date(item.checkInTime);
        const completed = new Date(item.updatedAt);
        return sum + Math.abs(completed - checkIn) / (1000 * 60); // in minutes
      }, 0);
      avgWaitTime = Math.round(totalWaitTime / completedTodayItems.length);
    }
    
    return {
      totalInQueue,
      currentlyWaiting,
      patientsServedToday: completedToday,
      avgWaitTime,
      totalPatients: this.queue.length,
      noShowToday: this.queue.filter(q => {
        const date = new Date(q.updatedAt || q.checkInTime);
        return q.status === "no_show" && date >= today;
      }).length
    };
  }

  generateTicketNumber() {
    const prefix = "Q";
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  }

  reorderPositions(departmentId) {
    const waitingItems = this.queue
      .filter(q => q.departmentId === departmentId && q.status === "waiting")
      .sort((a, b) => a.position - b.position);
    
    waitingItems.forEach((item, index) => {
      const queueIndex = this.queue.findIndex(q => q.Id === item.Id);
      if (queueIndex !== -1) {
        this.queue[queueIndex].position = index + 1;
      }
    });
  }
}

const queueService = new QueueService();
export default queueService;