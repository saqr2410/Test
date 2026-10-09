import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import toast from "react-hot-toast";

import { useAuth } from "./AuthContext";

import {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem
} from "../services/cart/cartService";


const CartContext = createContext();


export function CartProvider({ children }) {

    const { user } = useAuth();


    /*
    |--------------------------------------------------------------------------
    | Initial Cart
    |--------------------------------------------------------------------------
    |
    | Guest:
    | Read cart from localStorage.
    |
    | Logged User:
    | Start empty until backend cart is loaded.
    |
    */

    const [cartItems, setCartItems] = useState(() => {

        const saved = localStorage.getItem("cart");

        if (!saved) {
            return [];
        }

        try {
            return JSON.parse(saved);
        } catch {
            localStorage.removeItem("cart");
            return [];
        }

    });


    /*
    |--------------------------------------------------------------------------
    | Load Backend Cart
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!user) {
            return;
        }


        const loadCart = async () => {

            try {

                const data = await getCart();


                const items = (data.items || []).map(item => ({
                    id: item.product_id,
                    name: item.name,
                    quantity: item.quantity,
                    selling_price: item.unit_price
                }));


                setCartItems(items);


            } catch (error) {

                console.error(
                    "LOAD CART ERROR:",
                    error
                );

            }

        };


        loadCart();

    }, [user]);


    /*
    |--------------------------------------------------------------------------
    | Save Guest Cart
    |--------------------------------------------------------------------------
    |
    | Only guests use localStorage.
    |
    */

    useEffect(() => {

        if (!user) {

            localStorage.setItem(
                "cart",
                JSON.stringify(cartItems)
            );

        }

    }, [cartItems, user]);


    /*
    |--------------------------------------------------------------------------
    | Add To Cart
    |--------------------------------------------------------------------------
    */

    const addToCart = async (product) => {

        try {

            if (user) {

                await addCartItem(
                    product.id,
                    1
                );

            }


            setCartItems(prev => {

                const exists = prev.find(
                    item => item.id === product.id
                );


                if (exists) {

                    return prev.map(item =>

                        item.id === product.id

                            ? {
                                ...item,
                                quantity:
                                    item.quantity + 1
                            }

                            : item

                    );

                }


                return [
                    ...prev,
                    {
                        ...product,
                        quantity: 1
                    }
                ];

            });


            toast.success(
                "تمت إضافة المنتج للسلة"
            );


        } catch (error) {

            console.error(
                "ADD TO CART ERROR:",
                error
            );


            toast.error(
                error?.response?.data?.error ||
                "خطأ في إضافة المنتج"
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Increase Quantity
    |--------------------------------------------------------------------------
    */

    const increaseQuantity = async (id) => {

        const item = cartItems.find(
            item => item.id === id
        );


        if (!item) {
            return;
        }


        const newQty =
            Number(item.quantity) + 1;


        try {

            if (user) {

                await updateCartItem(
                    id,
                    newQty
                );

            }


            setCartItems(prev =>

                prev.map(item =>

                    item.id === id

                        ? {
                            ...item,
                            quantity: newQty
                        }

                        : item

                )

            );


        } catch (error) {

            console.error(
                "INCREASE CART ERROR:",
                error
            );


            toast.error(
                error?.response?.data?.error ||
                "لا يمكن زيادة الكمية"
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Decrease Quantity
    |--------------------------------------------------------------------------
    */

    const decreaseQuantity = async (id) => {

        const item = cartItems.find(
            item => item.id === id
        );


        if (!item) {
            return;
        }


        const newQty =
            Math.max(
                Number(item.quantity) - 1,
                1
            );


        if (newQty === item.quantity) {
            return;
        }


        try {

            if (user) {

                await updateCartItem(
                    id,
                    newQty
                );

            }


            setCartItems(prev =>

                prev.map(item =>

                    item.id === id

                        ? {
                            ...item,
                            quantity: newQty
                        }

                        : item

                )

            );


        } catch (error) {

            console.error(
                "DECREASE CART ERROR:",
                error
            );


            toast.error(
                error?.response?.data?.error ||
                "لا يمكن تقليل الكمية"
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Remove From Cart
    |--------------------------------------------------------------------------
    */

    const removeFromCart = async (id) => {

        try {

            if (user) {

                await removeCartItem(id);

            }


            setCartItems(prev =>
                prev.filter(
                    item => item.id !== id
                )
            );


            toast.success(
                "تم حذف المنتج"
            );


        } catch (error) {

            console.error(
                "REMOVE CART ERROR:",
                error
            );


            toast.error(
                "فشل حذف المنتج"
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Clear Cart
    |--------------------------------------------------------------------------
    */

    const clearCart = () => {

        setCartItems([]);

        localStorage.removeItem(
            "cart"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Total
    |--------------------------------------------------------------------------
    */

    const total = cartItems.reduce(
        (sum, item) =>

            sum +
            (
                Number(
                    item.selling_price
                ) *
                Number(
                    item.quantity
                )
            ),

        0
    );


    return (

        <CartContext.Provider
            value={{
                cartItems,
                total,

                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart
            }}
        >

            {children}

        </CartContext.Provider>

    );

}


export const useCart = () =>
    useContext(CartContext);