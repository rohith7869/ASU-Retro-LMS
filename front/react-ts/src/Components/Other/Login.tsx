import React, { useState, useEffect, useRef } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

interface Credentials {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const roleRef = useRef("");
  const showCreatePasswordRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Make a request to the server to check the authentication status
        const response = await fetch("http://localhost:8080/check-auth", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });

        if (response.ok) {
          // User is authenticated, redirect to the landing page

          const data = await response.json();
          const role = data.role;
          const showCreatePassword = data.resetPassword;
          const makeStudentEditable = data.makeStudentEditable;
          if (role === "student") {
      if (showCreatePassword) {
          navigate("/createPassword", { state: { firstName: data.profile.firstName, lastName: data.profile.lastName, makeStudentEditable } });
      } else {
        navigate("/dashboard");
      }
    } else  {
      navigate("/dashboard");
    }
        } else {
          // User is not authenticated, continue rendering the login page
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuthentication();
  }, [navigate]);

  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });
  
  const handleLogin = async () => {
    try {
      // Send credentials to the server
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        roleRef.current = data.role;
        showCreatePasswordRef.current = data.resetPassword;
        if (roleRef.current === "student") {
          if (showCreatePasswordRef.current) {
              navigate("/createPassword", { state: { firstName: data.profile.firstName, lastName: data.profile.lastName, makeStudentEditable:data.makeStudentEditable } });
          } else {
              navigate("/dashboard");
            }
          } else  {
               navigate("/dashboard");
          }
      } else {
        console.error("Login failed");
        setErrorMessage("Login failed");

      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

return (
    <div className="nes-container is-rounded is-centered login-container">
      <div className="form-container">
        <img
          src="https://file.rendit.io/n/mWZVWPIwAmEIOBF3b0E9.png" 
          alt="ASU"
          className="form-image"
        />
        <h1 className="form-title">Sign In</h1>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            ASURITE User ID
          </label>
          <input
            id="username"
            type="text"
            placeholder=""
            className="form-input"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder=""
            className="form-input"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <button className="nes-btn is-success mt-4" type="submit">
            Sign In
          </button>
        </form>
        {errorMessage.length > 0 && <div className="validation-message">{errorMessage}</div>}
      </div>

    </div>
  );

};

export default Login;