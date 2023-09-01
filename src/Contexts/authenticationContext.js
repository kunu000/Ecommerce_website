// importing Hooks
import { createContext, useContext, useState } from "react";

// importing Hook from react-router-dom
import { useNavigate } from "react-router-dom";

// importing function for toast notifications
import Notification from "../utils/Notification";

// importing firebase
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

// create context
const authenticationContext = createContext();
// this return  all value pass to authenticationContext
function useAuthentication() {
  const value = useContext(authenticationContext);
  return value;
}

function CustomAuthenticationContext({ children }) {
  // signupValue is use to contain name, email and password entered by user during signup
  const [signupValue, setSignupValue] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signinButtonDisable, setSigninButtonDisable] = useState(false);
  const navigate = useNavigate();

  // it take care of signup
  const handleSignup = () => {
    if (signupValue.name && signupValue.email && signupValue.password) {
      setSigninButtonDisable(true);
      // firebase code
      createUserWithEmailAndPassword(
        auth,
        signupValue.email,
        signupValue.password
      )
        .then(async (data) => {
          // sign up successful
          Notification("Sign up successfully", false);
          const user = data.user;

          // create empty product and orders of this user in firebase
          await setDoc(doc(db, "usersCarts", user.uid), {
            products: [],
          });
          await setDoc(doc(db, "usersOrders", user.uid), {
            orders: [],
          });

          // update user displayName to name provided by user
          await updateProfile(user, { displayName: signupValue.name });
          setSigninButtonDisable(false);
          navigate("/");
        })
        .catch((error) => {
          setSigninButtonDisable(false);
          Notification(error.code, true);
        });
    } else {
      Notification("Please fill all fields", true);
    }
  };

  // LoginValue is use to contain email and password entered by user during login
  const [LoginValue, setLoginValue] = useState({ email: "", password: "" });
  const [LoginButtonDisable, setLoginButtonDisable] = useState(false);

  // it take care of login
  let handleLogin = () => {
    if (LoginValue.email && LoginValue.password) {
      setLoginButtonDisable(true);
      // firebase code
      signInWithEmailAndPassword(auth, LoginValue.email, LoginValue.password)
        .then(() => {
          // successful login
          setLoginButtonDisable(false);
          Notification("Log in successfully");
          navigate("/");
        })
        .catch((error) => {
          // error occur during login
          setLoginButtonDisable(false);
          Notification(error.code, true);
        });
    } else {
      Notification("Please fill all fields", true);
    }
  };

  return (
    <authenticationContext.Provider
      value={{
        setSignupValue,
        signinButtonDisable,
        handleSignup,
        setLoginValue,
        LoginButtonDisable,
        handleLogin,
      }}
    >
      {children}
    </authenticationContext.Provider>
  );
}

// exporting CustomAuthenticationContext Component
export default CustomAuthenticationContext;

// exporting useAuthentication function that return some values
export { useAuthentication };
