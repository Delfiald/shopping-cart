import Header from "../../components/Header/Header";
import Main from "../../components/Main/HomeMain";
import { useOutletContext } from "react-router-dom";

function Home() {
 const {
  cartItem,
  notificationItem,
  hoverButton,
  setHoverButton,
  searchInput,
  setSearchInput,
  categories,
  products,
 } = useOutletContext();

 return (
  <>
   <Header
    cartItem={cartItem}
    notificationItem={notificationItem}
    hoverButton={hoverButton}
    setHoverButton={setHoverButton}
    searchInput={searchInput}
    setSearchInput={setSearchInput}
   />
   <Main categories={categories} products={products} />
  </>
 );
}

export default Home;
