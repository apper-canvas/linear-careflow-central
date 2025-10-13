import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, type = "appointment" }) => {
  const getStatusConfig = () => {
    if (type === "appointment") {
      const configs = {
        "Scheduled": { variant: "info", icon: "Calendar", text: "Scheduled" },
        "Completed": { variant: "success", icon: "CheckCircle", text: "Completed" },
        "Cancelled": { variant: "error", icon: "XCircle", text: "Cancelled" },
        "In Progress": { variant: "warning", icon: "Clock", text: "In Progress" },
        "No Show": { variant: "error", icon: "AlertTriangle", text: "No Show" }
      };
      return configs[status] || { variant: "default", icon: "Circle", text: status };
    }

    if (type === "admission") {
      const configs = {
        "Active": { variant: "success", icon: "Activity", text: "Active" },
        "Critical": { variant: "error", icon: "AlertCircle", text: "Critical" },
        "Stable": { variant: "info", icon: "Heart", text: "Stable" },
        "Discharged": { variant: "default", icon: "LogOut", text: "Discharged" }
      };
      return configs[status] || { variant: "default", icon: "Circle", text: status };
    }

    if (type === "patient") {
      const configs = {
        "Outpatient": { variant: "info", icon: "User", text: "Outpatient" },
        "Admitted": { variant: "warning", icon: "Bed", text: "Admitted" },
        "Emergency": { variant: "error", icon: "Zap", text: "Emergency" },
        "Discharged": { variant: "success", icon: "CheckCircle", text: "Discharged" }
      };
      return configs[status] || { variant: "default", icon: "Circle", text: status };
    }

    if (type === "staff") {
      const configs = {
        "Available": { variant: "success", icon: "CheckCircle", text: "Available" },
        "Busy": { variant: "warning", icon: "Clock", text: "Busy" },
        "On Call": { variant: "info", icon: "Phone", text: "On Call" },
        "Off Duty": { variant: "default", icon: "Pause", text: "Off Duty" }
      };
      return configs[status] || { variant: "default", icon: "Circle", text: status };
    }

    return { variant: "default", icon: "Circle", text: status };
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant}>
      <ApperIcon name={config.icon} className="w-3 h-3 mr-1" />
      {config.text}
    </Badge>
  );
};

export default StatusBadge;