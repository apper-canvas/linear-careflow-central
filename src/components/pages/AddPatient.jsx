import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import patientService from "@/services/api/patientService";
import { toast } from "react-toastify";

const AddPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
first_name_c: "",
    last_name_c: "",
    date_of_birth_c: "",
    gender_c: "",
    blood_group_c: "",
    phone_c: "",
    email_c: "",
    address_c: "",
    emergency_contact_c: "",
    emergency_phone_c: "",
    allergies_c: "",
    medications_c: "",
    medical_history_c: "",
    admission_status_c: "Outpatient"
  });
  const [errors, setErrors] = useState({});

  const bloodGroupOptions = [
    { value: "", label: "Select Blood Group" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" }
  ];

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
  ];

  const admissionStatusOptions = [
    { value: "Outpatient", label: "Outpatient" },
    { value: "Admitted", label: "Admitted" },
    { value: "Emergency", label: "Emergency" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
if (!formData.first_name_c.trim()) newErrors.first_name_c = "First name is required";
    if (!formData.last_name_c.trim()) newErrors.last_name_c = "Last name is required";
    if (!formData.date_of_birth_c) newErrors.date_of_birth_c = "Date of birth is required";
    if (!formData.gender_c) newErrors.gender_c = "Gender is required";
    if (!formData.blood_group_c) newErrors.blood_group_c = "Blood group is required";
    if (!formData.phone_c.trim()) newErrors.phone_c = "Phone number is required";
    if (!formData.emergency_contact_c.trim()) newErrors.emergency_contact_c = "Emergency contact is required";
    if (!formData.emergency_phone_c.trim()) newErrors.emergency_phone_c = "Emergency phone is required";
    // Email validation
if (formData.email_c && !/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Invalid email format";
    }

    // Phone validation
const phoneRegex = /^\+?[\d\s\-()]+$/;
    if (formData.phone_c && !phoneRegex.test(formData.phone_c)) {
      newErrors.phone_c = "Invalid phone format";
    }
    if (formData.emergency_phone_c && !phoneRegex.test(formData.emergency_phone_c)) {
      newErrors.emergency_phone_c = "Invalid emergency phone format";
    }

    // Date validation
if (formData.date_of_birth_c) {
      const birthDate = new Date(formData.date_of_birth_c);
      const today = new Date();
      if (birthDate > today) {
        newErrors.date_of_birth_c = "Date of birth cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare patient data
      const patientData = {
...formData,
        allergies_c: formData.allergies_c || "",
        medications_c: formData.medications_c || "",
        medical_history_c: formData.medical_history_c || ""
      };

      await patientService.create(patientData);
      toast.success("Patient registered successfully!");
      navigate("/patients");
    } catch (error) {
      console.error("Error creating patient:", error);
      toast.error("Failed to register patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/patients");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={handleCancel}
          icon="ArrowLeft"
          className="mb-4"
        >
          Back to Patients
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
        <p className="text-gray-600 mt-1">Register a new patient in the system</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="User" size={20} className="mr-2" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
label="First Name *"
                value={formData.first_name_c}
                onChange={(e) => handleInputChange('first_name_c', e.target.value)}
                placeholder="Enter first name"
                error={errors.first_name_c}
                required
              />
<Input
                label="Last Name *"
                value={formData.last_name_c}
                onChange={(e) => handleInputChange('last_name_c', e.target.value)}
                placeholder="Enter last name"
                error={errors.last_name_c}
                required
/>
              <Input
                label="Date of Birth *"
                type="date"
                value={formData.date_of_birth_c}
                onChange={(e) => handleInputChange('date_of_birth_c', e.target.value)}
                error={errors.date_of_birth_c}
                required
              />
<Select
                label="Gender *"
                value={formData.gender_c}
                onChange={(e) => handleInputChange('gender_c', e.target.value)}
                options={genderOptions}
                error={errors.gender_c}
                required
              />
              <Select
label="Blood Group *"
                value={formData.blood_group_c}
                onChange={(e) => handleInputChange('blood_group_c', e.target.value)}
                options={bloodGroupOptions}
                error={errors.blood_group_c}
                required
              />
              <Input
label="Phone Number *"
                value={formData.phone_c}
                onChange={(e) => handleInputChange('phone_c', e.target.value)}
                placeholder="+1-555-0123"
                error={errors.phone_c}
                required
              />
              <Input
label="Email"
                type="email"
                value={formData.email_c}
                onChange={(e) => handleInputChange('email_c', e.target.value)}
                placeholder="patient@email.com"
                error={errors.email_c}
                className="md:col-span-2"
              />
<Input
                label="Address"
                value={formData.address_c}
                onChange={(e) => handleInputChange('address_c', e.target.value)}
                placeholder="Street, City, State, ZIP"
                error={errors.address_c}
                className="md:col-span-2"
              />
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Phone" size={20} className="mr-2" />
              Emergency Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
label="Emergency Contact Name *"
                value={formData.emergency_contact_c}
                onChange={(e) => handleInputChange('emergency_contact_c', e.target.value)}
                placeholder="Contact person name"
                error={errors.emergency_contact_c}
                required
              />
<Input
                label="Emergency Phone *"
                value={formData.emergency_phone_c}
                onChange={(e) => handleInputChange('emergency_phone_c', e.target.value)}
                placeholder="+1-555-0123"
                error={errors.emergency_phone_c}
                required
              />
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Heart" size={20} className="mr-2" />
              Medical Information
            </h2>
            <div className="space-y-4">
              <Input
label="Allergies"
                value={formData.allergies_c}
                onChange={(e) => handleInputChange('allergies_c', e.target.value)}
                placeholder="List known allergies"
                error={errors.allergies_c}
              />
              <Input
label="Current Medications"
                value={formData.medications_c}
                onChange={(e) => handleInputChange('medications_c', e.target.value)}
                placeholder="List current medications"
                error={errors.medications_c}
              />
              <Input
label="Medical History"
                value={formData.medical_history_c}
                onChange={(e) => handleInputChange('medical_history_c', e.target.value)}
                placeholder="Brief medical history or current conditions"
                error={errors.medical_history_c}
              />
<Select
                label="Admission Status"
                value={formData.admission_status_c}
                onChange={(e) => handleInputChange('admission_status_c', e.target.value)}
                options={admissionStatusOptions}
                error={errors.admission_status_c}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon="Plus"
          >
            Register Patient
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;