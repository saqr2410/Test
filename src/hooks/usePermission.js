import { useAuth } from "../contexts/AuthContext";

export default function usePermission() {

    const { user } = useAuth();

    const hasPermission = (permission) => {

        if (!user) {
            return false;
        }

        if (user.role === "OWNER") {
            return true;
        }

        return Array.isArray(user.permissions)
            && user.permissions.includes(permission);
    };

    const hasAnyPermission = (permissions = []) => {

        if (!user) {
            return false;
        }

        if (user.role === "OWNER") {
            return true;
        }

        return permissions.some(permission =>
            user.permissions?.includes(permission)
        );
    };

    const hasAllPermissions = (permissions = []) => {

        if (!user) {
            return false;
        }

        if (user.role === "OWNER") {
            return true;
        }

        return permissions.every(permission =>
            user.permissions?.includes(permission)
        );
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    };
}