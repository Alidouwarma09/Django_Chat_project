import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const MainRoute = ({ element: Component, isAuthenticated, path }) => {
  return (
    <Route
      path={path}
      element={isAuthenticated ? <Component /> : <Navigate to="/login" />}
    />
  );
};

export default MainRoute;
