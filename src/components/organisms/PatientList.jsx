import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import patientService from "@/services/api/patientService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import StatusBadge from "@/components/molecules/StatusBadge";

const PatientList = ({ onSelectPatient, onAddPatient }) => {
const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load patients. Please try again.");
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  // Get paginated patients for current page
  const getPaginatedPatients = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPatients.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = getPaginatedPatients();

  useEffect(() => {
    loadPatients();
  }, []);

const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    
    if (!query.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient => 
      patient.firstName.toLowerCase().includes(query.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(query.toLowerCase()) ||
      patient.phone.includes(query) ||
      patient.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Patient Directory</h2>
          <p className="text-slate-600">Manage patient records and information</p>
        </div>
<Button onClick={onAddPatient} icon="Plus">
          Add New Patient
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar 
            placeholder="Search patients by name, phone, or email..."
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
      </div>

{filteredPatients.length === 0 && !loading ? (
        <Empty 
          icon="Users"
          title={searchQuery ? "No patients found" : "No patients registered"}
          description={searchQuery ? "Try adjusting your search criteria." : "Get started by adding your first patient to the system."}
          actionLabel="Add First Patient"
          onAction={onAddPatient}
        />
) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-slate-100">
            {paginatedPatients.map((patient) => (
              <div
                key={patient.Id}
                className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => onSelectPatient(patient)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                        <span className="flex items-center">
                          <ApperIcon name="Phone" className="w-4 h-4 mr-1" />
                          {patient.phone}
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Mail" className="w-4 h-4 mr-1" />
                          {patient.email}
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Droplets" className="w-4 h-4 mr-1" />
                          {patient.bloodGroup}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={patient.admissionStatus} type="patient" />
                    <ApperIcon name="ChevronRight" className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {filteredPatients.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    <ApperIcon name="ChevronLeft" className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    Next
                    <ApperIcon name="ChevronRight" className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                
                <div className="pagination-info text-sm text-slate-600">
                  <span className="font-medium">
                    {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length}
                  </span>
                  <span className="mx-2">•</span>
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default PatientList;