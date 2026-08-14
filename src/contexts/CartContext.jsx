import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";


import toast from "react-hot-toast";


import {
    useAuth
} from "./AuthContext";


import {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem
} from "../services/cart/cartService";







const CartContext = createContext();








export function CartProvider({children}){


    const {
        user
    } = useAuth();





    const [
        cartItems,
        setCartItems
    ] = useState(()=>{


        const saved = localStorage.getItem(
            "cart"
        );


        return saved
        ?
        JSON.parse(saved)
        :
        [];


    });









    // تحميل Cart من الباك اند بعد Login

    useEffect(()=>{


        if(!user)
            return;




        const loadCart = async()=>{


            try{


                const data = await getCart();



                const items = data.items.map(item=>(

                    {

                        id:item.product_id,

                        name:item.name,

                        quantity:item.quantity,

                        selling_price:item.unit_price

                    }

                ));



                setCartItems(items);



            }

            catch(error){


                console.log(

                    "Load cart error",

                    error

                );


            }



        };



        loadCart();



    },[user]);









    // حفظ Local Cart للزائر فقط

    useEffect(()=>{


        if(!user){


            localStorage.setItem(

                "cart",

                JSON.stringify(cartItems)

            );


        }



    },[cartItems,user]);









    const addToCart = async(product)=>{





        if(user){


            try{


                await addCartItem(

                    product.id,

                    1

                );



                setCartItems(prev=>{


                    const exists = prev.find(

                        item=>item.id === product.id

                    );



                    if(exists){


                        return prev.map(item=>

                            item.id === product.id

                            ?

                            {

                                ...item,

                                quantity:item.quantity + 1

                            }

                            :

                            item

                        );


                    }





                    return [

                        ...prev,

                        {

                            ...product,

                            quantity:1

                        }

                    ];


                });



            }


            catch(error){


                toast.error(

                    error.response?.data?.error ||

                    "خطأ في إضافة المنتج"

                );


            }



        }

        else{


            setCartItems(prev=>{


                const exists = prev.find(

                    item=>item.id === product.id

                );



                if(exists){


                    return prev.map(item=>


                        item.id === product.id

                        ?

                        {

                            ...item,

                            quantity:item.quantity+1

                        }

                        :

                        item

                    );


                }





                return [

                    ...prev,

                    {

                        ...product,

                        quantity:1

                    }

                ];



            });



        }





        toast.success(

            "تمت إضافة المنتج للسلة"

        );



    };












    const increaseQuantity = async(id)=>{



        const item = cartItems.find(

            item=>item.id===id

        );



        if(!item)
            return;





        const newQty = item.quantity + 1;






        if(user){


            await updateCartItem(

                id,

                newQty

            );


        }





        setCartItems(prev=>


            prev.map(item=>


                item.id===id

                ?

                {

                    ...item,

                    quantity:newQty

                }

                :

                item


            )

        );




    };









    const decreaseQuantity = async(id)=>{


        const item = cartItems.find(

            item=>item.id===id

        );



        if(!item)
            return;




        const newQty =

            item.quantity > 1

            ?

            item.quantity - 1

            :

            1;





        if(user){


            await updateCartItem(

                id,

                newQty

            );


        }






        setCartItems(prev=>

            prev.map(item=>

                item.id===id

                ?

                {

                    ...item,

                    quantity:newQty

                }

                :

                item

            )

        );



    };









    const removeFromCart = async(id)=>{



        if(user){


            await removeCartItem(

                id

            );


        }





        setCartItems(prev=>

            prev.filter(

                item=>item.id!==id

            )

        );



        toast.success(

            "تم حذف المنتج"

        );


    };









    const clearCart = ()=>{


        setCartItems([]);


        localStorage.removeItem(

            "cart"

        );


    };









    const total = cartItems.reduce(


        (sum,item)=>


            sum +

            (

                Number(

                    item.selling_price

                )

                *

                item.quantity

            ),


        0


    );








    return (

        <CartContext.Provider


            value={


                {


                    cartItems,


                    total,


                    addToCart,


                    increaseQuantity,


                    decreaseQuantity,


                    removeFromCart,


                    clearCart


                }


            }


        >


            {children}


        </CartContext.Provider>


    );


}








export const useCart = ()=>useContext(CartContext);