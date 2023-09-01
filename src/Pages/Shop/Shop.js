// importing Hooks
import { useEffect } from "react";
// importing component from react-loader-spinner package
// it shows loading image
import { Oval } from "react-loader-spinner";
// importing Products Component
import Products from "../../Components/Products/Products";
// importing css
import styles from "./Shop.module.css";
// importing function that return some values from context
import { useProducts } from "../../Contexts/productsContext";
// importing firebase
import { onSnapshot, query, collection } from "firebase/firestore";
import { db } from "../../firebase";

function Shop() {
  // priceRef is used to get the value of range input
  // handleSearch function
  // handleFilter function
  const {
    isLoading,
    setIsLoading,
    setSearchProductsData,
    setProductsData,
    priceValue,
    handleRange,
    handleFilter,
    setSearchValue,
  } = useProducts();
  const categories = ["electronics", "jewellery", "man", "women"];

  // this hook fetch products data from firebase
  useEffect(() => {
    const q = query(collection(db, "products"));
    onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ productId: doc.id, ...doc.data() });
      });
      setIsLoading(false);
      setSearchProductsData(data);
      setProductsData(data);
    });
  }, [setIsLoading, setProductsData, setSearchProductsData]);

  return (
    <>
      {/* isLoading is true the show loading image else show html element  */}
      {isLoading ? (
        <div className={styles.shop_loading_container}>
          <Oval />
        </div>
      ) : (
        <>
          <div className={styles.filter}>
            <h2 className={styles.filter_title}>Filter</h2>
            <div className={styles.panel}>
              <div style={{ textAlign: "center", marginLeft: "0" }}>
                <label htmlFor="priceRange">Price : {priceValue}</label>
                <br />
                <input
                  type="range"
                  id="priceRange"
                  value={priceValue}
                  min={100}
                  max={100000}
                  // onChange={handleFilter}
                  onChange={(e) => handleRange(e.target.value)}
                />
              </div>
            </div>
            <h2 className={styles.filter_title}>Category</h2>
            <div className={styles.panel}>
              {/* map over categories array */}
              {categories.map((val, i) => (
                <div key={i}>
                  <input
                    type="checkbox"
                    value={val}
                    id={val}
                    onClick={(e) => handleFilter(e.target.checked, val)}
                  />
                  <label htmlFor={val}>{val}</label>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.rightSide}>
            <div className={styles.search_container}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="search"
                onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
                placeholder="Search for products"
              />
            </div>
            {/* this Component contain all products  */}
            <Products />
          </div>
        </>
      )}
    </>
  );
}
// exporting Shop Component
export default Shop;
