import Navbar from '../Components/Navbar'
import '../styles/globals.css'
import '../Components/Navbar'
import '../styles/Navbar.css'
import '../styles/product.css'
import '../styles/ShopStyle.css'
import '../styles/productosEmpresas.css'
import '../styles/Animacion.css'
//import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function MyApp({ Component, pageProps }) {
  return (
    <>
   
    <Navbar>
        <Component {...pageProps} />
    </Navbar>
    </>
  )
}

export default MyApp
