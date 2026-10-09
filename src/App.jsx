import {
    BrowserRouter,
    useLocation
} from "react-router-dom";

import {
    useEffect
} from "react";

import {
    Toaster
} from "react-hot-toast";

import {
    AuthProvider
} from "./contexts/AuthContext";

import {
    CartProvider
} from "./contexts/CartContext";

import AppRoutes from "./routes/AppRoutes";


function ScrollToTop() {

    const {
        pathname
    } = useLocation();


    useEffect(() => {

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

    }, [pathname]);


    return null;
}


function App() {

    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >

            <AuthProvider>

                <CartProvider>

                    <ScrollToTop />

                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        toastOptions={{
                            success: {
                                style: {
                                    background: "#5B2A86",
                                    color: "#FFFFFF",
                                },
                            },
                        }}
                    />

                    <AppRoutes />

                </CartProvider>

            </AuthProvider>

        </BrowserRouter>
    );
}


export default App;