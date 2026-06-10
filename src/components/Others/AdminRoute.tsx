import { Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

interface Props {
    children: React.ReactNode;
}

export default function AdminRoute({ children }: Props) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="skeleton skeleton-bubble" />;

    if (!user) return <Navigate to="/login" replace />;

    if (user.role !== "admin") return <Navigate to="/home" replace />;

    return children;
}
