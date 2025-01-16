import { useParams } from "react-router-dom";

function Product() {
 const { id } = useParams();
 return (
  <section>
   <h1>Product {id}</h1>
  </section>
 );
}

export default Product;
