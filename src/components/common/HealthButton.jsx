const {
    user
}=useAuth();


const navigate = useNavigate();


const handleHealth = ()=>{


    if(!user){

        navigate(
            "/login?next=/health/create"
        );

        return;

    }


    navigate(
        "/health/create"
    );


}