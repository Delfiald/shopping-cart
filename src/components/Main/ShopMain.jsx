import PropTypes from "prop-types";

function Card({ product }) {
 return (
  <div data-testid="product-card" className="card">
   <img src={product.image} alt={product.title} />
   <div className="product-name">{product.title}</div>
   <div className="product-price">{product.price}</div>
  </div>
 );
}

function ShopMain({ products }) {
 return (
  <main>
   <h2>All Products</h2>
   <section>
    {products &&
     products.map((product) => <Card key={product.id} product={product} />)}
   </section>
  </main>
 );
}

ShopMain.propTypes = {
 products: PropTypes.array,
};

Card.propTypes = {
 product: PropTypes.object,
};

export default ShopMain;
