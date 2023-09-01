// importing css
import styles from "./Products.module.css";

// importing Icon image
import sadCartIcon from "../../Assets/Images/icons/sadcart.PNG";

// importing function that return some values from context
import { useProducts } from "../../Contexts/productsContext";

function Products() {
  // destructuring values from useProducts function
  const {
    handleAddToCart,
    productsData, 
    navigate,
    disableCartButton,
    isLoading,
  } = useProducts();

  return (
    <>
      {/* if isLoading is true then return null else return html element */}
      {isLoading ? null : (
        <section id={styles.product1} className={styles.section_p1}>
          <div className={styles.pro_container}>
            {/* if productData legth is 0 then show no product found else show products  */}
            {productsData.length !== 0 ? (
              productsData.map((item, i) => (
                <div
                  className={styles.pro}
                  key={i}
                  onClick={() => {
                    if (!disableCartButton) {
                      navigate(`/shop/${item.productId}`);
                    }
                  }}
                >
                  <img src={item.productUrl} alt="" />
                  <div className={styles.des}>
                    <h3>{item.productName}</h3>
                    <h4>Rs {item.productPrice}</h4>
                    <button
                      disabled={disableCartButton}
                      className={styles.cart}
                      onClick={(e) => handleAddToCart(e, item)}
                    >
                      <i className="fa-solid fa-cart-shopping"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.no_product_container}>
                <img src={sadCartIcon} alt="" />
                <span>No Products found!</span>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

// exporting Products Component 
export default Products;
