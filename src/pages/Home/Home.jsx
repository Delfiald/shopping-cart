import Main from "../../components/Main/HomeMain";
import { useOutletContext } from "react-router-dom";

function Home() {
 const { categories, products } = useOutletContext();

 return (
  <>
   <Main categories={categories} products={products} />
  </>
 );
}

export default Home;
