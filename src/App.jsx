import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import AppRoutes from "./routes/AppRoutes";


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

                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                    />

                    <AppRoutes />

                </CartProvider>

            </AuthProvider>

        </BrowserRouter>

    );

}


export default App;