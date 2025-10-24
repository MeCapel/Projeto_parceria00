import { Navigate } from "react-router";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"

interface Props {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children } : Props)
{
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login"/>

    return children;
}