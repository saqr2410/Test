import api from "../../api/axios";


/*
|--------------------------------------------------------------------------
| Get Cart
|--------------------------------------------------------------------------
*/

export const getCart = async () => {

    const response = await api.get(
        "/cart/summary/"
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| Add Cart Item
|--------------------------------------------------------------------------
*/

export const addCartItem = async (
    product_id,
    quantity = 1
) => {

    const response = await api.post(
        "/cart/add_item/",
        {
            product_id,
            quantity
        }
    );


    window.dispatchEvent(
        new Event("cartUpdated")
    );


    return response.data;

};


/*
|--------------------------------------------------------------------------
| Update Cart Item
|--------------------------------------------------------------------------
*/

export const updateCartItem = async (
    product_id,
    quantity
) => {

    const response = await api.patch(
        "/cart/update_item/",
        {
            product_id,
            quantity
        }
    );


    window.dispatchEvent(
        new Event("cartUpdated")
    );


    return response.data;

};


/*
|--------------------------------------------------------------------------
| Remove Cart Item
|--------------------------------------------------------------------------
*/

export const removeCartItem = async (
    product_id
) => {

    const response = await api.delete(
        "/cart/remove_item/",
        {
            data: {
                product_id
            }
        }
    );


    window.dispatchEvent(
        new Event("cartUpdated")
    );


    return response.data;

};


/*
|--------------------------------------------------------------------------
| Sync Guest Cart
|--------------------------------------------------------------------------
*/

export const syncCart = async (
    items
) => {

    const response = await api.post(
        "/cart/sync/",
        {
            items
        }
    );


    window.dispatchEvent(
        new Event("cartUpdated")
    );


    return response.data;

};