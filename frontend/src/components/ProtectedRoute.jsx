import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
        // Redirige al login si no hay token
        return <Navigate to="/auth/sign-in" />;
    }

    return children; // Permite el acceso si hay token
};

export default ProtectedRoute;