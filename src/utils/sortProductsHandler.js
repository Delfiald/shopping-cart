const displayedProducts = (products, sort) =>
 products
  ? [...products].sort((a, b) => {
     switch (sort) {
      case "name-asc":
       return a.title.localeCompare(b.title);
      case "name-desc":
       return b.title.localeCompare(a.title);
      case "price-asc":
       return a.price - b.price;
      case "price-desc":
       return b.price - a.price;
      default:
       return 0;
     }
    })
  : products;

export default displayedProducts;
