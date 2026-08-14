import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";


function Loading() {

    return (
        <div className="min-h-screen flex items-center justify-center">
            Loading...
        </div>
    );

}



export default function RoleRoute({ roles = [], children }) {


    const { user, loading } = useAuth();



    if (loading) {

        return <Loading />;

    }



    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }




    if (!roles.includes(user.role)) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }




    // لو مستخدم children
    if (children) {

        return children;

    }



    // لو مستخدم Nested Routes
    return <Outlet />;


}