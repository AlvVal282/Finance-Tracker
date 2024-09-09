import React, { useState } from "react";
import "../Styles/Register.css";
import Header from "../Assets/Header.jsx";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const fetchUsernameEmailTaken = async (username, email) => {
        const response = await fetch(`http://localhost:5001/api/check-username-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email }),
        });
    
        if (!response.ok) {
            throw new Error("Failed to check username/email");
        }
    
        const result = await response.json();
        return result.taken;
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const taken = await fetchUsernameEmailTaken(username, email);

            if (taken) {
                setError("Username or email already taken.");
                return;
            }

            const userData = {
                username,
                password,
                email,
            };

            const response = await fetch("http://localhost:5001/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });            

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("User registered successfully");
            window.location.href = "/login"; // Redirect after successful registration
        } catch (error) {
            console.error("Fetch error:", error);
            setError("Network error. Please try again.");
        }
    };

    return (
        <>
            <Header />
            <div className="register-container">
                <div className="register-box">
                    <h2>Register</h2>
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
