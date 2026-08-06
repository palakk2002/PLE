import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DeliveryProtectedRoute from "../modules/Delivery/components/DeliveryProtectedRoute";
import DeliveryLayout from "../modules/Delivery/components/Layout/DeliveryLayout";

// Lazy Loaded Pages
const DeliveryLogin = lazy(() => import("../modules/Delivery/pages/Login"));
const DeliveryRegister = lazy(() => import("../modules/Delivery/pages/Register"));
const DeliveryForgotPassword = lazy(() => import("../modules/Delivery/pages/ForgotPassword"));
const DeliveryResetPassword = lazy(() => import("../modules/Delivery/pages/ResetPassword"));
const DeliveryDashboard = lazy(() => import("../modules/Delivery/pages/Dashboard"));
const DeliveryOrders = lazy(() => import("../modules/Delivery/pages/Orders"));
const DeliveryOrderDetail = lazy(() => import("../modules/Delivery/pages/OrderDetail"));
const DeliveryProfile = lazy(() => import("../modules/Delivery/pages/Profile"));
const DeliveryNotifications = lazy(() => import("../modules/Delivery/pages/Notifications"));
const ReturnPickups = lazy(() => import("../modules/Delivery/pages/ReturnPickups"));
const DeliverySupport = lazy(() => import("../modules/Delivery/pages/DeliverySupport"));

export default function DeliveryRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<DeliveryLogin />} />
      <Route path="/register" element={<DeliveryRegister />} />
      <Route path="/forgot-password" element={<DeliveryForgotPassword />} />
      <Route path="/reset-password" element={<DeliveryResetPassword />} />
      <Route
        path="/"
        element={
          <DeliveryProtectedRoute>
            <DeliveryLayout />
          </DeliveryProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DeliveryDashboard />} />
        <Route path="orders" element={<DeliveryOrders />} />
        <Route path="orders/:id" element={<DeliveryOrderDetail />} />
        <Route path="notifications" element={<DeliveryNotifications />} />
        <Route path="profile" element={<DeliveryProfile />} />
        <Route path="pickups" element={<ReturnPickups />} />
        <Route path="support" element={<DeliverySupport />} />
      </Route>
    </Routes>
  );
}
