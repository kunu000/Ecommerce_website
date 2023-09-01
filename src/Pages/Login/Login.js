// import css
import styles from "./Login.module.css";

// importing Component from react-router-dom
import { Link } from "react-router-dom";

// importing function that return some values from context
import { useAuthentication } from "../../Contexts/authenticationContext";

function Login() {
  // ṣetLoginvalue is used to set the value of email and password
  const { setLoginValue, LoginButtonDisable, handleLogin } =
    useAuthentication();

  return (
    <>
      <div className={styles.login}>
        <div className={styles.login_container}>
          <h2>Login Here</h2>
          <div>
            <label htmlFor={styles.email}>Email : </label>
            <input
              type="email"
              id={styles.email}
              placeholder="Email"
              onChange={(e) =>
                setLoginValue((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div>
            <label htmlFor={styles.password}>Password : </label>
            <input
              type="password"
              id={styles.password}
              placeholder="password"
              onChange={(e) =>
                setLoginValue((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>
          <button onClick={handleLogin} disabled={LoginButtonDisable}>
            Log in
          </button>
          <div>
            <strong style={{ color: "white" }}>
              Don't have account?{" "}
              <span className={styles.text}>
                <Link to="/signup">Sign up</Link>
              </span>
            </strong>
          </div>
        </div>
      </div>
    </>
  );
}

// exporting Login Component
export default Login;
