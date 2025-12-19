import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("User created successfully");
                navigate("/login", { state: { signupSuccess: true } });
            } else {
                setMessage(data.msg || "Error creating user");
            }
        } catch (error) {
            console.error("Error creating user: ", error);
        }
    };
    return (
        <div className="login">
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <input
                    type="email "
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
                <button type="submit" className="btn btn-primary btn-block btn-large">Sign Up</button>
            </form>
            {message && <p style={{ color: "white", marginTop: "10px" }}>{message}</p>}
        </div>
    );
};

export default Signup;