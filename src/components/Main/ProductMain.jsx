import { ChevronRight } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Media() {}

function Detail(props) {
 return (
  <section className="detail">
   <div className="top-detail">
    <h2 className="product-title">{props.title}</h2>
    <div className="product-price">{props.price}</div>
   </div>
   <div className="main-detail">
    <div className="detail-option">
     <div
      data-testid="detail-button"
      className="detail-button"
      onClick={() => props.setDetail("detail")}
     >
      Detail
     </div>
     <div
      data-testid="info-button"
      className="info-button"
      onClick={() => props.setDetail("info")}
     >
      Important Information
     </div>
    </div>
    <div className="detail-content">
     {props.detail === "detail" ? (
      <div className="product-detail">
       <div className="min-order">Min Order: 1 Pcs</div>
       <div
        className="product-category"
        onClick={() => props.handleNavigate(`/shop?category=${props.category}`)}
       >
        Category: {props.category ? props.category : "-"}
       </div>
       <div className="product-description">{props.description}</div>
      </div>
     ) : (
      <div className="important-information">
       <div>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque
        mollitia doloribus quo consequatur nostrum quod.
       </div>
      </div>
     )}
    </div>
   </div>
  </section>
 );
}

function Option() {}

function Review() {}

function ProductMain({ product }) {
 const navigate = useNavigate();
 const [detail, setDetail] = useState("detail");

 const handleNavigate = (entries = "/") => {
  navigate(entries);
 };

 return (
  <>
   <div data-testid="breadcrumb" className="breadcrumb">
    <div onClick={handleNavigate}>Home</div>
    <ChevronRight size={16} />
    <div onClick={() => handleNavigate("/shop")}>Shop</div>
    <ChevronRight size={16} />
    <div onClick={() => handleNavigate(`/shop?category=${product.category}`)}>
     {product.category}
    </div>
    <ChevronRight size={16} />
    {product.title}
   </div>
   <main>
    <Media image={product.image} />
    <Detail
     title={product.title}
     price={product.price}
     description={product.description}
     category={product.category}
     detail={detail}
     setDetail={setDetail}
     handleNavigate={handleNavigate}
    />
    <Option title={product.title} price={product.price} />
    <Review />
   </main>
  </>
 );
}

ProductMain.propTypes = {
 product: PropTypes.object,
};

Media.propTypes = {
 image: PropTypes.string,
};

Detail.propTypes = {
 title: PropTypes.string,
 price: PropTypes.number,
 category: PropTypes.string,
 description: PropTypes.string,
 detail: PropTypes.string,
 setDetail: PropTypes.func,
 handleNavigate: PropTypes.func,
};

export default ProductMain;
