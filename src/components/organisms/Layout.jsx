import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import { cn } from "@/utils/cn";

// Lazy load all page components
const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Patients = lazy(() => import("@/components/pages/Patients"));
const AddPatient = lazy(() => import("@/components/pages/AddPatient"));
const Appointments = lazy(() => import("@/components/pages/Appointments"));
const PatientQueue = lazy(() => import("@/components/pages/PatientQueue"));
const Staff = lazy(() => import("@/components/pages/Staff"));
const Departments = lazy(() => import("@/components/pages/Departments"));
const Admissions = lazy(() => import("@/components/pages/Admissions"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div>Loading.....</div>}>
    {children}
  </Suspense>
);

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <main className="flex-1 relative overflow-y-auto">
        <Routes>
          <Route
            path=""
            element={
              <SuspenseWrapper>
                <Dashboard toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
              </SuspenseWrapper>
            }
          />
          <Route
            path="patients"
            element={
              <SuspenseWrapper>
                <Patients toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
              </SuspenseWrapper>
            }
          />
          <Route
            path="patients/add"
            element={
              <SuspenseWrapper>
                <AddPatient toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
              </SuspenseWrapper>
            }
          />
          <Route
            path="appointments"
            element={
              <SuspenseWrapper>
                <Appointments toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
              </SuspenseWrapper>
            }
          />
          <Route
            path="patient-queue"
            element={
              <SuspenseWrapper>
                <PatientQueue toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
              </SuspenseWrapper>
            }
          />
          <Route
            path="staff"
            element={
              <SuspenseWrapper>
                <Staff toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
              </SuspenseWrapper>
            }
          />
          <Route
            path="departments"
            element={
              <SuspenseWrapper>
                <Departments toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
              </SuspenseWrapper>
            }
          />
          <Route
            path="admissions"
            element={
              <SuspenseWrapper>
                <Admissions toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
              </SuspenseWrapper>
            }
          />
          <Route
            path="*"
            element={
              <SuspenseWrapper>
                <NotFound />
              </SuspenseWrapper>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default Layout;