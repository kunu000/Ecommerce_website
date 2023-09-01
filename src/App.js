// importing pages
import Home from "./Pages/Home/Home";
import Shop from "./Pages/Shop/Shop";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Order from "./Pages/Order/Order";
import Cart from "./Pages/Cart/Cart";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import AddProduct from "./Pages/AddProduct/AddProduct";

// importing Components
import Navbar from "./Components/Navbar/Navbar";
import Page404 from "./Pages/Page404/Page404";

// importing Hooks
import { useEffect, useState } from "react";

// importing function and component from react-router-dom library
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// importing Protected Routes
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import ProtectedRouteForLoginAndSignup from "./Components/ProtectedRoute/ProtectedRouteLoginAndSignup";

// importing Component from react-toastify package
import { ToastContainer } from "react-toastify";

// importing context
import CustomAuthenticationContext from "./Contexts/authenticationContext";
import CustomProductsContext from "./Contexts/productsContext";

// importing firebase
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [userId, setUserId] = useState("");

  // This hook check whether a user is loggedin or not
  // if user is loggedin then set userId to uid of user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId("");
      }
    });
  }, []);

  // creating router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar isLoggedIn={(userId || false) && true} />,
      errorElement: <Page404 />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "shop",
          children: [
            {
              index: true,
              element: (
                <CustomProductsContext userId={userId}>
                  <Shop />
                </CustomProductsContext>
              ),
            },
            {
              path: ":productId",
              element: (
                <CustomProductsContext userId={userId}>
                  <ProductDetails />
                </CustomProductsContext>
              ),
            },
          ],
        },
        {
          path: "login",
          element: (
            <ProtectedRouteForLoginAndSignup>
              <CustomAuthenticationContext>
                <Login />
              </CustomAuthenticationContext>
            </ProtectedRouteForLoginAndSignup>
          ),
        },
        {
          path: "order",
          element: (
            <ProtectedRoute>
              <Order userId={userId} />
            </ProtectedRoute>
          ),
        },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <Cart userId={userId} />
            </ProtectedRoute>
          ),
        },
        {
          path: "signup",
          element: (
            <ProtectedRouteForLoginAndSignup>
              <CustomAuthenticationContext>
                <Signup />
              </CustomAuthenticationContext>
            </ProtectedRouteForLoginAndSignup>
          ),
        },
        {
          path: "addProduct",
          element: (
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      {/* this component is use for notification */}
      <ToastContainer />
    </>
  );
}

export default App;

