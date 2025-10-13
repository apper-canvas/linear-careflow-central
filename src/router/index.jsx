import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load all page components
const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Patients = lazy(() => import("@/components/pages/Patients"));
const Appointments = lazy(() => import("@/components/pages/Appointments"));
const Staff = lazy(() => import("@/components/pages/Staff"));
const Departments = lazy(() => import("@/components/pages/Departments"));
const Admissions = lazy(() => import("@/components/pages/Admissions"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Wrap components in Suspense
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div>Loading.....</div>}>
    {children}
  </Suspense>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: <SuspenseWrapper><Dashboard /></SuspenseWrapper>
  },
  {
    path: "patients",
    element: <SuspenseWrapper><Patients /></SuspenseWrapper>
  },
  {
    path: "appointments",
    element: <SuspenseWrapper><Appointments /></SuspenseWrapper>
  },
  {
    path: "staff",
    element: <SuspenseWrapper><Staff /></SuspenseWrapper>
  },
  {
    path: "departments",
    element: <SuspenseWrapper><Departments /></SuspenseWrapper>
  },
  {
    path: "admissions",
    element: <SuspenseWrapper><Admissions /></SuspenseWrapper>
  },
  {
    path: "*",
    element: <SuspenseWrapper><NotFound /></SuspenseWrapper>
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);