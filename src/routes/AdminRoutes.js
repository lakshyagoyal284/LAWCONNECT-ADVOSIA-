import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminUserDetail from '../pages/admin/AdminUserDetail';
import AdminCases from '../pages/admin/AdminCases';
import AdminCaseDetail from '../pages/admin/AdminCaseDetail';
import CreateCaseForm from '../pages/admin/CreateCaseForm';
import EditCaseForm from '../pages/admin/EditCaseForm';
import AdminBids from '../pages/admin/AdminBids';
import AdminSettings from '../pages/admin/AdminSettings';
import NotFoundPage from '../pages/NotFoundPage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users">
        <Route index element={<AdminUsers />} />
        <Route path=":userId" element={<AdminUserDetail />} />
      </Route>
      <Route path="cases">
        <Route index element={<AdminCases />} />
        <Route path="new" element={<CreateCaseForm />} />
        <Route path=":caseId/edit" element={<EditCaseForm />} />
        <Route path=":caseId" element={<AdminCaseDetail />} />
      </Route>
      <Route path="bids" element={<AdminBids />} />
      <Route path="settings" element={<AdminSettings />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRoutes;
