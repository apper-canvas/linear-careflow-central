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
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    allergies: "",
    medications: "",
    medicalHistory: "",
    admissionStatus: "Outpatient"
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
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required";
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = "Emergency phone is required";

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }
    if (formData.emergencyPhone && !phoneRegex.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = "Invalid emergency phone format";
    }

    // Date validation
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
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
        allergies: formData.allergies ? formData.allergies.split(',').map(item => item.trim()).filter(item => item) : [],
        medications: formData.medications ? formData.medications.split(',').map(item => item.trim()).filter(item => item) : []
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
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name *"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                error={errors.lastName}
                required
              />
              <Input
                label="Date of Birth *"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                error={errors.dateOfBirth}
                required
              />
              <Select
                label="Gender *"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                options={genderOptions}
                error={errors.gender}
                required
              />
              <Select
                label="Blood Group *"
                value={formData.bloodGroup}
                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                options={bloodGroupOptions}
                error={errors.bloodGroup}
                required
              />
              <Input
                label="Phone Number *"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1-555-0123"
                error={errors.phone}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="patient@email.com"
                error={errors.email}
                className="md:col-span-2"
              />
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Street, City, State, ZIP"
                error={errors.address}
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
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="Contact person name"
                error={errors.emergencyContact}
                required
              />
              <Input
                label="Emergency Phone *"
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                placeholder="+1-555-0123"
                error={errors.emergencyPhone}
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
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                placeholder="Separate multiple allergies with commas (e.g., Penicillin, Shellfish)"
                error={errors.allergies}
              />
              <Input
                label="Current Medications"
                value={formData.medications}
                onChange={(e) => handleInputChange('medications', e.target.value)}
                placeholder="Separate multiple medications with commas (e.g., Lisinopril 10mg, Aspirin 81mg)"
                error={errors.medications}
              />
              <Input
                label="Medical History"
                value={formData.medicalHistory}
                onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                placeholder="Brief medical history or current conditions"
                error={errors.medicalHistory}
              />
              <Select
                label="Admission Status"
                value={formData.admissionStatus}
                onChange={(e) => handleInputChange('admissionStatus', e.target.value)}
                options={admissionStatusOptions}
                error={errors.admissionStatus}
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