import {
    useEffect,
    useState
} from "react";


import {
    getNotifications,
    markNotificationRead
} from "../../../services/notifications/notificationService";


import PageHeader from "../../../components/ui/layout/PageHeader";


import Loading from "../../../components/ui/feedback/Loading";



export default function Notifications(){


    const [notifications,setNotifications]=useState([]);

    const [loading,setLoading]=useState(true);






    useEffect(()=>{


        const load = async()=>{


            try{


                const data =
                    await getNotifications();


                setNotifications(data);


            }


            catch(error){

                console.log(error);

            }


            finally{

                setLoading(false);

            }


        };



        load();



    },[]);







    const readNotification = async(id)=>{


        try{


            await markNotificationRead(id);



            setNotifications(prev=>

                prev.map(item=>

                    item.id === id

                    ?

                    {
                        ...item,
                        is_read:true
                    }

                    :

                    item

                )

            );


        }

        catch(error){

            console.log(error);

        }


    };








    if(loading){

        return <Loading/>;

    }





    return (

        <div className="space-y-6">



            <PageHeader

                title="Notifications"

                subtitle="System notifications"

            />





            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow
                    p-6
                    space-y-4
                "
            >



            {
                notifications.length === 0

                ?

                (

                    <p className="text-gray-400">

                        No notifications

                    </p>

                )

                :

                notifications.map(notification=>(


                    <div

                        key={notification.id}

                        className={`

                            flex

                            justify-between

                            items-center

                            p-4

                            rounded-xl

                            border

                            ${
                                notification.is_read

                                ?

                                "bg-gray-50"

                                :

                                "bg-purple-50"

                            }

                        `}

                    >



                        <div>


                            <h3
                                className="
                                    font-bold
                                "
                            >

                                {notification.title}

                            </h3>



                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >

                                {notification.message}

                            </p>



                        </div>





                        {

                            !notification.is_read &&

                            <button

                                onClick={()=>
                                    readNotification(
                                        notification.id
                                    )
                                }

                                className="
                                    bg-[#5B2A86]
                                    text-white
                                    px-4
                                    py-2
                                    rounded-xl
                                "

                            >

                                Mark Read

                            </button>


                        }



                    </div>


                ))

            }




            </div>



        </div>

    );

}