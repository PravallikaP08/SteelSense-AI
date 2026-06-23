import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Notifications is consolidated into Alerts to avoid duplication.
// This component simply redirects to /alerts.
const Notifications = () => {
  return <Navigate to="/alerts" replace />;
};

export default Notifications;
