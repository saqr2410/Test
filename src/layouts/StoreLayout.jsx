import Navbar from "../components/store/Navbar";
import Footer from "../components/store/Footer";

export default function StoreLayout({ children }) {

    return (

        <>

            <Navbar />

            <main>

                {children}

            </main>

            <Footer />

        </>

    );

}