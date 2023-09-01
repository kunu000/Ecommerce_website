// importing css
import styles from "./ProductDetails.module.css";
// importing hooks from react-router-dom
import { useParams } from "react-router-dom";
// importing Hooks
import { useEffect } from "react";
// importing firebase
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

// importing component from react-loader-spinner package
// it shows loading image
import { Oval } from "react-loader-spinner";
// importing function that return some values from context
import { useProducts } from "../../Contexts/productsContext";
// importing page
import Page404 from "../Page404/Page404";

function ProductDetails() {
  const id = useParams();
  const {
    handleAddToCart,
    disableCartButton,
    product,
    setProduct,
    isLoading,
    setIsLoading,
  } = useProducts();

  // this hook fetch data of product from firebase database
  useEffect(() => {
    onSnapshot(doc(db, "products", id.productId), (doc) => {
      const data = doc.data();
      if (data) {
        setProduct({ ...data, productId: doc.id });
        setIsLoading(false);
      } else {
        setProduct(undefined);
        setIsLoading(false);
      }
    });
  }, [id.productId,setIsLoading,setProduct]);

  return (
    <>
      {/* if isLoading is true then show loading image else show product */}
      {isLoading ? (
        <div
          style={{
            height: "100vh",
            minHeight: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Oval />
        </div>
      ) : // if product is not present in database then show page404 else show product details
      product ? (
        <div className={styles.product_details_container}>
          <div className={styles.left}>
            <img
              src={product.productUrl}
              alt={product.productName}
              className={styles.product_img}
            />
          </div>
          <div className={styles.right}>
            <h3 className={styles.product_name}>{product.productName}</h3>
            <span style={{ fontSize: "13px" }}>price</span>
            <h2 className={styles.product_price}>Rs {product.productPrice}</h2>
            <button
              disabled={disableCartButton}
              className={styles.add_to_cart}
              onClick={(e) => handleAddToCart(e, product)}
            >
              Add to cart
            </button>
            <div className={styles.product_description}>
              <h2>Details</h2>
              <ul>
                {product.productDescription &&
                  product.productDescription
                    .split(",")
                    .map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <Page404 />
      )}
    </>
  );
}
// exporting ProductDetails Component
export default ProductDetails;
