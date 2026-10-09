import { Route } from "react-router-dom";

import StoreLayout from "../layouts/StoreLayout";

import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/store/Home";
import Products from "../pages/store/Products";
import ProductDetails from "../pages/store/ProductDetails";
import Cart from "../pages/store/Cart";
import Checkout from "../pages/store/Checkout";

import FastDelivery from "../pages/store/FastDelivery";
import AuthenticProducts from "../pages/store/AuthenticProducts";
import Support24 from "../pages/store/Support24";
import Pharmacists from "../pages/store/Pharmacists";

import MyOrders from "../pages/store/orders/MyOrders";
import OrderDetails from "../pages/store/orders/OrderDetails";

import UploadPrescription from "../pages/store/prescriptions/UploadPrescription";

import Patients from "../pages/store/patients/Patients";
import PatientProfile from "../pages/store/patients/PatientProfile";
import CreatePatient from "../pages/store/patients/CreatePatient";
import EditPatient from "../pages/store/patients/EditPatient";

import AccountDashboard from "../pages/store/account/AccountDashboard";
import Profile from "../pages/store/account/Profile";
import Settings from "../pages/store/account/Settings";
import Favorites from "../pages/store/account/Favorites";
import Addresses from "../pages/store/account/Addresses";
import HealthProfile from "../pages/store/account/HealthProfile";


export default function StoreRoutes() {
    return (
        <>
            <Route
                path="/"
                element={
                    <StoreLayout>
                        <Home />
                    </StoreLayout>
                }
            />

            <Route
                path="/products"
                element={
                    <StoreLayout>
                        <Products />
                    </StoreLayout>
                }
            />

            <Route
                path="/products/:id"
                element={
                    <StoreLayout>
                        <ProductDetails />
                    </StoreLayout>
                }
            />

            <Route
                path="/cart"
                element={
                    <StoreLayout>
                        <Cart />
                    </StoreLayout>
                }
            />

            <Route
                path="/checkout"
                element={
                    <StoreLayout>
                        <Checkout />
                    </StoreLayout>
                }
            />

            {/* Why Us Pages */}

            <Route
                path="/fast-delivery"
                element={
                    <StoreLayout>
                        <FastDelivery />
                    </StoreLayout>
                }
            />

            <Route
                path="/authentic-products"
                element={
                    <StoreLayout>
                        <AuthenticProducts />
                    </StoreLayout>
                }
            />

            <Route
                path="/support"
                element={
                    <StoreLayout>
                        <Support24 />
                    </StoreLayout>
                }
            />

            <Route
                path="/pharmacists"
                element={
                    <StoreLayout>
                        <Pharmacists />
                    </StoreLayout>
                }
            />

            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <StoreLayout>
                            <MyOrders />
                        </StoreLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/orders/:id"
                element={
                    <ProtectedRoute>
                        <StoreLayout>
                            <OrderDetails />
                        </StoreLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/prescriptions/upload"
                element={
                    <StoreLayout>
                        <UploadPrescription />
                    </StoreLayout>
                }
            />

            <Route
                path="/patients"
                element={
                    <ProtectedRoute>
                        <StoreLayout>
                            <Patients />
                        </StoreLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/patients/create"
                element={
                    <ProtectedRoute>
                        <StoreLayout>
                            <CreatePatient />
                        </StoreLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/patients/:id/profile"
                element={
                    <ProtectedRoute>
                        <StoreLayout>
                            <PatientProfile />
                        </StoreLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/patients/:id/edit"
                element={
                    <ProtectedRoute>
                        <StoreLayout>
                            <EditPatient />
                        </StoreLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/account"
                element={
                    <ProtectedRoute>
                        <StoreLayout>
                            <AccountDashboard />
                        </StoreLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/account/profile"
                element={
                    <ProtectedRoute>
                        <StoreLayout>
                            <Profile />
                        </StoreLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/account/settings"
                element={
                    <ProtectedRoute>
                        <StoreLayout>
                            <Settings />
                        </StoreLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/account/favorites"
                element={
                    <ProtectedRoute>
                        <StoreLayout>
                            <Favorites />
                        </StoreLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/account/addresses"
                element={
                    <ProtectedRoute>
                        <StoreLayout>
                            <Addresses />
                        </StoreLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/account/health"
                element={
                    <ProtectedRoute>
                        <StoreLayout>
                            <HealthProfile />
                        </StoreLayout>
                    </ProtectedRoute>
                }
            />
        </>
    );
}