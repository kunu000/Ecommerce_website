// importing css
import styles from "./Signup.module.css";
// importing component from react-router-dom package
import { Link } from "react-router-dom";
// importing function that return some values from context
import { useAuthentication } from "../../Contexts/authenticationContext";

function Signup() {
  // setSignupValue is use to set the value of name, email and password entered by user during signup
  const { setSignupValue, signinButtonDisable, handleSignup } =
    useAuthentication();

  return (
    <>
      <div className={styles.signup}>
        <div className={styles.signup_container}>
          <h2>Signup Here</h2>
          <div>
            <label htmlFor={styles.name}>Name : </label>
            <input
              type="text"
              id={styles.name}
              placeholder="Name"
              onChange={(e) =>
                setSignupValue((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div>
            <label htmlFor={styles.email}>Email : </label>
            <input
              type="email"
              id={styles.email}
              placeholder="Email"
              onChange={(e) =>
                setSignupValue((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div>
            <label htmlFor={styles.password}>Password : </label>
            <input
              type="password"
              id={styles.password}
              placeholder="Password"
              onChange={(e) =>
                setSignupValue((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </div>
          <button onClick={handleSignup} disabled={signinButtonDisable}>
            Sign up
          </button>
          <div>
            <strong style={{ color: "white" }}>
              Already have an account?{" "}
              <span className={styles.text}>
                <Link to="/login">Login</Link>
              </span>
            </strong>
          </div>
        </div>
      </div>
    </>
  );
}
// exporting Signup Component
export default Signup;
