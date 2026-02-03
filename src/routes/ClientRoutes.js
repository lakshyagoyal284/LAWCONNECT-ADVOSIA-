import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientDashboard from '../pages/client/ClientDashboard';
import ClientCaseDetail from '../pages/client/ClientCaseDetail';
import CreateCase from '../pages/client/CreateCase';
import PrivateRoute from '../components/routing/PrivateRoute';

const ClientRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route
        path="dashboard"
        element={
          <PrivateRoute>
            <ClientDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="cases"
        element={
          <PrivateRoute>
            <ClientDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="cases/new"
        element={
          <PrivateRoute>
            <CreateCase />
          </PrivateRoute>
        }
      />
      <Route
        path="cases/:caseId"
        element={
          <PrivateRoute>
            <ClientCaseDetail />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default ClientRoutes;
