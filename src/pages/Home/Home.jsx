import Header from "../../components/Header/Header";
import { useOutletContext } from "react-router-dom";

function Main() {
 return (
  <main>
   <div className="hero">
    <div className="carousel"></div>
   </div>
   <div className="category"></div>
  </main>
 );
}

function Home() {
 const {
  cartItem,
  notificationItem,
  hoverButton,
  setHoverButton,
  searchInput,
  setSearchInput,
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
   <Main />
  </>
 );
}

export default Home;
