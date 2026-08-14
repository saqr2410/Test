import { useAuth } from "../contexts/AuthContext";


export default function usePermission(){


    const {user}=useAuth();



    const hasPermission=(permission)=>{


        if(!user){
            return false;
        }


        return user.permissions?.includes(permission);


    };



    return {
        hasPermission
    };

}