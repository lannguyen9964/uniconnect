import { useAuthStore } from "../../stores/useAuthStore";
import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {

    const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
    const [startupLoading, setStartupLoading] = useState(true);

    const init = async () => {
        if (!accessToken) {
            await refresh();
        }
        if (!user && accessToken) {
            await fetchMe();
        }

        setStartupLoading(false);
    };

    useEffect(() => {
        init();
    }, []);

    if (loading || startupLoading) {
        return <div className="items center justify-center flex h-screen">Page is loading...</div>;
    }

    if (!accessToken) {
        return (
            <Navigate to="/login" replace />
        )
    }


    return (
        <Outlet></Outlet>

    )
}

export default ProtectedRoute;