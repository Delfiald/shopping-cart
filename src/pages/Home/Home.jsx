import Main from "../../components/Main/HomeMain";
import { useOutletContext } from "react-router-dom";

function Home() {
 const { categories, products, isExiting, setIsExiting } = useOutletContext();

 return (
  <>
   <Main
    categories={categories}
    products={products}
    isExiting={isExiting}
    setIsExiting={setIsExiting}
   />
  </>
 );
}

export default Home;
