// importing Hooks
import { createContext, useContext, useEffect, useState } from "react";
// importing Hook from react-router-dom
import { useNavigate } from "react-router-dom";
// importing firebase
import { db } from "../firebase";
import { updateDoc, arrayUnion, getDoc, doc } from "firebase/firestore";
// importing function for toast notifications
import Notification from "../utils/Notification";

// create context
const productsContext = createContext();

// this return  all value pass to authenticationContext
function useProducts() {
  const value = useContext(productsContext);
  return value;
}

function CustomProductsContext({ userId, children }) {
  // priceValue is used to contain range input value
  // categoryFilters is used to contain category clicked by user in input
  // searchedProductsData is used to store products after applying filter to it

  const [isLoading, setIsLoading] = useState(true);
  const [searchedProductsData, setSearchProductsData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [priceValue, setPriceValue] = useState("100000");
  const [categoryFilters, setcategoryFilters] = useState(new Set());
  const [disableCartButton, setDisableCartButton] = useState(false);
  const navigate = useNavigate();
  const [product, setProduct] = useState({});

  // it call under handleFilter when category checkbox are clicked
  const handleCategory = (checked, categoryFilter, result) => {
    if (checked) {
      setcategoryFilters((prev) => new Set(prev).add(categoryFilter));
      setSearchProductsData(
        result.filter((item) =>
          categoryFilters.add(categoryFilter).has(item.productCategory)
        )
      );
    } else {
      setcategoryFilters((prev) => {
        const next = new Set(prev);
        next.delete(categoryFilter);
        return next;
      });

      const temp = new Set(categoryFilters);
      temp.delete(categoryFilter);

      setSearchProductsData(
        temp.size === 0
          ? result
          : result.filter((item) => temp.has(item.productCategory))
      );
    }
  };

  const handleSearch = (data) => {
    // filters items based on product name
    const result = data.filter((item) => {
      let temp1 = item.productName.toLowerCase();
      let temp2 = searchValue;
      if (temp1.length >= temp2.length) {
        let index = temp1.indexOf(temp2);
        if (index === 0) {
          return item;
        }
      }
      return null;
    });

    return result;
  };

  const handleRange = (value) => {
    setPriceValue(value);
  };

  useEffect(() => {
    handleFilter();
  }, [priceValue]);

  useEffect(() => {
    handleFilter();
  }, [searchValue]);

  // filter product based on price and category
  const handleFilter = (checked, categoryFilter) => {
    // filter based on price
    let result = productsData.filter((item) => {
      if (priceValue === "100000") {
        return item;
      } else if (item.productPrice <= Number(priceValue)) {
        return item;
      }
      return null;
    });

    if (searchValue) {
      // filter based on product name
      result = handleSearch(result);
    }

    if (categoryFilter) {
      // filter based on product category
      handleCategory(checked, categoryFilter, result);
    } else if (categoryFilters.size === 0) {
      setSearchProductsData(result);
    } else {
      setSearchProductsData(
        result.filter((item) => categoryFilters.has(item.productCategory))
      );
    }
  };

  // add product to cart when user click on add to cart button
  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    setDisableCartButton(true);
    if (userId) {
      async function addproduct() {
        const docRef = doc(db, "usersCarts", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // product exist
          // find index of product in cart
          let index = docSnap
            .data()
            .products.findIndex((obj) => obj.productId === item.productId);
          if (index === -1) {
            // update product to cart
            async function updateDocs() {
              await updateDoc(doc(db, "usersCarts", userId), {
                products: arrayUnion({ ...item, qty: 1 }),
              });
              Notification("Item added to cart", false);
              setDisableCartButton(false);
            }
            updateDocs();
          } else {
            Notification("Item is already in cart", true);
            setDisableCartButton(false);
          }
        } else {
          console.log("No such document exist!");
          setDisableCartButton(false);
        }
      }
      addproduct();
    } else {
      Notification("please Login before adding items to cart", true);
      setDisableCartButton(false);
    }
  };

  return (
    <productsContext.Provider
      value={{
        isLoading,
        setIsLoading,
        userId,
        searchedProductsData,
        setSearchProductsData,
        setProductsData,
        priceValue,
        handleRange,
        handleFilter,
        handleAddToCart,
        productsData: searchedProductsData,
        navigate,
        disableCartButton,
        product,
        setProduct,
        setSearchValue,
      }}
    >
      {children}
    </productsContext.Provider>
  );
}

export default CustomProductsContext;
export { useProducts };
