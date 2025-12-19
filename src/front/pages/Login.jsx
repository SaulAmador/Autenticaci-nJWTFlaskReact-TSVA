import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/login.css";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { dispatch } = useGlobalReducer(); 

    useEffect(() => {
        if (location.state?.signupSuccess) {
            setMessage("User created successfully, please login");
        }
    }, [location.state]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.access_token);
                dispatch({
                    type: "login",
                    payload: data.access_token
                });
                navigate("/private");
            } else {
                setMessage(data.msg || "Error logging in");
            }
        } catch (error) {
            setMessage("Error logging in");
        }
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary btn-block btn-large">Login</button>
                {message && <p style={{ color: "white", marginTop: "10px" }} >{message}</p>}
            </form>
        </div>
    );
};

export default Login;