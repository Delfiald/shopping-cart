import Header from "../../components/Header/Header";
import { useOutletContext } from "react-router-dom";

function Home() {
 const { cartItem, cartOpen, setCartOpen } = useOutletContext();

 return (
  <>
   <Header cartItem={cartItem} cartOpen={cartOpen} setCartOpen={setCartOpen} />
   <main>Main</main>
   <footer>Footer</footer>
  </>
 );
}

export default Home;
