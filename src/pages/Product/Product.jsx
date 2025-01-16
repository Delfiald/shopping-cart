import { useOutletContext, useParams } from "react-router-dom";
import ProductMain from "../../components/Main/ProductMain";

function Product() {
 const { products } = useOutletContext();
 const { id } = useParams();

 const product = products.find((product) => product.id === parseInt(id));

 return (
  <>
   <ProductMain product={product} />
  </>
 );
}

export default Product;
